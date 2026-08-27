---
title: "Evaluating retrieval when the client has no golden set"
summary: "No client arrives with labelled questions and answers, and almost none will build them. How to measure whether retrieval improved anyway."
date: 2026-08-26
tags: ["RAG", "Evaluation", "MLOps"]
draft: false
---

None of the clients I've built a RAG system for had a labelled set of questions and answers, and
none was going to build one. Building it means sitting the person who knows the business best down
for two or three days to write questions and mark which document answers each one, and that person
already has a job.

The evaluation literature starts exactly where I couldn't: by assuming that set exists. What
follows is how I got to measuring without it.

## First, the questions that already exist

Before generating anything, it pays to look for where people already ask: support tickets, the
inbox of the team answering those questions by hand today, the intranet search box and, as soon as
there is something to show, the demo's own log.

Those questions carry something no synthetic question has: the vocabulary of the person asking,
which is not the document's. Someone writes "how much have we spent on project X so far" and the
document says "cumulative accrued amount". That gap between the two ways of saying it is exactly
what you are evaluating.

Labelling them is cheaper than it looks, because you don't need the answer: it's enough to mark
which document - or which page - contains it. Fifty questions marked that way are enough to measure
recall@k, which is the question that matters. Does the right document make it into the context? If
it doesn't, no prompt fixes it afterwards.

## Then, generate the rest from the corpus

When you can't gather even fifty, you fill in backwards: take a chunk of the corpus, ask a model
for the question that chunk answers, and there's your pair. Free, and in quantity.

And biased. The question gets written with the chunk's own words, so measuring against it measures
how much a text resembles itself. Everything scores high, no change appears to make anything worse,
and the number sits still when it should move.

It helps, halfway:

- Ask for the question the way someone who hasn't read the document would write it, in the real
  user's register: short, abbreviated, using the internal name for things.
- Drop any question that repeats a rare term from the chunk verbatim.

Halfway, because a synthetic set is good for detecting that something broke, not for claiming that
something improved.

## Compare two versions rather than score one

Scoring an answer one to five doesn't hold up: the same person doesn't score the same on Tuesday as
on Thursday, and two people never score the same at all.

Asking which of two is better does hold up. Freeze the question set, generate the answers with the
old configuration and the new one, put them side by side without saying which is which, and let the
judge pick. I use a model as judge: by hand nobody rereads the whole set every time a parameter
moves, and with the model the volume stops mattering. What you do have to do is review a fair few of
its verdicts: if the judge disagrees with you on the easy ones, you won't know whether what went up
is the system or its quirk.

## What has to be versioned

The question set, frozen and in the repository. The results, in the same commit as the prompt, the
model and the chunking parameters that produced them. Without that, "this improved" can't be
compared against anything two weeks later, which is exactly when someone asks.

None of this replaces a set labelled by someone who knows the business. It's there so you don't
depend on that set arriving.
