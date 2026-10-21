/**
 * The kiosk flow is linear and closed (no browser back button, no manipulable
 * URLs), so screens are modeled as a state machine instead of routes.
 * Los avisos ("ya participaste", "no encontramos ese código") NO son pantallas:
 * son un modal sobre la pantalla desde la que se dispararon, como en el diseño.
 *
 *   welcome → register → idGenerated → instructions → game → result → welcome
 *   register → "digitar ID código" → registerId → instructions (acceso rápido)
 */
export type Screen = "welcome" | "register" | "registerId" | "idGenerated" | "instructions" | "game" | "result";

/** La persona de esta sesión: el ID lo genera el servidor y es el mismo en todas las experiencias. */
export interface Session {
  id: string;
  name: string;
}

export const EMPTY_SESSION: Session = { id: "", name: "" };

/** Outcome of the game itself, set once the board finishes and read by Result. */
export interface GameResult {
  /** 0-100 (sin redondear). */
  score: number;
  attempts: number;
  matchedPairs: number;
  durationMs: number;
}

export interface FlowState {
  screen: Screen;
  session: Session;
  result: GameResult | null;
}

export type FlowAction =
  | { type: "NAVIGATE"; screen: Screen }
  | { type: "SET_SESSION"; session: Partial<Session> }
  | { type: "SET_RESULT"; result: GameResult }
  | { type: "RESET" };

export const INITIAL_FLOW_STATE: FlowState = {
  screen: "welcome",
  session: EMPTY_SESSION,
  result: null,
};
