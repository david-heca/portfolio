# CLAUDE.md

Solo lo que **no** se deduce leyendo el código: invariantes, restricciones y porqués que costaría redescubrir. Si algo se puede verificar abriendo un archivo, sobra aquí.

## Stack

Astro estático con CSS propio sobre Cloudflare Workers, con `pnpm`. Sin React, sin islands, sin tests, sin linter.

Todo el sitio es **una landing por idioma** y la navegación es por anclas, no por rutas. Necesitar una subruta es señal de que algo no encaja en el modelo, no permiso para crearla.

## Bilingüe - ES en `/`, EN en `/en/`

- **Ningún texto visible se escribe en un componente**, ni siquiera un `alt`: todo sale de `src/i18n/locales/`.
- **`localizePath()` y `getHome()` son la única implementación del mapeo es↔en.** Las comparten el hreflang, el conmutador y el redirect por preferencia; una segunda copia acabaría divergiendo en la barra final.
- **Las URLs internas de inglés llevan barra final** (`/en/`): es la forma que emite el build, la del canonical y la del sitemap. Sin ella aparecen redirects y el hreflang deja de casar.
- **El idioma viaja por prop desde la página, nunca se deduce de la URL en un componente.** Dos fuentes de verdad para el mismo dato es como se cuelan las páginas medio traducidas.
- **La autodetección propone, no redirige.** Redirigir según `navigator.languages` saca a los rastreadores de `/`, que es el canonical y el x-default. El único redirect admisible exige una preferencia que el usuario haya elegido a mano.

## Páginas y `<head>`

- **El 404 es una página por idioma con el `lang` hardcodeado.** El build congela cada HTML, así que derivar el idioma de la URL devolvería siempre el de por defecto.
- Fuera de la landing, el `Navbar` emite sus anclas en absoluto: en una página sin secciones no llevan a ninguna parte.
- Todo el `<head>` -canonical, hreflang, Open Graph, JSON-LD- sale de `Layout`. **No añadir `<meta name="googlebot">`**: para Googlebot tiene prioridad sobre `robots`, así que un `index` ahí anula cualquier `noindex`.
- **Los scripts inline de `<head>` no se reejecutan al hacer swap** de View Transitions. Lo que deba sobrevivir a una navegación -la clase `.dark`, que se aplica antes del paint- se copia en el handler de `astro:before-swap`.

## Diseño

- **Token-driven.** Para reajustar el look se editan variables en `global.css`, nunca componentes. Un valor literal dentro de un `<style>` scoped es un token que falta.
- **Las primitivas viven en `global.css`; el layout de cada sección, en su `<style>` scoped.** Un patrón que aparece en tres sitios ya es una primitiva.
- **Un solo acento.** Las variantes translúcidas derivan con `color-mix`; no se declaran a mano.
- **Solo tres colores llevan texto.** `--color-ink` para títulos y el valor principal de un bloque; `--color-ink-2` para toda la prosa secundaria, meta, fechas y `.label`; `--color-accent` para kickers, `.status`, los `em` de los títulos y los hover. **`--color-ink-3` no pinta texto nunca**: da ~2:1 de contraste y está calibrado para viñetas, hairlines e iconos en reposo. Si un texto necesita bajar de tono, ya está en ink-2; lo que necesita es menos cuerpo, no menos tinta.
- **El serif es la excepción.** `--font-display` marca solo los dos niveles altos de la jerarquía; por debajo va la sans. Si la italic baja al nivel de card deja de significar énfasis y la página se satura.
- **Un rol por tipografía.** Display para titulares; `--font-text` para leer y para la UI; `--font-mono` solo para etiquetas en mayúsculas con tracking, tags y cifras. Lo que se lee como frase va en la sans aunque contenga números.
- **Los tamaños display salen de los tokens `--display-*`** y pasan por `.section-title` para heredar el tracking que los distingue. `--display-size` es el hook por instancia, no permiso para escribir un `clamp` nuevo; `--display-leading` sí es óptico.
- **`--weight-medium` es solo para la sans.** La mono se carga en un único peso estático, así que aplicárselo da negrita sintética del navegador.
- **El ritmo va en rejilla de 4px; la forma no.** `gap` y `margin` -el espacio *entre* elementos- son múltiplos de 4. El `padding` de algo con fondo, borde o radio es **forma**: está calibrado contra el texto que envuelve, y llevarlo a rejilla cambia la silueta del control, no lo unifica. Un `padding` sobre un bloque pelado sí es ritmo y sí va en rejilla.
- Lo que se sale de la rejilla por alineación óptica lleva comentario diciéndolo. Sin esa nota, el siguiente que pase lo "arregla".
- Una sola acción primaria por vista; el resto en `.btn--ghost`.
- Iconos Phosphor monocromáticos, heredando `currentColor`. **Nunca un glifo como icono** (`↗`, `→`): algunos navegadores los resuelven contra una fuente de emoji.
- Imágenes en WebP. Toda animación respeta `prefers-reduced-motion`.
- Antes de añadir decoración, agotar el espacio y la jerarquía.

## Código

- **Comentar solo lo no obvio, y comentar la restricción, no la historia.** Un comentario explica por qué el código tiene que ser así; nunca cuenta qué se probó antes ni cuándo se cambió.
- `src/components/sections/` son bloques de la landing; `src/components/ui/`, chrome reutilizable en cualquier página. Importar siempre por alias, no con rutas relativas que suban de carpeta.
- **El `<header>` se reemplaza en cada navegación; `document` y `window` no.** Un listener sobre el elemento se registra en su `setup()` con guarda `dataset.ready`; uno sobre `document` se registra una sola vez a nivel de módulo. Mezclarlos acumula listeners en cada navegación.
- **`astro:page-load` también dispara en la carga inicial**, así que todo `setup()` corre dos veces de salida: tiene que ser idempotente. La llamada directa no sobra -sin ella el efecto esperaría al evento `load`-; lo que hace falta es la guarda.
- Un `cleanup()` va antes de cualquier `return` temprano, no después: si la página nueva no tiene lo que el script busca es justo cuando más hace falta soltar lo de la anterior.
