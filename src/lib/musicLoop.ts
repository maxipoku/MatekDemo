/*
  Seamless looping background music.

  The mp3 loops badly in two separate ways. Its tail does not join its head
  musically, so the loop point is audible as a cut, and a plain looping <audio>
  element also drops a short silence in at the wrap, because mp3 carries encoder
  padding at both ends and the element cannot skip it.

  Both go away here. The file is fetched and decoded once into raw sound, then
  played as overlapping passes: the last few seconds of one pass are faded down
  while the first few seconds of the next are faded up underneath it. Passes are
  scheduled on the audio clock rather than by a timer, so the join is exact.

  If Web Audio is missing or the file cannot be decoded, this falls back to the
  old plain looping element, so a failure here can never leave the story silent.
*/

// How long the end of one pass overlaps the start of the next. The loop then
// comes round every (track length minus this). Raise it for a softer, longer
// blend, lower it if the track loses too much of its ending.
const CROSSFADE_SECONDS = 3
// How far ahead passes are queued, and how often the scheduler wakes to top the
// queue up. The lookahead only has to beat the wake interval comfortably.
const LOOKAHEAD_SECONDS = 6
const SCHEDULE_INTERVAL_MS = 1500
// Volume changes ease over this long, so dragging the slider never clicks.
const VOLUME_RAMP_SECONDS = 0.08
// Resolution of the fade shape. 64 points is far finer than the ear needs.
const CURVE_POINTS = 64

export type MusicPlayer = {
  start: (url: string, volume: number) => void
  setVolume: (volume: number) => void
  setMuted: (muted: boolean) => void
  stop: () => void
}

/*
  An equal power fade, not a straight line. Two overlapping passes of unrelated
  music add up by power, not by amplitude, so a straight line fade would dip in
  volume in the middle of every join. Sine and cosine keep the sum steady.
*/
function fadeCurve(rising: boolean): Float32Array {
  const curve = new Float32Array(CURVE_POINTS)
  for (let i = 0; i < CURVE_POINTS; i += 1) {
    const position = i / (CURVE_POINTS - 1)
    curve[i] = rising
      ? Math.sin((position * Math.PI) / 2)
      : Math.cos((position * Math.PI) / 2)
  }
  return curve
}

export function createMusicPlayer(): MusicPlayer {
  let context: AudioContext | null = null
  let master: GainNode | null = null
  let buffer: AudioBuffer | null = null
  let fallback: HTMLAudioElement | null = null
  let timer: number | undefined
  let nextStart = 0
  let volume = 0
  let muted = false
  let stopped = false

  const fadeIn = fadeCurve(true)
  const fadeOut = fadeCurve(false)

  function applyGain() {
    if (context && master) {
      master.gain.setTargetAtTime(
        muted ? 0 : volume,
        context.currentTime,
        VOLUME_RAMP_SECONDS,
      )
    }
    if (fallback) {
      fallback.volume = volume
      fallback.muted = muted
    }
  }

  function playFallback(url: string) {
    fallback = new Audio(url)
    fallback.loop = true
    fallback.volume = volume
    fallback.muted = muted
    fallback.play().catch(() => {})
  }

  // Kept below half the track so the two fades can never overlap each other.
  function fadeLength(length: number): number {
    return Math.min(CROSSFADE_SECONDS, length / 3)
  }

  function schedulePass(at: number) {
    if (!context || !master || !buffer) return

    const source = context.createBufferSource()
    source.buffer = buffer
    const gain = context.createGain()
    source.connect(gain)
    gain.connect(master)

    const length = buffer.duration
    const fade = fadeLength(length)

    // Up over the first seconds, held at full in the middle by the curve's own
    // last value, then down over the last seconds.
    gain.gain.setValueCurveAtTime(fadeIn, at, fade)
    gain.gain.setValueCurveAtTime(fadeOut, at + length - fade, fade)

    source.start(at)
    source.stop(at + length)
    source.onended = () => {
      source.disconnect()
      gain.disconnect()
    }
  }

  function tick() {
    if (stopped || !context || !buffer) return
    const length = buffer.duration
    const step = length - fadeLength(length)
    while (nextStart < context.currentTime + LOOKAHEAD_SECONDS) {
      schedulePass(nextStart)
      nextStart += step
    }
  }

  async function begin(url: string, initialVolume: number) {
    volume = initialVolume

    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    if (!Ctor) {
      playFallback(url)
      return
    }

    try {
      context = new Ctor()
      master = context.createGain()
      master.gain.value = muted ? 0 : volume
      master.connect(context.destination)
      // The Kezdes tap is what permits sound at all, and this runs from it.
      if (context.state === "suspended") await context.resume()

      const response = await fetch(url)
      const bytes = await response.arrayBuffer()
      buffer = await context.decodeAudioData(bytes)
      if (stopped) return

      nextStart = context.currentTime + 0.1
      tick()
      timer = window.setInterval(tick, SCHEDULE_INTERVAL_MS)
    } catch {
      // Anything at all went wrong (no decoder for this file, a blocked fetch,
      // an old browser). Drop back to the plain looping element.
      if (context) context.close().catch(() => {})
      context = null
      master = null
      buffer = null
      playFallback(url)
    }
  }

  return {
    start(url, initialVolume) {
      stopped = false
      begin(url, initialVolume)
    },
    setVolume(next) {
      volume = next
      applyGain()
    },
    setMuted(next) {
      muted = next
      applyGain()
    },
    stop() {
      stopped = true
      if (timer !== undefined) {
        window.clearInterval(timer)
        timer = undefined
      }
      if (fallback) {
        fallback.pause()
        fallback = null
      }
      if (context) {
        context.close().catch(() => {})
        context = null
      }
      master = null
      buffer = null
    },
  }
}
