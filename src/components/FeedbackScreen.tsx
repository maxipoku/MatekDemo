import { useRef, useState } from "react"
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

type Answers = Record<string, string | number>

// Submitting opens a prefilled email to this address (the user then sends it).
// Change the address here if needed; it is visible in the built code, so a
// dedicated inbox is fine.
const FEEDBACK_EMAIL = "thesolydstore@gmail.com"
const FEEDBACK_SUBJECT = "Matek demo visszajelzés"

// Readable labels for the email body.
const LABELS: Record<string, string> = {
  q1_role: "Ki tölti ki",
  q2_device: "Milyen eszközön nézte",
  s_impression: "Milyen volt (pár szóban)",
  s_exciting: "Mennyire volt izgalmas a történet",
  s_taskVsStory: "A feladat megszakította vagy a történet része volt",
  s_clarity: "Egyértelmű volt, mit kell csinálni és hová írni",
  s_clarityWhere: "Hol akadt el",
  s_nextPart: "Megcsinálná a következő részt",
  s_bestWorst: "Legjobb és legunalmasabb rész",
  s_anythingElse: "Bármi más",
  s_nextTopic: "Miről látna szívesen történetet legközelebb",
  p_gradeExam: "Hányadik osztályos, készül-e felvételire",
  p_howPrepare: "Most hogyan készül",
  p_alone: "Leülne ezzel egyedül",
  p_useful: "Mennyire hasznos a felvételihez",
  p_usefulWhy: "Indoklás",
  p_missing: "Mi hiányzik a használathoz",
  p_pay: "Fizetne érte",
  p_price: "Reális ár",
  p_recommend: "Ajánlaná másik szülőnek",
  p_anythingElse: "Bármi más, kritika",
}

// The order the answers appear in the email. Only answered ones are included.
const ORDER = [
  "q1_role",
  "q2_device",
  "s_impression",
  "s_exciting",
  "s_taskVsStory",
  "s_clarity",
  "s_clarityWhere",
  "s_nextPart",
  "s_bestWorst",
  "s_anythingElse",
  "s_nextTopic",
  "p_gradeExam",
  "p_howPrepare",
  "p_alone",
  "p_useful",
  "p_usefulWhy",
  "p_missing",
  "p_pay",
  "p_price",
  "p_recommend",
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
  value?: string | number
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
  value?: string | number
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
  const [answers, setAnswers] = useState<Answers>({})
  // form: filling in. sending: saving to the server. done: saved. fallback: the
  // save failed, so we show the copy or email screen so feedback is never lost.
  const [status, setStatus] = useState<"form" | "sending" | "done" | "fallback">("form")
  const [result, setResult] = useState<{ body: string; mailto: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const summaryRef = useRef<HTMLTextAreaElement>(null)

  const set = (key: string, value: string | number) =>
    setAnswers((prev) => ({ ...prev, [key]: value }))
  const val = (key: string) => (answers[key] as string) ?? ""

  const role = answers.q1_role
  const isStudent = role === "Diák"
  const isParentTeacher = role === "Szülő" || role === "Tanár"
  const stuck = answers.s_clarity === "Néha elakadtam" || answers.s_clarity === "Sokszor nem értettem"

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
    const lines = ORDER.filter(
      (key) => answers[key] !== undefined && answers[key] !== "",
    ).map((key) => `${LABELS[key]}: ${answers[key]}`)
    const body = [sourceLine, "", ...lines].join("\n")
    const mailto = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(
      FEEDBACK_SUBJECT,
    )}&body=${encodeURIComponent(body)}`

    setStatus("sending")
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, source }),
      })
      if (!response.ok) throw new Error(`save failed: ${response.status}`)
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

            <Field label="A feladat inkább megszakította a történetet, vagy a történet része volt?">
              <Radio
                name="s_taskVsStory"
                options={["Megszakította", "A része volt", "Nem vagyok biztos benne"]}
                value={answers.s_taskVsStory}
                onChange={(v) => set("s_taskVsStory", v)}
              />
            </Field>

            <Field label="Mindig egyértelmű volt, hogy mit kell csinálnod és hová kell írnod a választ?">
              <Radio
                name="s_clarity"
                options={["Végig", "Néha elakadtam", "Sokszor nem értettem"]}
                value={answers.s_clarity}
                onChange={(v) => set("s_clarity", v)}
              />
            </Field>

            {stuck && (
              <Field label="Hol akadtál el?">
                <textarea
                  className={styles.textarea}
                  rows={2}
                  value={val("s_clarityWhere")}
                  onChange={(e) => set("s_clarityWhere", e.target.value)}
                />
              </Field>
            )}

            <Field label="Ha holnap kijönne a következő rész, megcsinálnád?">
              <Radio
                name="s_nextPart"
                options={["Igen, azonnal", "Talán", "Nem"]}
                value={answers.s_nextPart}
                onChange={(v) => set("s_nextPart", v)}
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

            <Field label="Bármi más, ami eszedbe jut?">
              <textarea
                className={styles.textarea}
                rows={2}
                value={val("s_anythingElse")}
                onChange={(e) => set("s_anythingElse", e.target.value)}
              />
            </Field>

            <Field label="Miről látnál szívesen történetet legközelebb?">
              <textarea
                className={styles.textarea}
                rows={2}
                value={val("s_nextTopic")}
                onChange={(e) => set("s_nextTopic", e.target.value)}
              />
            </Field>
          </>
        )}

        {isParentTeacher && (
          <>
            <Field label="Hányadik osztályos a gyereked, és készül-e felvételire?">
              <textarea
                className={styles.textarea}
                rows={2}
                value={val("p_gradeExam")}
                onChange={(e) => set("p_gradeExam", e.target.value)}
              />
            </Field>

            <Field label="Most hogyan készül?">
              <Radio
                name="p_howPrepare"
                options={["Magántanár", "Szakkör", "Munkafüzet otthon", "Veled együtt", "Egyelőre sehogy"]}
                value={answers.p_howPrepare}
                onChange={(v) => set("p_howPrepare", v)}
              />
            </Field>

            <Field label="A gyereked leülne ezzel egyedül?">
              <Radio
                name="p_alone"
                options={["Igen", "Csak ha mellette ülök", "Nem"]}
                value={answers.p_alone}
                onChange={(v) => set("p_alone", v)}
              />
            </Field>

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

            <Field label="Mi hiányzik ahhoz, hogy tényleg használnátok?">
              <textarea
                className={styles.textarea}
                rows={3}
                value={val("p_missing")}
                onChange={(e) => set("p_missing", e.target.value)}
              />
            </Field>

            <Field label="Ha mind a tíz rész elkészülne, fizetnél érte?">
              <Radio
                name="p_pay"
                options={["Igen", "Talán", "Nem"]}
                value={answers.p_pay}
                onChange={(v) => set("p_pay", v)}
              />
              {answers.p_pay === "Igen" && (
                <input
                  type="text"
                  className={styles.textInput}
                  placeholder="Mennyi lenne szerinted reális ár?"
                  value={val("p_price")}
                  onChange={(e) => set("p_price", e.target.value)}
                />
              )}
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
