import { useEffect, useRef, useState } from "react";
import { useFlow } from "../../app/FlowMachine";
import { Rings, SocialFooter, SoftBackground, TopBar, Wordmark } from "../../components/Brand";
import { MatchPopup } from "../../components/Popup";
import { CARD_DROP_DURATION_MS, CARD_DROP_STAGGER_MS, INTRO_REVEAL_DURATION_MS } from "../../game/game.config";
import { PAIRS } from "../../game/pairs";
import { useMemoryGame } from "../../game/useMemoryGame";
import { Card } from "./Card";

/**
 * Pre-game intro: cards drop into place face-down, then flip face-up for a
 * beat so the player actually sees the board before it becomes a memory
 * test, then flip back down and hand off to real play.
 */
type IntroStage = "dropping" | "revealing" | "playing";

/** Board screen: wires useMemoryGame to the UI, nothing here owns game rules. */
export function Game() {
  const { navigate, setResult } = useFlow();
  const [introStage, setIntroStage] = useState<IntroStage>("dropping");
  const { cards, phase, attempts, score, matchedPairs, shakingIds, lastMatchedPair, lastMatchText, flipCard, acknowledgeMatch } =
    useMemoryGame();
  /** Momento en que arranca el juego real (después de la intro): de ahí sale el tiempo que se muestra al final. */
  const playStartedAt = useRef<number | null>(null);

  // Runs once on mount: waits out the staggered drop animation, flips every
  // card face-up for a preview, then flips back down and starts real play.
  useEffect(() => {
    const dropTotalMs = CARD_DROP_DURATION_MS + (cards.length - 1) * CARD_DROP_STAGGER_MS;
    const revealTimer = setTimeout(() => setIntroStage("revealing"), dropTotalMs);
    const playTimer = setTimeout(() => {
      playStartedAt.current = Date.now();
      setIntroStage("playing");
    }, dropTotalMs + INTRO_REVEAL_DURATION_MS);
    return () => {
      clearTimeout(revealTimer);
      clearTimeout(playTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Al cerrar el popup del último acierto, el juego termina y se pasa al resultado.
  useEffect(() => {
    if (phase === "finished" && !lastMatchedPair) {
      setResult({
        score,
        attempts,
        matchedPairs,
        durationMs: playStartedAt.current ? Date.now() - playStartedAt.current : 0,
      });
      navigate("result");
    }
  }, [phase, lastMatchedPair, score, attempts, matchedPairs, navigate, setResult]);

  return (
    <section className="screen">
      <SoftBackground />
      <Rings />
      <TopBar />
      <Wordmark left={258.2} top={220} width={551.8} />

      <div className="attempts" style={{ left: 308, top: 438, width: 464, height: 109 }}>
        Intentos: {attempts}
      </div>

      <div className="board" style={{ left: 173, top: 661 }}>
        {cards.map((card, index) => (
          <Card
            key={card.id}
            isFlipped={introStage === "revealing" || card.isFlipped}
            isMatched={card.isMatched}
            pair={PAIRS.find((p) => p.id === card.pairId)}
            onTap={() => flipCard(card.id)}
            disabled={introStage !== "playing"}
            dropDelayMs={index * CARD_DROP_STAGGER_MS}
            seed={index}
            breathe={introStage === "playing" && !card.isFlipped && !card.isMatched}
            shaking={shakingIds.includes(card.id)}
          />
        ))}
      </div>

      <MatchPopup open={lastMatchedPair !== null} onClose={acknowledgeMatch}>
        {lastMatchText}
      </MatchPopup>

      <SocialFooter />
    </section>
  );
}
