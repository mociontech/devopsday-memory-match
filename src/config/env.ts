/**
 * Configuración del despliegue. Solo las variables con prefijo VITE_ llegan al navegador, así que aquí no
 * puede haber claves ni tokens: Evius y la base de datos se hablan únicamente desde el servidor
 * de este proyecto (carpeta server/), nunca desde el navegador.
 */

function readOptional(key: string): string | undefined {
  const value = import.meta.env[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export const env = {
  /** El servidor de este proyecto (función de Netlify o middleware de Vite) responde en el mismo origen. */
  apiUrl: "/api",
  kioskId: readOptional("VITE_KIOSK_ID") ?? "unknown",
};

