import { useCallback, useEffect, useRef, useState } from "react"
import { story } from "./content/story"
import { CoverScreen } from "./components/CoverScreen"
import { NarrationScreen } from "./components/NarrationScreen"
import { ExerciseScreen } from "./components/ExerciseScreen"
import { MusicControls } from "./components/MusicControls"
import { CoinTally } from "./components/CoinTally"
import { ProgressBar } from "./components/ProgressBar"
import { audioUrl, imageUrl } from "./lib/assets"
import { SILENT_SOUND } from "./lib/audio"
import styles from "./App.module.css"

// The volume the background music starts at (0 to 1). Kept very low so it sits
// under the narration; the corner slider can change it live.
const MUSIC_VOLUME = 0.05
// If a narration sound is missing or blocked, reveal Tovabb after this pause
// so a missing file can never trap the child on a screen.
const MISSING_AUDIO_REVEAL_MS = 1500

export function App() {
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [canContinue, setCanContinue] = useState(false)
  const [musicOn, setMusicOn] = useState(true)
  const [musicVolume, setMusicVolume] = useState(MUSIC_VOLUME)
  // Developer mode: switched on from the cover screen. When on, extra buttons
  // appear to skip a narration or to fill an exercise with the right answers.
  const [devMode, setDevMode] = useState(false)
  // Treasure collected: one gold coin per correct answer, growing across the
  // whole story. The award holds the latest gain so the tally can show a plus.
  const [coins, setCoins] = useState(0)
  // Bumps on every gain, used only to replay the coin pop on the tally.
  const [award, setAward] = useState(0)

  const narrationRef = useRef<HTMLAudioElement | null>(null)
  const musicRef = useRef<HTMLAudioElement | null>(null)
  const revealTimerRef = useRef<number | undefined>(undefined)
  // True only while a real narration sound is playing. This keeps the silent
  // unlock sound (played once at the start) from being mistaken for a finished
  // narration, which would reveal Tovabb too early.
  const expectingEndRef = useRef(false)

  const screens = story.screens
  const screen = screens[index]
  const isLast = index === screens.length - 1
  const hasMusic = Boolean(story.backgroundMusic)

  const clearRevealTimer = useCallback(() => {
    if (revealTimerRef.current !== undefined) {
      window.clearTimeout(revealTimerRef.current)
      revealTimerRef.current = undefined
    }
  }, [])

  const scheduleReveal = useCallback(() => {
    clearRevealTimer()
    revealTimerRef.current = window.setTimeout(() => setCanContinue(true), MISSING_AUDIO_REVEAL_MS)
  }, [clearRevealTimer])

  // The first tap: unlock audio for the session, start the music, show screen 1.
  const handleStart = useCallback(() => {
    expectingEndRef.current = false
    const narration = narrationRef.current
    if (narration) {
      narration.src = SILENT_SOUND
      const played = narration.play()
      if (played) {
        played
          .then(() => {
            narration.pause()
            narration.currentTime = 0
          })
          .catch(() => {})
      }
    }

    const music = musicRef.current
    if (music && story.backgroundMusic) {
      music.src = audioUrl(story.backgroundMusic)
      music.loop = true
      music.volume = MUSIC_VOLUME
      music.play().catch(() => {})
    }

    setStarted(true)
    setIndex(0)
    setCanContinue(false)
    setCoins(0)
    setAward(0)
  }, [])

  // Play the current narration sound once its picture has loaded.
  const handleNarrationImageReady = useCallback(() => {
    if (!screen || screen.type !== "narration") return
    const narration = narrationRef.current
    if (!narration) return

    clearRevealTimer()
    setCanContinue(false)
    expectingEndRef.current = true
    narration.src = audioUrl(screen.audio)
    narration.currentTime = 0
    const played = narration.play()
    if (played) {
      played.catch(() => scheduleReveal())
    }
  }, [screen, clearRevealTimer, scheduleReveal])

  const handleAudioEnded = useCallback(() => {
    if (expectingEndRef.current) setCanContinue(true)
  }, [])

  const handleAudioError = useCallback(() => {
    if (expectingEndRef.current) scheduleReveal()
  }, [scheduleReveal])

  // Replay the current narration from the start. canContinue is left alone (it
  // stays true once the sound has finished once), so Tovabb remains on screen and
  // the child can skip the replay at any moment.
  const handleReplay = useCallback(() => {
    const narration = narrationRef.current
    if (!narration) return
    expectingEndRef.current = true
    narration.currentTime = 0
    const played = narration.play()
    if (played) played.catch(() => {})
  }, [])

  const goNext = useCallback(() => {
    clearRevealTimer()
    expectingEndRef.current = false
    const narration = narrationRef.current
    if (narration) narration.pause()
    setCanContinue(false)
    setIndex((current) => Math.min(current + 1, screens.length - 1))
  }, [clearRevealTimer, screens.length])

  // Award treasure when an answer is correct. Bumps the total and remembers the
  // size of the gain (a two box task can give two) so the tally can show a plus.
  const addCoins = useCallback((amount: number) => {
    if (amount <= 0) return
    setCoins((total) => total + amount)
    setAward((previous) => previous + 1)
  }, [])

  // Preload the next screen's picture and sound so the change feels instant.
  useEffect(() => {
    if (!started) return
    const next = screens[index + 1]
    if (!next) return
    const nextImage = next.type === "narration" ? next.image : next.backgroundImage
    const picture = new Image()
    picture.src = imageUrl(nextImage)
    if (next.type === "narration") {
      const sound = new Audio()
      sound.preload = "auto"
      sound.src = audioUrl(next.audio)
    }
  }, [started, index, screens])

  // Keep the music muted or audible in step with the toggle.
  useEffect(() => {
    const music = musicRef.current
    if (music) music.muted = !musicOn
  }, [musicOn])

  // Keep the music volume in step with the slider.
  useEffect(() => {
    const music = musicRef.current
    if (music) music.volume = musicVolume
  }, [musicVolume])

  // Tidy up the pending timer if the app goes away.
  useEffect(() => clearRevealTimer, [clearRevealTimer])

  return (
    <div className={styles.stage}>
      {started && <ProgressBar steps={screens.map((item) => item.type)} current={index} />}

      {hasMusic && started && (
        <MusicControls
          on={musicOn}
          onToggle={() => setMusicOn((value) => !value)}
          volume={musicVolume}
          onVolumeChange={setMusicVolume}
        />
      )}

      {started && coins > 0 && <CoinTally count={coins} awardId={award} />}

      {!started && (
        <CoverScreen
          coverImage={story.coverImage}
          onStart={handleStart}
          devMode={devMode}
          onToggleDevMode={() => setDevMode((value) => !value)}
        />
      )}

      {started && screen && (
        <div className={styles.screen} key={index}>
          {screen.type === "narration" ? (
            <NarrationScreen
              screen={screen}
              canContinue={canContinue}
              isLast={isLast}
              devMode={devMode}
              audioRef={narrationRef}
              onImageReady={handleNarrationImageReady}
              onContinue={goNext}
              onReplay={handleReplay}
            />
          ) : (
            <ExerciseScreen
              screen={screen}
              isLast={isLast}
              devMode={devMode}
              onContinue={goNext}
              onReward={addCoins}
              formatRule={story.answerFormatRule}
            />
          )}
        </div>
      )}

      {/* Hidden sound elements, driven by the player. */}
      <audio ref={narrationRef} onEnded={handleAudioEnded} onError={handleAudioError} preload="auto" />
      <audio ref={musicRef} preload="auto" />
    </div>
  )
}
