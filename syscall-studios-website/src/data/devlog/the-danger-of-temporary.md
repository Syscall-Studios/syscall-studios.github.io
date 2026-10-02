---
title: "Temporary Is a Dangerous Word"
seoTitle: "Temporary Is a Dangerous Word: Technical Debt in Games"
description: "Nothing is more permanent than a temporary solution. How game prototypes quietly become architecture, and how we decide when technical debt is worth it."
pubDate: 2026-09-21T18:00:00Z
tags:
  - Development
  - Programming
  - Process
  - Technical Debt
  - Prototyping
featured: false
draft: false
---

There is a phrase that should probably trigger some kind of alarm in a game development project:

> "It's temporary."

We say it constantly.

This model is temporary.

This UI is temporary.

This script is temporary.

This entire system is temporary.

We'll clean it up later.

And sometimes that's completely fine.

You need ugly prototypes.

You need placeholder art.

You need the button that is literally just a gray rectangle saying `TEST BUTTON`.

If every experiment had to be production-ready before you could use it, nothing would ever get built.

The problem is that temporary things have a remarkable ability to survive.

There's an old saying:

"Nothing is more permanent than a temporary solution."

And it couldn't be more true.

## The lifecycle of a temporary system

It usually goes something like this:

1. We need to test an idea.
2. We build the absolute minimum required to test it.
3. It works.
4. Great.
5. We build something else that uses it.
6. Then something else uses *that*.
7. Then another system needs information from the first system.
8. Three weeks pass.
9. Someone opens the original code.
10. Oh no.

What started as:

> "Just make this work for now."

has quietly become:

> "Removing this would currently destroy approximately 40% of the game."

Very cool.

Very healthy.

Definitely not an [XKCD Comic](https://xkcd.com/2347/) that we have all seen...

## Prototypes are supposed to be ugly

To be clear, we're not trying to avoid this entirely.

That would probably be worse.

There is a version of software development where you become so afraid of technical debt that every tiny feature gets designed like it's going to run a nuclear power plant for the next thirty years.

We're making a game.

Sometimes we genuinely just need to know:

**Is this fun?**

And spending three days designing the perfect architecture for something we're going to delete tomorrow would be ridiculous.

So we're trying to get better at recognizing two different kinds of temporary.

There's:

> **Temporary because we're testing the idea.**

And then there's:

> **Temporary because we don't feel like solving the actual problem yet.**

Those look suspiciously similar in the moment.

They are not the same thing.

## "We'll fix it later"

Later is a magical place.

Everything gets fixed there.

The code gets cleaned up later.

The placeholder animations get replaced later.

The UI gets reorganized later.

Naming conventions become consistent later.

That one weird interaction nobody understands?

Later.

Unfortunately, Future Us appears to already have a fairly substantial backlog.

So we're trying to be slightly nicer to them.

Not by polishing everything immediately, but by stopping occasionally and asking:

> If this survives longer than we're expecting, how painful is that going to be?

Sometimes the answer is:

Not very.

Ship the ugly version.

Sometimes the answer is:

This will infect literally everything we build after it.

Maybe deal with that now.

## The boring stuff matters

This is one of the strange things about game development that isn't particularly visible from the outside.

Sometimes the most important work happening on a project produces absolutely nothing interesting to look at.

You can spend an entire day reorganizing how a few systems communicate with each other.

At the end of the day, [the game looks exactly the same](/devlog/the-game-looks-exactly-the-same/).

Maybe it even runs exactly the same.

But now changing something six months from now won't require sacrificing a goat and rewriting half the project.

Hopefully.

No guarantees on the goat.

That work isn't exciting in a trailer.

It's very exciting when you're the person who has to maintain the project.

## We're already guilty

Project 01 is still early, and we've already had several moments where something built as a quick test started accumulating responsibilities it was never designed to have.

Which is probably unavoidable.

We're learning what the game actually needs while we're building it.

You can't perfectly architect a system around requirements you don't know yet.

And we'd rather discover those requirements by making the game than spend six months designing an incredibly elegant architecture for the wrong game.

So the goal isn't:

> Never create technical debt.

It's probably closer to:

> Know when you're creating it.

And maybe leave a note.

A very apologetic note.

## The current rule

Right now, we've landed on something roughly like this:

If we're experimenting with whether something should exist at all, **build it fast**.

If we're confident it's going to become a foundation for other systems, **slow down and think about it**.

And if something temporary suddenly has six other systems depending on it?

Congratulations.

It is no longer temporary.

Please update the documentation accordingly.

We'll almost certainly violate this rule again.

Probably this week.

But hey, now there's a Dev Log post we can link to while yelling at each other for doing it.