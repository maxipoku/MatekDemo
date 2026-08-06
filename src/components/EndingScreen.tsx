import { useState } from "react"
import { imageUrl } from "../lib/assets"
import styles from "./EndingScreen.module.css"

type Props = {
  coverImage: string
  onFeedback: () => void
}

// The closing screen after the last narration: the cover art behind a big "Vége"
// in the pirate title style, and a button that opens the feedback questionnaire.
export function EndingScreen({ coverImage, onFeedback }: Props) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={styles.ending}>
      {!failed && (
        <img
          className={styles.image}
          src={imageUrl(coverImage)}
          alt=""
          onError={() => setFailed(true)}
        />
      )}
      <div className={styles.overlay} />
      <div className={styles.hero}>
        <h1 className={styles.title}>Vége</h1>
        <div className={styles.feedback}>
          <button type="button" className={styles.feedbackButton} onClick={onFeedback}>
            Visszajelző kérdőív
          </button>
          <span className={styles.note}>2 perc</span>
        </div>
      </div>
    </div>
  )
}
