# Audio slots

Two slots, both wired into the film and the Lyric Lab.

| File | Song | Where it plays |
| --- | --- | --- |
| `soni-soni.mp3` | Soni Soni (From "Ishq Vishk Rebound") | SC.03 side A + Lyric Lab player |
| `happy-birthday.mp3` | Happy Birthday | SC.03 side B |

Drop a file in with the exact name above and push — the player picks it up automatically
(`SmartAudio` falls back to a silent visual cut until the file is there).

The film references them from `src/lib/dhruv.js`:

```js
{ id: "side-a", title: "Soni Soni", file: "/audio/soni-soni.mp3" }
```

To change a song, edit that file — no other code touches the audio paths.
