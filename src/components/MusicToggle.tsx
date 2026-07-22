import styles from "./MusicToggle.module.css"

type Props = {
  on: boolean
  onToggle: () => void
}

const speakerOn = (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
    <path d="M3 9v6h4l5 5V4L7 9H3z" />
    <path
      d="M16 8.5a3.5 3.5 0 0 1 0 7M18.7 6a6.5 6.5 0 0 1 0 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

const speakerOff = (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
    <path d="M3 9v6h4l5 5V4L7 9H3z" />
    <path
      d="M16 9L22 15M22 9L16 15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

export function MusicToggle({ on, onToggle }: Props) {
  return (
    <button
      type="button"
      className={styles.button}
      onClick={onToggle}
      aria-pressed={on}
      aria-label={on ? "Zene némítása" : "Zene bekapcsolása"}
    >
      <span className={styles.icon}>{on ? speakerOn : speakerOff}</span>
    </button>
  )
}
