"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, RotateCcw, Scissors, Sparkles } from "lucide-react";
import { Sunflower, Reveal, SectionHead } from "@/components/ui/motion-kit";
import { sfx, vibrate } from "@/lib/sfx";
import { EASE } from "@/lib/motion";
import { asset } from "@/lib/asset";

const MEMORIES = [
  { src: asset("/media/memory-1.svg"), label: "the entrance", note: "You walk in and the room decides it's a good day.", time: "00:01:16:04" },
  { src: asset("/media/memory-2.svg"), label: "the chaos", note: "The laugh that turns a normal Tuesday into a story.", time: "00:04:16:08" },
  { src: asset("/media/memory-3.svg"), label: "the calm", note: "Loudest person in the room. Safest place in it.", time: "00:07:11:02" },
  { src: asset("/media/memory-4.svg"), label: "the gold", note: "Golden hour looks good on you. So does this year.", time: "00:16:11:26" },
];

function PolaroidStack() {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(null);

  function dismiss(direction) {
    if (leaving) return;
    setLeaving(direction);
    vibrate(8);
    setTimeout(() => {
      setIndex((value) => Math.min(MEMORIES.length, value + 1));
      setLeaving(null);
    }, 320);
  }

  const finished = index >= MEMORIES.length;

  return (
    <div className="stack-zone">
      <div className="stack">
        {MEMORIES.map((memory, i) => {
          if (i < index) return null;
          const isTop = i === index;
          const depth = i - index;
          return (
            <motion.div
              key={memory.src}
              className={`polaroid ${isTop ? "is-top" : ""}`}
              style={{ zIndex: MEMORIES.length - i }}
              initial={false}
              animate={
                isTop && leaving
                  ? { x: leaving * 520, rotate: leaving * 26, opacity: 0 }
                  : { x: depth * 8, y: depth * 10, rotate: depth === 0 ? 0 : (i % 2 ? 4 : -3) * depth, opacity: 1 }
              }
              transition={{ duration: 0.32, ease: EASE.out }}
              drag={isTop && !leaving ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.9}
              onDragEnd={(event, info) => {
                if (info.offset.x > 90 || info.velocity.x > 550) dismiss(1);
                if (info.offset.x < -90 || info.velocity.x < -550) dismiss(-1);
              }}
              whileDrag={{ cursor: "grabbing", scale: 1.02 }}
            >
              <div className="polaroid-photo">
                <img src={memory.src} alt={`Memory: ${memory.label}`} draggable="false" loading="lazy" />
                <span className="develop" aria-hidden="true" />
                <span className="polaroid-time mono">{memory.time}</span>
              </div>
              <div className="polaroid-foot">
                <span className="script">{memory.label}</span>
                {isTop && <span className="mono drag-hint">DRAG TO FLICK</span>}
              </div>
            </motion.div>
          );
        })}

        <AnimatePresence>
          {finished && (
            <motion.div
              className="stack-finished"
              initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: -2 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
            >
              <span className="mono">ROLL 01</span>
              <strong>DEVELOPED.</strong>
              <p>All four frames are part of the story now.</p>
              <button
                type="button"
                className="mini-action mono"
                onClick={() => {
                  setIndex(0);
                  sfx.shutter();
                }}
              >
                <RotateCcw size={12} /> REWIND THE STACK
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="stack-meta">
        <span className="mono">
          FRAME {String(Math.min(index + 1, MEMORIES.length)).padStart(2, "0")} / {String(MEMORIES.length).padStart(2, "0")}
        </span>
        <p>{finished ? "Roll complete." : MEMORIES[Math.min(index, MEMORIES.length - 1)].note}</p>
        <div className="stack-dots" aria-hidden="true">
          {MEMORIES.map((memory, i) => (
            <i key={memory.src} className={i <= index ? "on" : ""} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ScratchCard() {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const strokes = useRef(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#e3d7c4");
    gradient.addColorStop(0.35, "#b7a78f");
    gradient.addColorStop(0.55, "#f8efdf");
    gradient.addColorStop(1, "#a2917b");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 900; i += 1) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.16})`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 1.4, 1.4);
    }

    ctx.strokeStyle = "rgba(88,68,40,.35)";
    ctx.setLineDash([4, 5]);
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 12, width - 24, height - 24);

    ctx.fillStyle = "#4a3a26";
    ctx.textAlign = "center";
    ctx.font = "600 13px ui-monospace, monospace";
    ctx.fillText("SCRATCH TO UNLOCK", width / 2, height / 2 - 8);
    ctx.font = "500 10px ui-monospace, monospace";
    ctx.fillText("DHRUV · GOLD", width / 2, height / 2 + 14);
    ctx.font = "500 9px ui-monospace, monospace";
    ctx.fillStyle = "rgba(74,58,36,.6)";
    ctx.fillText("USE A FINGER, NOT A FORK", width / 2, height / 2 + 36);
  }, []);

  function scratch(event) {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    const ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();
    strokes.current += 1;
    if (strokes.current > 34) {
      setRevealed(true);
      sfx.sparkle();
      vibrate([10, 30, 10]);
    }
  }

  return (
    <div className="scratch-shell">
      <div className={`scratch-stage ${revealed ? "revealed" : ""}`}>
        <img src={asset("/media/gift.svg")} alt="A birthday gift illustration" loading="lazy" />
        <span className="scratch-glow" aria-hidden="true" />
        <canvas
          ref={canvasRef}
          width={360}
          height={360}
          className={`scratch-canvas ${revealed ? "revealed" : ""}`}
          onPointerDown={(event) => {
            drawing.current = true;
            event.currentTarget.setPointerCapture?.(event.pointerId);
            scratch(event);
          }}
          onPointerMove={(event) => {
            if (drawing.current) scratch(event);
          }}
          onPointerUp={() => {
            drawing.current = false;
          }}
          onPointerCancel={() => {
            drawing.current = false;
          }}
          aria-label="Scratch card to reveal a birthday message"
        />
      </div>
      <div className="scratch-copy">
        <span className="mono"><Scissors size={11} /> SEALED FRAME · 04</span>
        <h3>Scratch the gold. <em>Keep what&apos;s under it.</em></h3>
        <p>One small gift, one big feeling: this year is going to be ridiculously golden.</p>
        <button
          type="button"
          className="mini-action mono"
          onClick={() => {
            setRevealed(true);
            sfx.sparkle();
          }}
        >
          <Sparkles size={12} /> {revealed ? "THE GIFT IS OPEN" : "TAP TO REVEAL"}
        </button>
      </div>
    </div>
  );
}

export default function Memories() {
  return (
    <section className="memories" id="memories">
      <div className="memories-aura" aria-hidden="true" />
      <div className="wrap">
        <SectionHead
          light
          scene="SC.04"
          eyebrow="THE MEMORY REEL · ROLL 01"
          title="frames from"
          accent="the good stuff."
          copy="Four frames, two moving scenes, one roll of film. Drag, scratch, scroll — this chapter is yours to develop."
        />

        <div className="memories-grid">
          <Reveal>
            <PolaroidStack />
          </Reveal>

          <Reveal delay={0.1}>
            <ScratchCard />
          </Reveal>
        </div>

        <div className="projector-row">
          <Reveal>
            <article className="projector p-intro">
              <div className="projector-gate">
                <img src={asset("/media/scene-a.svg")} alt="Golden hour opening scene" loading="lazy" />
                <span className="gate-leak" aria-hidden="true" />
                <span className="gate-reel mono">REC ● 00:00</span>
              </div>
              <div className="projector-meta">
                <span className="mono">SCENE 01 · THE OPENING</span>
                <h3>Every good story starts with a little chaos.</h3>
                <p>This one started the second you walked in.</p>
              </div>
            </article>
          </Reveal>

          <Reveal delay={0.1}>
            <article className="projector p-surprise">
              <div className="projector-gate">
                <img src={asset("/media/scene-b.svg")} alt="Afterglow scene" loading="lazy" />
                <span className="gate-leak alt" aria-hidden="true" />
                <span className="gate-reel mono">REC ● 00:14</span>
              </div>
              <div className="projector-meta">
                <span className="mono">SCENE 02 · THE PLOT TWIST</span>
                <h3>Nobody saw the plot twist coming.</h3>
                <p>That&apos;s the thing about your year — it keeps getting better.</p>
              </div>
            </article>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <div className="memory-note">
            <Sunflower className="note-sunflower" />
            <p>Some days are only lived once.<br /><em>The best ones move in.</em></p>
            <span className="mono"><Heart size={11} /> ROLL 01 · DHRUV / GOLD</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
