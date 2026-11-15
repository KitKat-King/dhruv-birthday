# Drop-in media

All artwork in this folder is original placeholder SVG. Replace files without touching code.

## The DP

`dp.jpg` is in place — Dhruv's profile photo (circular crop, 800 × 800), shown in the
**SC.02 dossier** panel and on the **Lyric Lab** lock card.

To swap it: replace `public/media/dp.jpg`. `SmartImage` falls back to `dp.svg` if the
file is missing, so a bad upload can't break the layout.

## Other artwork

| File | Used in |
| --- | --- |
| `memory-1.svg` … `memory-4.svg` | SC.04 polaroid stack + contact sheet |
| `golden-hour.svg`, `afterglow.svg` | SC.03 lyric-video stills |
| `scene-a.svg`, `scene-b.svg` | SC.04 projector cards |
| `reel-1.svg`, `reel-2.svg` | SC.04 contact sheet |
| `gift.svg` | SC.04 scratch card reveal |
| `cover.png` | Open Graph / social preview (rendered from `cover.svg`) |
| `cover.svg` | Source art for the share card |
| `dp.svg` | Portrait fallback |

Swap any of them with a real photo of the same name and aspect ratio (JPG/WebP works too — update the path in the component if the extension changes).

`scripts/make-media.py` regenerates every placeholder from scratch if you want to tweak the palette.
