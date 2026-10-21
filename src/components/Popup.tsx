import { useEffect, type ReactNode } from "react";
import { img } from "../assets";

interface PopupProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Aviso del diseño ("Advertencia"): atenúa toda la pantalla y muestra una caja rosa con un ícono de alerta.
 * Cualquier toque lo cierra. La primera frase va en negrita, como en el diseño.
 */
export function Warning({ open, onClose, children }: Omit<PopupProps, "children"> & { children: string | null }) {
  if (!open || children === null) return null;
  const corte = children.indexOf(". ");
  const primera = corte > 0 ? children.slice(0, corte + 1) : children;
  const resto = corte > 0 ? children.slice(corte + 1) : "";
  return (
    <div className="overlay enterFade" onClick={onClose} role="alertdialog">
      <img className="abs" src={img("icon-warning.svg")} alt="" aria-hidden="true" style={{ left: 451.5, top: 636.8, width: 183.9, height: 173 }} />
      <div className="warning enterScale delay1">
        <p>
          <strong>{primera}</strong>
          {resto}
        </p>
      </div>
    </div>
  );
}

const MATCH_AUTO_CLOSE_MS = 2_500;

/** Popup de pareja ("Posicionate"): borde blanco, sin atenuar el tablero. Se cierra solo o con un toque. */
export function MatchPopup({ open, onClose, children }: PopupProps) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, MATCH_AUTO_CLOSE_MS);
    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="match-popup-layer" onClick={onClose}>
      <div className="match-popup enterScale">
        <p>{children}</p>
      </div>
    </div>
  );
}
