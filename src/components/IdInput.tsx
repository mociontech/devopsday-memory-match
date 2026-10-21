import { useRef, type KeyboardEvent } from "react";

export type IdInputValue = [string, string];

const soloDigitos = (v: string) => v.replace(/\D+/g, "").slice(0, 3);

interface IdInputProps {
  value: IdInputValue;
  onChange?: (value: IdInputValue) => void;
  readOnly?: boolean;
  invalid?: boolean;
  /** Posición del conjunto (centro vertical = top + 77). */
  top: number;
  autoFocus?: boolean;
}

/** El ID 321-321: dos casillas de 3 dígitos con el guion en medio, como en el diseño. */
export function IdInput({ value, onChange, readOnly = false, invalid = false, top, autoFocus }: IdInputProps) {
  const refB = useRef<HTMLInputElement>(null);
  const refA = useRef<HTMLInputElement>(null);
  const clase = `id-box${invalid ? " is-invalid" : ""}${readOnly ? " id-box--value" : ""}`;

  if (readOnly) {
    return (
      <div className="id-code" style={{ top }}>
        <output className={clase}>{value[0]}</output>
        <span className="id-dash">-</span>
        <output className={clase}>{value[1]}</output>
      </div>
    );
  }

  const cambiar = (indice: 0 | 1, texto: string) => {
    const limpio = soloDigitos(texto);
    const nuevo: IdInputValue = indice === 0 ? [limpio, value[1]] : [value[0], limpio];
    onChange?.(nuevo);
    if (indice === 0 && limpio.length === 3) refB.current?.focus();
  };

  const alBorrar = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[1]) refA.current?.focus();
  };

  return (
    <div className="id-code" style={{ top }}>
      <input ref={refA} className={clase} inputMode="numeric" maxLength={3} placeholder="321" autoFocus={autoFocus}
        aria-label="Primeros tres dígitos del ID" value={value[0]} onChange={(e) => cambiar(0, e.target.value)} />
      <span className="id-dash">-</span>
      <input ref={refB} className={clase} inputMode="numeric" maxLength={3} placeholder="321"
        aria-label="Últimos tres dígitos del ID" value={value[1]} onChange={(e) => cambiar(1, e.target.value)} onKeyDown={alBorrar} />
    </div>
  );
}
