---
name: ULTEMA
description: Cinematic CGI car films by Artem Ryakin, shown the way automotive studios show their work.
colors:
  warm-black: "#0c0a08"
  ember-black: "#181512"
  white: "#ffffff"
  ash: "#8f8a84"
  brass: "#c9a45a"
  brass-light: "#d8b673"
  film-black: "#000000"
  scrim: "rgba(0, 0, 0, 0.72)"
typography:
  display:
    fontFamily: "Unbounded, Onest, sans-serif"
    fontSize: "clamp(3.25rem, 9vw, 8.5rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Unbounded, Onest, sans-serif"
    fontSize: "clamp(2rem, 1.2rem + 3.6vw, 5rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
  address:
    fontFamily: "Unbounded, Onest, sans-serif"
    fontSize: "clamp(3.25rem, 9vw, 8.5rem)"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "-0.04em"
  lead:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem)"
    fontWeight: 400
    lineHeight: 1.35
  body:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem)"
    fontWeight: 500
    lineHeight: 1.3
rounded:
  none: "0px"
spacing:
  gap: "8px"
  margin: "clamp(18px, 2.2vw, 32px)"
  bar: "72px"
  section: "clamp(120px, 14vw, 200px)"
components:
  button-primary:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.warm-black}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 22px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.brass-light}"
    textColor: "{colors.warm-black}"
  filter-chip:
    backgroundColor: "{colors.ember-black}"
    textColor: "{colors.ash}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 14px"
    height: "40px"
  filter-chip-active:
    backgroundColor: "{colors.white}"
    textColor: "{colors.warm-black}"
  nav-link:
    textColor: "{colors.white}"
    typography: "{typography.label}"
---

# Design System: ULTEMA

## Overview

**Creative North Star: "The Film Owns the Screen"**

ULTEMA is the automotive-CGI studio standard played straight, at the craft level of Fuze, Unit Image, The Mill and Platige. The film is always the largest thing on screen; the interface is a slim bar, a white wordmark and a few words. The page is warm black from top to bottom, and the only colour that is not the footage's own is a brass hover. It is a portfolio, not a sales page: no call-to-action buttons.

What makes it ULTEMA and not a template: the site opens on black with the reel seen through the ULTEMA letters, which then open to the full screen (after The Mill, at the owner's request); the reel names the film on screen; the work is a wall where every film keeps the frame it was made in, 2.39:1 cinema beside 9:16 social and 1:1 product films.

**Key Characteristics:**
- Full-bleed muted film in every first screen, with type on its lower edge over a neutral scrim and a second scrim under the bar.
- Warm black ground with one tone step for second grounds; white ink; brass only as a hover.
- Two faces: Unbounded 800 in capitals for titles, Onest for everything read.
- Square corners, no lines, no shadows, no ornament.
- Motion that comes from the films and the scroll, never decoration.

## Colors

A dark, warm, almost colourless system that leaves all colour to the footage.

### Primary
- **Brass** (#c9a45a): the hover state of links (the display email, the reel's film name, nav), and the one button on the 404 page. Never a field, never resting text.

### Neutral
- **Warm Black** (#0c0a08): the page ground everywhere, from the hero edges to the footer.
- **Ember Black** (#181512): the one tone step: the contact field, filter chips, tile placeholders while a poster loads.
- **White** (#ffffff): all running text, headings, the wordmark.
- **Ash** (#8f8a84): secondary notes only: frame labels in captions, muted meta values, inactive filters.
- **Film Black** (#000000): the ground behind a film and around its frame, before it loads and in letterboxes.
- **Scrim** (black at 72%): the one neutral scrim under type on a film, faded to transparent: under the bar, under the hero copy, under the 404 copy.

### Named Rules
**The One Brass Rule.** Brass appears only where a pointer is: the hover of a link. Nothing rests in brass.

**The Tone-Step Rule.** Surfaces separate by stepping from Warm Black to Ember Black, never by a line or a shadow.

**The Footage Owns Colour Rule.** The interface keeps to black, white and brass; every other colour on the page comes from the films.

## Typography

**Display Font:** Unbounded (with Onest, sans-serif)
**Body Font:** Onest (with system-ui, sans-serif)

**Character:** a wide, constructed display face with the weight of a car badge, against a clean, quiet text grotesk. Both carry Latin and Cyrillic, so the EN and RU pages look the same.

### Hierarchy
- **Display** (800, clamp(3.25rem, 9vw, 8.5rem), 1): section titles on the main page (WORK, the name in About). Capitals, tracking -0.03em. 14vw on phones.
- **Headline** (800, clamp(2rem, 1.2rem + 3.6vw, 5rem), 1): the hero statement (Artem Ryakin / CG Generalist, owner's wording), project titles and chapter titles. Capitals.
- **Address** (300, display size, 1): the contact email set as display type, lowercase, tracking -0.04em, breaking after the @ on phones.
- **Lead** (400, clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem), 1.35): the about paragraph, project descriptions, the line under a project title.
- **Body** (400, clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem), 1.5): the hero line, lists, running text. Measure 30–40ch in short blocks.
- **Label** (500, clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem), 1.3): navigation, captions, buttons, meta rows. Sentence case, never tracked capitals.

### Named Rules
**The Five Steps Rule.** A page uses at most five sizes: label, body, lead, headline, display. The wordmark is drawn, not set, and sits outside the count.

**The Two Lines Rule.** Every heading holds two lines or fewer at every width; cut words before shrinking type.

## Layout

One pair of equal outer margins (18px on phones to 32px on desktop) on every section, and an 8px gap wherever pictures meet. Sections sit 120–200px apart. The bar is 72px tall (60px on phones), transparent over the reel and solid Warm Black once the reel has scrolled away.

The work wall is a justified flex layout: each row's height follows a cycle of 300, 420, 260 and 360px at 1440px wide (scaled with the viewport), the break falls where the row height lands closest to its target, and the last row never ends as a stub. Below 820px a widescreen film takes the width alone and vertical or square films pair up. About sets the name and two paragraphs in columns 1–7 and a round portrait centred in columns 9–12; on phones they stack with the portrait last. Project pages keep a widescreen film full width under the title; a vertical film stands at 86svh with its words and stills beside it.

### Named Rules
**The True Frame Rule.** A film is shown in its own aspect. Never crop the wall to a uniform 16:9 grid.

## Elevation & Depth

Flat. There are no shadows at rest or in motion. Depth comes from the footage itself, from the one tone step, and from z-order in two places: the wordmark travelling over the page into the bar, and the portrait in About held in place while the words beside it scroll.

### Named Rules
**The No-Shadow Rule.** Nothing casts a shadow. Neutral scrims on a film (under the hero type, under the bar, under a tile's name) are the only gradients the system allows.

## Shapes

Square corners everywhere (0px): buttons, chips, tiles, films. The one circle is the About portrait (owner's request). No borders, outlines or rules; a selected state is a change of fill, not a stroke. The wordmark's italic slant is the only angle in the system and belongs to the logo alone.

## Components

### Buttons
- **Shape:** square (0px), 44px tall.
- **Primary:** Brass fill, Warm Black label in Onest 500, 22px side padding. Used only on the 404 page; the portfolio pages carry no call-to-action button (owner, 2026-10-26).
- **Hover / Focus:** fill lightens to Brass Light (#d8b673) on fine pointers; focus shows a 2px brass outline 3px off the edge; press scales to 0.97 over 160ms with a strong ease-out.
- **Icon button:** 44px square on a 55% Warm Black field (the reel's pause), press scale 0.95.
- **Film name:** bottom-right of the reel, a muted "In the reel" over the current film's name; it changes with each cut (180ms fade), links to that film's page and turns brass on hover.

### Chips
- **Style:** the frame filter (All, Cinema, Social) and the Sky Race lighting passes: Ember Black fill, Ash label, 40px tall.
- **State:** the active chip turns White with a Warm Black label; inactive ones brighten their label on hover.

### Cards / Containers
- **Corner Style:** square (0px).
- **Background:** Ember Black while media loads; otherwise the film or poster fills the box.
- **Shadow Strategy:** none.
- **Border:** none.
- **Internal Padding:** none; the caption sits 10px under the media.

### Footer
- **Style:** a quiet close on Warm Black: the logo at 120–168px with one line about Artem in Ash, the section links, the email and socials, and a legal row with Back to top. No full-width wordmark (owner, 2026-10-26).

### Navigation
- **Style:** the white wordmark at the left (136px max), Work, About, Contact and the EN/RU pair at the right, all in Label size and weight. Inactive language in Ash.
- **States:** links turn Brass on hover; the bar goes solid Warm Black once the reel is out of view.
- **Mobile:** Work and About fold away; Contact and the language pair stay.

### The Wall (signature)
Each tile is a poster in its true frame. On a fine pointer, hovering pushes the poster in (scale 1.06 over 1200ms), wipes the 5-second muted loop across it from the left (clip-path, 640ms) while it settles from scale 1.08, raises a quiet "Watch the film" line under the name, and dims the other tiles' media to 55%; leaving undoes it in 260–420ms, and a press sinks the tile to 0.985. All easing is cubic-bezier(0.23, 1, 0.32, 1); reduced motion drops the travel. On a phone the tile that is fully on screen plays on its own. Captions sit on the preview itself (owner, 2026-10-26): the film's name only, bottom-left over a neutral scrim, inside the tile's own width; the frame shows in the tile's shape, not in words. Every tile opens the film's own page in a new tab.

### The Intro (signature)
On a visitor's first load per session, the screen is Warm Black with the ULTEMA letters cut out of it at 62vw (84vw on phones), and the reel plays through them while the statement and nav stay readable. After 1.5s, or at the first scroll, key or touch, the layer scales 90x about a point inside the L's stem over 1100ms (cubic-bezier(0.77, 0, 0.175, 1)) and fades in its last 250ms; the bar's logo then fades in at the top left. Skipped under reduced motion, on a deep link and on later loads in the session.

## Do's and Don'ts

### Do:
- **Do** open every page with a full-bleed film or a film at full height, muted, with a pause control; on the reel, always name the film on screen.
- **Do** keep brass (#c9a45a) to hovers; nothing rests in brass.
- **Do** show each film in its own aspect: 2.39:1, 9:16 or 1:1.
- **Do** set titles in Unbounded 800 capitals and everything read in Onest.
- **Do** keep content visible by default; entrances play only where the browser supports scroll timelines, and reduced motion keeps opacity changes only.
- **Do** carry both languages in the markup and switch with the EN/RU pair, remembered per visitor.

### Don't:
- **Don't** use gradients, glows or shadows; the neutral scrims on the reel (under the hero type and under the bar) are the only exception.
- **Don't** draw lines: no hairlines, outlined boxes or dividers. Step the tone instead.
- **Don't** put small labels above headings, number sections 01/02/03, or set monospace.
- **Don't** round corners; the About portrait's circle is the single exception.
- **Don't** add a third typeface or a second accent colour.
- **Don't** add sales calls to action ("Start a project" and the like); contact lives in the Contact section.
