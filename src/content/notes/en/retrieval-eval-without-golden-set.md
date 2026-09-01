---
title: "Evaluating retrieval when the client has no golden set"
summary: "No client arrives with the questions labelled, and almost none will label them. How to measure whether retrieval improved without that starting point."
date: 2026-08-26
tags: ["RAG", "Evaluation", "MLOps"]
draft: false
---

None of the clients I built a RAG system for had questions labelled against their documents, and
none was going to start labelling them. Labelling means taking two or three days from the person
who knows the business best, and that person already has a job.

Almost everything written about retrieval evaluation starts by assuming that golden set exists.
This is how I ended up measuring without it.

## The questions that already exist

Before generating anything I look for where people already ask: support tickets, the shared inbox
of the team answering those questions by hand today, the intranet search box and, once there is a
demo, its own logs.

Those questions carry the vocabulary of the person asking, which is not the document's. Someone
writes "how much have we spent on project X so far" and the document says "cumulative accrued
amount". Measuring across that gap is measuring what fails in production.

Labelling them is cheap because you don't need the answer: it's enough to mark which document - or
which page - contains it. Fifty of them are enough to compute recall@k. Does the right document
make it into the context? If it doesn't, no prompt fixes it afterwards.

## Generating the rest from the corpus

When I can't gather even fifty, I fill in backwards: take a chunk of the corpus, ask a model for
the question that chunk answers, and there's the pair. Free and in quantity, with a large bias on
top: the question gets written with the chunk's own words, so measuring against it measures how
much a text resembles itself. Everything scores high and the number sits still when it should move.

The bias shrinks if you ask for the question the way someone who hasn't read the document would
write it - in the real user's register, using the internal name for things - and drop any question
that repeats a rare term from the chunk verbatim. Even so I use it as an alarm: if a change sinks
the number, something broke. When it goes up, I don't believe it.

## Comparing two versions

Scoring an answer one to five has never worked for me. The same person doesn't score the same on
Tuesday as on Thursday, and two people never agree.

Picking between two holds up much better. I freeze the question set, generate the answers with the
old configuration and the new one, put them side by side without saying which is which, and let the
judge pick. I use a model as judge because by hand nobody rereads the whole set every time I move a
parameter, and with the model the volume stops mattering. On the condition of reviewing a few of
its verdicts myself: if the judge disagrees with me on the easy ones, I won't know whether what
went up is the system or its quirk.

## What has to be versioned

The question set, frozen and in the repository. The results, in the same commit as the prompt, the
model and the chunking parameters that produced them. Two weeks later someone asks whether that
improved, and without it there's nothing to compare against.

None of this is a golden set. It's what I use while there isn't one, which so far has been always.
