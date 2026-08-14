---
title: "Connie"
summary: "A RAG platform over a company's databases, PDFs and spreadsheets that answers citing where each figure came from. I designed it from scratch and wrote 80% of the system."
role: "Design + 80% of the code"
year: "2025"
status: "production"
tags: ["RAG", "MCP", "Azure", "Python", "SQL"]
cover: "/assets/projects/connie.webp"
project: "connie"
draft: true
---

Connie answers questions in plain Spanish about a company's internal data and cites the source of
every figure. Three clients of a consultancy use it daily, each over their own systems. I designed
it from scratch and wrote around 80% of the code.

## The real constraint

The hard part is almost never the model. It was the input: databases nobody documented, scanned
PDFs, and spreadsheets with fifteen tabs — every client with their own, none of them alike.

> **To fill in.** Describe the worst concrete case you hit. A PDF that was a photo of a table. A
> database with column names in three languages. A sheet where the good data lived in a merged
> cell. The more specific, the less this reads like any other RAG case.

## What I tried first and why it broke

> **To fill in.** The first chunking you built and what happened when you put it against the real
> documents. This is where the case stops being a README and becomes yours: nobody who hasn't sat
> in front of those files can write this paragraph.

## What I decided, and against what

> **To fill in.** The architecture decisions and the alternative you rejected for each one.
> Ingestion, chunking, retrieval, serving. Why MCP to connect the sources instead of bespoke glue
> code. What cost you more than you expected.

## How I evaluated it without a golden set

None of the clients had a labelled set of questions and answers, and none was going to build one.
Evaluating retrieval anyway is what separated this from a demo.

> **To fill in.** How you built retrieval evaluation from zero, how you versioned prompts and
> models, and what you looked at to know whether a change had made answers better or worse. This
> section carries the most weight: it's the part almost nobody has.

## What still doesn't work

> **To fill in.** The limits the platform still has and the cases where it fails. This section buys
> more credibility than all the others combined, and it's the one no generator writes.

<!-- Confidentiality: no client names, no client data, no proprietary code.
     "A financial consultancy with three clients" instead of naming them. Also check the cover
     screenshot for visible real data: the repository is public. -->
