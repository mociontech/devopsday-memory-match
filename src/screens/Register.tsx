import { useState, type FormEvent } from "react";
import { useFlow } from "../app/FlowMachine";
import { img } from "../assets";
import { Blobs, TopBar, Wordmark } from "../components/Brand";
import { Button } from "../components/Button";
import { Warning } from "../components/Popup";
import { enviarEvius, recordarContacto } from "../services/evius";
import { ErrorApi, Registros, mensajeDe } from "../services/api";

type Campo = "nombre" | "empresa" | "correo" | "celular";

const CORREO_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Orden, posición y textos del diseño. El diseño trae los íconos de correo y celular intercambiados
// (un teléfono en "Tu correo" y un sobre en "Tu celular"): aquí cada campo lleva el ícono que le corresponde.
const CAMPOS: { campo: Campo; placeholder: string; icono: string; top: number; type: string; inputMode: "text" | "email" | "numeric"; autoComplete: string; max: number }[] = [
  { campo: "nombre", placeholder: "Tu nombre", icono: "icon-person.svg", top: 881, type: "text", inputMode: "text", autoComplete: "name", max: 80 },
  { campo: "empresa", placeholder: "Tu empresa", icono: "icon-building.svg", top: 1013, type: "text", inputMode: "text", autoComplete: "organization", max: 80 },
  { campo: "correo", placeholder: "Tu correo", icono: "icon-envelope.svg", top: 1145, type: "email", inputMode: "email", autoComplete: "email", max: 120 },
  { campo: "celular", placeholder: "Tu celular", icono: "icon-phone.svg", top: 1277, type: "tel", inputMode: "numeric", autoComplete: "tel", max: 10 },
];

/**
 * Registro de la persona. El ID lo genera el servidor (un solo ID en todas las experiencias del evento);
 * si el correo ya existe, se le indica que entre con su ID por «digitar ID código».
 */
export function Register() {
  const { navigate, setSession } = useFlow();
  const [valores, setValores] = useState<Record<Campo, string>>({ nombre: "", empresa: "", correo: "", celular: "" });
  const [invalidos, setInvalidos] = useState<Campo[]>([]);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const cambiar = (campo: Campo, valor: string) =>
    setValores((v) => ({ ...v, [campo]: campo === "celular" ? valor.replace(/\D+/g, "") : valor }));

  const validar = (): [Campo, string][] => {
    const falta: [Campo, string][] = [];
    if (valores.nombre.trim().length < 2) falta.push(["nombre", "Escribe tu nombre."]);
    if (!valores.empresa.trim()) falta.push(["empresa", "Escribe tu empresa."]);
    if (!CORREO_RE.test(valores.correo.trim())) falta.push(["correo", "Escribe un correo válido."]);
    if (!/^\d{10}$/.test(valores.celular)) falta.push(["celular", "El celular debe tener 10 dígitos."]);
    return falta;
  };

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (enviando) return;

    const falta = validar();
    setInvalidos(falta.map(([c]) => c));
    const [primero] = falta;
    if (primero) {
      setError(primero[1]);
      return;
    }
    setError("");

    setEnviando(true);
    try {
      const persona = await Registros.guardar({
        nombre: valores.nombre.trim(),
        empresa: valores.empresa.trim(),
        correo: valores.correo.trim(),
        celular: valores.celular,
      });
      // Supabase ya confirmó el registro: lo mismo va a Evius en segundo plano (con cola y reintentos).
      // La partida se envía a Evius al terminar (Result), con su puntaje.
      const contacto = { email: valores.correo.trim(), fullName: valores.nombre.trim(), phone: valores.celular, company: valores.empresa.trim() };
      recordarContacto(persona.id, contacto);
      enviarEvius(contacto);
      setSession({ id: persona.id, name: persona.nombre });
      navigate("idGenerated");
    } catch (err) {
      if (err instanceof ErrorApi && err.codigo === "correo_duplicado") {
        setInvalidos(["correo"]);
        setAviso(err.message);
      } else {
        setError(mensajeDe(err));
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="screen screen--light">
      <Blobs bottomTop={1651} topLeft={{ left: -27, top: -652, width: 994, height: 997 }} />
      <TopBar menuTop={92} />
      <Wordmark left={197} top={431} />

      <h1 className="title title--111 enterFromLeft" style={{ left: 5, top: 720, width: 1080, height: 104 }}>
        REGISTRO
      </h1>

      <form onSubmit={enviar} noValidate autoComplete="off">
        {CAMPOS.map((c) => (
          <label key={c.campo} className={`field${invalidos.includes(c.campo) ? " is-invalid" : ""}`} style={{ left: 98, top: c.top }}>
            <span className="field__icon">
              <img src={img(c.icono)} alt="" />
            </span>
            <img className="field__dot" src={img("icon-dot.svg")} alt="" />
            <input
              name={c.campo}
              type={c.type}
              inputMode={c.inputMode}
              autoComplete={c.autoComplete}
              maxLength={c.max}
              placeholder={c.placeholder}
              value={valores[c.campo]}
              onChange={(e) => cambiar(c.campo, e.target.value)}
              autoFocus={c.campo === "nombre"}
            />
          </label>
        ))}

        <p className="form-error" role="alert" style={{ left: 98, top: 1395, width: 882 }}>
          {error}
        </p>

        <Button type="submit" left={198} top={1543} disabled={enviando}>
          {enviando ? "Guardando..." : "Comenzar"}
        </Button>
      </form>

      <button className="link-btn" type="button" onClick={() => navigate("registerId")} style={{ left: 239, top: 1709, width: 593, height: 88 }}>
        digitar ID código
      </button>

      <Warning open={aviso !== null} onClose={() => setAviso(null)}>
        {aviso}
      </Warning>
    </section>
  );
}
