import { useFlow } from "../app/FlowMachine";
import { img } from "../assets";
import { Rings, SocialFooter } from "../components/Brand";
import { Button } from "../components/Button";

/**
 * Bienvenida: título "Memory Match" + llamado a registrarse. Las coordenadas son las del diseño (1080×1920).
 *
 * El robot y su brillo cian están en Figma dentro de un marco de 807×890 girado 3.73°; aquí se colocan ya en
 * coordenadas de la pantalla (el marco girado aislaría el modo de mezcla `difference` que produce el brillo).
 */
export function Welcome() {
  const { navigate } = useFlow();
  return (
    <section className="screen">
      <Rings />

      <img className="abs diamond" src={img("welcome-glow.svg")} alt="" style={{ left: 596.5, top: 299.8, width: 497.6, height: 497.6 }} />
      <img
        className="abs enterScale delay1"
        src={img("welcome-robot.webp")}
        alt=""
        style={{ left: 764.1, top: 321.8, width: 264.8, height: 316.2, rotate: "9.26deg" }}
      />
      <img className="abs" src={img("welcome-brain.webp")} alt="" style={{ left: 39, top: 527, width: 305, height: 262 }} />

      <div className="brand" style={{ left: 201, top: 138, width: 678, height: 144 }}>
        <img className="abs" src={img("hp-mocion.svg")} alt="Mocion" style={{ left: 0, top: 37, width: 351.5, height: 76.8 }} />
        <span className="brand__rule" style={{ left: 387, top: 0, height: 144 }} />
      </div>
      <img className="abs" src={img("hp-devops.svg")} alt="DevOps Days Bogotá 2026" style={{ left: 620, top: 153, width: 259, height: 114 }} />

      <h1 className="hero-word enterFromLeft" style={{ left: 117, top: 439, width: 746, height: 207 }}>
        Memory
      </h1>
      <h1 className="hero-word enterFromRight delay1" style={{ left: 409, top: 582, width: 576, height: 207 }}>
        Match
      </h1>

      <h2 className="tagline enterFade delay2" style={{ left: 61, top: 912, width: 957, height: 121 }}>
        Reta tus habilidades de memoria
      </h2>
      <p className="subtagline enterFade delay3" style={{ left: 116, top: 1063, width: 848, height: 112 }}>
        Pon a prueba tu memoria
        <br />y conoce las soluciones de mocion
      </p>

      <Button tone="pink" left={194} top={1346} width={693} height={133} className="enterFromBottom delay4" onClick={() => navigate("register")}>
        Iniciar
      </Button>

      <SocialFooter />
    </section>
  );
}
