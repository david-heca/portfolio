# CLAUDE.md

Solo lo que **no** se deduce leyendo el código: invariantes, restricciones y porqués que costaría redescubrir. Si algo se puede verificar abriendo un archivo, sobra aquí.

## Stack

Astro estático con CSS propio sobre Cloudflare Workers, con `pnpm`. Sin React, sin islands, sin tests, sin linter.

**La portada es una landing por idioma; el sitio no.** Dentro de la landing se navega por anclas. Fuera está `/notes/`, que es una ruta real: el texto largo es la única razón por la que el sitio deja de ser un CV, y no cabe en una landing.

- **La prosa larga vive en `src/content/`, nunca en `src/i18n/locales/`.** El locale es para etiquetas de UI; su lookup por dot-path y el tipado contra `es` sirven para eso y convertirían un caso de dos mil palabras en un muro de strings escapados.
- **La ruta no se traduce, ni el segmento ni el slug** -`/notes/rag-eval` y `/en/notes/rag-eval`-. Traducirla obligaría a un mapa de rutas junto a `localizePath()`, o sea la segunda copia del mapeo que acaba divergiendo.
- **Una entrada se publica solo si existe en los dos idiomas**; `localizedEntries()` esconde la que va sola. Media traducción deja el hreflang apuntando a una página que el build no emitió.

## Bilingüe - ES en `/`, EN en `/en/`

- **Ningún texto visible se escribe en un componente**, ni siquiera un `alt`: todo sale de `src/i18n/locales/`.
- **`localizePath()`, `getHome()` y `otherLang()` son la única implementación del mapeo es↔en.** Las comparten el hreflang, el conmutador y el redirect por preferencia; una segunda copia acabaría divergiendo en la barra final.
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
- **La página tiene armazón visible, y no es decoración.** Dos filos verticales en `.page` marcan la caja del contenido; cada sección cierra con una línea que se sale del contenedor hasta el borde de la pantalla. Los verticales caen en el **borde exterior** del contenedor, no donde arranca el texto: así el `--pad` de la columna es además el aire entre la línea y la letra, y no hace falta un hueco aparte. Si dejaran de derivar del contenedor, sobran -una rejilla que no mide nada es adorno-.
- **Nada flota por encima del armazón.** El navbar es una barra a todo el ancho con su filo, no una isla redondeada. Las esquinas van a escuadra (`--radius` y `--radius-sm` en 0): una foto redondeada es lo único que no puede alinearse contra una recta. Se salvan los círculos que son puntos -`.dot`, viñetas, el hito del eje de formación-.
- **«Por dónde vas» y «dónde estás» no son el mismo estado.** El spy de la portada -`.active`, que cambia en cada scroll- solo sube el enlace de gris a tinta; no mueve ni pinta nada más, o el nav se convierte en un semáforo. Estar en una ruta -`[aria-current="page"]`- sí es un hecho, y se marca invirtiendo el enlace, que es el mismo gesto que la acción primaria. Darles la misma señal fue el error que hubo que deshacer.
- **Las primitivas viven en `global.css`; el layout de cada sección, en su `<style>` scoped.** Un patrón que aparece en tres sitios ya es una primitiva.
- **La paleta no tiene tono.** Blanco puro, negro puro y grises neutros; ni un `#rrggbb` con color en todo el sitio. Un fondo teñido es lo que hace que una página converja con el gusto de su año, y no hay tinte que no envejezca. **No introducir un acento de color**: si algo no se distingue, le falta peso, espacio o subrayado, no color.
- **Solo dos tintas llevan texto.** `--color-ink` para títulos, el valor principal de un bloque y los enlaces; `--color-ink-2` para toda la prosa secundaria, meta, fechas y `.label`. **`--color-ink-3` no pinta texto nunca**: da ~2:1 de contraste y está calibrado para viñetas, hairlines e iconos en reposo. Si un texto necesita bajar de tono, ya está en ink-2; lo que necesita es menos cuerpo, no menos tinta.
- **`--color-accent` existe pero vale tinta.** Se mantiene para que los hover sigan siendo un salto de gris a negro con una sola declaración. Las variantes translúcidas derivan con `color-mix`; no se declaran a mano.
- **Un enlace sin subrayado no se ve.** Sin tono que lo separe del texto, el subrayado es lo único que lo señala. Vale la inversión -fondo tinta, texto papel- para la acción primaria.
- **El serif no titula: firma.** `--font-display` aparece en dos sitios de todo el sitio -el wordmark del nav y el `<em>` de `about.heading`- y en ninguno lleva el peso de un titular; los títulos son la sans a `--weight-medium`. Repartida por las secciones, la italic dejaba de significar énfasis y se leía como plantilla, con el copy escrito para llenar el hueco -«Hablemos *ahora*»- en vez de al revés. Por eso los locales ya no tienen clave para la mitad en italic: sin hueco, el patrón no puede volver.
- **Lo más grande de la portada es la tesis, no el nombre.** El `h1` sigue siendo el nombre, porque el nivel de encabezado dice de quién va la página y el cuerpo de letra dice qué mirar primero; son preguntas distintas y no tienen por qué contestarse igual.
- **Ninguna sección lleva etiqueta en versalitas sobre el título.** La única que queda es la ubicación del hero, que es un dato y no un rótulo. Sobre un título es autoridad editorial prestada, y estaba en 8 de 8.
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
