import { useEffect, useRef, useState } from "react"
import type { RefObject } from "react"
import type { NarrationScreen as NarrationScreenData } from "../content/types"
import { imageUrl } from "../lib/assets"
import styles from "./NarrationScreen.module.css"

type Props = {
  screen: NarrationScreenData
  canContinue: boolean
  isLast: boolean
  devMode: boolean
  audioRef: RefObject<HTMLAudioElement | null>
  onImageReady: () => void
  onContinue: () => void
}

export function NarrationScreen({
  screen,
  canContinue,
  isLast,
  devMode,
  audioRef,
  onImageReady,
  onContinue,
}: Props) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [portrait, setPortrait] = useState(false)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  // If the picture is missing, still move to the sound step so nothing hangs.
  useEffect(() => {
    if (failed) onImageReady()
  }, [failed, onImageReady])

  // For a tall (portrait) composition, slide the picture from its top edge to
  // its bottom edge in step with the narration audio, so it reaches the bottom
  // exactly when the narration ends. A landscape picture never moves.
  useEffect(() => {
    if (!portrait) return
    const image = imgRef.current
    const wrap = wrapRef.current
    if (!image || !wrap) return

    let frame = 0
    const tick = () => {
      const overflow = image.offsetHeight - wrap.clientHeight
      if (overflow > 0) {
        const audio = audioRef.current
        let progress = 0
        if (audio && isFinite(audio.duration) && audio.duration > 0) {
          progress = Math.min(audio.currentTime / audio.duration, 1)
        }
        image.style.transform = `translateY(${-overflow * progress}px)`
      } else {
        // Shorter than the screen: center it, with no motion.
        image.style.transform = `translateY(${-overflow / 2}px)`
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [portrait, audioRef])

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

      {!isLast && (
        <div className={styles.controls}>
          <button
            type="button"
            className={`${styles.continueButton} ${canContinue ? styles.visible : styles.hidden}`}
            onClick={onContinue}
            tabIndex={canContinue ? 0 : -1}
          >
            Tovább
          </button>
        </div>
      )}

      {devMode && !isLast && (
        <button type="button" className="devButton" onClick={onContinue}>
          Átugrás
        </button>
      )}
    </div>
  )
}
