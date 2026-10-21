// Todo lo de src/assets/images pasa por Vite (hash en el nombre, empaquetado). Se pide por nombre de archivo.
const urls = import.meta.glob("./images/*", { eager: true, query: "?url", import: "default" }) as Record<string, string>;

export function img(name: string): string {
  const url = urls[`./images/${name}`];
  if (!url) throw new Error(`Asset no encontrado: ${name}`);
  return url;
}

/**
 * Fuerza la descarga y el decode de las imágenes del tablero apenas arranca la app, para que el primer
 * volteo de cada carta no espere a la red (el wifi de un stand suele estar congestionado).
 */
export function preloadAssets(names: string[]): void {
  for (const name of names) {
    const image = new Image();
    image.src = img(name);
    void image.decode?.().catch(() => {});
  }
}
