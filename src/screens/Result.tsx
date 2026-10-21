import { useEffect, useRef } from "react";
import { useFlow } from "../app/FlowMachine";
import { img } from "../assets";
import { Rings, SocialFooter, SoftBackground, TopBar, Wordmark } from "../components/Brand";
import { Button } from "../components/Button";
import { PAIRS_COUNT } from "../game/game.config";
import { toDbScore } from "../game/scoring";
import { contactoDe, enviarEvius } from "../services/evius";
import { enqueueResultado } from "../services/outbox";

/** 65000 ms → "1:05". */
function formatDuration(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

/**
 * Cierre: gracias + intentos + tiempo. El resultado se guarda en la cola local al llegar (nunca bloquea a la
 * persona) y se envía a la base en segundo plano. No hay ranking aquí: el ranking del evento sale de la base.
 */
export function Result() {
  const { session, result, reset } = useFlow();
  const enviado = useRef(false);

  useEffect(() => {
    if (enviado.current || !result || !session.id) return;
    enviado.current = true;
    enqueueResultado({
      id: session.id,
      puntaje: toDbScore(result.score),
      detalles: { intentos: result.attempts, duracionMs: result.durationMs, parejas: PAIRS_COUNT },
    });
    // A Evius, en paralelo y en segundo plano. El contacto viene del registro (o se rescató de la base al entrar con ID).
    const contacto = contactoDe(session.id);
    if (contacto) {
      enviarEvius(contacto, { score: toDbScore(result.score), attempts: result.attempts, durationMs: result.durationMs });
    }
  }, [result, session.id]);

  return (
    <section className="screen">
      <SoftBackground />
      <Rings />
      <TopBar devops="devops-pink.svg" />
      <Wordmark left={197} top={266} tone="pink" />

      <img className="abs enterScale delay1" src={img("result-robot.webp")} alt="" style={{ left: 370, top: 526, width: 292, height: 372 }} />

      <h1 className="result-title enterFromLeft" style={{ left: 139, top: 913, width: 801, height: 211 }}>
        ¡Gracias por participar!
      </h1>

      <div className="attempts attempts--pink enterFade delay2" style={{ left: 303, top: 1163, width: 464, height: 109 }}>
        Intentos: {result?.attempts ?? 0}
      </div>
      <p className="result-time enterFade delay3" style={{ left: 313, top: 1295, width: 443, height: 47 }}>
        {formatDuration(result?.durationMs ?? 0)} TIME
      </p>

      <Button left={198} top={1512} onClick={reset}>
        Finalizar
      </Button>

      <SocialFooter />
    </section>
  );
}
