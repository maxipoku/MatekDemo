import { useMemo, useState } from "react"
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

  const allFields = useMemo(
    () => screen.exercises.flatMap((exercise) => exercise.fields),
    [screen],
  )
  const allCorrect = allFields.every((field) => fieldStates[field.id]?.status === "correct")

  const setValue = (id: string, value: string) => {
    setFieldStates((prev) => {
      const current = prev[id]
      if (current?.status === "correct") return prev // locked once correct
      return { ...prev, [id]: { value, status: current?.status ?? "idle" } }
    })
  }

  // Check every field at once. Correct fields turn green and lock. Others turn
  // yellow and stay editable. Nothing else happens, and no answer is revealed.
  const checkAll = () => {
    setFieldStates((prev) => {
      const next: Record<string, FieldState> = { ...prev }
      for (const exercise of screen.exercises) {
        for (const field of exercise.fields) {
          const current = next[field.id]
          if (current.status === "correct") continue
          const correct = checkAnswer(current.value, field.acceptedAnswers)
          next[field.id] = { value: current.value, status: correct ? "correct" : "incorrect" }
        }
      }
      return next
    })
  }

  // Developer mode only: put the first accepted answer into every box and mark
  // them correct, so the screen completes and Tovabb appears.
  const fillCorrect = () => {
    setFieldStates(() => {
      const next: Record<string, FieldState> = {}
      for (const exercise of screen.exercises) {
        for (const field of exercise.fields) {
          next[field.id] = { value: field.acceptedAnswers[0] ?? "", status: "correct" }
        }
      }
      return next
    })
  }

  const showNextHint = (exerciseId: string, total: number) => {
    setHintLevels((prev) => ({
      ...prev,
      [exerciseId]: Math.min((prev[exerciseId] ?? 0) + 1, total),
    }))
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
        {screen.introText && (
          <p className={styles.intro}>
            <MathText text={screen.introText} />
          </p>
        )}

        {screen.exercises.map((exercise) => {
          const hints = exercise.hints ?? []
          const level = hintLevels[exercise.id] ?? 0
          return (
            <section key={exercise.id} className={styles.task}>
              <p className={styles.prompt}>
                <MathText text={exercise.prompt} />
              </p>

              <div className={styles.fields}>
                {exercise.fields.map((field) => {
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
                            checkAll()
                          }
                        }}
                      />
                    </div>
                  )
                })}
              </div>

              {hints.length > 0 && (
                <div className={styles.hints}>
                  {level > 0 && (
                    <ol className={styles.hintList}>
                      {hints.slice(0, level).map((hint, hintIndex) => (
                        <li key={hintIndex} className={styles.hintItem}>
                          <MathText text={hint} />
                        </li>
                      ))}
                    </ol>
                  )}
                  {level < hints.length && (
                    <button
                      type="button"
                      className={styles.hintButton}
                      onClick={() => showNextHint(exercise.id, hints.length)}
                    >
                      Tipp {level + 1}/{hints.length}
                    </button>
                  )}
                </div>
              )}
            </section>
          )
        })}

        <div className={styles.actions}>
          <button type="button" className={styles.checkButton} onClick={checkAll}>
            Ellenőrzés
          </button>
          {!isLast && (
            <button
              type="button"
              className={`${styles.continueButton} ${allCorrect ? styles.visible : styles.hidden}`}
              onClick={onContinue}
              tabIndex={allCorrect ? 0 : -1}
            >
              Tovább
            </button>
          )}
        </div>
      </div>

      {devMode && (
        <button type="button" className="devButton" onClick={fillCorrect}>
          Kitöltés
        </button>
      )}
    </div>
  )
}
