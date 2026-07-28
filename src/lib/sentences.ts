// Splits a caption into sentences and maps them to word positions. The timing
// tool and the player both use this, so they always agree on where sentences
// begin, which is what lets the recorded times line up with the word reveal.

export type CaptionAnalysis = {
  words: string[] // every word, in order (this is what the player renders and reveals)
  counts: number[] // how many words each sentence has
  starts: number[] // the word index each sentence starts at
  sentences: string[] // the sentence texts (shown in the timing tool)
}

// A word ends a sentence when it ends in . ! ? or an ellipsis, optionally
// followed by a closing quote or bracket.
const TERMINATOR = /[.!?…]["”'»)]?$/

export function analyzeCaption(caption: string): CaptionAnalysis {
  const words = caption.split(/\s+/).filter(Boolean)
  const counts: number[] = []
  let current = 0
  for (const word of words) {
    current++
    if (TERMINATOR.test(word)) {
      counts.push(current)
      current = 0
    }
  }
  if (current > 0) counts.push(current) // trailing words with no closing punctuation

  const starts: number[] = []
  let acc = 0
  for (const count of counts) {
    starts.push(acc)
    acc += count
  }

  const sentences = counts.map((count, i) => words.slice(starts[i], starts[i] + count).join(" "))
  return { words, counts, starts, sentences }
}

// How many words should be shown at a given audio time. Each recorded time is
// the END of a sentence (the tap that closes it). Sentence 0 starts at 0, and
// each later sentence starts where the previous one ended, so the first sentence
// always begins right away. Within a sentence the words ease in evenly.
export function revealedWordCount(
  currentTime: number,
  duration: number,
  timings: number[],
  analysis: CaptionAnalysis,
): number {
  const { counts, words } = analysis
  if (counts.length === 0) return 0

  let revealed = 0
  for (let i = 0; i < counts.length; i++) {
    const sentenceStart = i === 0 ? 0 : i - 1 < timings.length ? timings[i - 1] : duration
    const sentenceEnd = i < timings.length ? timings[i] : duration
    if (currentTime >= sentenceEnd) {
      revealed += counts[i]
      continue
    }
    if (currentTime > sentenceStart) {
      const span = sentenceEnd - sentenceStart
      const fraction = span > 0 ? Math.min(1, Math.max(0, (currentTime - sentenceStart) / span)) : 1
      revealed += Math.floor(fraction * counts[i])
    }
    break
  }
  return Math.min(words.length, revealed)
}
