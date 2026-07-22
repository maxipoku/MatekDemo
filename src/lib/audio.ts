// A tiny silent sound played once, on the first tap (the Kezdes button), to
// unlock audio for the whole session. Browsers block sound from playing on its
// own until the user interacts with the page, so without this first play the
// narration would never start by itself. This is a 45 byte silent WAV.
export const SILENT_SOUND =
  "data:audio/wav;base64,UklGRiUAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQEAAACA"
