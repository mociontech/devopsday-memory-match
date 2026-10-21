import { useEffect } from "react";
import { FlowProvider, useFlow } from "./FlowMachine";
import { preloadAssets } from "../assets";
import { Stage } from "../components/Stage";
import { SecretResetZone } from "../components/SecretResetZone";
import { IDLE_TIMEOUT_MS } from "../game/game.config";
import { PAIRS } from "../game/pairs";
import { useIdleReset } from "../hooks/useIdleReset";
import { Game } from "../screens/Game";
import { IdGenerated } from "../screens/IdGenerated";
import { Instructions } from "../screens/Instructions";
import { Register } from "../screens/Register";
import { RegisterId } from "../screens/RegisterId";
import { Result } from "../screens/Result";
import { Welcome } from "../screens/Welcome";
import { iniciarEnvioEvius } from "../services/evius";
import { initOutboxFlush } from "../services/outbox";

/**
 * Blocks the two gestures CSS alone can't stop on a public kiosk: the
 * right-click/long-press context menu and pinch-to-zoom (Safari's
 * non-standard `gesturestart` plus a synthetic pinch via multi-touch).
 */
function useKioskGestureLock(): void {
  useEffect(() => {
    const blockContextMenu = (event: Event) => event.preventDefault();
    const blockGesture = (event: Event) => event.preventDefault();
    const blockPinch = (event: TouchEvent) => {
      if (event.touches.length > 1) event.preventDefault();
    };

    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("gesturestart", blockGesture);
    document.addEventListener("touchmove", blockPinch, { passive: false });

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("gesturestart", blockGesture);
      document.removeEventListener("touchmove", blockPinch);
    };
  }, []);
}

function CurrentScreen() {
  const { screen, session } = useFlow();
  switch (screen) {
    case "welcome":
      return <Welcome />;
    case "register":
      return <Register />;
    case "registerId":
      return <RegisterId />;
    case "idGenerated":
      return <IdGenerated />;
    case "instructions":
      return session.id ? <Instructions /> : <Welcome />;
    case "game":
      return session.id ? <Game /> : <Welcome />;
    case "result":
      return <Result />;
  }
}

function AppShell() {
  const { reset } = useFlow();
  useIdleReset(reset, IDLE_TIMEOUT_MS);
  useKioskGestureLock();
  useEffect(() => initOutboxFlush(), []);
  useEffect(() => iniciarEnvioEvius(), []);
  // Arranca en el mismo instante que Welcome (no espera a llegar a Game): así el primer volteo de cada carta no espera a la red.
  useEffect(() => preloadAssets(["card-m-back.svg", ...PAIRS.map((p) => p.art.img)]), []);

  return (
    <Stage>
      <CurrentScreen />
      <SecretResetZone onTrigger={reset} />
    </Stage>
  );
}

/** App root: wires the flow state machine and kiosk hardening. */
export function App() {
  return (
    <FlowProvider>
      <AppShell />
    </FlowProvider>
  );
}
