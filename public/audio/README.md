# Audio slot

One slot, wired into the film and the Lyric Lab.

| File | Song | Where it plays |
| --- | --- | --- |
| `soni-soni.mp3` | Soni Soni (From "Ishq Vishk Rebound") | SC.03 + Lyric Lab player |

Drop a file in with the exact name above and push — the player picks it up automatically
(`SmartAudio` falls back to a silent visual cut until the file is there).

The film references it from `src/lib/dhruv.js`:

```js
{ id: "side-a", title: "Soni Soni", file: "/audio/soni-soni.mp3" }
```

To change the song, edit that file — no other code touches the audio paths.
