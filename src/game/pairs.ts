/**
 * Las 6 parejas del tablero, tal como aparecen en el diseño (Figma, JUEGO). Cada carta mide 210×200 y su cara
 * es un fondo + un elemento gráfico; las coordenadas de `art` son relativas a la carta.
 */

export interface CardArt {
  /** Nombre del archivo en src/assets/images. */
  img: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface Pair {
  id: string;
  /** Texto accesible de la carta. */
  name: string;
  /** Fondo CSS de la cara. */
  background: string;
  art: CardArt;
}

export const PAIRS: Pair[] = [
  {
    id: "pulse",
    name: "Pulse",
    background: "linear-gradient(180deg, #5ed9d5 0%, #c1a9eb 47.6%, #efa7d5 100%)",
    art: { img: "card-p.svg", left: 64, top: 45, width: 106, height: 129 },
  },
  {
    id: "mocion",
    name: "Mocion",
    background: "#a81780",
    art: { img: "card-robot.webp", left: 44.5, top: 27, width: 121, height: 144 },
  },
  {
    id: "devy",
    name: "Devy",
    background: "linear-gradient(270deg, #b51579 0%, #4e2fc6 100%)",
    // Figma estira la imagen (cuadrada) a 96×165; aquí conserva su proporción para que no se deforme.
    art: { img: "card-devy.webp", left: 22, top: 18, width: 166, height: 166 },
  },
  {
    id: "devops",
    name: "DevOps Days",
    background: "#ffffff",
    art: { img: "card-devops.svg", left: 17, top: 61, width: 176.7, height: 78 },
  },
  {
    id: "evius",
    name: "Evius",
    background: "#00dad7",
    art: { img: "card-evius.webp", left: 47, top: 52, width: 113, height: 102 },
  },
  {
    id: "m",
    name: "Mocion M",
    background: "#1e1e1e",
    art: { img: "card-m-face.svg", left: 40, top: 41, width: 130, height: 118 },
  },
];
