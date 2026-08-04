import { useState } from "react"
import { imageUrl } from "../lib/assets"
import styles from "./CoverScreen.module.css"

type Props = {
  coverImage: string
  onStart: () => void
  devMode: boolean
  onToggleDevMode: () => void
}

export function CoverScreen({ coverImage, onStart, devMode, onToggleDevMode }: Props) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={styles.cover}>
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
        <h1 className={styles.title}>A Törtek Tengere</h1>
        <button type="button" className={styles.startButton} onClick={onStart}>
          Kezdés
        </button>
      </div>
      <button
        type="button"
        className={styles.devToggle}
        onClick={onToggleDevMode}
        aria-pressed={devMode}
        aria-label="Fejlesztői mód"
        tabIndex={-1}
      >
        Fejlesztői mód: {devMode ? "be" : "ki"}
      </button>
    </div>
  )
}
