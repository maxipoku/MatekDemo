import { Fragment } from "react"
import styles from "./ProgressBar.module.css"

type Kind = "narration" | "exercise"

type Props = {
  steps: Kind[] // one per screen, in play order
  current: number // index of the screen on show
}

// Each screen is a marker: a circle for a narration scene, a hexagon for an
// exercise. Drawn as SVG so the fill and outline are easy to animate.
function Shape({ kind }: { kind: Kind }) {
  return (
    <svg className={styles.shape} viewBox="0 0 20 20" aria-hidden="true">
      {kind === "exercise" ? (
        <polygon points="6,3 14,3 18,10 14,17 6,17 2,10" />
      ) : (
        <circle cx="10" cy="10" r="7.5" />
      )}
    </svg>
  )
}

// A thin progress line across the top. It fills up to the screen on show, the
// passed markers fill with colour, and the current one pops with a sparkle.
export function ProgressBar({ steps, current }: Props) {
  const total = steps.length
  return (
    <div
      className={styles.bar}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={Math.min(current + 1, total)}
      aria-label="Haladás a történetben"
    >
      <div className={styles.row}>
        {steps.map((kind, index) => {
          const state =
            index < current ? styles.past : index === current ? styles.current : styles.future
          return (
            <Fragment key={index}>
              {index > 0 && (
                <span className={`${styles.conn} ${index <= current ? styles.connOn : ""}`} />
              )}
              <span className={`${styles.marker} ${state}`}>
                <Shape kind={kind} />
                {index === current && (
                  <span className={styles.sparkle} aria-hidden="true">
                    <span className={styles.ring} />
                    <span className={styles.star}>✦</span>
                  </span>
                )}
              </span>
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
