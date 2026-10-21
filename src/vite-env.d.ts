/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Identificador de este tótem, solo para diagnóstico. */
  readonly VITE_KIOSK_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
