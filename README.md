# Memory Match — DevOps Days Bogotá 2026

Juego de memoria para tótem táctil vertical (1080×1920). React + Vite + TypeScript estricto.
Reemplaza el diseño de Mirage ("Kick and Match"): el código anterior sigue en el historial de git.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo en http://127.0.0.1:5504 (puerto fijo: coincide con `ALLOWED_ORIGINS` de la API) |
| `npm run build` | `tsc` (type-check estricto) + build de producción |
| `npm run preview` | Sirve el build de `dist/` |
| `npm run test` | Vitest (puntaje y lógica del tablero) |

## Flujo

```
welcome → register → idGenerated → instructions → game → result → welcome
              └─ "digitar ID código" → registerId ─┘   (acceso rápido)
```

- **Un ID por persona** (`321-321`), generado en el servidor y válido en todas las experiencias del evento.
  Quien ya se registró en VR, Láser Grafiti o Mega Control entra aquí con ese ID, sin volver a registrarse.
- **Una partida por persona.** Si el ID ya terminó Memory Match: «Parece que ya participaste en esta experiencia».
- **Sin ranking en esta app.** El ranking del evento sale de la base de datos (vista `ranking`).
- Los avisos (correo repetido, ID no encontrado, ya participaste) son un modal sobre la pantalla, como en el diseño.

## Juego

- 12 cartas: 6 parejas en un tablero de 3 columnas × 4 filas (`game/game.config.ts`).
- Sin cuenta regresiva: el tablero solo muestra los **intentos**; al final se muestra el tiempo que tomó la partida.
- **Puntaje (0-100):** cada pareja suma 100/6; cada error resta 4; mínimo 0. Es el `puntaje` que va a la base.
  Se redondea a entero (`game/scoring.ts`). _Pendiente de confirmar con quien defina el ranking._
- Al acertar una pareja aparece un popup con uno de los 12 textos del diseño (`game/popups.ts`), sin repetir en la partida.

## Datos y servidor

La base de datos se habla a través de la función de servidor del proyecto (`../backend`). **Evius se envía directo desde
la app** (`services/evius.ts`), en paralelo y en segundo plano, con las variables `VITE_EVIUS_*`: el token queda en el
código del navegador. Solo se envía si la persona se registró en este equipo (el acceso rápido no devuelve el correo).

| Acción | Llamada |
|---|---|
| Registro | `POST /registrar` |
| Acceso rápido | `GET /participante/:id?experiencia=memory` |
| Resultado de la partida | `POST /participacion` (idempotente: solo cuenta la primera vez) |

`services/outbox.ts` guarda el resultado en `localStorage` **antes** de depender de la red y lo reintenta en
segundo plano (1s/2s/4s/8s, al volver la conexión y cada 20 s), así que nadie queda bloqueado por un mal wifi.

**Requiere la migración `backend/supabase/migrations/20261021_003_memory_match.sql`** (agrega la experiencia
`memory`, la marca de "ya jugó" y el guardado del resultado). Sin ella, el registro y el resultado fallan.

## Variables de entorno (`.env`)

Solo `VITE_*` llega al navegador. Ver `.env.example`.

| Variable | Para qué |
|---|---|
| `VITE_API_URL` | URL de la función `api`. Tiene valor por defecto en `config/env.ts`. |
| `VITE_KIOSK_ID` | Identificador del tótem (diagnóstico). |
| `VITE_EVIUS_URL`, `VITE_EVIUS_TOKEN`, `VITE_EVIUS_EVENT_ID`, `VITE_EVIUS_EXPERIENCE_ID`, `VITE_EVIUS_SOURCE` | Evius (Datahub). Sin ellas el envío a Evius queda apagado. En Netlify, cargarlas como variables del sitio. |

## Tipografía y recursos

- Fuentes autohospedadas (`@fontsource`, solo subset latino): el kiosko no llama a Google Fonts en runtime.
  Figtree sustituye a Proxima Nova (sin licencia).
- Imágenes en `src/assets/images` (WebP al doble del tamaño en pantalla; el fondo suave viene recortado de Figma).
- `public/sw.js` guarda imágenes y fuentes en caché (cache-first) para el wifi congestionado del venue.

## Kiosco

Gestos bloqueados (menú contextual, zoom), reinicio por inactividad a los 60 s y una zona secreta arriba a la
derecha (5 toques) para que el staff saque a alguien de una pantalla trabada.

## Desviaciones del diseño

- El diseño trae los íconos de **correo** y **celular** intercambiados; cada campo lleva el que le corresponde.
- El unicornio de la carta (Figma lo estira a 96×165) conserva su proporción.
- El diseño muestra "Intentos: 11" y "1:05 TIME" como ejemplos; son valores reales de la partida.
