# Dhruv — Golden Hour

A mobile-first, cinematic birthday film built for Dhruv Kaushal. **THE GOLDEN CUT**: loader → wax-seal unlock → six scenes → end credits.

## The film

- **SC.00 — The Seal.** Cinematic boot sequence with a live T‑minus countdown to 16 November, then a press‑and‑hold wax seal that heats, cracks and takes over the screen.
- **SC.01 — Hero.** Kinetic `DHRUV / CHAPTER GOLD / IT'S YOUR GOLDEN HOUR` with scroll parallax, a gold-symbol orbit and a velocity-reactive marquee.
- **SC.02 — The Dossier.** Pointer-tracked 3D ID card with a flip side showing live IST time, holographic stamps, a portrait slot and an original line-drawn sunflower.
- **SC.03 — Anthems.** A real mixtape for *Soni Soni*: cassette side flip, vinyl player, dynamic-island now-playing bar and a word-lit lyric card. MP3 slots live in `public/audio/` and the player falls back to a silent visual cut while a slot is empty.
- **SC.04 — The Reel.** Draggable polaroid stack, scratch-off gift card, contact-sheet film strip and two moving-scene projectors.
- **SC.05 — The Wish.** A twelve-candle CSS cake with a hold-to-blow interaction, confetti celebration and a wish ticket.
- **SC.06 — Stay Golden.** `STAY GOLDEN` end credits, a boarding-pass birthday pass with share/copy, a three-tap verified stamp and a post-credits deleted scene.
- **EXTRA — Lyric Lab.** `/lyric-video`, a separate pink room copied from the birthday-lock demo: code `369`, glass card, circular keypad, then the AI lyric-video guide from the `lyric-video-guide.pdf` plus a working synced player for *Soni Soni*.

## Palette

Warm cinema, not one color: gold `#f4b860`, coral `#ff7a5c`, jade `#79e0be`, sky `#8fa6ff`, cream `#fff6e8` on deep warm ink `#0a0806`. Each act gets its own color wash. Type: Bebas Neue, Fraunces, Manrope, JetBrains Mono.

## Drop in the media

`public/media/dp.jpg` is already set (circular profile crop). See `public/media/README.md` for every other swappable visual, and `public/audio/README.md` for the song slot.

## Stack

HTML5, CSS3, JavaScript/JSX, React 19, Next.js 16, Tailwind CSS 4, Bootstrap grid, Framer Motion, anime.js, Lenis, Lucide React, Canvas Confetti.

## Interactions at a glance

- Press and hold the seal (~1.4s) or tap "instead"
- Flip the dossier card; drag the polaroid stack
- Scratch the gold card with a finger
- Play/pause the mixtape, flip sides, tap lyric lines to cue them
- Hold the wish button to blow out the candles
- Tap the boarding pass three times; tap the post-credits reel three times
- Sound toggle is interface-only Web Audio, off by default

## Local notes

- All motion respects `prefers-reduced-motion`.
- The build is a static export (`output: "export"`); no server runtime is required.
- `scripts/make-media.py` regenerates the placeholder art.
- `src/lib/soni-soni-sync.js` holds the *Soni Soni* lyric map (line timings + words).

## Deployment

This repository is configured for Vercel. Pushes to `main` are built in Vercel's cloud; no local development server or local build is required for deployment.
