# CLAUDE.md

Solo lo que **no** se deduce leyendo el código: invariantes, restricciones y porqués que costaría redescubrir. Si algo se puede verificar abriendo un archivo, sobra aquí.

## Stack

Astro estático con CSS propio sobre Cloudflare Workers, con `pnpm`. Sin React, sin islands, sin tests, sin linter.

**La portada es una página por idioma; el sitio no.** Fuera está `/notes/`, que es una ruta real: el texto largo es la única razón por la que el sitio deja de ser un CV, y no cabe en la portada. **La barra solo enlaza rutas reales.** La portada es una columna que se recorre sola; unas anclas con scrollspy fueron lo primero que sobró.

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
- Todo el `<head>` -canonical, hreflang, Open Graph, JSON-LD- sale de `Layout`. **No añadir `<meta name="googlebot">`**: para Googlebot tiene prioridad sobre `robots`, así que un `index` ahí anula cualquier `noindex`.
- **Los scripts inline de `<head>` no se reejecutan al hacer swap** de View Transitions. Lo que deba sobrevivir a una navegación -la clase `.dark`, que se aplica antes del paint- se copia en el handler de `astro:before-swap`.

## Diseño

- **Token-driven.** Para reajustar el look se editan variables en `global.css`, nunca componentes. Un valor literal dentro de un `<style>` scoped es un token que falta.
- **Una columna, y la columna es la medida.** `--container` es lo único que fija anchos: no hay rejillas de dos columnas, ni `max-width` en la prosa, ni fotos a sangre. Lo que no cabe en 640px se lista, no se maqueta. Las referencias son steipete.me, darioamodei.com y jakubantalik.com: texto, listas con fecha, un avatar y miniaturas.
- **El h1 es lo más grande, y no por mucho.** `--display` es el único cuerpo por encima del subhead y solo lo lleva el h1 de cada página. En una columna estrecha la jerarquía la ponen el peso y el aire, no el cuerpo. Un `clamp` nuevo es un token que falta.
- **Nada se sale de la columna** -salvo el aviso de idioma, que es una notificación, y el grano, que es el papel-. Sin armazón, sin líneas a sangre, sin marcas de registro, sin reveal al hacer scroll: cada cosa que había que sostener con un pseudoelemento era decoración. Las esquinas van a escuadra (`--radius` y `--radius-sm` en 0); se salvan las viñetas.
- **Los ornamentos son dos: la onda y el grano.** La onda es una pausa, no un borde: parte el hueco entre secciones y hace de `hr` en la prosa. El grano es una capa fija sobre todo -barra y avisos incluidos, como en una impresión-, nunca una textura por bloque. Los dos viven en `mask` para que la tinta siga siendo un token. Lo que es chrome -barra, pie, hairlines entre filas- sigue recto, y los enlaces también; una onda más -bajo un título, en el wordmark, bajo un enlace- la convierte en plantilla.
- **Cada dato vive en un sitio.** Los canales en el pie -es lo único que está en todas las páginas, y quien acaba una nota es quien busca dónde seguirte-, el correo en Contacto, el nombre en el h1 y el wordmark en el nav. Nada fijo ni flotante para los canales: en móvil se come la vista. Repetir un enlace «por si acaso» es lo que hacía que la página pareciera más larga de lo que es.
- **Las listas son la unidad, y una fila es un título y una línea.** `.rows`/`.row` es una fila de raíl más cuerpo con hairline entre filas; `.thumb` es la única caja para imagen y `--thumb` su único tamaño. Delante del título va una fecha en mono o una miniatura, y debajo una sola línea: sin fichas de specs, sin stack, sin estado, sin logros plegados. Lo que un elemento necesite contar de más va a una nota. **En Experiencia la fila es la empresa**, con el raíl midiendo el total y las etapas dentro sin hairline: una etapa por fila convertía tres años en una misma casa en tres trabajos. Un patrón que aparece en tres sitios ya es una primitiva, y vive en `global.css`.
- **El título de sección va solo.** Sin párrafo debajo que lo presente ni lo justifique: la lista es la descripción. Por eso `.section-title` lleva su propio margen y los locales no tienen `description` por sección.
- **Los iconos son lo que no es texto.** Phosphor monocromático heredando `currentColor`, y solo donde señalan algo: un canal, un dato, una flecha, un estado. **El glifo va en la tinta de su palabra**, sin regla de color propia; el control que es solo icono -tema, canales del pie, cerrar el aviso- va en ink-2 como una palabra de la barra. En ink-3 un icono se desvanece. **Al pasar, el icono de un canal o un control se inclina** (`--icon-tilt`) **y una flecha se desplaza** hacia donde apunta; nunca las dos cosas. **Nunca un glifo como icono** (`↗`, `→`): algunos navegadores los resuelven contra una fuente de emoji.
- **La barra es texto.** Sin píldoras ni fondos al pasar: `.nav-item` es una palabra en ink-2 que sube a tinta, y estar en la ruta -`[aria-current="page"]`- es quedarse en tinta. La inversión -fondo tinta, texto papel- es solo de la acción primaria.
- **La paleta no tiene tono, salvo la firma.** Blanco puro, negro puro y grises neutros; el único color del sitio es `--color-accent`, y vive en un solo sitio: el «herrera» del wordmark, el mismo que ya es el único con serif. Un fondo teñido es lo que hace que una página converja con el gusto de su año, y no hay tinte que no envejezca. **El acento no se reparte** -ni iconos, ni enlaces, ni estados-: repartido deja de ser firma y pasa a ser el primario de una plantilla, y sobre negro no da contraste de texto. Si algo no se distingue, le falta peso, espacio o subrayado, no color.
- **Solo dos tintas llevan texto.** `--color-ink` para títulos, el valor principal de un bloque y los enlaces; `--color-ink-2` para toda la prosa secundaria, meta, fechas y `.label`. **`--color-ink-3` no pinta texto ni iconos nunca**: da ~2:1 de contraste y está calibrado para viñetas, hairlines y la onda. Si un texto necesita bajar de tono, ya está en ink-2; lo que necesita es menos cuerpo, no menos tinta.
- **Un enlace sin subrayado no se ve.** Sin tono que lo separe del texto, el subrayado es lo único que lo señala, y es siempre raya recta: `.link` para el enlace de una línea -«ver todas», volver, el correo- y la nativa para el enlace dentro de la prosa. Vale la inversión -fondo tinta, texto papel- para la acción primaria.
- **El serif no titula: firma.** `--font-display` aparece en un solo sitio de todo el sitio -el wordmark del nav- y no lleva el peso de ningún titular; los títulos son la sans a `--weight-medium`. Repartida por las secciones, la italic dejaba de significar énfasis y se leía como plantilla, con el copy escrito para llenar el hueco -«Hablemos *ahora*»- en vez de al revés. Por eso los locales no tienen clave para una mitad en italic: sin hueco, el patrón no puede volver.
- **No hay etiquetas en versalitas**, ni sobre un título -es autoridad editorial prestada- ni dentro de una fila como clave de una ficha.
- **Un rol por tipografía.** Display para el wordmark; `--font-text` para leer y para la UI; `--font-mono` solo para el raíl de fechas y los tags de una nota. Lo que se lee como frase va en la sans aunque contenga números.
- **`--weight-medium` es solo para la sans.** La mono se carga en un único peso estático, así que aplicárselo da negrita sintética del navegador.
- **El ritmo va en rejilla de 4px; la forma no.** `gap` y `margin` -el espacio *entre* elementos- son múltiplos de 4. El `padding` de algo con fondo, borde o radio es **forma**: está calibrado contra el texto que envuelve, y llevarlo a rejilla cambia la silueta del control, no lo unifica. Un `padding` sobre un bloque pelado sí es ritmo y sí va en rejilla.
- Lo que se sale de la rejilla por alineación óptica lleva comentario diciéndolo. Sin esa nota, el siguiente que pase lo "arregla".
- Una sola acción primaria por vista; el resto en `.btn--ghost` o en `.link`.
- **Las fechas van en `src/data/`, en años, y el periodo se compone en el componente.** Así ES y EN no pueden decir fechas distintas, y el raíl mide lo mismo en todas las listas.
- Imágenes en WebP, importadas desde `src/assets/` para que el build emita la miniatura al tamaño que se pinta. Toda animación respeta `prefers-reduced-motion`.
- Antes de añadir decoración, agotar el espacio y la jerarquía.

## Código

- **Comentar solo lo no obvio, y comentar la restricción, no la historia.** Un comentario explica por qué el código tiene que ser así; nunca cuenta qué se probó antes ni cuándo se cambió.
- `src/components/sections/` son bloques de la landing; `src/components/ui/`, chrome reutilizable en cualquier página. Importar siempre por alias, no con rutas relativas que suban de carpeta.
- **El `<header>` se reemplaza en cada navegación; `document` y `window` no.** Un listener sobre el elemento se registra en su `setup()` con guarda `dataset.ready`; uno sobre `document` se registra una sola vez a nivel de módulo. Mezclarlos acumula listeners en cada navegación.
- **`astro:page-load` también dispara en la carga inicial**, así que todo `setup()` corre dos veces de salida: tiene que ser idempotente. La llamada directa no sobra -sin ella el efecto esperaría al evento `load`-; lo que hace falta es la guarda.
- Un `cleanup()` va antes de cualquier `return` temprano, no después: si la página nueva no tiene lo que el script busca es justo cuando más hace falta soltar lo de la anterior.
