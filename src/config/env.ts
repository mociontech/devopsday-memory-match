/**
 * Configuración del despliegue. Solo las variables con prefijo VITE_ llegan al navegador, así que aquí no
 * puede haber claves ni tokens: Evius y la base de datos se hablan únicamente desde la función de servidor
 * (ver ../backend), nunca desde el kiosko.
 */

function readOptional(key: string): string | undefined {
  const value = import.meta.env[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export const env = {
  apiUrl: readOptional("VITE_API_URL") ?? "https://jvhxghykvifkggekcdvi.supabase.co/functions/v1/api",
  kioskId: readOptional("VITE_KIOSK_ID") ?? "unknown",
};

/** Clave de esta experiencia en la base de datos compartida. */
export const EXPERIENCE = "memory" as const;
