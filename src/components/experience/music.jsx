"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronUp,
  Clapperboard,
  Disc3,
  Pause,
  Play,
  Radio,
  SkipForward,
  Sparkles,
  Volume2,
  X,
} from "lucide-react";
import { Sunflower, Reveal, SectionHead, TiltCard } from "@/components/ui/motion-kit";
import { DHRUV } from "@/lib/dhruv";
import { sfx, vibrate } from "@/lib/sfx";
import { EASE } from "@/lib/motion";
import { asset } from "@/lib/asset";

const SCENES = [asset("/media/golden-hour.svg"), asset("/media/afterglow.svg")];
const FALLBACK_SECONDS = 214;

function clock(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function Equalizer({ active, className = "" }) {
  return (
    <div className={`equalizer ${active ? "is-on" : ""} ${className}`} aria-hidden="true">
      {Array.from({ length: 22 }).map((_, i) => (
        <i
          key={i}
          style={{
            height: `${7 + ((i * 7) % 18)}px`,
            animationDelay: `${(i % 7) * 0.07}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function MusicChapter() {
  const [track, setTrack] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [islandOpen, setIslandOpen] = useState(false);
  const [audioState, setAudioState] = useState("loading"); // loading | ready | missing
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const song = DHRUV.songs[track];
  const lines = song.lines;

  /* Real audio drives the timeline when the file exists. */
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onMeta = () => {
      if (el.duration && Number.isFinite(el.duration)) {
        setDuration(el.duration);
        setAudioState("ready");
      }
    };
    const onTime = () => {
      if (el.duration) setProgress(Math.min(1, el.currentTime / el.duration));
    };
    const onEnd = () => {
      setPlaying(false);
      setProgress(0);
    };
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("durationchange", onMeta);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnd);
    el.addEventListener("error", () => setAudioState("missing"));
    return () => {
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("durationchange", onMeta);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnd);
    };
  }, [track]);

  /* Silent fallback: keep the visualizer moving while the mp3 is still missing. */
  useEffect(() => {
    if (!playing || audioState === "ready") return;
    const timer = setInterval(() => {
      setProgress((value) => (value + 0.008 >= 1 ? 0 : value + 0.008));
    }, 110);
    return () => clearInterval(timer);
  }, [playing, track, audioState]);

  const seconds = audioState === "ready" && duration ? progress * duration : progress * FALLBACK_SECONDS;
  const totalSeconds = audioState === "ready" && duration ? duration : FALLBACK_SECONDS;

  const activeLine = Math.min(lines.length - 1, Math.floor(progress * lines.length));
  const lineFraction = progress * lines.length - activeLine;
  const wordsInLine = lines[activeLine].split(" ");
  const litWords = Math.max(1, Math.ceil(lineFraction * wordsInLine.length));


  async function togglePlay() {
    const el = audioRef.current;
    if (audioState === "ready" && el) {
      if (el.paused) {
        try {
          await el.play();
          setPlaying(true);
        } catch {
          setAudioState("missing");
          setPlaying((value) => !value);
        }
      } else {
        el.pause();
        setPlaying(false);
      }
    } else {
      setPlaying((value) => !value);
    }
    sfx.click();
    vibrate(10);
  }

  function switchTrack(next = (track + 1) % DHRUV.songs.length) {
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    setTrack(next);
    setProgress(0);
    setDuration(0);
    setPlaying(true);
    sfx.cassette();
    vibrate([8, 30, 8]);
  }

  function scrub(event) {
    const box = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
    const el = audioRef.current;
    if (audioState === "ready" && el && el.duration) el.currentTime = ratio * el.duration;
    setProgress(ratio);
    sfx.click();
  }

  return (
    <section className="music" id="music">
      <div className="music-aura" aria-hidden="true" />
      <div className="wrap">
        <SectionHead
          scene="SC.03"
          eyebrow="THE SOUNDTRACK · TWO SIDES"
          title="press play."
          accent="stay a while."
          copy="Side A is the song that owns the aux — Soni Soni is already loaded and playable. Side B only gets played once a year, and it is still waiting for its file. The whole scene starts breathing the moment both slots are full."
        />

        <Reveal delay={0.06}>
          <div className="music-stage">
            <div className="cassette-zone">
              <div className="side-tabs" role="tablist" aria-label="Mixtape sides">
                {DHRUV.songs.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={track === index}
                    className={track === index ? "side-tab active" : "side-tab"}
                    onClick={() => switchTrack(index)}
                  >
                    <span className="mono">SIDE {index === 0 ? "A" : "B"}</span>
                    <b>{item.title}</b>
                  </button>
                ))}
              </div>

              <div className="cassette-shell">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={song.id}
                    className={`cassette ${playing ? "is-playing" : ""}`}
                    initial={{ rotateY: -78, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: 78, opacity: 0 }}
                    transition={{ duration: 0.55, ease: EASE.inOut }}
                  >
                    <div className="cassette-top">
                      <span className="mono">{DHRUV.productionCode} · MIXTAPE</span>
                      <span className="mono">{playing ? "REC ●" : "STANDBY"}</span>
                    </div>
                    <div className="cassette-window">
                      <span className={`reel ${playing ? "spin" : ""}`} />
                      <span className="tape-line" />
                      <span className={`reel ${playing ? "spin" : ""}`} />
                    </div>
                    <div className="cassette-label">
                      <span className="mono">SIDE {track === 0 ? "A" : "B"} · 16.11</span>
                      <strong>{song.title}</strong>
                      <span className="mono cassette-mood">{song.mood}</span>
                    </div>
                    <div className="cassette-dots" aria-hidden="true">
                      <i /><i /><i /><i />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <p className="mono cassette-note">
                TWO SIDES · TWO SONGS · TAP TO FLIP
              </p>
            </div>

            <Reveal delay={0.1}>
              <TiltCard className="player" max={7}>
                <div className="player-vinyl-zone">
                  <div className={`vinyl ${playing ? "spinning" : ""}`} aria-hidden="true">
                    <span className="vinyl-groove g1" />
                    <span className="vinyl-groove g2" />
                    <span className="vinyl-groove g3" />
                    <span className="vinyl-label">
                      <Disc3 size={18} />
                      <b>DHRUV</b>
                      <em className="mono">GOLD</em>
                    </span>
                  </div>
                  <span className={`tonearm ${playing ? "drop" : ""}`} aria-hidden="true" />
                </div>

                <div className="player-main">
                  <div className="player-live mono">
                    <span className={playing ? "signal on" : "signal"} />
                    {playing ? (audioState === "ready" ? "NOW IN THE AIR" : "VISUAL ONLY") : "READY WHEN YOU ARE"}
                  </div>
                  <h3 className="player-title">{song.title}</h3>
                  <p className="mono player-sub">{song.mood}</p>

                  <Equalizer active={playing} />

                  <div className="player-progress" onClick={scrub} role="slider" aria-label="Scrub the track" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(progress * 100)} tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowRight") setProgress((p) => Math.min(1, p + 0.05));
                      if (event.key === "ArrowLeft") setProgress((p) => Math.max(0, p - 0.05));
                    }}
                  >
                    <span className="player-progress-fill" style={{ width: `${progress * 100}%` }} />
                    <span className="player-progress-knob" style={{ left: `${progress * 100}%` }} />
                  </div>

                  <div className="player-controls">
                    <button type="button" className="play-btn" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
                      {playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                    </button>
                    <button type="button" className="side-btn" onClick={() => switchTrack()} aria-label="Switch to the other song">
                      <SkipForward size={16} />
                      <span className="mono">NEXT SIDE</span>
                    </button>
                    <span className="mono player-time">
                      {clock(seconds)} / {clock(totalSeconds)}
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    {audioState === "missing" && (
                      <motion.p
                        key="missing"
                        className="audio-slot mono"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <Volume2 size={11} /> SLOT EMPTY · ADD <b>{song.file}</b>
                      </motion.p>
                    )}
                    {audioState === "ready" && (
                      <motion.p
                        key="ready"
                        className="audio-slot mono is-live"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <Volume2 size={11} /> LIVE AUDIO · {clock(duration)} LOADED
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <span className="player-gloss" aria-hidden="true" />
                <span className="player-island-hint mono">
                  <Radio size={11} /> DYNAMIC ISLAND ARMED
                </span>
              </TiltCard>
            </Reveal>
          </div>
        </Reveal>

        <div className="lyric-scene">
          <Reveal delay={0.05}>
            <div className="lyric-frame">
              <div className={`lyric-photo p${track}`}>
                <img src={SCENES[track]} alt="" aria-hidden="true" />
                <span className="ken-burns" />
                <span className="light-leak l1" />
                <span className="light-leak l2" />
              </div>

              <div className="lyric-card">
                <div className="lyric-head mono">
                  <span><Sparkles size={11} /> SIDE {track === 0 ? "A" : "B"}</span>
                  <span>{song.title}</span>
                </div>

                <div className="lyric-lines" aria-live="polite">
                  {lines.map((line, lineIndex) => {
                    const words = line.split(" ");
                    const isActive = lineIndex === activeLine;
                    return (
                      <p
                        key={line}
                        className={`lyric-line ${isActive ? "active" : ""}`}
                        onClick={() => {
                          setProgress((lineIndex + 0.5) / lines.length);
                          setPlaying(true);
                        }}
                      >
                        {words.map((word, wordIndex) => (
                          <span
                            key={`${word}-${wordIndex}`}
                            className={isActive && wordIndex < litWords ? "lit" : ""}
                          >
                            {word}{" "}
                          </span>
                        ))}
                      </p>
                    );
                  })}
                </div>

                <div className="lyric-foot">
                  <div className="lyric-bars" aria-hidden="true">
                    <span style={{ width: `${progress * 100}%` }} />
                  </div>
                  <span className="mono">{Math.round(progress * 100)}%</span>
                </div>

                <AnimatePresence>
                  {activeLine >= 0 && (
                    <motion.div
                      key={`${track}-${activeLine}`}
                      className="lyric-bloom"
                      initial={{ opacity: 0, scale: 0.4, rotate: -30 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 1.4, rotate: 20 }}
                      transition={{ duration: 0.6, ease: EASE.out }}
                      aria-hidden="true"
                    >
                      <Sunflower />
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="lyric-note mono">TAP A LINE TO CUE IT · WORDS LIGHT WITH THE TRACK</p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="lyric-film">
            <div className="lyric-film-head mono">
              <span><Clapperboard size={12} /> GENERATED CLIP · 16 : 9 · 176.9S</span>
              <span>{song.title}</span>
            </div>
            <video
              className="lyric-film-video"
              src={asset("/media/soni-soni-full.mp4")}
              controls
              playsInline
              preload="metadata"
              aria-label={`Generated lyric video for ${song.title}`}
            />
            <p className="lyric-film-note mono">THE GENERATED OUTPUT · FROM THE LYRIC LAB PIPELINE · SYNCED TO THE SONG</p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="music-footnote">
            <span className="mono"><Volume2 size={12} /> AUDIO SLOTS ARMED</span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Link href="/lyric-video" className="lab-link">
            <span className="lab-link-icon"><Sparkles size={14} /></span>
            <span className="lab-link-copy">
              <span className="mono">EXTRA SCENE · LOCKED</span>
              <strong>Open the Lyric Lab</strong>
              <em>Soni Soni, synced word by word — code required.</em>
            </span>
            <ArrowUpRight size={18} />
          </Link>
        </Reveal>
      </div>

      <audio
        key={song.id}
        ref={audioRef}
        src={asset(song.file)}
        preload="metadata"
        aria-label={`${song.title} audio`}
      />

      <AnimatePresence>
        {playing && (
          <motion.div
            layout
            className={`dynamic-island ${islandOpen ? "open" : ""}`}
            initial={{ y: -90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            onClick={() => setIslandOpen((value) => !value)}
            role="status"
            aria-label="Now playing"
          >
            <div className="island-inner">
              <span className={`island-vinyl ${playing ? "spin" : ""}`} aria-hidden="true" />
              <div className="island-meta">
                <span className="mono island-kicker">NOW PLAYING · CHAPTER GOLD</span>
                <strong>{song.title}</strong>
                <span className="mono island-sub">{song.mood}</span>
              </div>
              <Equalizer active={playing} className="island-eq" />
              <button
                type="button"
                className="island-btn"
                onClick={(event) => {
                  event.stopPropagation();
                  togglePlay();
                }}
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
              </button>
              <button
                type="button"
                className="island-btn ghost"
                onClick={(event) => {
                  event.stopPropagation();
                  setPlaying(false);
                  setIslandOpen(false);
                }}
                aria-label="Close now playing"
              >
                <X size={15} />
              </button>
              <ChevronUp size={12} className="island-chevron" aria-hidden="true" />
            </div>
            {islandOpen && (
              <motion.div
                className="island-expanded"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <div className="island-wave" aria-hidden="true">
                  {Array.from({ length: 42 }).map((_, i) => (
                    <i key={i} style={{ height: `${4 + ((i * 11) % 24)}px`, animationDelay: `${i * 0.02}s` }} />
                  ))}
                </div>
                <div className="island-lines mono">
                  <span>{audioState === "ready" ? "LIVE AUDIO" : "VISUAL MIXTAPE"}</span>
                  <span>{Math.round(progress * 100)}%</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
