/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Evius (Datahub). Sin ellas el envío a Evius queda apagado. */
  readonly VITE_EVIUS_URL?: string;
  readonly VITE_EVIUS_TOKEN?: string;
  readonly VITE_EVIUS_EVENT_ID?: string;
  readonly VITE_EVIUS_EXPERIENCE_ID?: string;
  readonly VITE_EVIUS_SOURCE?: string;
  /** URL de la función de servidor (API compartida del evento). Hay un valor por defecto en config/env.ts. */
  readonly VITE_API_URL: string;
  /** Identificador de este tótem, solo para diagnóstico. */
  readonly VITE_KIOSK_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
