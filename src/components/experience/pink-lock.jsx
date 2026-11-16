"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Check, Delete, Lock } from "lucide-react";
import { DHRUV } from "@/lib/dhruv";
import { asset } from "@/lib/asset";

const PINK = ["#ff667f", "#ff2357", "#f6339a", "#fda5d5", "#fff1f2"];

/**
 * PinkLock — the opening gate of the birthday film.
 * A glass card on a pink room, circular keypad, three-digit code.
 * Lives at the start of the film (like the v5 demo) and opens into the cut.
 */
export default function PinkLock({ onUnlock }) {
  const code = DHRUV.lyricLabCode;
  const [entry, setEntry] = useState("");
  const [bad, setBad] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const press = useCallback(
    (digit) => {
      setEntry((value) => {
        if (value.length >= code.length) return value;
        const next = value + digit;
        if (next.length === code.length) {
          if (next === code) {
            sessionStorage.setItem("dhrv-lyric-lab", "1");
            confetti({
              particleCount: 90,
              spread: 82,
              startVelocity: 32,
              origin: { y: 0.6 },
              colors: PINK,
            });
            setTimeout(onUnlock, 450);
          } else {
            setBad(true);
            setShakeKey((k) => k + 1);
            setTimeout(() => setBad(false), 600);
            setTimeout(() => setEntry(""), 750);
          }
        }
        return next;
      });
    },
    [code, onUnlock]
  );

  const backspace = useCallback(() => setEntry((value) => value.slice(0, -1)), []);

  useEffect(() => {
    const onKey = (event) => {
      if (/^[0-9]$/.test(event.key)) press(event.key);
      if (event.key === "Backspace") backspace();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [press, backspace]);

  return (
    <motion.div
      className="pl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
    >
      <div className="pl-pinkbg" />
      <div className="pl-pinkbg-md" />
      <div className="pl-grain" aria-hidden="true" />

      <motion.div
        key={shakeKey}
        className={`pl-glass ${shakeKey ? "pl-shake" : ""}`}
        initial={{ opacity: 0, y: 22, scale: 0.97 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          x: shakeKey ? [-14, 14, -10, 10, -5, 5, 0] : 0,
        }}
        transition={{ duration: shakeKey ? 0.4 : 0.6, ease: shakeKey ? [0.36, 0.07, 0.19, 0.97] : [0.16, 1, 0.3, 1] }}
      >
        <div className="pl-lock-head">
          <span>DHRV · THE GOLDEN HOUR</span>
          <span className="pl-lock-live">
            <i /> PRIVATE
          </span>
        </div>

        <div className="pl-avatar">
          <span className="pl-avatar-ring">
            <img src={asset("/media/dp.jpg")} alt="Dhruv" draggable="false" />
          </span>
          <span className="pl-avatar-badge">
            <Lock size={13} strokeWidth={2.4} />
          </span>
        </div>

        <h2 className="pl-lock-title">
          Unlock <em>your surprise</em>
        </h2>
        <p className="pl-lock-sub">Enter the secret code to begin</p>

        <div className="pl-dots" aria-label={`${entry.length} of ${code.length} digits entered`}>
          {Array.from({ length: code.length }).map((_, index) => (
            <span key={index} className={`pl-dot ${index < entry.length ? "on" : ""}`}>
              {index < entry.length ? <Check size={12} strokeWidth={3} /> : ""}
            </span>
          ))}
        </div>

        <div className="pl-lock-status" aria-live="polite">
          {bad ? <span>Oops! Try again...</span> : ""}
        </div>

        <div className="pl-keypad">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
            <button key={digit} type="button" className="pl-key" onClick={() => press(digit)}>
              {digit}
            </button>
          ))}
          <span className="pl-key blank" aria-hidden="true" />
          <button type="button" className="pl-key" onClick={() => press("0")}>
            0
          </button>
          <button type="button" className="pl-key back" onClick={backspace} aria-label="Delete digit">
            <Delete size={20} />
          </button>
        </div>

        <p className="pl-lock-foot">3 digits · count by three</p>
      </motion.div>
    </motion.div>
  );
}
