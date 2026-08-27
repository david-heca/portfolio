---
title: "Evaluar retrieval cuando el cliente no tiene conjunto dorado"
summary: "Ningún cliente llega con preguntas y respuestas etiquetadas, y casi ninguno va a construirlas. Cómo medir de todas formas si el retrieval mejoró."
date: 2026-08-26
tags: ["RAG", "Evaluación", "MLOps"]
draft: false
---

Ninguno de los clientes para los que he montado un RAG tenía un conjunto de preguntas y respuestas
etiquetado, y ninguno iba a construirlo. Construirlo significa sentar dos o tres días a la persona
que más sabe del negocio a escribir preguntas y marcar qué documento contesta cada una, y esa
persona ya tiene un trabajo.

La literatura de evaluación empieza justo donde yo no podía empezar: dando ese conjunto por hecho.
Lo que sigue es cómo llegué a medir sin él.

## Primero, las preguntas que ya existen

Antes de generar nada conviene buscar dónde pregunta ya la gente: los tickets de soporte, el correo
del equipo que hoy contesta esas dudas a mano, el buscador de la intranet y, en cuanto haya algo
que enseñar, el log de la propia demo.

Esas preguntas traen algo que ninguna pregunta sintética tiene: el vocabulario de quien pregunta,
que no es el del documento. Alguien escribe «cuánto llevamos gastado en el proyecto X» y el
documento dice «importe devengado acumulado». Ese hueco entre las dos formas de decirlo es
exactamente lo que estás evaluando.

Etiquetarlas sale más barato de lo que parece, porque no hace falta la respuesta: basta con marcar
qué documento -o qué página- la contiene. Con cincuenta preguntas marcadas así ya se puede medir
recall@k, que es la pregunta que importa. ¿Entra el documento correcto en el contexto? Si no entra,
no hay prompt que lo arregle después.

## Después, generar el resto desde el corpus

Cuando no se juntan ni cincuenta, se rellena al revés: coges un fragmento del corpus, le pides a un
modelo la pregunta que ese fragmento contesta, y ya tienes el par. Sale gratis y en cantidad.

Y sale sesgado. La pregunta se escribe con las palabras del fragmento, así que medir contra ella es
medir cuánto se parece un texto a sí mismo. Todo puntúa alto, ningún cambio parece empeorar nada y
el número se queda quieto cuando debería moverse.

Ayuda, a medias:

- Pedir la pregunta como la escribiría quien no ha leído el documento, en el registro del usuario
  real: corta, abreviada y con el nombre interno de las cosas.
- Descartar la pregunta que repite literal un término poco frecuente del fragmento.

A medias porque un conjunto sintético sirve para detectar que algo se ha roto, no para afirmar que
algo ha mejorado.

## Comparar dos versiones antes que puntuar una

Puntuar una respuesta del uno al cinco no aguanta: la misma persona no puntúa igual el martes que
el jueves, y dos personas no puntúan igual nunca.

Preguntar cuál de dos es mejor sí aguanta. Congelas el conjunto de preguntas, generas las
respuestas con la configuración vieja y con la nueva, las pones al lado sin decir cuál es cuál y
quien juzga elige. Yo uso un modelo de juez: a mano nadie se relee el conjunto entero cada vez que
toca un parámetro, y con el modelo el volumen deja de importar. Lo que sí hay que hacer es revisar
unos cuantos de sus veredictos: si el juez no coincide contigo en los casos fáciles, no vas a saber
si lo que sube es el sistema o su manía.

## Lo que hay que versionar

El conjunto de preguntas, congelado y en el repositorio. Los resultados, en el mismo commit que el
prompt, el modelo y los parámetros de troceado que los produjeron. Sin eso, «esto ha mejorado» no
se puede comparar con nada dentro de dos semanas, que es justo cuando alguien lo pregunta.

Nada de esto sustituye a un conjunto etiquetado por alguien que conozca el negocio. Sirve para no
depender de que llegue.
