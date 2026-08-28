import { useEffect, useMemo, useRef, useState } from "react"
import type { RefObject } from "react"
import type { NarrationScreen as NarrationScreenData } from "../content/types"
import { imageUrl } from "../lib/assets"
import { analyzeCaption, revealedWordCount } from "../lib/sentences"
import { CaptionTimer } from "./CaptionTimer"
import styles from "./NarrationScreen.module.css"

// If a narration sound is missing, reveal the whole caption after this pause so
// it is never stuck hidden with no audio to pace it.
const CAPTION_FALLBACK_MS = 2000
// Keep a little breathing room below the newest revealed line.
const CAPTION_BOTTOM_GAP = 10

type Props = {
  screen: NarrationScreenData
  canContinue: boolean
  isLast: boolean
  devMode: boolean
  audioRef: RefObject<HTMLAudioElement | null>
  onImageReady: () => void
  onContinue: () => void
  onReplay: () => void
  // Go back to the previous screen. Left out on the very first screen, where there
  // is nowhere to go back to, and the Vissza button is then not shown.
  onBack?: () => void
}

export function NarrationScreen({
  screen,
  canContinue,
  isLast,
  devMode,
  audioRef,
  onImageReady,
  onContinue,
  onReplay,
  onBack,
}: Props) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [portrait, setPortrait] = useState(false)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const captionViewportRef = useRef<HTMLDivElement | null>(null)
  const captionInnerRef = useRef<HTMLParagraphElement | null>(null)

  const caption = screen.caption
  const timings = screen.captionTimings
  const analysis = useMemo(() => (caption ? analyzeCaption(caption) : null), [caption])

  // If the picture is missing, still move to the sound step so nothing hangs.
  useEffect(() => {
    if (failed) onImageReady()
  }, [failed, onImageReady])

  // One loop, paced to the narration audio: it slides a tall picture from top to
  // bottom, and reveals the caption word by word (following recorded sentence
  // times when present, otherwise spread evenly), keeping the newest words in view.
  useEffect(() => {
    if (!portrait && !analysis) return

    const startedAt = performance.now()
    let lastRevealed = -1
    let frame = 0

    const tick = () => {
      const audio = audioRef.current
      // Only trust the audio clock once the shared player is actually playing
      // this screen's sound. Right after advancing it still holds the previous
      // screen's finished position for a moment, so treat the time as 0 until it
      // matches, otherwise the caption would flash in fully revealed.
      const matches = Boolean(audio && audio.currentSrc && audio.currentSrc.includes(screen.audio))
      const duration =
        matches && audio && isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0
      const time = matches && audio ? audio.currentTime : 0
      let progress = duration > 0 ? Math.min(time / duration, 1) : 0
      const noAudio = duration === 0 && performance.now() - startedAt > CAPTION_FALLBACK_MS
      if (noAudio) progress = 1

      if (portrait) {
        const image = imgRef.current
        const wrap = wrapRef.current
        if (image && wrap) {
          const overflow = image.offsetHeight - wrap.clientHeight
          image.style.transform =
            overflow > 0
              ? `translateY(${-overflow * progress}px)`
              : `translateY(${-overflow / 2}px)`
        }
      }

      const inner = captionInnerRef.current
      const viewport = captionViewportRef.current
      if (inner && viewport && analysis) {
        const total = analysis.words.length
        let revealed: number
        if (timings && timings.length > 0 && duration > 0 && !noAudio) {
          revealed = revealedWordCount(time, duration, timings, analysis)
        } else {
          revealed = Math.round(progress * total)
        }
        revealed = Math.min(total, Math.max(0, revealed))

        const spans = inner.children
        if (revealed !== lastRevealed) {
          const from = Math.max(0, Math.min(revealed, lastRevealed))
          const to = Math.max(revealed, lastRevealed)
          for (let i = from; i < to; i++) {
            ;(spans[i] as HTMLElement).style.opacity = i < revealed ? "1" : "0"
          }
          lastRevealed = revealed
        }
        if (revealed > 0 && spans[revealed - 1]) {
          const last = spans[revealed - 1] as HTMLElement
          const bottom = last.offsetTop + last.offsetHeight
          const scroll = Math.max(0, bottom - viewport.clientHeight + CAPTION_BOTTOM_GAP)
          inner.style.transform = `translateY(${-scroll}px)`
        } else {
          inner.style.transform = "translateY(0px)"
        }
      }

      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [portrait, audioRef, analysis, timings, screen.audio])

  const handleLoad = () => {
    const image = imgRef.current
    if (image) setPortrait(image.naturalHeight > image.naturalWidth)
    setLoaded(true)
    onImageReady()
  }

  return (
    <div className={styles.narration} ref={wrapRef}>
      {!failed && (
        <img
          ref={imgRef}
          className={portrait ? styles.imagePan : styles.image}
          style={{ opacity: loaded ? 1 : 0 }}
          src={imageUrl(screen.image)}
          alt=""
          onLoad={handleLoad}
          onError={() => setFailed(true)}
        />
      )}

      {caption && analysis && (
        <div className={styles.captionOverlay}>
          <div className={styles.captionViewport} ref={captionViewportRef}>
            <p className={styles.captionInner} ref={captionInnerRef}>
              {analysis.words.map((word, index) => (
                <span key={index} className={styles.word}>
                  {index < analysis.words.length - 1 ? word + " " : word}
                </span>
              ))}
            </p>
          </div>
        </div>
      )}

      <div className={styles.controls}>
        <button
          type="button"
          className={`${styles.replayButton} ${canContinue ? styles.visible : styles.hidden}`}
          onClick={onReplay}
          tabIndex={canContinue ? 0 : -1}
        >
          Történet újrajátszása
        </button>
        {!isLast && (
          <button
            type="button"
            className={`${styles.continueButton} ${canContinue ? styles.visible : styles.hidden}`}
            onClick={onContinue}
            tabIndex={canContinue ? 0 : -1}
          >
            Tovább
          </button>
        )}
      </div>

      {/* Always available, unlike Tovabb which waits for the narration to finish. A
          child who does not want to hear the story out can jump straight to the next
          block from the bottom right corner. */}
      {!isLast && (
        <button type="button" className={styles.skipButton} onClick={onContinue}>
          Történet átugrása
        </button>
      )}

      {/* Go back, mirroring the skip button in the bottom left corner. Only shown when
          there is a previous screen (so not on the first one). */}
      {onBack && (
        <button type="button" className={styles.backButton} onClick={onBack}>
          Vissza
        </button>
      )}

      {devMode && !isLast && (
        <button type="button" className="devButton" onClick={onContinue}>
          Átugrás
        </button>
      )}

      {devMode && caption && <CaptionTimer caption={caption} audioRef={audioRef} />}
    </div>
  )
}
