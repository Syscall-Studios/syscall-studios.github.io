---
title: "The Game Looks Exactly the Same"
seoTitle: "The Game Looks Exactly the Same: Invisible Dev Work"
description: "A week of game development, and the game looks exactly like it did on Monday. On refactoring, invisible work, and why screenshots are a bad measure of progress."
pubDate: 2026-09-25T17:00:00Z
tags:
  - Development
  - Programming
  - Process
  - Refactoring
featured: false
draft: false
---

Sometimes you spend an entire week working on a game.

You write a bunch of code.

You tear apart a system that technically worked.

You rebuild half of it.

You fix six bugs.

You create three new ones.

You reorganize things.

You test everything.

You finally get to Friday, launch the game, look at the screen and think:

> Huh.

It looks exactly the same.

Cool.

## The invisible work

This is something we're running into more and more as Project 01 develops.

Early on, progress is really easy to see.

You add an object.

There is now an object.

You add a menu.

There is now a menu.

You make something move.

It moves.

Excellent.

Progress.

But eventually you reach a point where more and more development happens underneath everything the player actually sees.

And that's where things get weird.

You can spend hours changing how two systems communicate with each other and, if you did your job correctly, the player will notice absolutely nothing.

That is the goal.

You worked all day so nothing would happen.

Game development is a very normal profession.

## "What did you work on today?"

This also makes answering that question surprisingly difficult sometimes.

Imagine someone asking what you accomplished today and the answer is:

> Well, yesterday when this thing happened, System A directly told System B to do something, but System B shouldn't actually know that System A exists, so now System A tells System C that something happened and System C...

Their eyes are already glazing over.

Understandably.

So you eventually just say:

> Backend stuff.

Which makes it sound like you spent the day moving buttons around in an admin panel.

But a lot of game development is exactly that kind of invisible plumbing.

Things need to know when other things happen.

Things need to stop knowing about things they shouldn't know about.

Data needs to exist somewhere sensible.

Objects need to survive being created, destroyed, loaded, unloaded, moved, saved, restored, and occasionally abused in ways you did not anticipate.

None of that necessarily changes a screenshot.

## The screenshot problem

Screenshots are a terrible way to measure progress.

Useful for showing a game?

Absolutely.

Useful for figuring out whether the project is healthier than it was last week?

Not always.

You can make a screenshot dramatically prettier while making the project substantially worse.

You can also spend a week making the underlying game dramatically better while producing two screenshots that are pixel-for-pixel identical.

That makes development updates a little awkward sometimes.

Especially while we're still [keeping Project 01 quiet](/devlog/building-before-announcing/).

We can say:

> We made a lot of progress this week.

And technically that's true.

But if we showed you before and after images, you'd probably start playing spot-the-difference.

There may not be a difference.

That's the point.

## Boring work has compounding returns

The nice thing about invisible work is that it usually isn't really about today.

It's about making tomorrow easier.

Maybe we clean up a system now so adding the next feature takes two hours instead of two days.

Maybe we separate two pieces of code so changing one doesn't mysteriously break the other.

Maybe we make something data-driven instead of hardcoded so we don't have to manually repeat the same work fifty times later.

None of these things are particularly exciting in isolation.

But they compound.

A project where every new feature is fighting everything that came before it eventually becomes miserable to work on.

A project where the underlying systems are reasonably healthy gives you room to experiment.

And experimentation is kind of important when you're still figuring out what the game wants to be.

## Of course, there's a trap

This is also an excellent excuse for programmers to disappear into a cave for three weeks and emerge proudly announcing:

> I rewrote the inventory system.

Why?

> Architecture.

Was anything actually wrong with it?

> Architecture.

Does the player care?

> **Architecture.**

So there is obviously a balance here.

Not every ugly piece of code needs to become a beautiful abstraction.

Not every system needs to be future-proofed against fourteen hypothetical games we may never make.

And "cleaning things up" can very easily become a sophisticated form of procrastination.

Sometimes the ugly thing works.

Sometimes the correct architectural decision is:

> Leave it alone and make the game.

We're getting better at figuring out which is which.

Mostly.

## Progress doesn't always photograph well

The strange thing is that some of the work we're happiest with lately would make absolutely terrible social media posts.

Here's the game before:

`[ screenshot ]`

Here's the game after:

`[ the exact same screenshot ]`

Huge week.

But underneath that screenshot, maybe something that used to be fragile isn't fragile anymore.

Maybe a system we were afraid to touch is now easy to change.

Maybe five future features just became significantly easier to build.

Maybe [Future Us](/devlog/the-danger-of-temporary/) is going to open that code six months from now and, instead of saying:

> What idiot wrote this?

we'll say:

> Oh.

> This actually makes sense.

Let's not get too ambitious.

But that's the dream.

Project 01 looks pretty similar today to how it looked yesterday.

A surprising amount has changed anyway.