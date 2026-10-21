import { useRef } from "react";

const TAPS_TO_TRIGGER = 5;
const WINDOW_MS = 2500;

interface SecretResetZoneProps {
  onTrigger: () => void;
}

/**
 * Zona invisible en la esquina superior derecha: 5 toques seguidos ahí (en menos de WINDOW_MS) vuelven al
 * inicio, sin ningún botón visible en el diseño. Sirve para que el staff saque a alguien de una pantalla trabada
 * sin esperar el timeout de inactividad. Está arriba a la derecha (no a la izquierda) para no tapar la flecha
 * de volver. Sin fondo, borde ni cursor especial: a propósito no da ninguna pista visual de que existe.
 */
export function SecretResetZone({ onTrigger }: SecretResetZoneProps) {
  const tapsRef = useRef<number[]>([]);

  const handleTap = () => {
    const now = Date.now();
    const recentTaps = tapsRef.current.filter((tapTime) => now - tapTime < WINDOW_MS);
    recentTaps.push(now);
    tapsRef.current = recentTaps;

    if (recentTaps.length >= TAPS_TO_TRIGGER) {
      tapsRef.current = [];
      onTrigger();
    }
  };

  return <div className="secret-zone" onClick={handleTap} aria-hidden="true" />;
}
