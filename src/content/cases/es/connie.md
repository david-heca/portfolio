---
title: "Connie"
summary: "Una plataforma RAG sobre las bases de datos, PDFs y hojas de cálculo de la empresa, que responde citando de dónde sacó cada dato. La diseñé desde cero y escribí el 80% del sistema."
role: "Diseño + 80% del código"
year: "2025"
status: "production"
tags: ["RAG", "MCP", "Azure", "Python", "SQL"]
cover: "/assets/projects/connie.webp"
project: "connie"
draft: true
---

Connie contesta preguntas en español sobre los datos internos de una empresa y cita la fuente de
cada cifra. Hoy la usan a diario tres clientes de una consultora, cada uno sobre sus propios
sistemas. La diseñé desde cero y escribí alrededor del 80% del código.

## La restricción real

La parte difícil casi nunca es el modelo. Era el dato de entrada: bases de datos que nadie
documentó, PDFs escaneados y hojas de cálculo con quince pestañas, cada cliente con las suyas y
ninguna parecida a la anterior.

> **Por rellenar.** Describe el peor caso concreto que te tocó. Un PDF que era una foto de una
> tabla. Una base con nombres de columna en tres idiomas. Una hoja donde el dato bueno estaba en
> una celda combinada. Cuanto más específico, menos se parece esto a cualquier otro caso de RAG.

## Qué probé primero y por qué se rompió

> **Por rellenar.** El primer chunking que montaste y qué pasó cuando lo pusiste contra los
> documentos reales. Aquí es donde el caso deja de ser un README y pasa a ser tuyo: nadie que no
> haya estado delante de esos archivos puede escribir este párrafo.

## Qué decidí y contra qué

> **Por rellenar.** Las decisiones de arquitectura y la alternativa que descartaste en cada una.
> Ingestión, chunking, retrieval, serving. Por qué MCP para conectar las fuentes en vez de glue
> code a medida. Qué te costó más de lo que esperabas.

## Cómo lo evalué sin conjunto dorado

Ninguno de los clientes tenía un conjunto de preguntas y respuestas etiquetado, ni iba a construir
uno. Evaluar el retrieval de todas formas fue lo que separó esto de una demo.

> **Por rellenar.** Cómo montaste la evaluación de retrieval partiendo de cero, cómo versionabas
> prompts y modelos, y qué mirabas para saber si un cambio había mejorado o empeorado las
> respuestas. Esta sección es la que más pesa: es la parte que casi nadie tiene.

## Qué sigue sin funcionar

> **Por rellenar.** Los límites que la plataforma sigue teniendo y los casos donde falla. Esta
> sección da más credibilidad que todas las anteriores juntas, y es la que ningún generador
> escribe.

<!-- Confidencialidad: sin nombres de cliente, sin datos suyos, sin código propietario.
     "Una consultora financiera con tres clientes" en vez de nombrarlos. Revisa además que
     la captura de portada no tenga datos reales visibles: el repositorio es público. -->
