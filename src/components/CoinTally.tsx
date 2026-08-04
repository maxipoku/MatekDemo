import styles from "./CoinTally.module.css"

type Props = {
  count: number
  awardId: number
}

const coin = (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill="#f4c542" stroke="#a9791b" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="6.4" fill="none" stroke="#d7a327" strokeWidth="1.3" />
    <ellipse cx="9" cy="8.6" rx="2.1" ry="1.2" fill="#fff2c2" opacity="0.7" />
  </svg>
)

// A small treasure count parked in the top corner. It grows as the child answers
// correctly, with a coin pop and a floating plus on each gain. The awardId keys
// the animated parts so they replay every time, even for the same gain value.
export function CoinTally({ count, awardId }: Props) {
  return (
    <div className={styles.tally}>
      <span key={`coin-${awardId}`} className={styles.coin}>
        {coin}
      </span>
      <span className={styles.count}>{count}</span>
      <span className={styles.srOnly} aria-live="polite">
        {count} aranytallér
      </span>
    </div>
  )
}
