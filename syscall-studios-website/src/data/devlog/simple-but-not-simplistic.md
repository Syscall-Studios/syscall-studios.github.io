---
title: "Simple, But Not Simplistic"
seoTitle: "Simple, But Not Simplistic: Designing for Depth"
description: "The game design principle behind our first game: make systems easy to understand without making them shallow, from Minecraft's Redstone to skill trees."
pubDate: 2026-09-15T16:00:00Z
tags:
  - Game Design
  - Development
  - Philosophy
featured: false
draft: false
---

One phrase has started showing up repeatedly while we're working on Project 01:

> **Simple, but not simplistic.**

It's become a useful shorthand for a surprisingly large number of design decisions.

## Simplicity isn't the absence of depth

There's a temptation when designing a complicated system to communicate that depth by showing the player everything.

More buttons.

More statistics.

More menus.

More labels.

More information.

Sometimes that's necessary.

Sometimes it just means we've moved the complexity from the game into the interface.

We're much more interested in systems that become understandable through interaction.

The player shouldn't need a manual just to understand what the game is asking them to do.

But that doesn't mean the thing they're doing has to be shallow.

## The difference between complicated and complex

Those words sound similar, but we're starting to think about them very differently.

A complicated system can have a lot of parts.

A complex system can have relatively simple parts that interact in interesting ways.

**Redstone in Minecraft is a great example.**

At its core, [Redstone](https://minecraft.wiki/w/Redstone_circuits) gives the player a relatively small collection of understandable building blocks: redstone dust, buttons, torches, repeaters, pistons, and a small selection of other components.

None of those pieces are especially complicated on their own.

But because they interact through a small set of consistent rules, people have used them to build everything from automatic doors to calculators, memory circuits, and literal functioning computers.

The depth doesn't come from Minecraft giving you a "build computer" block.

It comes from simple pieces being allowed to combine in ways the designers didn't have to individually prescribe.

That's the kind of complexity we find interesting.

The opposite is something you see in a lot of progression systems: dozens of upgrades, sprawling skill trees, multiple currencies, hundreds of percentage modifiers, and an intimidating number of apparent choices.

You can spend twenty minutes deciding whether to take one branch or another, only to discover that both paths ultimately amount to:

> Your character now does a little more damage.

There may be a tremendous amount of *stuff* in the system, but if most of the decisions converge on roughly the same outcome, all of that complication hasn't necessarily created much depth.

We'd rather have a handful of meaningful rules that can produce unexpected situations than a hundred options that all eventually resolve to `+5% DPS`.

That philosophy affects more than mechanics.

It applies to interfaces.

Art.

Animation.

Progression.

Level design.

Even sound.

## Let the player understand things

One of our favorite kinds of progression has nothing to do with numbers.

It's when the player gets better because **they understand the game better**.

Maybe they recognize a pattern faster.

Maybe they realize two systems interact.

Maybe something that originally seemed confusing becomes obvious because they now understand why it behaves the way it does.

The game didn't secretly add +10 to their Understanding stat.

The player learned something.

That's a powerful feeling.

And we're interested in [building around it](/about/).

## Visual simplicity matters too

We're taking a similar approach visually.

More detail does not automatically create a more believable world.

Sometimes the opposite happens.

If every surface, object, and interface element is screaming for attention, nothing feels important.

We're aiming for strong shapes, clear visual hierarchy, believable materials, and detail where the detail actually contributes something.

The goal isn't minimalism.

The goal is intentionality.

We want an object to contain enough information for your brain to understand what it is without having to reproduce every scratch, screw, seam, and manufacturing mark that exists on the real thing.

Simple.

Not simplistic.

## The difficult part

Of course, saying this is much easier than doing it.

Removing unnecessary complexity requires knowing which complexity is unnecessary.

And sometimes the weird little detail that looks expendable ends up being the thing that makes an interaction satisfying.

So a lot of development currently looks like this:

1. Build the thing.
2. Realize the thing is too complicated.
3. Simplify the thing.
4. Realize we removed something important.
5. Put part of the thing back.
6. Somehow discover a completely unrelated problem.
7. Repeat.

Scientific stuff.

## A useful filter

We're starting to use a simple question when evaluating features:

> Does this add depth, or does it just add work?

Sometimes the answer is both.

But asking the question has been useful.

Project 01 still has a long way to go, and plenty of these ideas will continue evolving as we build it.

But "simple, not simplistic" is becoming one of the principles we keep coming back to.

That's usually a sign it's worth writing down.