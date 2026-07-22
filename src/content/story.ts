import type { Story } from "./types"

// THROWAWAY PLACEHOLDER CONTENT (this is not real story content).
// It exists only so you can see the player working from start to finish.
// Replace all of it with your real story. The README explains exactly how,
// with a filled narration example and a filled exercise example.
//
// Nothing here points at a real file yet, so the pictures show as empty color
// panels and the narration has no sound. That is expected until you add your
// own images and audio into public/assets and name them below. The bracketed
// text like [ide kerul ...] is placeholder wording for you to overwrite.

export const story: Story = {
  coverImage: "cover.webp",
  // backgroundMusic: "music.mp3", // add a file, then delete the two slashes to switch music on

  screens: [
    // Screen 1: a narration screen (picture plus sound).
    {
      type: "narration",
      image: "01.webp",
      audio: "01.mp3",
    },

    // Screen 2: an exercise screen (math tasks over a background picture).
    {
      type: "exercise",
      backgroundImage: "02.webp",
      introText: "[ide kerul a bevezeto szoveg, keplet is lehet benne, peldaul $\\frac{1}{2}$]",
      exercises: [
        {
          id: "peldaFeladat",
          prompt: "[ide kerul a feladat szovege, keplettel is: mennyi a $\\frac{1}{2}$ ?]",
          fields: [
            {
              id: "elsoMezo",
              label: "[elso mezo cimkeje]",
              acceptedAnswers: ["1/2", "0,5"],
            },
            {
              id: "masodikMezo",
              label: "[masodik mezo cimkeje]",
              acceptedAnswers: ["2"],
            },
          ],
          hints: ["[elso tipp]", "[masodik tipp]", "[harmadik tipp]"],
        },
      ],
    },

    // Screen 3: the final picture. The story simply ends here.
    {
      type: "narration",
      image: "03.webp",
      audio: "03.mp3",
    },
  ],
}
