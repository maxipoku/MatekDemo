// Turns a typed answer into a comparable form: trims the ends, removes inner
// spaces, treats a decimal comma the same as a decimal dot, and treats a colon
// the same as a fraction slash. This is the heart of handling Hungarian number
// formats: 10,25 and 10.25 are equal, and a fraction may be written 5/7 or 5:7.
export function normalizeAnswer(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, "")
    .replace(/,/g, ".")
    .replace(/:/g, "/")
}

// True when the typed value matches any of the accepted forms for a field.
// The author lists every form they will accept (for example "3/5" and "0,6"),
// because this compares text and does not do the arithmetic itself.
export function checkAnswer(value: string, acceptedAnswers: string[]): boolean {
  const typed = normalizeAnswer(value)
  if (typed === "") return false
  return acceptedAnswers.some((answer) => normalizeAnswer(answer) === typed)
}
