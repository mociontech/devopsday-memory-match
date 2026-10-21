import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

/** Tamaño del diseño en Figma (tótem vertical). Todo se posiciona en estos píxeles y el escenario se escala. */
const STAGE_W = 1080;
const STAGE_H = 1920;

const escala = () => Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H);

/** Escenario fijo 1080×1920 escalado al tamaño de la ventana (cada elemento usa las coordenadas exactas del diseño). */
export function Stage({ children }: { children: ReactNode }) {
  const [s, setS] = useState(escala);

  useEffect(() => {
    const alCambiar = () => setS(escala());
    window.addEventListener("resize", alCambiar);
    return () => window.removeEventListener("resize", alCambiar);
  }, []);

  return (
    <main className="stage" style={{ "--s": s } as CSSProperties}>
      {children}
    </main>
  );
}
