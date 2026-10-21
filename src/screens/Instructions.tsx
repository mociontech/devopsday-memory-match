import { useFlow } from "../app/FlowMachine";
import { img } from "../assets";
import { Rings } from "../components/Brand";
import { Button } from "../components/Button";
import { PAIRS_COUNT } from "../game/game.config";

/** Reglas del juego antes de cargar el tablero. "Si completas las N" sale de PAIRS_COUNT, no del texto de Figma. */
export function Instructions() {
  const { navigate } = useFlow();
  return (
    <section className="screen screen--pink">
      <img className="abs" src={img("circle-white.svg")} alt="" style={{ left: -249, top: 429, width: 1577, height: 1577 }} />
      <Rings />
      <img className="abs" src={img("menu-icon.svg")} alt="" style={{ left: 49, top: 94, width: 147, height: 43.4 }} />

      <div className="brand" style={{ left: 201, top: 181, width: 678, height: 144 }}>
        <img className="abs" src={img("instructivo-wordmark.svg")} alt="Mocion" style={{ left: 0, top: 37, width: 351.6, height: 76.8 }} />
        <span className="brand__rule brand__rule--light" style={{ left: 387, top: 0, height: 144 }} />
      </div>

      <img className="abs enterScale delay1" src={img("instructivo-robot.webp")} alt="" style={{ left: 376, top: 364, width: 329, height: 407 }} />

      <h1 className="title title--97 title--ink enterFromLeft" style={{ left: 98, top: 787, width: 882, height: 138 }}>
        Instructivo
      </h1>
      <p className="lead lead--instructivo enterFade delay2" style={{ left: 107, top: 884, width: 873, height: 577 }}>
        Toca las tarjetas en el tablero para descubrir objetos. Por cada coincidencia correcta, desbloquearás un beneficio y sumarás
        puntos. Si completas las {PAIRS_COUNT}, podrás canjear tus puntos por premios y pasar a la siguiente experiencia.
      </p>

      <Button left={198} top={1512} onClick={() => navigate("game")}>
        Iniciar
      </Button>
    </section>
  );
}
