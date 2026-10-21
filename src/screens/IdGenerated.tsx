import { useFlow } from "../app/FlowMachine";
import { img } from "../assets";
import { Blobs, TopBar, Wordmark } from "../components/Brand";
import { Button } from "../components/Button";
import { IdInput, type IdInputValue } from "../components/IdInput";

/** Muestra el ID que acaba de generar el servidor, antes de pasar al instructivo. */
export function IdGenerated() {
  const { navigate, reset, session } = useFlow();
  const [a = "", b = ""] = session.id.split("-");
  const bloques: IdInputValue = [a, b];

  return (
    <section className="screen screen--light">
      <Blobs bottomTop={1490} topLeft={{ left: -27, top: -591, width: 871, height: 874 }} />
      <TopBar />
      <Wordmark left={197} top={370} />

      <h1 className="title title--111 enterFromLeft" style={{ left: 5, top: 680, width: 1080, height: 104 }}>
        Tu ID unico
      </h1>
      <p className="lead lead--id enterFade delay1" style={{ left: 118, top: 782, width: 851, height: 162 }}>
        <strong>Este es tu código personal.</strong>
        <span>Guárdalo, lo necesitarás para iniciar.</span>
      </p>

      <IdInput top={995} value={bloques} readOnly />

      <Button left={198} top={1243} onClick={() => navigate("instructions")}>
        Comenzar
      </Button>

      {/* El registro ya quedó guardado: volver reinicia la estación, no vuelve al formulario. */}
      <button className="back" type="button" onClick={reset} aria-label="Volver al inicio" style={{ left: 881, top: 1701 }}>
        <img src={img("arrow-back.svg")} alt="" />
      </button>
    </section>
  );
}
