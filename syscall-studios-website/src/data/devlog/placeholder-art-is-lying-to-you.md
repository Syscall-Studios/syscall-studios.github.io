---
title: "Placeholder Art Is Lying to You"
seoTitle: "Placeholder Art Is Lying to You: Prototyping Game Feel"
description: "Placeholder art is essential for prototyping. It's also great at making good mechanics feel terrible. What we're learning about game feel, polish, and fidelity."
pubDate: 2026-10-01T17:00:00Z
tags:
  - Development
  - Art
  - Game Design
  - Prototyping
  - Game Feel
featured: false
draft: false
---

Placeholder art is great.

We use it constantly.

Boxes.

Capsules.

Gray materials.

Icons someone made in approximately twelve seconds.

Text labels that say things like:

`THING`

or:

`TEMP`

or, if we're feeling particularly organized:

`TEMP_THING_02`

It's fast.

It's ugly.

It lets us test ideas before spending time making them look good.

Perfect.

There's just one problem.

Placeholder art is a liar.

## "This feels terrible"

You build a mechanic.

Technically, it works.

But something feels wrong.

It feels cheap.

The interaction feels flat.

Nothing has weight.

Nothing feels satisfying.

You start wondering if the whole idea is bad.

Maybe the mechanic doesn't work.

Maybe the design was wrong from the beginning.

Maybe this entire feature needs to be cut.

Or...

Maybe you're interacting with a bright gray cube called:

`TEST_OBJECT`

that teleports three feet to the left when you click it.

Possibly not the fairest evaluation environment.

## Presentation changes how mechanics feel

This sounds obvious when you write it down.

Of course animation matters.

Of course sound matters.

Of course visual feedback matters.

But when you're actually developing something, it's surprisingly easy to mentally separate:

> the mechanic

from:

> the presentation.

As if there's a clean line between them.

There often isn't.

A button that responds instantly feels different from one that eases into position.

An object that snaps from Point A to Point B feels different from one that has weight and momentum.

An interaction with a little sound, motion, and feedback can suddenly feel obvious when the exact same interaction felt confusing five minutes earlier.

The underlying rules didn't change.

The player's experience of those rules did.

That's important.

## But placeholder art is also doing its job

None of this means everything needs final art before we can test it.

That would be catastrophic.

Imagine needing a finished model, animation set, sound effects, particles, UI treatment, and polished environment every time you wanted to answer:

> Would this mechanic be interesting?

We would release Project 01 sometime around 2047.

Placeholder assets exist for a reason.

They let you throw ideas at the wall quickly.

And sometimes the gray cube is enough.

If moving the gray cube around isn't interesting at all, giving it a beautiful texture probably won't save it.

Probably.

But there's a point where the lack of presentation starts contaminating the test.

That's the part we're learning to recognize.

## The opposite problem exists too

Presentation can also make a bad idea look much better than it actually is.

This may be more dangerous.

Give something a satisfying animation.

Add a nice sound.

Put some particles on it.

Maybe give the screen a tiny shake.

Suddenly:

> Oh wow, this is great.

Is it?

Or did we just put enough juice on a mediocre mechanic that our monkey brains started applauding?

This is where things get annoying.

Because now placeholder art can make good things feel bad **and** polish can make bad things feel good.

Very helpful.

Thank you, game development.

## There are different questions

We're starting to think the useful approach is figuring out exactly what we're testing.

If the question is:

> Does this system logically work?

Gray boxes are probably fine.

If the question is:

> Is this interaction satisfying?

The gray boxes may no longer be enough.

If the question is:

> Does the player understand what happened?

Then visual hierarchy, animation, sound, and interface feedback might actually be part of the mechanic we're testing.

And if the question is:

> Does this look good?

Well.

Probably stop using the gray cube.

Different tests need different levels of fidelity.

Which sounds incredibly obvious.

We have still gotten this wrong.

Repeatedly.

## Art can change design

There's another interesting side effect.

Sometimes replacing placeholder assets doesn't just make an existing feature look better.

It changes how we think the feature should work.

An object gets its actual proportions and suddenly the interaction designed around the placeholder no longer makes sense.

An environment gains real scale and something that felt conveniently close is now annoyingly far away.

A real animation takes longer than the instant placeholder transition, which changes the pacing.

An interface gets actual typography and suddenly the amount of information we thought would fit comfortably absolutely does not.

Who could have possibly foreseen that `Lorem ipsum` was not a representative final UI element?

Certainly not us.

So art isn't always the layer you add after design.

Sometimes it feeds back into design.

The two are constantly arguing with each other.

Usually that's a good thing.

## The challenge is knowing when to care

We don't want to polish things too early.

Polished garbage is still garbage, except now you've spent significantly more time on it.

But we also don't want to throw away an idea because the temporary version was incapable of communicating what made the idea interesting in the first place.

So the question becomes:

> Is the placeholder showing us the mechanic clearly enough to judge it?

If yes, great.

Keep moving.

If no, maybe it needs just enough animation, sound, art, or feedback to make the test honest.

Not final.

Not beautiful.

Just honest.

## The current collection of nonsense

Project 01 currently contains plenty of things that are somewhere between:

> prototype

and:

> please don't let anyone outside the studio see this.

There are assets that exist purely to answer questions.

There are objects whose appearance is not remotely representative of where they're headed.

There are things that will absolutely be replaced.

Probably.

See our [previous post](/devlog/the-danger-of-temporary/) regarding the word "temporary."

But we're slowly getting better at knowing when something can stay ugly and when the ugliness itself has become part of the problem.

That's a surprisingly useful distinction.

Placeholder art is supposed to lie about what the final game will **look** like.

We just have to make sure it isn't also lying about what the final game will **feel** like.