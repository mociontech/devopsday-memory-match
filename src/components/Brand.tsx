import type { CSSProperties, ReactNode } from "react";
import { img } from "../assets";

type Box = { left: number; top: number; width: number; height: number };
const box = ({ left, top, width, height }: Box): CSSProperties => ({ left, top, width, height });

/** Menú (esquina superior izquierda) y logo DevOps Days Bogotá (superior derecha), comunes a las pantallas verticales. */
export function TopBar({ menuLeft = 98, menuTop = 95, devops = "devops-black.svg" }: { menuLeft?: number; menuTop?: number; devops?: string }) {
  return (
    <>
      <img className="abs" src={img("menu-icon.svg")} alt="" style={box({ left: menuLeft, top: menuTop, width: 147, height: 43.4 })} />
      <img className="abs" src={img(devops)} alt="DevOps Days Bogotá 2026" style={box({ left: 818, top: 69, width: 199, height: 87.8 })} />
    </>
  );
}

/** "Powered by Mocion .com.co": el logo grande se arma con dos piezas. `scale` = ancho / 673.7 (ancho del diseño de registro). */
export function Wordmark({ left, top, width = 673.7, tone = "black" }: { left: number; top: number; width?: number; tone?: "black" | "pink" }) {
  const k = width / 673.745;
  return (
    <>
      <img className="abs" src={img(`wordmark-${tone}-a.svg`)} alt="Mocion" style={box({ left, top, width, height: 147.159 * k })} />
      <img
        className="abs"
        src={img(`wordmark-${tone}-b.svg`)}
        alt=""
        style={box({ left: left + 489 * k, top: top + 164.6 * k, width: 185 * k, height: 22.7 * k })}
      />
    </>
  );
}

/** Círculos decorativos de las esquinas (arriba a la izquierda y abajo a la derecha). */
export function Rings() {
  return (
    <>
      <img className="abs" src={img("welcome-rings-left.svg")} alt="" style={box({ left: -429, top: -244.4, width: 922.7, height: 987.3 })} />
      <img className="abs" src={img("welcome-rings.svg")} alt="" style={box({ left: 172, top: 1007, width: 1298, height: 1153 })} />
    </>
  );
}

/** Fondo difuminado (turquesa → morado) de las pantallas de juego y resultado. */
export function SoftBackground() {
  return <img className="soft-bg" src={img("bg-hero-v.webp")} alt="" />;
}

/** Pie con redes y enlace a Mocion.global. */
export function SocialFooter() {
  return (
    <div className="social" style={{ left: 270, top: 1815 }}>
      <img src={img("social.svg")} alt="" width={540} height={36} />
      <a className="social__link" href="https://mocion.global/" target="_blank" rel="noopener noreferrer">
        Mocion.global
      </a>
    </div>
  );
}

/** Fondo turquesa de las pantallas de registro: dos formas, una arriba a la izquierda y otra abajo a la derecha. */
export function Blobs({ bottomTop, topLeft }: { bottomTop: number; topLeft: Box }) {
  return (
    <>
      <img className="abs" src={img("blob-right.svg")} alt="" style={box({ left: 231, top: bottomTop, width: 1426, height: 1426 })} />
      {/* El asset viene rotado -90° en Figma: se centra en su caja con el ancho y el alto intercambiados. */}
      <div className="abs art" style={box(topLeft)}>
        <img
          src={img("blob-left.svg")}
          alt=""
          style={{ width: topLeft.height, height: topLeft.width, "--r": "-90deg" } as CSSProperties}
        />
      </div>
    </>
  );
}

export function Layer({ children }: { children: ReactNode }) {
  return <div className="layer">{children}</div>;
}
