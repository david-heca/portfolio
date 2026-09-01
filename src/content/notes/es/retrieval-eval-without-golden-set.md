---
title: "Evaluar retrieval cuando el cliente no tiene golden set"
summary: "Ningún cliente llega con las preguntas etiquetadas y casi ninguno las va a etiquetar. Cómo medir si el retrieval mejoró sin ese punto de partida."
date: 2026-08-26
tags: ["RAG", "Evaluación", "MLOps"]
draft: false
---

Ninguno de los clientes para los que armé un RAG tenía preguntas etiquetadas contra sus documentos,
y ninguno iba a ponerse a etiquetarlas. Etiquetar significa ocupar dos o tres días a la persona que
más sabe del negocio, y esa persona ya tiene trabajo.

Casi todo lo que se ha escrito sobre evaluación de retrieval arranca dando ese golden set por
hecho. Así fue como acabé midiendo sin él.

## Las preguntas que ya existen

Antes de generar nada busco dónde pregunta ya la gente: los tickets de soporte, el buzón del equipo
que hoy contesta esas dudas a mano, el buscador de la intranet y, en cuanto hay demo, sus propios
logs.

Esas preguntas traen el vocabulario de quien pregunta, que no es el del documento. Alguien escribe
«cuánto llevamos gastado en el proyecto X» y el documento dice «importe devengado acumulado». Medir
sobre ese hueco es medir lo que falla en producción.

Etiquetarlas sale barato porque no hace falta la respuesta: basta marcar qué documento -o qué
página- la contiene. Con cincuenta ya se calcula recall@k. ¿Entra el documento correcto en el
contexto? Si no entra, no hay prompt que lo arregle después.

## Generar el resto desde el corpus

Cuando no se juntan ni cincuenta, relleno al revés: tomo un fragmento del corpus, le pido a un
modelo la pregunta que ese fragmento contesta y ya tengo el par. Sale gratis y en cantidad, con un
sesgo grande encima: la pregunta se escribe con las palabras del fragmento, así que medir contra
ella es medir cuánto se parece un texto a sí mismo. Todo puntúa alto y el número se queda quieto
cuando debería moverse.

El sesgo se recorta pidiendo la pregunta como la escribiría alguien que no ha leído el documento
-en el registro del usuario real, con el nombre interno de las cosas- y descartando la que repite
literal un término poco frecuente del fragmento. Aun así lo uso como alarma: si un cambio hunde el
número, algo se rompió. Cuando sube, no me lo creo.

## Comparar dos versiones

Puntuar una respuesta del uno al cinco no me ha funcionado nunca. La misma persona no puntúa igual
el martes que el jueves, y dos personas no coinciden jamás.

Elegir entre dos aguanta mucho mejor. Congelo el conjunto de preguntas, genero las respuestas con
la configuración vieja y con la nueva, las pongo lado a lado sin decir cuál es cuál y quien juzga
elige. Uso un modelo de juez porque a mano nadie se relee el conjunto entero cada vez que muevo un
parámetro, y con el modelo el volumen deja de importar. Con la condición de revisar unos cuantos de
sus veredictos: si el juez no coincide conmigo en los casos fáciles, no voy a saber si lo que sube
es el sistema o su manía.

## Lo que hay que versionar

El conjunto de preguntas, congelado y en el repositorio. Los resultados, en el mismo commit que el
prompt, el modelo y los parámetros de chunking que los produjeron. Dos semanas después alguien
pregunta si aquello mejoró, y sin eso no hay con qué comparar.

Nada de esto es un golden set. Es lo que uso mientras no lo hay, que hasta ahora ha sido siempre.
