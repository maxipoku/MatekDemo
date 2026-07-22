import katex from "katex"

type Segment = { math: boolean; value: string }

// Splits a string into alternating plain text and math parts. Math is anything
// written between single dollar signs, for example: a $\frac{3}{4}$ resze.
function splitSegments(text: string): Segment[] {
  const segments: Segment[] = []
  let i = 0
  while (i < text.length) {
    const start = text.indexOf("$", i)
    if (start === -1) {
      segments.push({ math: false, value: text.slice(i) })
      break
    }
    if (start > i) segments.push({ math: false, value: text.slice(i, start) })
    const end = text.indexOf("$", start + 1)
    if (end === -1) {
      // No closing dollar sign: show the remainder as plain text.
      segments.push({ math: false, value: text.slice(start) })
      break
    }
    segments.push({ math: true, value: text.slice(start + 1, end) })
    i = end + 1
  }
  return segments
}

// Renders text with inline math. throwOnError is off so a small LaTeX mistake
// shows in red instead of crashing the whole screen.
export function MathText({ text }: { text: string }) {
  const segments = splitSegments(text)
  return (
    <>
      {segments.map((segment, index) =>
        segment.math ? (
          <span
            key={index}
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(segment.value, {
                throwOnError: false,
                displayMode: false,
              }),
            }}
          />
        ) : (
          <span key={index}>{segment.value}</span>
        ),
      )}
    </>
  )
}
