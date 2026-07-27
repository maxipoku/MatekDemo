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
      <button type="button" className={styles.startButton} onClick={onStart} autoFocus>
        Kezdés
      </button>
      <button
        type="button"
        className="devButton"
        onClick={onToggleDevMode}
        aria-pressed={devMode}
      >
        Fejlesztői mód: {devMode ? "be" : "ki"}
      </button>
    </div>
  )
}
