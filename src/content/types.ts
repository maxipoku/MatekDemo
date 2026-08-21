// The shape of the whole story. The player renders exactly what is described
// here and nothing else. You (the content author) fill this in inside story.ts.
// These types make the editor show a clear error if something is missing or
// misspelled, so a content mistake is caught before it reaches a child.

export type Story = {
  coverImage: string // file in public/assets/images, shown behind the Kezdes button
  backgroundMusic?: string // optional file in public/assets/audio, loops across every screen
  answerFormatRule?: string // optional note shown on every exercise about how to write answers
  screens: Screen[] // played in order, top to bottom
}

export type Screen = NarrationScreen | ExerciseScreen

// A narration screen: one picture and one sound, with no text on the screen.
export type NarrationScreen = {
  type: "narration"
  image: string // file in public/assets/images
  audio: string // file in public/assets/audio
  caption?: string // optional narrator text shown over the picture, revealed word by word
  captionTimings?: number[] // optional start time (seconds) of each caption sentence, from the timing tool
}

// An exercise screen: one or more math tasks over a background picture.
export type ExerciseScreen = {
  type: "exercise"
  backgroundImage: string // file in public/assets/images
  introText?: string // optional line above the tasks, may contain math between $ signs
  exercises: Exercise[]
}

export type Exercise = {
  id: string // any short unique label, for example "vitorla"
  prompt: string // the question, may contain math between $ signs
  fields: Field[] // one or more answer boxes
  hints?: string[] // optional, revealed one at a time (Tipp 1/3, 2/3, 3/3)
  continueUrl?: string // if set, the Tovabb button on this task leaves the demo for this address instead of advancing
}

export type Field = {
  id: string // any short unique label
  label: string // text beside the box, may contain math between $ signs
  acceptedAnswers: string[] // every accepted form, for example ["3/5", "0,6"]
}
