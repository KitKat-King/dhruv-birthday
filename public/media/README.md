# Drop-in media

All artwork in this folder is original placeholder SVG. Replace files without touching code.

## The DP

1. Put the real photo at `public/media/dp.jpg` (portrait crop, roughly 900 × 1100, JPG/PNG/WebP).
2. That's it. `SmartImage` tries `/media/dp.jpg` first and silently falls back to `dp.svg`.

The portrait appears in the **SC.02 dossier** panel. Keep the face in the upper third — the frame uses `object-position: 50% 24%`.

## Other artwork

| File | Used in |
| --- | --- |
| `memory-1.svg` … `memory-4.svg` | SC.04 polaroid stack + contact sheet |
| `golden-hour.svg`, `afterglow.svg` | SC.03 lyric-video stills |
| `scene-a.svg`, `scene-b.svg` | SC.04 projector cards |
| `reel-1.svg`, `reel-2.svg` | SC.04 contact sheet |
| `gift.svg` | SC.04 scratch card reveal |
| `cover.svg` | Open Graph / social preview |
| `dp.svg` | Portrait fallback |

Swap any of them with a real photo of the same name and aspect ratio (JPG/WebP works too — update the path in the component if the extension changes).

`scripts/make-media.py` regenerates every placeholder from scratch if you want to tweak the palette.
