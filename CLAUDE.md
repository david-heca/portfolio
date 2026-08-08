# CLAUDE.md

Reglas para trabajar en este repositorio.

Documenta lo que **no** se deduce leyendo el código: invariantes, restricciones y los porqués que costaría redescubrir. El inventario -qué secciones existen, qué primitivas hay en `global.css`, qué aliases define `tsconfig.json`- se lee del código. Si algo de aquí se puede verificar abriendo un archivo, sobra.

## Comandos

```bash
pnpm dev       # localhost:4321
pnpm build     # /dist
pnpm preview
pnpm deploy    # build + wrangler
```

## Stack

Astro 7 estático con CSS propio, desplegado en Cloudflare Workers. Sin React, sin islands, sin tests, sin linter.

Todo el sitio es **una landing por idioma** y la navegación es por anclas, no por rutas. Necesitar una subruta es señal de que algo no encaja en el modelo, no permiso para crearla. `src/config.ts` enciende y apaga secciones: apagar una la quita de la landing y del nav a la vez.

## Bilingüe - ES en `/`, EN en `/en/`

- Traducciones en `src/i18n/locales/{es,en}.json`; `useTranslations(lang)` devuelve `t<T>()` con notación de punto. Las claves con HTML inline se renderizan con `set:html`. **Ningún texto visible se escribe en un componente**, ni siquiera un `alt`.
- **`localizePath()` es la única implementación del mapeo es↔en**, y `getHome()` la única de la portada por idioma. Las usan el hreflang, el conmutador y el redirect por preferencia; una segunda copia acabaría divirgiendo en la barra final.
- **Las URLs internas de inglés llevan barra final** (`/en/`). Es la forma que emite el build, la del canonical y la del sitemap; sin ella aparecen redirects y el hreflang deja de casar.
- **El idioma viaja por prop desde la página, nunca se deduce de la URL en un componente.** Dos fuentes de verdad para el mismo dato es como se cuelan las páginas medio traducidas.
- **La autodetección propone, no redirige.** Redirigir según `navigator.languages` saca a los rastreadores de `/`, que es el canonical y el x-default. El único redirect admisible exige una preferencia que el usuario haya elegido a mano.

## 404

- **Una página por idioma, con el `lang` hardcodeado.** El build congela cada HTML, así que derivar el idioma de la URL devolvería siempre el de por defecto.
- Cloudflare sirve el `404.html` **más cercano** al path pedido, pero Astro escribe las rutas anidadas como `404/index.html`. La integración `nested-404` de `astro.config.ts` las renombra al terminar el build; sin ese paso el 404 traducido no se encuentra nunca.
- Fuera de la landing, el `Navbar` emite sus anclas en absoluto: en una página sin secciones, `#about` no lleva a ninguna parte.

## SEO

- `Layout` centraliza canonical, hreflang, Open Graph, Twitter Cards y JSON-LD. Acepta `noindex` para lo que no es contenido indexable.
- **No añadir `<meta name="googlebot">`.** Para Googlebot tiene prioridad sobre `robots`, así que un `index` ahí anula cualquier `noindex`.

## Temas

La clase `.dark` se aplica en `<html>` **antes del paint** y se preserva entre View Transitions con `astro:before-swap`. Los scripts inline de `<head>` no se reejecutan al hacer swap: lo que deba sobrevivir a una navegación se copia en ese handler.

## Diseño

- **Token-driven.** Para reajustar el look se editan variables en `global.css`, nunca componentes. Un valor literal dentro de un `<style>` scoped es un token que falta.
- **Un solo acento.** Las variantes translúcidas derivan con `color-mix`; no se declaran a mano.
- **El serif es la excepción.** `--font-display` (Junicode italic) marca solo los dos niveles altos de la jerarquía -el título de sección y su divisor-. Por debajo va `.card-title`, en sans. Si la italic baja al nivel de card deja de significar énfasis y la página se satura.
- **Un rol por tipografía.** Display para titulares; `--font-text` para leer y para la UI; `--font-mono` solo para etiquetas en mayúsculas con tracking, tags y cifras. Lo que se lee como frase va en la sans aunque contenga números.
- **Las primitivas viven en `global.css`; el layout de cada sección, en su `<style>` scoped.** Un patrón que aparece en tres sitios ya es una primitiva.
- **Solo tres colores llevan texto.** `--color-ink` para títulos y el valor principal de un bloque; `--color-ink-2` para toda la prosa secundaria, meta, fechas y `.label`; `--color-accent` para kickers, `.status`, los `em` de los títulos y los hover. **`--color-ink-3` no pinta texto nunca**: da ~2:1 de contraste y está calibrado para viñetas, hairlines e iconos en reposo. Si un texto necesita bajar de tono, ya está en ink-2; lo que necesita es menos cuerpo, no menos tinta.
- **El tier display se elige entre los cinco tokens `--display-*`.** `--display-size` es el hook por instancia, no permiso para escribir un `clamp` nuevo: toda la display pasa por `.section-title` para heredar el `--track-tight` que la distingue. `--display-leading` sí es óptico y se ajusta por instancia.
- **`.lead` y `.card-title` comparten cuerpo a propósito**, y por eso comparten token. Separarlos en dos tamaños a 1px de distancia no crea jerarquía: la crean el peso y el color.
- **`--weight-medium` es solo para la sans.** La mono se carga en un único peso estático, así que aplicárselo da negrita sintética del navegador.
- El kicker del hero es el único en gris: en acento competiría con el nombre que tiene debajo. Volver a la norma es borrar ese `color`.
- **No hay linter que atrape un token mal escrito.** Un `var(--typo)` no falla el build: la propiedad se vuelve `unset` y **hereda** en silencio. Tras tocar tokens, correr el `comm` de abajo; solo deben salir los hooks conocidos (`--display-size`, `--display-leading`) y las variables que pone el JS del tema (`--theme-x/y/r`).

  ```bash
  comm -13 <(grep -oE '^\s*--[a-z0-9-]+' src/styles/global.css | tr -d ' ' | sort -u) \
           <(grep -ohrE 'var\(--[a-z0-9-]+' src/ | sed 's/var(//' | sort -u)
  ```
- Una sola acción primaria por vista; el resto en `.btn--ghost`.
- Iconos Phosphor en peso regular vía `astro-icon`, monocromáticos, heredando `currentColor`. **Nunca un glifo como icono** (`↗`, `→`): algunos navegadores los resuelven contra una fuente de emoji.
- Imágenes en WebP. Toda animación respeta `prefers-reduced-motion`.
- Antes de añadir decoración, agotar el espacio y la jerarquía.

## Código

- **Comentar solo lo no obvio, y comentar la restricción, no la historia.** Un comentario explica por qué el código tiene que ser así; nunca cuenta qué se probó antes ni cuándo se cambió.
- `src/components/sections/` son bloques de la landing; `src/components/ui/`, chrome reutilizable en cualquier página; `src/components/`, lo que no es ni una cosa ni la otra.
- Importar siempre por alias, no con rutas relativas que suban de carpeta.
- **El `<header>` se reemplaza en cada navegación; `document` y `window` no.** Un listener sobre el elemento se registra en su `setup()` con guarda `dataset.ready`; uno sobre `document` se registra una sola vez a nivel de módulo. Mezclarlos acumula listeners en cada navegación.
- **`astro:page-load` también dispara en la carga inicial**, así que todo `setup()` corre dos veces de salida: tiene que ser idempotente. La llamada directa no sobra -sin ella el efecto esperaría al evento `load`-; lo que hace falta es la guarda.
- Un `cleanup()` va antes de cualquier `return` temprano, no después: si la página nueva no tiene lo que el script busca es justo cuando más hace falta soltar lo de la anterior.

## Junicode

Se autoaloja en `public/assets/fonts/` (OFL, no está en Fontsource). Para regenerarlo desde el VF de `psb1558/Junicode-font`: **subsetear con `pyftsubset` primero y fijar los ejes con `varLib.instancer` después** - en el orden inverso el GSUB completo desborda al guardar. Se fijan `wdth` y `ENLA`, se conserva `wght` variable y solo se retienen las features `kern,liga`.
