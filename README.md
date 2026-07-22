# Matek demo

An illustrated math story played inside a simple media player. The whole story
lives in one content file that you edit. The player code just renders whatever
that file describes.

## What you need

Node.js (version 20.19 or newer, or 22 or newer). Check it with:

```
node -v
```

## The four commands

Run these from this folder (the one that has this README in it).

* `npm install` downloads the building blocks the project needs. Run it once at
  the start, and again only if the project ever asks for something new.
* `npm run dev` starts a live local preview. It prints a web address (usually
  http://localhost:5173 ). Open that in your browser. Changes you save show up
  right away.
* `npm run build` produces the final site in a folder called `dist`.
* `npm run preview` opens that finished `dist` locally so you can check it before
  it goes online.

## Where things live

```
public/assets/images   your pictures go here
public/assets/audio     your sounds go here
src/content/story.ts    THE ONE FILE YOU EDIT (your whole story)
src/content/types.ts    the shape and rules (do not edit; it catches mistakes)
```

You only ever touch the two `public/assets` folders and `src/content/story.ts`.
Everything else is the engine.

## Adding your pictures and sounds

* Pictures: put them in `public/assets/images`. Make every picture the same
  size, 2912 wide by 1632 tall (landscape), saved as WebP, ideally under about
  500 to 700 KB each. The dpi setting does not matter on the web, only the pixel
  size does.
* Sounds: put them in `public/assets/audio`, saved as MP3.
* In `story.ts` you point at each file by its name only, for example
  `image: "02.webp"` and `audio: "02.mp3"`. A tidy habit is to number them in
  play order (02.webp goes with 02.mp3), plus one `cover.webp`.

## Editing the story

Open `src/content/story.ts`. It is a list of screens played top to bottom.
There are two kinds of screen.

### A narration screen (picture plus sound)

```ts
{
  type: "narration",
  image: "02.webp",
  audio: "02.mp3",
}
```

The picture fills the screen, the sound plays once by itself, and the Tovább
button appears when the sound finishes.

### An exercise screen (math tasks over a picture)

```ts
{
  type: "exercise",
  backgroundImage: "07.webp",
  introText: "A térkép első bejegyzése a kikötő zátonyairól szól.",
  exercises: [
    {
      id: "vitorla",
      prompt: "Ennyi vitorlát bonts ki = a $\\frac{3}{4}$-nek a $\\frac{4}{5}$ része",
      fields: [
        {
          id: "vitorla1",
          label: "Kibontott vitorlák",
          acceptedAnswers: ["3/5", "0,6"],
        },
      ],
      hints: [
        "Két törtet kell összeszorozni.",
        "Számlálót számlálóval, nevezőt nevezővel.",
        "A végén egyszerűsíts, ha lehet.",
      ],
    },
  ],
}
```

Notes:

* `id` can be any short label, as long as each one is unique on the screen.
* `acceptedAnswers` must list every form you will accept. The checker treats a
  comma and a dot as the same and ignores spaces, but it does not do the math
  for you, so if both `3/5` and `0,6` are right, list both.
* A screen can hold several exercises, and an exercise can hold several fields.
  Every field must be answered correctly before Tovább appears.

## Writing math

Write math as LaTeX between single dollar signs, mixed into normal text:
`a $\frac{3}{4}$ része`. Real fractions stack, and `^` makes an exponent.

Two things to remember:

* Double every backslash. Inside these text strings you must write `\\frac`,
  `\\text`, `\\cdot` (two backslashes), not `\frac`. A single backslash can turn
  into a hidden character and break the formula.
* For a decimal comma inside a formula, write `{,}` so the spacing stays right,
  for example `$10{,}25$`. Words inside a fraction go in `\\text{...}`, for
  example `$\\frac{\\text{Oromkotel hossza}}{4} = 10{,}25$`.

The child always types plain numbers into the answer boxes (like `10,25` or
`3/4`), never LaTeX.

## Background music (optional)

Put one looping track in `public/assets/audio` (for example `music.mp3`), then
in `story.ts` set it at the top:

```ts
export const story: Story = {
  coverImage: "cover.webp",
  backgroundMusic: "music.mp3",
  screens: [ ... ],
}
```

A small speaker button then appears in the corner so a child can mute it. Leave
`backgroundMusic` out entirely and there is no music and no button.

## Going online

Deployment (free GitHub Pages hosting) is set up as a separate step. Ask when
you are ready and you will be guided through it.
