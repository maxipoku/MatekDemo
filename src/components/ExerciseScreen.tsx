import { useEffect, useLayoutEffect, useRef, useState } from "react"
import type { ExerciseScreen as ExerciseScreenData } from "../content/types"
import { checkAnswer } from "../lib/answers"
import { imageUrl } from "../lib/assets"
import { MathText } from "./MathText"
import styles from "./ExerciseScreen.module.css"

type Props = {
  screen: ExerciseScreenData
  isLast: boolean
  devMode: boolean
  onContinue: () => void
  onReward: (amount: number) => void
  formatRule?: string
}

type FieldStatus = "idle" | "correct" | "incorrect"
type FieldState = { value: string; status: FieldStatus }

// A small gold coin drawn for the floating reward at the answer field.
const coinMini = (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill="#f4c542" stroke="#a9791b" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="6.4" fill="none" stroke="#d7a327" strokeWidth="1.4" />
  </svg>
)

export function ExerciseScreen({
  screen,
  isLast,
  devMode,
  onContinue,
  onReward,
  formatRule,
}: Props) {
  const [bgFailed, setBgFailed] = useState(false)
  // Which task in this screen is on show. The screen shows one task at a time,
  // forward only, so nothing ever needs to scroll.
  const [taskIndex, setTaskIndex] = useState(0)
  const [hintOpen, setHintOpen] = useState(false)
  // Floating "+1" markers shown at the answer fields, cleared shortly after.
  // Correct answer +1 floats. A wrong answer is handled separately, by animating
  // the box red imperatively (see checkCurrent), so it can retrigger every time.
  const [flashes, setFlashes] = useState<{ key: number; fieldId: string }[]>([])
  const flashKeyRef = useRef(0)
  const flashTimersRef = useRef<number[]>([])
  // Scale the card down if it would be taller than the screen, so a busy
  // exercise (long intro, format rule, several chips) never needs scrolling.
  const contentRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  // One entry per field, keyed by the field id.
  const [fieldStates, setFieldStates] = useState<Record<string, FieldState>>(() => {
    const initial: Record<string, FieldState> = {}
    for (const exercise of screen.exercises) {
      for (const field of exercise.fields) {
        initial[field.id] = { value: "", status: "idle" }
      }
    }
    return initial
  })

  // How many hints are shown per exercise id (0 means none yet).
  const [hintLevels, setHintLevels] = useState<Record<string, number>>({})

  // Clear any pending float timers if the screen goes away.
  useEffect(() => {
    return () => {
      for (const timer of flashTimersRef.current) window.clearTimeout(timer)
    }
  }, [])

  // Fit the card to the screen height. offsetHeight is the natural (unscaled)
  // height, so the measurement stays stable even while a scale is applied.
  useLayoutEffect(() => {
    const content = contentRef.current
    const card = cardRef.current
    if (!content || !card) return
    const fit = () => {
      const cs = getComputedStyle(content)
      const pad = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0)
      const available = content.clientHeight - pad
      const natural = card.offsetHeight
      if (natural <= 0 || available <= 0) return
      const ratio = available / natural
      setScale(ratio >= 1 ? 1 : Math.max(ratio, 0.6))
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(content)
    observer.observe(card)
    return () => observer.disconnect()
  }, [taskIndex])

  const tasks = screen.exercises
  const current = tasks[taskIndex]
  const isLastTask = taskIndex === tasks.length - 1
  const currentCorrect = current.fields.every((field) => fieldStates[field.id]?.status === "correct")
  // Tasks already answered. Their answers stay visible as small chips, so a later
  // task that builds on them (for example X equals O plus K plus O plus S) still
  // has the numbers on screen.
  const solved = tasks.slice(0, taskIndex)

  const hints = current.hints ?? []
  const hintLevel = hintLevels[current.id] ?? 0

  const setValue = (id: string, value: string) => {
    setFieldStates((prev) => {
      const currentState = prev[id]
      if (currentState?.status === "correct") return prev // locked once correct
      return { ...prev, [id]: { value, status: currentState?.status ?? "idle" } }
    })
  }

  // Check only the task on show. Correct fields turn green and lock. Others turn
  // yellow and stay editable. Nothing else happens, and no answer is revealed.
  // Flash the given boxes light red, fading back to normal. Uses the Web
  // Animations API on the element directly so each call restarts the flash,
  // which lets a repeated wrong answer retrigger it every time.
  const flashWrong = (fieldIds: string[]) => {
    if (fieldIds.length === 0) return
    const root = getComputedStyle(document.documentElement)
    const redBg = root.getPropertyValue("--wrongFlashBg").trim() || "#ffd4d0"
    const redBorder = root.getPropertyValue("--wrongFlashBorder").trim() || "#e0685e"
    const normalBg = root.getPropertyValue("--inputBg").trim() || "#ffffff"
    const normalBorder = root.getPropertyValue("--inputBorder").trim() || "#9aa4b0"
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    for (const id of fieldIds) {
      const el = document.getElementById(id)
      if (!el || typeof el.animate !== "function") continue
      if (reduce) {
        // No fade: hold a steady light red briefly, then it clears on its own.
        el.animate(
          [
            { backgroundColor: redBg, borderColor: redBorder },
            { backgroundColor: redBg, borderColor: redBorder },
          ],
          { duration: 1800 },
        )
      } else {
        el.animate(
          [
            { backgroundColor: redBg, borderColor: redBorder, offset: 0 },
            { backgroundColor: redBg, borderColor: redBorder, offset: 0.15 },
            { backgroundColor: normalBg, borderColor: normalBorder, offset: 1 },
          ],
          { duration: 2600, easing: "ease-out" },
        )
      }
    }
  }

  const checkCurrent = () => {
    const checked: { fieldId: string; correct: boolean }[] = []
    const next: Record<string, FieldState> = { ...fieldStates }
    for (const field of current.fields) {
      const state = next[field.id]
      if (state.status === "correct") continue
      const correct = checkAnswer(state.value, field.acceptedAnswers)
      checked.push({ fieldId: field.id, correct })
      next[field.id] = { value: state.value, status: correct ? "correct" : "incorrect" }
    }
    setFieldStates(next)
    if (checked.length === 0) return

    // Reward each newly correct answer with a coin (a two box task can give two).
    const gained = checked.filter((item) => item.correct).length
    if (gained > 0) onReward(gained)

    // A gold plus floats up from each newly correct box.
    const added = checked
      .filter((item) => item.correct)
      .map((item) => ({ key: (flashKeyRef.current += 1), fieldId: item.fieldId }))
    if (added.length > 0) {
      setFlashes((prev) => [...prev, ...added])
      const addedKeys = new Set(added.map((item) => item.key))
      const timer = window.setTimeout(() => {
        setFlashes((prev) => prev.filter((item) => !addedKeys.has(item.key)))
      }, 2000)
      flashTimersRef.current.push(timer)
    }

    // A wrong box flashes light red and fades back to normal. This is animated
    // imperatively rather than through a class or attribute, so pressing
    // Ellenorzes again on a still wrong answer restarts the flash every time.
    flashWrong(checked.filter((item) => !item.correct).map((item) => item.fieldId))
  }

  // Tovabb: move to the next task, or leave the screen when the last task is done.
  const advance = () => {
    setHintOpen(false)
    if (isLastTask) {
      onContinue()
    } else {
      setTaskIndex((value) => Math.min(value + 1, tasks.length - 1))
    }
  }

  const openHint = () => {
    if (hints.length === 0) return
    setHintLevels((prev) => ({ ...prev, [current.id]: Math.max(prev[current.id] ?? 0, 1) }))
    setHintOpen(true)
  }

  const nextHint = () => {
    setHintLevels((prev) => ({
      ...prev,
      [current.id]: Math.min((prev[current.id] ?? 1) + 1, hints.length),
    }))
  }

  // Developer mode only: fill every box with its first accepted answer, mark them
  // correct, and jump to the last task so one Tovabb press leaves the screen.
  const fillCorrect = () => {
    setFieldStates(() => {
      const next: Record<string, FieldState> = {}
      for (const exercise of tasks) {
        for (const field of exercise.fields) {
          next[field.id] = { value: field.acceptedAnswers[0] ?? "", status: "correct" }
        }
      }
      return next
    })
    setHintOpen(false)
    setTaskIndex(tasks.length - 1)
  }

  return (
    <div className={styles.exercise}>
      {!bgFailed && (
        <img
          className={styles.background}
          src={imageUrl(screen.backgroundImage)}
          alt=""
          onError={() => setBgFailed(true)}
        />
      )}
      <div className={styles.dim} />

      <div className={styles.content} ref={contentRef}>
        <div className={styles.card} ref={cardRef} style={{ transform: `scale(${scale})` }}>
          {screen.introText && (
            <p className={styles.intro}>
              <MathText text={screen.introText} />
            </p>
          )}

          {tasks.length > 1 && (
            <div className={styles.progress} aria-hidden="true">
              {tasks.map((task, position) => {
                const done = task.fields.every(
                  (field) => fieldStates[field.id]?.status === "correct",
                )
                return (
                  <span
                    key={task.id}
                    className={`${styles.dot} ${
                      position === taskIndex ? styles.dotNow : done ? styles.dotDone : ""
                    }`}
                  />
                )
              })}
            </div>
          )}

          {solved.length > 0 && (
            <div className={styles.solved}>
              {solved.flatMap((task) =>
                task.fields.map((field) => (
                  <span key={field.id} className={styles.chip}>
                    <span className={styles.chipLabel}>
                      <MathText text={field.label} />
                    </span>
                    <span className={styles.chipValue}>{fieldStates[field.id]?.value}</span>
                  </span>
                )),
              )}
            </div>
          )}

          <section key={current.id} className={styles.task}>
            <p className={styles.prompt}>
              <MathText text={current.prompt} />
            </p>

            {formatRule && (
              <p className={styles.formatRule}>
                <MathText text={formatRule} />
              </p>
            )}

            {(() => {
              const tippButton =
                hints.length > 0 ? (
                  <button type="button" className={styles.hintButton} onClick={openHint}>
                    Tipp
                  </button>
                ) : null

              const actionButton = currentCorrect ? (
                !(isLast && isLastTask) ? (
                  <button type="button" className={styles.continueButton} onClick={advance}>
                    Tovább
                  </button>
                ) : null
              ) : (
                <button type="button" className={styles.checkButton} onClick={checkCurrent}>
                  Ellenőrzés
                </button>
              )

              const renderInput = (field: (typeof current.fields)[number]) => {
                const state = fieldStates[field.id]
                return (
                  <div className={styles.inputWrap}>
                    {/* The full keyboard, not the number keypad. A fraction answer needs a
                        slash (3/5), which inputMode decimal does not offer on a phone. The
                        tradeoff is that plain number answers now use the full keyboard too. */}
                    <input
                      id={field.id}
                      className={styles.input}
                      type="text"
                      inputMode="text"
                      autoComplete="off"
                      value={state.value}
                      readOnly={state.status === "correct"}
                      data-state={state.status}
                      onChange={(event) => setValue(field.id, event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault()
                          checkCurrent()
                        }
                      }}
                    />
                    {flashes
                      .filter((flash) => flash.fieldId === field.id)
                      .map((flash) => (
                        <span key={flash.key} className={styles.fieldGain} aria-hidden="true">
                          {coinMini}
                          <span>+1</span>
                        </span>
                      ))}
                  </div>
                )
              }

              // The common case: one answer box. The label sits on top and the row
              // below is Tipp, the box, Ellenorzes, so on a phone both buttons stay
              // beside the box and above the keyboard.
              if (current.fields.length === 1) {
                const field = current.fields[0]
                return (
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={field.id}>
                      <MathText text={field.label} />
                    </label>
                    <div className={styles.inputRow}>
                      {tippButton}
                      {renderInput(field)}
                      {actionButton}
                    </div>
                  </div>
                )
              }

              // The rare task with several boxes: keep them stacked, each with its
              // own label, and put the buttons in a row underneath.
              return (
                <>
                  <div className={styles.fields}>
                    {current.fields.map((field) => (
                      <div key={field.id} className={styles.field}>
                        <label className={styles.label} htmlFor={field.id}>
                          <MathText text={field.label} />
                        </label>
                        {renderInput(field)}
                      </div>
                    ))}
                  </div>
                  <div className={styles.actions}>
                    {tippButton}
                    {actionButton}
                  </div>
                </>
              )
            })()}
          </section>
        </div>
      </div>

      {hintOpen && hints.length > 0 && (
        <div
          className={styles.hintOverlay}
          role="dialog"
          aria-modal="true"
          onClick={() => setHintOpen(false)}
        >
          <div className={styles.hintCard} onClick={(event) => event.stopPropagation()}>
            <p className={styles.hintTitle}>
              Tipp {hintLevel}/{hints.length}
            </p>
            <ol className={styles.hintList}>
              {hints.slice(0, hintLevel).map((hint, hintIndex) => (
                <li key={hintIndex} className={styles.hintItem}>
                  <span className={styles.hintNumber}>{hintIndex + 1}.</span>
                  <span className={styles.hintText}>
                    <MathText text={hint} />
                  </span>
                </li>
              ))}
            </ol>
            <div className={styles.hintActions}>
              {hintLevel < hints.length && (
                <button type="button" className={styles.hintNext} onClick={nextHint}>
                  Következő tipp
                </button>
              )}
              <button type="button" className={styles.hintClose} onClick={() => setHintOpen(false)}>
                Bezárás
              </button>
            </div>
          </div>
        </div>
      )}

      {devMode && (
        <button type="button" className="devButton" onClick={fillCorrect}>
          Kitöltés
        </button>
      )}
    </div>
  )
}
