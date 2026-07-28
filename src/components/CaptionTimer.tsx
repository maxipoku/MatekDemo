import { useCallback, useEffect, useRef, useState } from "react"
import type { RefObject } from "react"
import { analyzeCaption } from "../lib/sentences"
import styles from "./CaptionTimer.module.css"

// Developer mode tool. Replays the narration and lets you tap the spacebar at
// the start of each sentence; it records the exact audio times and prints a
// captionTimings line to paste into the screen in story.ts.
type Props = {
  caption: string
  audioRef: RefObject<HTMLAudioElement | null>
}

export function CaptionTimer({ caption, audioRef }: Props) {
  const { sentences } = analyzeCaption(caption)
  const total = sentences.length

  const [phase, setPhase] = useState<"idle" | "recording" | "done">("idle")
  const [index, setIndex] = useState(0)
  const [times, setTimes] = useState<number[]>([])
  const indexRef = useRef(0)

  const start = useCallback(() => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = 0
      audio.play().catch(() => {})
    }
    indexRef.current = 0
    setIndex(0)
    setTimes([])
    setPhase("recording")
  }, [audioRef])

  const tap = useCallback(() => {
    const audio = audioRef.current
    const value = audio ? Math.round(audio.currentTime * 100) / 100 : 0
    setTimes((prev) => [...prev, value])
    const next = indexRef.current + 1
    indexRef.current = next
    setIndex(next)
    if (next >= total) {
      if (audio) audio.pause()
      setPhase("done")
    }
  }, [audioRef, total])

  const reset = useCallback(() => {
    indexRef.current = 0
    setIndex(0)
    setTimes([])
    setPhase("idle")
  }, [])

  // Spacebar records a tap while recording; Esc cancels.
  useEffect(() => {
    if (phase !== "recording") return
    const onKey = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault()
        if (!event.repeat) tap()
      } else if (event.code === "Escape") {
        reset()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [phase, tap, reset])

  if (phase === "idle") {
    return (
      <button type="button" className={styles.timerButton} onClick={start}>
        Időzítés ({total} mondat)
      </button>
    )
  }

  return (
    <div className={styles.panel}>
      {phase === "recording" ? (
        <>
          <div className={styles.counter}>
            {Math.min(index + 1, total)} / {total}
          </div>
          <div className={styles.sentence}>{sentences[index] ?? ""}</div>
          <div className={styles.tapButton} onClick={tap} role="button">
            Vége (szóköz)
          </div>
          <div className={styles.hint}>
            Koppints, amikor a felolvasó befejezi ezt a mondatot. Az első a nulláról indul.
            Kilépés: Esc.
          </div>
        </>
      ) : (
        <>
          <div className={styles.doneTitle}>
            Kész. Másold ezt a sort a képernyő beállításai közé a story.ts fájlban:
          </div>
          <textarea
            className={styles.output}
            readOnly
            rows={2}
            value={`captionTimings: [${times.join(", ")}],`}
            onFocus={(event) => event.currentTarget.select()}
          />
          <button type="button" className={styles.panelButton} onClick={reset}>
            Újra
          </button>
        </>
      )}
    </div>
  )
}
