import { useEffect, useRef, useState } from "react"
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

// Submitting opens a prefilled email to this address (the user then sends it).
// Change the address here if needed; it is visible in the built code, so a
// dedicated inbox is fine.
const FEEDBACK_EMAIL = "thesolydstore@gmail.com"
const FEEDBACK_SUBJECT = "Matek demo visszajelzés"

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

// Readable labels for the email body.
const LABELS: Record<string, string> = {
  q1_role: "Ki tölti ki",
  q2_device: "Milyen eszközön nézte",
  s_impression: "Milyen volt (pár szóban)",
  s_exciting: "Mennyire volt izgalmas a történet",
  s_bestWorst: "Legjobb és legunalmasabb rész",
  s_frustrations: "Mitől tart leginkább a felvételiben",
  s_media: "Milyen médiákat fogyaszt",
  p_useful: "Mennyire hasznos a felvételihez",
  p_usefulWhy: "Indoklás",
  p_recommend: "Ajánlaná másik szülőnek",
  p_media: "Milyen médiákat fogyaszt",
  p_anythingElse: "Bármi más, kritika",
}

// The order the answers appear in the email. Only answered ones are included.
const ORDER = [
  "q1_role",
  "q2_device",
  "s_impression",
  "s_exciting",
  "s_bestWorst",
  "s_frustrations",
  "s_media",
  "p_useful",
  "p_usefulWhy",
  "p_recommend",
  "p_media",
  "p_anythingElse",
]

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
  // form: filling in. sending: saving to the server. done: saved. fallback: the
  // save failed, so we show the copy or email screen so feedback is never lost.
  const [status, setStatus] = useState<"form" | "sending" | "done" | "fallback">("form")
  const [result, setResult] = useState<{ body: string; mailto: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const summaryRef = useRef<HTMLTextAreaElement>(null)

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
    // Save the answers to our own serverless endpoint, which writes them to the
    // database. If that ever fails (offline, or running without the backend), we
    // fall back to the copy or email screen so the feedback is never lost. Build
    // that fallback text up front from the same answers.
    const sourceLine = source
      ? source.type === "ending"
        ? "Forrás: a történet vége"
        : `Forrás: ${source.position}. képernyő / ${source.total} (${source.type})`
      : "Forrás: ismeretlen"
    // Only the answers that belong to the chosen role. The student (s_) and the
    // parent/teacher (p_) blocks share the answers object, so if someone picks a
    // role, fills something in, then switches, the earlier role's answers linger.
    // Dropping them here keeps a submission to one role, and avoids two identically
    // labelled lines (both media questions read "Milyen médiákat fogyaszt").
    const belongsToRole = (key: string) => {
      if (key.startsWith("s_")) return isStudent
      if (key.startsWith("p_")) return isParentTeacher
      return true
    }
    const relevant: Answers = {}
    for (const key of Object.keys(answers)) {
      if (belongsToRole(key)) relevant[key] = answers[key]
    }
    const lines = ORDER.filter((key) => {
      if (!belongsToRole(key)) return false
      const value = relevant[key]
      if (value === undefined || value === "") return false
      if (Array.isArray(value) && value.length === 0) return false
      return true
    }).map((key) => {
      const value = relevant[key]
      return `${LABELS[key]}: ${Array.isArray(value) ? value.join(", ") : value}`
    })
    const body = [sourceLine, "", ...lines].join("\n")
    const mailto = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(
      FEEDBACK_SUBJECT,
    )}&body=${encodeURIComponent(body)}`

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
      setResult({ body, mailto })
      setStatus("fallback")
    }
  }

  const markCopied = () => {
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      markCopied()
      return
    } catch {
      // Fall through to the legacy path below.
    }
    // Fallback: select the text box and use the old copy command. If even that is
    // blocked, the text stays selected so it can be copied by hand.
    const area = summaryRef.current
    if (area) {
      area.focus()
      area.select()
      try {
        if (document.execCommand("copy")) markCopied()
      } catch {
        // Left selected for a manual copy.
      }
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

  if (status === "fallback" && result) {
    return (
      <div className={styles.feedback}>
        <div className={styles.doneCard}>
          <h1 className={styles.title}>Köszönjük!</h1>
          <p className={styles.doneNote}>
            Az elküldés most nem sikerült. Másold ki a szöveget, vagy nyisd meg a levelezőt, és küldd
            el a(z) {FEEDBACK_EMAIL} címre.
          </p>
          <div className={styles.doneActions}>
            <button type="button" className={styles.submit} onClick={() => copy(result.body)}>
              {copied ? "Kimásolva" : "Szöveg másolása"}
            </button>
            <a className={styles.openMail} href={result.mailto}>
              Levelező megnyitása
            </a>
          </div>
          <textarea
            ref={summaryRef}
            className={styles.summary}
            readOnly
            rows={9}
            value={result.body}
          />
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
