import { useState } from "react"
import { imageUrl } from "../lib/assets"
import styles from "./CoverScreen.module.css"

type Props = {
  coverImage: string
  onStart: () => void
}

export function CoverScreen({ coverImage, onStart }: Props) {
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
    </div>
  )
}
