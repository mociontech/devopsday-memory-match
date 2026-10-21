import { shuffle } from "./shuffle";

/**
 * Textos del popup que aparece al acertar una pareja (12 variantes del diseño, "Posicionate"). No están atados a
 * una pareja concreta: se reparten al azar y sin repetir dentro de una partida.
 */
export const POPUP_TEXTS: string[] = [
  "Diseñamos experiencias que se pueden medir",
  "DataHub junta todos tus datos en un solo tablero",
  "Pulse, la capa de inteligencia que corre debajo de cada experiencia",
  "Mocion y DevOps: código y experiencia, juntos",
  "Donde hay tecnología, Mocion crea la experiencia",
  "DevOps automatiza procesos, Mocion mide la experiencia",
  "De un stand a una decisión de negocio",
  "Con oficinas en Colombia, México y Estados Unidos",
  "Tecnología, juego e interacción en el mismo lugar",
  "DevOps conecta equipos. Mocion conecta personas",
  "Integración continua entre personas, datos y tecnología",
  "Aquí la tecnología se juega, se mide y se vive",
];

/** Baraja nueva por partida: cada acierto toma el siguiente texto, así no se repite ninguno. */
export function buildPopupDeck(): string[] {
  return shuffle(POPUP_TEXTS);
}
