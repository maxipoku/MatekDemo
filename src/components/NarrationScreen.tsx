import { useEffect, useState } from "react"
import type { NarrationScreen as NarrationScreenData } from "../content/types"
import { imageUrl } from "../lib/assets"
import styles from "./NarrationScreen.module.css"

type Props = {
  screen: NarrationScreenData
  canContinue: boolean
  isLast: boolean
  onImageReady: () => void
  onContinue: () => void
}

export function NarrationScreen({ screen, canContinue, isLast, onImageReady, onContinue }: Props) {
  const [failed, setFailed] = useState(false)

  // If the picture is missing, still move to the sound step so nothing hangs.
  useEffect(() => {
    if (failed) onImageReady()
  }, [failed, onImageReady])

  return (
    <div className={styles.narration}>
      {!failed && (
        <img
          className={styles.image}
          src={imageUrl(screen.image)}
          alt=""
          onLoad={onImageReady}
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
    </div>
  )
}
