/**
 * Single source of truth for the board size and game rules. Changing
 * PAIRS_COUNT reconfigures the grid, shuffle, and scoring ceiling with no
 * other file needing to change.
 */

/** Número de parejas. El diseño (Figma, JUEGO) muestra 12 cartas: 6 parejas en un tablero de 3 columnas × 4 filas. */
export const PAIRS_COUNT = 6;

/** Columnas del tablero según el diseño (3×4). */
export const GRID_COLUMNS = 3;

/** How long both cards of a wrong guess stay face-up before flipping back. */
export const MISMATCH_DELAY_MS = 800;

/** How long one card's drop-into-place animation takes, on intro. */
export const CARD_DROP_DURATION_MS = 500;

/** Stagger between each card's drop start, so they fall in one after another instead of all at once. */
export const CARD_DROP_STAGGER_MS = 40;

/** How long the board stays face-up, showing every card, before the intro ends and cards flip back down to start play. */
export const INTRO_REVEAL_DURATION_MS = 1200;

/** Puntaje máximo de una partida perfecta (todas las parejas, sin errores). Va a la base como `puntaje` (0-100). */
export const MAX_SCORE = 100;

/** Cada pareja vale lo mismo y juntas suman MAX_SCORE. */
export const POINTS_PER_MATCH = MAX_SCORE / PAIRS_COUNT;

/**
 * Un error resta puntos: sin penalización, una partida sin errores no se distinguiría en dificultad de una con
 * una docena, y el puntaje perfecto se lograría por fuerza bruta. Aprox. una cuarta parte del valor de una pareja.
 */
export const PENALTY_PER_MISMATCH = 4;

/** Tiempo de inactividad tras el cual el kiosko vuelve a la bienvenida. */
export const IDLE_TIMEOUT_MS = 60_000;
