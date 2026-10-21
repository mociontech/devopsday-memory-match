import type { ButtonHTMLAttributes } from "react";

type Tone = "dark" | "pink";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: Tone;
  left: number;
  top: number;
  width?: number;
  height?: number;
}

/** Botón del diseño: píldora oscura (acciones del flujo) o rectángulo rosa (llamado a la acción de la bienvenida). */
export function Button({ tone = "dark", left, top, width = 684, height = 133, className = "", style, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={`btn btn--${tone} ${className}`}
      style={{ left, top, width, height, ...style }}
      {...rest}
    />
  );
}
