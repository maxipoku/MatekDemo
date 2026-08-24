import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import styles from "./FeedbackScreen.module.css"

// Where the user was when they opened feedback, so the submission records how far
// they got. index/position are 0 and 1 based positions in the screen list.
export type FeedbackSource = {
  index: number
  position: number
  total: number
  type: string
}

type Props = {
  source: FeedbackSource | null
  onBack: () => void
}

// A single answer is a string or number, except multi select (checkbox) questions,
// which keep the chosen options as an array.
type Answers = Record<string, string | number | string[]>

// The half filled form is kept here for the browser session, so an accidental
// Vissza (which unmounts this screen) does not throw away what was typed. It is
// restored when the questionnaire is opened again and cleared once a submission
// saves. sessionStorage, not localStorage, so it lives only for this tab.
const STORAGE_KEY = "matek_feedback_answers"

function loadAnswers(): Answers {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Answers
  } catch {
    // Private mode or corrupt value: start empty, no harm done.
  }
  return {}
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.q}>
      <p className={styles.label}>{label}</p>
      {children}
    </div>
  )
}

function Radio({
  name,
  options,
  value,
  onChange,
}: {
  name: string
  options: string[]
  value?: string | number | string[]
  onChange: (v: string) => void
}) {
  return (
    <div className={styles.options}>
      {options.map((opt) => (
        <label key={opt} className={styles.option}>
          <input type="radio" name={name} checked={value === opt} onChange={() => onChange(opt)} />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  )
}

// Like Radio, but several options can be picked at once. The chosen ones are kept
// as an array in the answers.
function CheckboxGroup({
  name,
  options,
  values,
  onToggle,
}: {
  name: string
  options: string[]
  values: string[]
  onToggle: (option: string) => void
}) {
  return (
    <div className={styles.options}>
      {options.map((opt) => (
        <label key={opt} className={styles.option}>
          <input
            type="checkbox"
            name={name}
            checked={values.includes(opt)}
            onChange={() => onToggle(opt)}
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  )
}

function Scale({
  name,
  min,
  max,
  value,
  onChange,
}: {
  name: string
  min: number
  max: number
  value?: string | number | string[]
  onChange: (v: number) => void
}) {
  const nums: number[] = []
  for (let n = min; n <= max; n++) nums.push(n)
  return (
    <div className={styles.scale}>
      {nums.map((n) => (
        <label key={n} className={styles.scaleItem}>
          <input type="radio" name={name} checked={value === n} onChange={() => onChange(n)} />
          <span>{n}</span>
        </label>
      ))}
    </div>
  )
}

export function FeedbackScreen({ source, onBack }: Props) {
  const [answers, setAnswers] = useState<Answers>(loadAnswers)
  // form: filling in. sending: saving to the server. done: saved (thank you screen).
  // error: the save failed, so the form stays up with a note to try again.
  const [status, setStatus] = useState<"form" | "sending" | "done" | "error">("form")

  const set = (key: string, value: string | number) =>
    setAnswers((prev) => ({ ...prev, [key]: value }))
  const val = (key: string) => (answers[key] as string) ?? ""
  // Multi select (checkbox) answers are kept as arrays. arr reads one, toggle flips
  // a single option in it.
  const arr = (key: string) => (Array.isArray(answers[key]) ? (answers[key] as string[]) : [])
  const toggle = (key: string, option: string) =>
    setAnswers((prev) => {
      const current = Array.isArray(prev[key]) ? (prev[key] as string[]) : []
      const next = current.includes(option)
        ? current.filter((v) => v !== option)
        : [...current, option]
      return { ...prev, [key]: next }
    })

  // Keep the session copy in step with what has been filled in, so it survives an
  // accidental Vissza and is there when the form is reopened.
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
    } catch {
      // Storing is best effort; losing it only means the form does not persist.
    }
  }, [answers])

  const role = answers.q1_role
  const isStudent = role === "Diák"
  const isParentTeacher = role === "Szülő" || role === "Tanár"

  const submit = async () => {
    // Only the answers that belong to the chosen role. The student (s_) and the
    // parent/teacher (p_) blocks share the answers object, so if someone picks a
    // role, fills something in, then switches, the earlier role's answers linger.
    // Dropping them here keeps a submission to one role.
    const belongsToRole = (key: string) => {
      if (key.startsWith("s_")) return isStudent
      if (key.startsWith("p_")) return isParentTeacher
      return true
    }
    const relevant: Answers = {}
    for (const key of Object.keys(answers)) {
      if (belongsToRole(key)) relevant[key] = answers[key]
    }

    // Save straight to our serverless endpoint, which writes to the database.
    setStatus("sending")
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: relevant, source }),
      })
      if (!response.ok) throw new Error(`save failed: ${response.status}`)
      // Saved, so the kept copy is no longer needed. A later open starts fresh.
      try {
        sessionStorage.removeItem(STORAGE_KEY)
      } catch {
        // Nothing to do if the store is unavailable.
      }
      setStatus("done")
    } catch {
      // The save failed. Stay on the form so the user can try again; the answers
      // are untouched and still kept in sessionStorage.
      setStatus("error")
    }
  }

  if (status === "done") {
    return (
      <div className={styles.feedback}>
        <div className={styles.doneCard}>
          <h1 className={styles.title}>Köszönjük!</h1>
          <p className={styles.doneNote}>
            A visszajelzésed megérkezett. Sokat segítesz vele a fejlesztésben.
          </p>
          <button type="button" className={styles.back} onClick={onBack}>
            Vissza
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.feedback}>
      <div className={styles.form}>
        <h1 className={styles.title}>Visszajelző kérdőív</h1>

        <Field label="Ki tölti ki?">
          <Radio
            name="q1_role"
            options={["Diák", "Szülő", "Tanár"]}
            value={answers.q1_role}
            onChange={(v) => set("q1_role", v)}
          />
        </Field>

        <Field label="Milyen eszközön nézted?">
          <Radio
            name="q2_device"
            options={["Telefon", "Tablet", "Laptop vagy asztali gép"]}
            value={answers.q2_device}
            onChange={(v) => set("q2_device", v)}
          />
        </Field>

        {isStudent && (
          <>
            <Field label="Írd le pár szóban, milyen volt.">
              <textarea
                className={styles.textarea}
                rows={2}
                value={val("s_impression")}
                onChange={(e) => set("s_impression", e.target.value)}
              />
            </Field>

            <Field label="Mennyire volt izgalmas a történet?">
              <Scale
                name="s_exciting"
                min={1}
                max={5}
                value={answers.s_exciting}
                onChange={(v) => set("s_exciting", v)}
              />
            </Field>

            <Field label="Mi volt a legjobb és mi volt a legunalmasabb rész?">
              <textarea
                className={styles.textarea}
                rows={3}
                value={val("s_bestWorst")}
                onChange={(e) => set("s_bestWorst", e.target.value)}
              />
            </Field>

            <Field label="Mitől tartasz leginkább a felvételiben?">
              <textarea
                className={styles.textarea}
                rows={3}
                value={val("s_frustrations")}
                onChange={(e) => set("s_frustrations", e.target.value)}
              />
            </Field>

            <Field label="Milyen médiákat fogyasztasz?">
              <CheckboxGroup
                name="s_media"
                options={["TikTok", "Instagram", "YouTube", "Újságok", "TV"]}
                values={arr("s_media")}
                onToggle={(opt) => toggle("s_media", opt)}
              />
            </Field>
          </>
        )}

        {isParentTeacher && (
          <>
            <Field label="Mennyire tartod hasznosnak a felvételire készüléshez?">
              <Scale
                name="p_useful"
                min={1}
                max={5}
                value={answers.p_useful}
                onChange={(v) => set("p_useful", v)}
              />
              <textarea
                className={styles.textarea}
                rows={2}
                placeholder="Indoklás"
                value={val("p_usefulWhy")}
                onChange={(e) => set("p_usefulWhy", e.target.value)}
              />
            </Field>

            <Field label="Ajánlanád egy másik szülőnek? (0 = biztosan nem, 10 = biztosan igen)">
              <Scale
                name="p_recommend"
                min={0}
                max={10}
                value={answers.p_recommend}
                onChange={(v) => set("p_recommend", v)}
              />
            </Field>

            <Field label="Milyen médiákat fogyasztasz?">
              <CheckboxGroup
                name="p_media"
                options={["TikTok", "Instagram", "YouTube", "Újságok", "TV"]}
                values={arr("p_media")}
                onToggle={(opt) => toggle("p_media", opt)}
              />
            </Field>

            <Field label="Bármi más, akár kritika.">
              <textarea
                className={styles.textarea}
                rows={3}
                value={val("p_anythingElse")}
                onChange={(e) => set("p_anythingElse", e.target.value)}
              />
            </Field>
          </>
        )}

        <p className={styles.privacy}>
          A válaszokat névtelenül tároljuk, és csak a demó fejlesztéséhez használjuk.
        </p>

        {status === "error" && (
          <p className={styles.error}>
            Az elküldés nem sikerült. Ellenőrizd az internetkapcsolatot, és próbáld újra.
          </p>
        )}

        <div className={styles.actions}>
          <button type="button" className={styles.back} onClick={onBack}>
            Vissza
          </button>
          <button
            type="button"
            className={styles.submit}
            onClick={submit}
            disabled={!role || status === "sending"}
          >
            {status === "sending" ? "Küldés..." : "Elküldés"}
          </button>
        </div>
      </div>
    </div>
  )
}
