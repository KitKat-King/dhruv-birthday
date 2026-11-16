"use client";

import "./lyric-lab.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Copy,
  FileAudio,
  FileText,
  Music2,
  Pause,
  Play,
  Sparkles,
  Volume2,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import { DHRUV } from "@/lib/dhruv";
import { SONI_SONI } from "@/lib/soni-soni-sync";
import { asset } from "@/lib/asset";

/* ── tiny copy helper ─────────────────────────────────────────── */
function useCopy() {
  const [toast, setToast] = useState("");
  const timer = useRef(0);

  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setToast("COPIED TO CLIPBOARD");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 1800);
  }, []);

  return { toast, copy };
}

function CopyButton({ text, label = "COPY", className = "" }) {
  const [done, setDone] = useState(false);
  const { copy } = useCopy();
  return (
    <button
      type="button"
      className={`ll-copy ${done ? "done" : ""} ${className}`}
      onClick={() => {
        copy(text);
        setDone(true);
        setTimeout(() => setDone(false), 1600);
      }}
    >
      {done ? <Check size={9} /> : <Copy size={9} />} {done ? "DONE" : label}
    </button>
  );
}

function Toast({ text }) {
  return (
    <AnimatePresence>
      {text && (
        <motion.div
          className="ll-toast"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          role="status"
        >
          <Sparkles size={10} /> {text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── synced lyric player ──────────────────────────────────────── */
function LyricPlayer() {
  const audioRef = useRef(null);
  const [state, setState] = useState("loading"); // loading | ready | missing
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(SONI_SONI.duration);
  const silent = useRef(0);

  const src = asset("/audio/soni-soni.mp3");

  /* silent fallback while the mp3 is not loaded / missing */
  useEffect(() => {
    if (!playing || state === "ready") return;
    const timer = setInterval(() => {
      silent.current = (silent.current + 0.1) % SONI_SONI.duration;
      setCurrent(silent.current);
    }, 100);
    return () => clearInterval(timer);
  }, [playing, state]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    silent.current = 0;
    setCurrent(0);
    setState("loading");
    el.load();
  }, [src]);

  function toggle() {
    const el = audioRef.current;
    if (state === "ready" && el) {
      if (el.paused) {
        el.play().catch(() => setState("missing"));
        setPlaying(true);
      } else {
        el.pause();
        setPlaying(false);
      }
    } else {
      setPlaying((value) => !value);
    }
  }

  function seek(event) {
    const box = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
    const el = audioRef.current;
    if (state === "ready" && el && el.duration) {
      el.currentTime = ratio * el.duration;
    } else {
      silent.current = ratio * duration;
    }
    setCurrent(ratio * duration);
  }

  function cue(seconds) {
    const el = audioRef.current;
    if (state === "ready" && el && el.duration) {
      el.currentTime = seconds;
      el.play().catch(() => {});
      setPlaying(true);
    } else {
      silent.current = seconds;
      setCurrent(seconds);
      setPlaying(true);
    }
  }

  const lines = SONI_SONI.lines;
  const active = useMemo(() => {
    let index = -1;
    lines.forEach((line, i) => {
      if (current >= line.t) index = i;
    });
    return index;
  }, [current, lines]);

  const windowLines = useMemo(() => {
    const start = Math.max(0, active - 1);
    const end = Math.min(lines.length, active + 3);
    return lines.slice(start, end).map((line, offset) => ({
      ...line,
      index: start + offset,
    }));
  }, [active, lines]);

  const clock = (value) => {
    const m = Math.floor(value / 60);
    const s = Math.floor(value % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="ll-player">
      <div className="ll-player-grid">
        <div className="ll-art">
          <img src={asset("/media/dp.jpg")} alt="Dhruv — Soni Soni lyric video" />
          <span className="ll-art-tint" aria-hidden="true" />
          <span className="ll-art-badge">OUTPUT · SYNCED</span>
        </div>

        <div className="ll-player-main">
          <div className="ll-lyrics" aria-live="polite">
            {windowLines.length === 0 && (
              <p className="ll-lyrics-empty">Press play — the words light up with the song.</p>
            )}
            {windowLines.map((line) => {
              const span = (lines[line.index + 1]?.t ?? duration) - line.t;
              const progress = Math.min(1, Math.max(0, (current - line.t) / Math.max(0.01, span)));
              const words = line.text.split(" ");
              const lit = Math.round(progress * words.length);
              const isLive = line.index === active;
              return (
                <p
                  key={`${line.index}-${line.text}`}
                  className={`ll-line ${isLive ? "is-live" : ""} ${line.index < active ? "is-past" : ""}`}
                  onClick={() => cue(line.t)}
                >
                  {words.map((word, index) => (
                    <span key={`${word}-${index}`} className={`w ${isLive && index < lit ? "lit" : ""}`}>
                      {word}{" "}
                    </span>
                  ))}
                </p>
              );
            })}
          </div>

          <div className="ll-ctl">
            <div
              className="ll-bar"
              onClick={seek}
              role="slider"
              tabIndex={0}
              aria-label="Seek the song"
              aria-valuemin={0}
              aria-valuemax={Math.round(duration)}
              aria-valuenow={Math.round(current)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") cue(Math.min(duration, current + 5));
                if (event.key === "ArrowLeft") cue(Math.max(0, current - 5));
              }}
            >
              <span className="ll-bar-fill" style={{ width: `${duration ? (current / duration) * 100 : 0}%` }} />
              <span className="ll-bar-knob" style={{ left: `${duration ? (current / duration) * 100 : 0}%` }} />
            </div>

            <div className="ll-ctl-row">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button type="button" className="ll-btn" onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
                  {playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                </button>
                <span className="ll-time">{clock(current)} / {clock(duration)}</span>
              </div>
              <span className={`ll-audio-state ${state === "ready" ? "ready" : "missing"}`}>
                <Volume2 size={10} />
                {state === "ready" ? "SONG LOADED" : "SYNC ESTIMATED"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(event) => {
          const el = event.currentTarget;
          if (el.duration && Number.isFinite(el.duration)) {
            setDuration(el.duration);
            setState("ready");
          }
        }}
        onTimeUpdate={(event) => {
          const el = event.currentTarget;
          if (el.duration) {
            silent.current = el.currentTime;
            setCurrent(el.currentTime);
          }
        }}
        onEnded={() => {
          setPlaying(false);
          setCurrent(0);
          silent.current = 0;
        }}
        onError={() => setState("missing")}
        aria-label="Soni Soni audio"
      />
    </div>
  );
}

/* ── guide ────────────────────────────────────────────────────── */
const PROMPT =
  'Make a 16:9 lyric video for song.mp3 using the lyrics in lyrics.txt. Sync every word to the vocals with forced alignment. Style: a Spotify lyrics card that tilts in 3D, then the singer as glowing red particles with big pop lyrics. Show me 3 still frames first, then render the MP4.';

export default function LyricLab() {
  const { toast, copy } = useCopy();

  return (
    <div className="ll">
      <div className="ll-pinkbg" />
      <div className="ll-pinkbg-md" />
      <div className="ll-grain" aria-hidden="true" />

      <motion.div
        className="ll-page"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="ll-wrap">
          <div className="ll-scroll-hint" aria-hidden="true">
            <ChevronDown size={13} />
            <span>Scroll</span>
          </div>
          <header className="ll-topbar">
            <Link href="/" className="ll-brand">
              <span className="ll-brand-mark"><Music2 size={16} /></span>
              <span>
                <b>Lyric Lab</b>
                <small>DHRV · GOLDEN HOUR</small>
              </span>
            </Link>
            <Link href="/" className="ll-back"><ArrowLeft size={11} /> BACK TO THE FILM</Link>
          </header>

          <section className="ll-hero">
            <span className="ll-eyebrow"><Sparkles size={11} /> Scene 03.5 · the pink room</span>
            <h1>
              <span className="row">Make</span>
              <span className="row">Lyric <em>Videos</em></span>
            </h1>
            <p className="ll-hero-line">with Dhruv&apos;s two songs</p>
            <p className="ll-hero-copy">
              <strong>Soni Soni</strong> is downloaded, the lyrics are in, and the guide&apos;s
              pipeline is wired up — no After Effects, no timeline, just the song and its words.
              Everything below is the exact setup, plus the output: a player that lights the
              lyrics as the track runs.
            </p>
            <div className="ll-chips">
              <span className="ll-chip">16 : 9</span>
              <span className="ll-chip">2 : 57 runtime</span>
              <span className="ll-chip">word-lit</span>
              <span className="ll-chip">code {DHRUV.lyricLabCode}</span>
            </div>
          </section>

          <section className="ll-section">
            <div className="ll-head">
              <div>
                <span className="ll-step-label">STEP 05 · <b>THE OUTPUT</b></span>
                <h2>Play it. <em>Watch it light up.</em></h2>
              </div>
              <p>
                The song with its lyric map. Tap a line to cue it, or press play and let the
                words chase the vocals.
              </p>
            </div>
            <LyricPlayer />
          </section>

          <section className="ll-section">
            <div className="ll-head">
              <div>
                <span className="ll-step-label">STEP 01 · <b>PICK YOUR AI</b></span>
                <h2>Three agents, <em>one prompt.</em></h2>
              </div>
              <p>Same prompt works in Claude Code, Codex or Antigravity.</p>
            </div>
            <div className="ll-ai-grid">
              {[
                { name: "Claude Code", tag: "Best quality", blurb: "Opus plans the shots and fixes its own mistakes.", cmd: "curl -fsSL https://claude.ai/install.sh | bash" },
                { name: "Codex", tag: "Free limits", blurb: "OpenAI's coding agent — sign in with ChatGPT.", cmd: "npm install -g @openai/codex" },
                { name: "Antigravity", tag: "Free limits", blurb: "Google's AI code editor, open a folder and chat.", cmd: "antigravity.google" },
              ].map((tool) => (
                <div key={tool.name} className="ll-ai">
                  <div className="ll-ai-top">
                    <b>{tool.name}</b>
                    <span className="ll-ai-tag">{tool.tag}</span>
                  </div>
                  <p>{tool.blurb}</p>
                  <div className="ll-code">
                    <CopyButton text={tool.cmd} />
                    {tool.cmd}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="ll-section">
            <div className="ll-head">
              <div>
                <span className="ll-step-label">STEP 02 · <b>INSTALL THE HELPERS</b></span>
                <h2>Once. <em>Then never again.</em></h2>
              </div>
              <p>Node films each frame, uv runs the lyric-sync script, FFmpeg joins them.</p>
            </div>
            <div className="ll-os-grid">
              <div className="ll-os">
                <span>Mac · Terminal</span>
                <div className="ll-code">
                  <CopyButton text="brew install node uv ffmpeg" />
                  brew install node uv ffmpeg
                </div>
              </div>
              <div className="ll-os">
                <span>Windows · PowerShell</span>
                <div className="ll-code">
                  <CopyButton text="winget install OpenJS.NodeJS astral-sh.uv ffmpeg" />
                  winget install OpenJS.NodeJS astral-sh.uv ffmpeg
                </div>
              </div>
            </div>
          </section>

          <section className="ll-section">
            <div className="ll-head">
              <div>
                <span className="ll-step-label">STEP 03 · <b>SET UP THE FOLDER</b></span>
                <h2>Two files. <em>That&apos;s the whole studio.</em></h2>
              </div>
              <p>Song first, lyrics second, then open the folder in your agent.</p>
            </div>
            <div className="ll-steps">
              <div className="ll-step">
                <span className="ll-step-num">01</span>
                <div className="ll-step-body">
                  <h3>song.mp3</h3>
                  <p>The part of the song you want. 30–60 seconds works best.</p>
                  <div className="ll-files">
                    <div className="ll-file">
                      <FileAudio size={16} />
                      <span>
                        <b>soni-soni.mp3</b>
                        <span>already in public/audio · 2:57</span>
                      </span>
                    </div>
                    <div className="ll-file">
                      <FileText size={16} />
                      <span>
                        <b>lyrics.txt</b>
                        <span>one line per lyric line, in order</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ll-step">
                <span className="ll-step-num">02</span>
                <div className="ll-step-body">
                  <h3>Open the folder in your agent</h3>
                  <p>Run claude or codex inside it, or open it in Antigravity and let the agent work.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="ll-section">
            <div className="ll-head">
              <div>
                <span className="ll-step-label">STEP 04 · <b>STARTER PROMPT</b></span>
                <h2>Paste it. <em>Swap the gold bits.</em></h2>
              </div>
              <p>The full prompt behind the pink Spotify clip, tuned for Dhruv.</p>
            </div>
            <div className="ll-prompt">
              <div className="ll-prompt-head">
                <span>FULL PROMPT · CLIP LYRICS</span>
                <CopyButton text={PROMPT} />
              </div>
              <p>
                Make a 16:9 lyric video for <b>song.mp3</b> using the lyrics in{" "}
                <b>lyrics.txt</b>. Sync every word to the vocals with forced alignment. Style: a{" "}
                <i>Spotify lyrics card that tilts in 3D</i>, then the singer as{" "}
                <i>glowing red particles with big pop lyrics</i>. Show me{" "}
                <i>3 still frames</i> first, then render the MP4.
              </p>
              <div className="ll-prompt-foot">
                <span className="ll-chip">swap the red parts</span>
                <span className="ll-chip">change mood with colour</span>
                <span className="ll-chip">no after effects</span>
              </div>
            </div>
          </section>

          <section className="ll-section">
            <div className="ll-head">
              <div>
                <span className="ll-step-label">TIPS · <b>SAVE HOURS</b></span>
                <h2>Four habits <em>that pay.</em></h2>
              </div>
            </div>
            <div className="ll-tips">
              {[
                "Always ask for still frames first — a still takes seconds, a render takes minutes.",
                "Fix one thing at a time: “make line 3 appear 0.2 s earlier”, not “make it better”.",
                "Change the mood with colour: same engine, red → pink → gold is a new video.",
                "Words out of sync? Ask it to re-run alignment on the vocals only.",
              ].map((tip, index) => (
                <div className="ll-tip" key={tip}>
                  <b>{String(index + 1).padStart(2, "0")}</b>
                  <p>{tip}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="ll-section">
            <div className="ll-head">
              <div>
                <span className="ll-step-label">TRACKS · <b>IN THE STUDIO</b></span>
                <h2>One song, <em>one birthday.</em></h2>
              </div>
            </div>
            <div className="ll-tracks">
              {DHRUV.songs.map((song, index) => (
                <div className="ll-track" key={song.id}>
                  <div className="ll-track-top">
                    <span className="ll-track-side">SIDE {index === 0 ? "A" : "B"}</span>
                    <TrackState file={song.file} />
                  </div>
                  <h3>{song.title}</h3>
                  <small>{song.mood}</small>
                  <div className="ll-track-bar" aria-hidden="true">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <i key={i} style={{ animationDelay: `${(i % 7) * 0.09}s`, height: `${30 + ((i * 7) % 70)}%` }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <footer className="ll-footer">
            <span>CODE {DHRUV.lyricLabCode} · PINK ROOM · DHRV / GOLD</span>
            <span className="ll-sign">From your best friend</span>
          </footer>
        </div>
      </motion.div>

      <Toast text={toast} />
    </div>
  );
}

/* ── checks whether an audio slot already has a file ─────────── */
function TrackState({ file }) {
  const [state, setState] = useState("missing");

  useEffect(() => {
    let alive = true;
    fetch(asset(file), { method: "HEAD" })
      .then((response) => {
        if (alive) setState(response.ok ? "ready" : "missing");
      })
      .catch(() => {
        if (alive) setState("missing");
      });
    return () => {
      alive = false;
    };
  }, [file]);

  return (
    <span className={`ll-track-state ${state}`}>
      <Volume2 size={9} />
      {state === "ready" ? "FILE IN" : "ADD MP3"}
    </span>
  );
}
