import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GRID_COLUMNS, MISMATCH_DELAY_MS, PAIRS_COUNT } from "./game.config";
import { PAIRS, type Pair } from "./pairs";
import { buildPopupDeck } from "./popups";
import { shuffle } from "./shuffle";
import { computeScore } from "./scoring";

export interface Card {
  id: string;
  pairId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

/**
 * The spec names five phases (idle -> flippingFirst -> flippingSecond ->
 * evaluating -> match|mismatch -> ... -> finished). This hook collapses
 * flippingFirst/flippingSecond into "idle" (both allow tapping any
 * unflipped card — the only observable difference is `flippedCount`, which
 * callers can read off `cards`) since nothing behaviorally distinguishes
 * them: the 2nd card's flip is a CSS concern in the Card component, not a
 * gated JS state. "evaluating" is real: clicks are blocked while the pair's
 * outcome is being shown.
 *
 * Ya no hay cuenta regresiva: el diseño no muestra un cronómetro en el tablero, solo los intentos, y al final
 * muestra el tiempo que tomó la partida (lo mide la pantalla Game con startedAt/finishedAt).
 */
export type GamePhase = "idle" | "evaluating" | "finished";

export interface UseMemoryGameResult {
  cards: Card[];
  phase: GamePhase;
  /** Incremented once per pair evaluated (not per tap). */
  attempts: number;
  score: number;
  gridColumns: number;
  matchedPairs: number;
  totalPairs: number;
  /** The two card ids currently shaking off a wrong guess, purely for visual feedback. */
  shakingIds: string[];
  /** Set right after a match resolves; screens use this to open the popup. Cleared by acknowledgeMatch. */
  lastMatchedPair: Pair | null;
  /** Texto del popup de ese acierto (uno distinto por acierto dentro de la partida). */
  lastMatchText: string | null;
  flipCard: (cardId: string) => void;
  /** Call when the popup has been dismissed, so the next flip is accepted again. */
  acknowledgeMatch: () => void;
}

function buildDeck(): Card[] {
  const pairs = PAIRS.slice(0, PAIRS_COUNT);
  const cards = pairs.flatMap((pair) => [
    { id: `${pair.id}-a`, pairId: pair.id, isFlipped: false, isMatched: false },
    { id: `${pair.id}-b`, pairId: pair.id, isFlipped: false, isMatched: false },
  ]);
  return shuffle(cards);
}

/**
 * All memory-match game logic, isolated from JSX so it can be unit tested
 * directly (see useMemoryGame.test.ts).
 */
export function useMemoryGame(): UseMemoryGameResult {
  const [cards, setCards] = useState<Card[]>(buildDeck);
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [attempts, setAttempts] = useState(0);
  const [matches, setMatches] = useState(0);
  const [mismatches, setMismatches] = useState(0);
  const [lastMatchedPair, setLastMatchedPair] = useState<Pair | null>(null);
  const [lastMatchText, setLastMatchText] = useState<string | null>(null);
  const [awaitingAcknowledge, setAwaitingAcknowledge] = useState(false);
  /** Card ids currently shaking off a wrong guess — cleared once they flip back down. */
  const [shakingIds, setShakingIds] = useState<string[]>([]);
  const popupDeck = useRef<string[]>(buildPopupDeck());

  const score = useMemo(() => computeScore(matches, mismatches), [matches, mismatches]);
  const totalPairs = PAIRS_COUNT;
  const matchedPairs = matches;

  useEffect(() => {
    if (matchedPairs === totalPairs) setPhase("finished");
  }, [matchedPairs, totalPairs]);

  const mismatchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (mismatchTimeoutRef.current) clearTimeout(mismatchTimeoutRef.current);
    };
  }, []);

  const flipCard = useCallback(
    (cardId: string) => {
      if (phase !== "idle" || awaitingAcknowledge) return;

      const flippedUnmatched = cards.filter((c) => c.isFlipped && !c.isMatched);
      const target = cards.find((c) => c.id === cardId);
      if (!target || target.isFlipped || target.isMatched) return;

      if (flippedUnmatched.length === 0) {
        setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c)));
        return;
      }

      // Second card of the pair: flip it and evaluate.
      const first = flippedUnmatched[0]!;
      setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c)));
      setAttempts((prev) => prev + 1);
      setPhase("evaluating");

      if (first.pairId === target.pairId) {
        setCards((prev) => prev.map((c) => (c.id === first.id || c.id === cardId ? { ...c, isMatched: true } : c)));
        setMatches((prev) => prev + 1);
        setLastMatchedPair(PAIRS.find((p) => p.id === target.pairId) ?? null);
        setLastMatchText(popupDeck.current.shift() ?? null);
        setAwaitingAcknowledge(true);
        setPhase("idle");
      } else {
        setMismatches((prev) => prev + 1);
        setShakingIds([first.id, cardId]);
        mismatchTimeoutRef.current = setTimeout(() => {
          setCards((prev) => prev.map((c) => (c.id === first.id || c.id === cardId ? { ...c, isFlipped: false } : c)));
          setShakingIds([]);
          setPhase("idle");
        }, MISMATCH_DELAY_MS);
      }
    },
    [cards, phase, awaitingAcknowledge],
  );

  const acknowledgeMatch = useCallback(() => {
    setLastMatchedPair(null);
    setLastMatchText(null);
    setAwaitingAcknowledge(false);
  }, []);

  return {
    cards,
    phase,
    attempts,
    score,
    gridColumns: GRID_COLUMNS,
    matchedPairs,
    totalPairs,
    shakingIds,
    lastMatchedPair,
    lastMatchText,
    flipCard,
    acknowledgeMatch,
  };
}
