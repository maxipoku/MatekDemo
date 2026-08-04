import { useState } from "react"
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
}

type FieldStatus = "idle" | "correct" | "incorrect"
type FieldState = { value: string; status: FieldStatus }

export function ExerciseScreen({ screen, isLast, devMode, onContinue }: Props) {
  const [bgFailed, setBgFailed] = useState(false)
  // Which task in this screen is on show. The screen shows one task at a time,
  // forward only, so nothing ever needs to scroll.
  const [taskIndex, setTaskIndex] = useState(0)
  const [hintOpen, setHintOpen] = useState(false)

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
  const checkCurrent = () => {
    setFieldStates((prev) => {
      const next: Record<string, FieldState> = { ...prev }
      for (const field of current.fields) {
        const state = next[field.id]
        if (state.status === "correct") continue
        const correct = checkAnswer(state.value, field.acceptedAnswers)
        next[field.id] = { value: state.value, status: correct ? "correct" : "incorrect" }
      }
      return next
    })
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

      <div className={styles.content}>
        <div className={styles.card}>
          {screen.introText && (
            <p className={styles.intro}>
              <MathText text={screen.introText} />
            </p>
          )}

          {tasks.length > 1 && (
            <div className={styles.progress} aria-hidden="true">
              {tasks.map((task, position) => (
                <span
                  key={task.id}
                  className={`${styles.dot} ${
                    position < taskIndex
                      ? styles.dotDone
                      : position === taskIndex
                        ? styles.dotNow
                        : ""
                  }`}
                />
              ))}
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

            <div className={styles.fields}>
              {current.fields.map((field) => {
                const state = fieldStates[field.id]
                return (
                  <div key={field.id} className={styles.field}>
                    <label className={styles.label} htmlFor={field.id}>
                      <MathText text={field.label} />
                    </label>
                    <input
                      id={field.id}
                      className={styles.input}
                      type="text"
                      inputMode="decimal"
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
                  </div>
                )
              })}
            </div>

            {hints.length > 0 && (
              <button type="button" className={styles.hintButton} onClick={openHint}>
                Tipp
              </button>
            )}
          </section>

          <div className={styles.actions}>
            <button type="button" className={styles.checkButton} onClick={checkCurrent}>
              Ellenőrzés
            </button>
            {!(isLast && isLastTask) && (
              <button
                type="button"
                className={`${styles.continueButton} ${currentCorrect ? styles.visible : styles.hidden}`}
                onClick={advance}
                tabIndex={currentCorrect ? 0 : -1}
              >
                Tovább
              </button>
            )}
          </div>
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
                  <MathText text={hint} />
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
