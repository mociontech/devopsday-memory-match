import { useState } from "react";
import { useFlow } from "../app/FlowMachine";
import { Blobs, TopBar, Wordmark } from "../components/Brand";
import { Button } from "../components/Button";
import { IdInput, type IdInputValue } from "../components/IdInput";
import { Warning } from "../components/Popup";
import { img } from "../assets";
import { registrarContactoEnEvius } from "../services/evius";
import { Registros, mensajeDe } from "../services/api";

const EMPTY_ID: IdInputValue = ["", ""];

/**
 * Acceso rápido: quien ya tiene su ID (de esta u otra experiencia del evento) entra sin volver a registrarse.
 * "No encontrado" y "ya participaste" son avisos distintos porque son problemas distintos.
 */
export function RegisterId() {
  const { navigate, setSession } = useFlow();
  const [bloques, setBloques] = useState<IdInputValue>(EMPTY_ID);
  const [invalido, setInvalido] = useState(false);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState<string | null>(null);
  const [consultando, setConsultando] = useState(false);

  const completo = bloques[0].length === 3 && bloques[1].length === 3;

  async function enviar() {
    if (consultando) return;
    if (!completo) {
      setInvalido(true);
      setError("Escribe los 6 dígitos de tu ID.");
      return;
    }

    setConsultando(true);
    try {
      const persona = await Registros.buscarPorId(`${bloques[0]}-${bloques[1]}`);
      if (!persona) {
        setInvalido(true);
        setAviso("No encontramos ese código. Verifica que esté bien escrito o regístrate.");
        return;
      }
      if (persona.jugado) {
        setAviso("Parece que ya participaste en esta experiencia. ¡Gracias!");
        return;
      }
      // La persona ya estaba registrada: se rescata su contacto de la base para mandarla a Evius.
      // La partida se envía a Evius al terminar (Result), con su puntaje.
      registrarContactoEnEvius(persona.id, persona.nombre, persona.contacto);
      setSession({ id: persona.id, name: persona.nombre });
      navigate("instructions");
    } catch (err) {
      setError(mensajeDe(err));
    } finally {
      setConsultando(false);
    }
  }

  return (
    <section className="screen screen--light">
      <Blobs bottomTop={1490} topLeft={{ left: -27, top: -591, width: 871, height: 874 }} />
      <TopBar />
      <Wordmark left={197} top={370} />

      <h1 className="title title--111 enterFromLeft" style={{ left: 5, top: 794, width: 1080, height: 104 }}>
        Agrega ID
      </h1>

      <IdInput
        top={975}
        value={bloques}
        invalid={invalido}
        autoFocus
        onChange={(v) => {
          setBloques(v);
          setInvalido(false);
          setError("");
        }}
      />

      <p className="form-error form-error--center" role="alert" style={{ left: 177, top: 1150, width: 704 }}>
        {error}
      </p>

      <Button left={198} top={1243} disabled={consultando} onClick={enviar}>
        {consultando ? "Verificando..." : "Comenzar"}
      </Button>

      <button className="back" type="button" onClick={() => navigate("register")} aria-label="Volver" style={{ left: 881, top: 1701 }}>
        <img src={img("arrow-back.svg")} alt="" />
      </button>

      <Warning open={aviso !== null} onClose={() => setAviso(null)}>
        {aviso}
      </Warning>
    </section>
  );
}
