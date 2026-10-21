import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useMemoryGame, type Card } from "./useMemoryGame";
import { MISMATCH_DELAY_MS, PAIRS_COUNT, POINTS_PER_MATCH } from "./game.config";
import { POPUP_TEXTS } from "./popups";

function findMatchingPair(cards: Card[]): [Card, Card] {
  for (const card of cards) {
    const partner = cards.find((c) => c.id !== card.id && c.pairId === card.pairId);
    if (partner) return [card, partner];
  }
  throw new Error("no matching pair found in deck");
}

function findMismatchedPair(cards: Card[]): [Card, Card] {
  const [first] = cards;
  const other = cards.find((c) => c.pairId !== first!.pairId);
  return [first!, other!];
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useMemoryGame", () => {
  it("reparte PAIRS_COUNT*2 cartas (12 en 3 columnas), todas boca abajo y sin acertar", () => {
    const { result } = renderHook(() => useMemoryGame());
    expect(result.current.cards).toHaveLength(PAIRS_COUNT * 2);
    expect(result.current.gridColumns).toBe(3);
    expect(result.current.cards.every((c) => !c.isFlipped && !c.isMatched)).toBe(true);
  });

  it("acierto: dos cartas de la misma pareja quedan acertadas y suman POINTS_PER_MATCH", () => {
    const { result } = renderHook(() => useMemoryGame());
    const [a, b] = findMatchingPair(result.current.cards);

    act(() => result.current.flipCard(a.id));
    act(() => result.current.flipCard(b.id));

    expect(result.current.cards.find((c) => c.id === a.id)!.isMatched).toBe(true);
    expect(result.current.cards.find((c) => c.id === b.id)!.isMatched).toBe(true);
    expect(result.current.score).toBeCloseTo(POINTS_PER_MATCH);
    expect(result.current.attempts).toBe(1);
    expect(result.current.lastMatchedPair?.id).toBe(a.pairId);
    expect(POPUP_TEXTS).toContain(result.current.lastMatchText);
  });

  it("error: dos parejas distintas se voltean tras la espera y restan puntos", () => {
    const { result } = renderHook(() => useMemoryGame());
    const [a, b] = findMismatchedPair(result.current.cards);

    act(() => result.current.flipCard(a.id));
    act(() => result.current.flipCard(b.id));

    expect(result.current.phase).toBe("evaluating");
    expect(result.current.shakingIds).toEqual([a.id, b.id]);

    act(() => {
      vi.advanceTimersByTime(MISMATCH_DELAY_MS);
    });

    expect(result.current.cards.find((c) => c.id === a.id)!.isFlipped).toBe(false);
    expect(result.current.phase).toBe("idle");
    expect(result.current.attempts).toBe(1);
    expect(result.current.score).toBe(0);
  });

  it("no acepta toques mientras el popup del acierto sigue abierto", () => {
    const { result } = renderHook(() => useMemoryGame());
    const [a, b] = findMatchingPair(result.current.cards);
    act(() => result.current.flipCard(a.id));
    act(() => result.current.flipCard(b.id));

    const otra = result.current.cards.find((c) => !c.isMatched)!;
    act(() => result.current.flipCard(otra.id));
    expect(result.current.cards.find((c) => c.id === otra.id)!.isFlipped).toBe(false);

    act(() => result.current.acknowledgeMatch());
    act(() => result.current.flipCard(otra.id));
    expect(result.current.cards.find((c) => c.id === otra.id)!.isFlipped).toBe(true);
  });

  it("termina al acertar todas las parejas y una partida perfecta suma 100 sin repetir textos de popup", () => {
    const { result } = renderHook(() => useMemoryGame());
    const textos: string[] = [];

    for (let i = 0; i < PAIRS_COUNT; i++) {
      const pendientes = result.current.cards.filter((c) => !c.isMatched);
      const [a, b] = findMatchingPair(pendientes);
      act(() => result.current.flipCard(a.id));
      act(() => result.current.flipCard(b.id));
      textos.push(result.current.lastMatchText!);
      act(() => result.current.acknowledgeMatch());
    }

    expect(result.current.phase).toBe("finished");
    expect(result.current.matchedPairs).toBe(PAIRS_COUNT);
    expect(result.current.attempts).toBe(PAIRS_COUNT);
    expect(Math.round(result.current.score)).toBe(100);
    expect(new Set(textos).size).toBe(PAIRS_COUNT);
  });
});
