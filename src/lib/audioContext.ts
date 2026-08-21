/*
  One AudioContext for the whole session, shared by the music and the narration.

  Why this has to be shared: iOS Safari muffles any HTML <audio> element that
  plays while a Web Audio context is running, as if it were underwater, unless
  that element is routed into the same graph. It can also stall the element so
  its "ended" event never fires. The music runs on Web Audio (see musicLoop.ts),
  so the narration element must be connected here too, or on a phone the
  narration comes out muffled and the story never advances past the first screen.

  If Web Audio is missing, every function here is a safe no op and the app falls
  back to plain <audio> elements, which is exactly how it behaved before the
  music moved to Web Audio.
*/

let context: AudioContext | null = null
let unsupported = false

export function getAudioContext(): AudioContext | null {
  if (context) return context
  if (unsupported) return null
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext
  if (!Ctor) {
    unsupported = true
    return null
  }
  context = new Ctor()
  return context
}

// Bring the context out of the suspended state browsers start it in. Must be
// called from a user gesture (the Kezdes tap), which is what permits sound.
export function resumeAudioContext(): void {
  const ctx = getAudioContext()
  if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {})
}

// Route an <audio> element through the shared context so iOS keeps it on the
// same clean output as the music. An element can be connected only once, so a
// second call for the same element is ignored.
const connected = new WeakSet<HTMLMediaElement>()

export function connectElement(element: HTMLMediaElement): void {
  const ctx = getAudioContext()
  if (!ctx || connected.has(element)) return
  try {
    const source = ctx.createMediaElementSource(element)
    source.connect(ctx.destination)
    connected.add(element)
  } catch {
    // Already routed, or this browser will not route it. Leaving it as a plain
    // element is correct on anything without the iOS muffling bug.
  }
}
