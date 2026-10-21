import { useEffect, useState, type CSSProperties } from "react";
import { img } from "../../assets";
import type { Pair } from "../../game/pairs";

interface CardProps {
  isFlipped: boolean;
  isMatched: boolean;
  pair: Pair | undefined;
  onTap: () => void;
  /** Stagger for the intro drop-in animation; 0 outside the intro (mount only, never replayed). */
  dropDelayMs?: number;
  /** True while the intro preview is holding every card face-up — taps are ignored until it ends. */
  disabled?: boolean;
  /** Stable per-card index, used only to pick a pseudo-random breathing delay/duration (so cards don't breathe in lockstep). */
  seed?: number;
  /** True while idle face-down and waiting to be tapped — gives the board a bit of life between taps. */
  breathe?: boolean;
  /** True for the ~400ms right after a wrong guess, before the pair flips back down. */
  shaking?: boolean;
}

/** Deterministic 0..1 pseudo-random from an integer seed — same seed always breathes the same way, no state needed. */
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/** One board tile: flips with transform/backface-visibility only (no layout-affecting animation). */
export function Card({ isFlipped, isMatched, pair, onTap, dropDelayMs = 0, disabled = false, seed = 0, breathe = false, shaking = false }: CardProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
  }, [isFlipped]);

  const breatheDelayMs = Math.round(pseudoRandom(seed) * 2500);
  const breatheDurationMs = 3000 + Math.round(pseudoRandom(seed + 0.5) * 1800);

  return (
    <button
      type="button"
      className={`card ${breathe ? "card--breathing" : ""} ${shaking ? "card--shaking" : ""}`}
      style={
        {
          "--drop-delay": `${dropDelayMs}ms`,
          "--breathe-delay": `${breatheDelayMs}ms`,
          "--breathe-duration": `${breatheDurationMs}ms`,
        } as CSSProperties
      }
      onClick={onTap}
      disabled={disabled || isFlipped || isMatched}
      aria-label={isFlipped || isMatched ? (pair?.name ?? "carta") : "Carta boca abajo"}
    >
      <div
        className={`card__inner ${isFlipped || isMatched ? "card__inner--flipped" : ""}`}
        data-animating={isAnimating}
        onTransitionEnd={() => setIsAnimating(false)}
      >
        <div className="card__face card__face--down">
          <img src={img("card-m-back.svg")} alt="" aria-hidden="true" style={{ left: 40, top: 41, width: 130, height: 118 }} />
        </div>
        <div className="card__face card__face--up" style={{ background: pair?.background }}>
          {pair && (
            <img
              src={img(pair.art.img)}
              alt=""
              aria-hidden="true"
              style={{ left: pair.art.left, top: pair.art.top, width: pair.art.width, height: pair.art.height }}
            />
          )}
        </div>
      </div>
    </button>
  );
}
