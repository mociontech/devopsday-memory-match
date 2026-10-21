# Memory Match — DevOps Days Bogotá 2026

Juego de memoria para tótem táctil vertical (1080×1920). React + Vite + TypeScript estricto.
Reemplaza el diseño de Mirage ("Kick and Match"): el código anterior sigue en el historial de git.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo en http://127.0.0.1:5504 (puerto fijo; sirve también `/api/*`) |
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

## Servidor propio (`server/`)

Este proyecto es **autónomo**: trae su propio servidor y sus propias variables de entorno. Lo único compartido con las
otras experiencias es la **base de datos** (Supabase, mismas tablas); el código no se comparte, se replica.

- `server/registros.ts`: todo el acceso a datos (base + Evius). La experiencia (`memory`) es la única línea que cambia entre proyectos.
- `server/handler.ts`: la API (`POST /api/registrar`, `GET /api/participante/:id`, `POST /api/participacion`).
- El navegador solo habla con `/api/*` del mismo origen; **las claves nunca llegan al navegador**.
- El ID (`321-321`) lo genera la base. Un correo ya registrado devuelve el ID de esa persona (no se duplica).
- El acceso rápido devuelve solo el nombre. El servidor lee el contacto de la base y registra a la persona en Evius
  (`/attendees` y luego `/experiences`); si Evius falla, queda pendiente en la base y se reintenta con espera creciente.
- El resultado (`puntaje`, intentos, duración) lo guarda el servidor la primera vez; `services/outbox.ts` lo guarda en
  `localStorage` **antes** de depender de la red y lo reintenta en segundo plano (1s/2s/4s/8s, al volver la conexión y cada 20 s).
  A Evius sale solo cuando ya hay resultado.

Variables (`.env` local o panel del hosting; ver `.env.example`):

| Variable | Para qué |
|---|---|
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Base compartida. La clave de servicio (secret key) va **solo** en el servidor. |
| `EVIUS_MODE` | `live` activa el envío a Evius; con cualquier otro valor no se manda nada. |
| `EVIUS_URL`, `EVIUS_TOKEN`, `EVIUS_EVENT_ID`, `EVIUS_EXPERIENCE_ID`, `EVIUS_SOURCE` | Evius (Datahub). |

**Requiere** que la migración `backend/supabase/migrations/20261021_003_autonomo.sql` esté aplicada en Supabase.

**Despliegue en Netlify:** `netlify.toml` ya define el build; `netlify/functions/api.mts` sirve `/api/*` y
`netlify/functions/reintentar.mts` reintenta lo pendiente hacia Evius cada minuto. Carga las variables de la tabla en
*Site configuration → Environment variables*.

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
