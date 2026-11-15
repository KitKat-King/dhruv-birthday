export const DHRUV = {
  name: "Dhruv",
  fullName: "Dhruv Kaushal",
  handle: "alw4ys_dhruv.08",
  chapter: "GOLD",
  birthdayISO: "2026-11-16T00:00:00+05:30",
  birthdayLabel: "16 · 11 · 2026",
  songs: [
    {
      id: "side-a",
      title: "Soni Soni",
      mood: "side a · the one that owns the aux",
      accent: "gold",
      file: "/audio/soni-soni.mp3",
      /**
       * One line per sung line, in order.
       * Replace these mood lines with the real lyrics and the lyric card
       * will light them word by word against the actual audio.
       */
      lines: [
        "Sun on the dashboard, nowhere to be",
        "Windows down, the whole city agrees",
        "These are the hours we keep",
      ],
    },
    {
      id: "side-b",
      title: "Happy Birthday",
      mood: "side b · candles, chorus, cake",
      accent: "coral",
      file: "/audio/happy-birthday.mp3",
      lines: [
        "One more year of you in the room",
        "One more chorus, one more wish",
        "Make it count, then make it loud",
      ],
    },
  ],
  lyricLabCode: "369",
  flower: "Sunflower",
  signature: "From your best friend",
  productionCode: "DHRV-GOLD",
};

export const CHAPTERS = [
  { id: "hero", label: "HERO", scene: "SC.01" },
  { id: "dossier", label: "DOSSIER", scene: "SC.02" },
  { id: "music", label: "ANTHEMS", scene: "SC.03" },
  { id: "memories", label: "REEL", scene: "SC.04" },
  { id: "wish", label: "WISH", scene: "SC.05" },
  { id: "finale", label: "GOLD", scene: "SC.06" },
];
