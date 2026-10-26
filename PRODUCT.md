# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/vanilla JS, no build step (existing repo, deployed to ultema.pro via GitHub Pages / CNAME). Kept as is.

## Users

- **Primary (owner-confirmed 2026-10-25):** brands, agencies and production studios looking for a CGI/VFX artist for a commercial, teaser or product spot (auto.ru, Weds, Skoda-type clients). They arrive from Instagram, Behance or a referral link, watch the reel for a few seconds, open two or three projects and decide whether to write. The look is judged by them first.
- Secondary: the lowered-car / stance community and event organisers (EKB Stance Meet) who know the cars on sight and judge the builds' authenticity.

## Product Purpose

A one-page portfolio of Artem Ryakin (ULTEMA), CG generalist. Success = a visitor watches work and sends a project request (email / Instagram / Behance).

## Positioning

One person runs a studio's whole pipeline: art direction, storyboard, modeling, animation, simulation, lighting, rendering and compositing in Unreal Engine 5, Blender, Cinema 4D, EmberGen. Work centres on cinematic automotive CGI with real-world custom builds (wheels, aero kits, air suspension modelled from real parts).

## Operating Context

Visitors mostly come from phones (Instagram bio link) and desktops (Behance, agency briefs). A large share of the work is vertical 9:16 social video; the rest is 2.39:1 / 16:9 cinema format.

## Capabilities and Constraints

- Owner brief (2026-10-25, replaces the earlier VHS-cassette structure): a one-page site for the personal premium brand ULTEMA, redesign of ultema.pro, **in dark tones**, three blocks:
  1. top: the showreel cut from different projects;
  2. middle: the works — each shows a preview still, hovering starts its video, clicking opens a separate project page with that film's materials, modelled on the Sky Race breakdown;
  3. bottom: about — Artem's photo, a description and contact.
- Typography: the owner asks for interesting, premium typefaces.
- Reference site: fuzestudio.ltd (full-bleed reel under a large wordmark that settles into a small top bar; small lowercase nav; one short statement; work pages pairing the film with its stills and a one-line credit of what was done).
- Project pages: only Sky Race (ESM 2026 / VIDEO_2) has a full breakdown. Its Behance layout runs: work / year / synopsis → storyboard and sketch → project goal and challenges → mood board → modeling (Jaguar F-Type 2014, Toyota Soarer Z30, Mercedes-Benz CL W215) → main scenario by scene → how it all began (inspiration, solo challenge) → problems and solutions (×3: EmberGen tyre smoke, Niagara contrails, VDB clouds vs Ultra Dynamic Sky) → stills → thanks for watching. Other projects have a film and a preview still only; their pages carry the film, stills pulled from it and a short credit until more material exists.
- Bilingual: EN default with RU toggle, remembered in the browser.
- No form backend: contact is mailto / social links, kept in one CONFIG object at the top of `tools/build.mjs` (email, telegram, instagram, behance); pages are generated from `tools/works.mjs` with `node tools/build.mjs`.
- Source videos are 4K/HEVC and 25–580 MB; everything shipped must be re-encoded to H.264 web sizes.
- No ready showreel exists; a 30–40 s cut is assembled from project footage until Artem supplies his own.

## Brand Commitments

- Name: ULTEMA, positioned as a personal premium brand. Logo: italic geometric wordmark, supplied 2026-10-25 as a **white** PNG on transparent (`F:/UNREAL_ENGINE/PORTFOLIO/ultema-logo.png`, 7483×750); the same outline exists as `assets/img/ultema-logo.svg` (an earlier red #FA0102 file, recolourable).
- Portrait: `F:/UNREAL_ENGINE/PORTFOLIO/my_photo.jpg`, 4096² black-and-white studio portrait on black.
- **Standing preference (owner, 2026-10-25):** the site takes the category standard of automotive CGI studios, played straight at full craft, not an invented world. Craft bar: Fuze Studio (fuzestudio.ltd), Unit Image (unit-image.fr), The Mill (themill.com), Platige Image (platige.com). Owner approved Taste's dealt palette: warm near-black ground, white ink, gold only on the single action. Faces: **Unbounded** (display) + **Onest** (text), chosen by the owner from Taste's library because the first dealt pair (Gambarino / General Sans) has no Cyrillic.
- Instagram @ruby_gs300, Behance artemryakin. Email `hello@ultema.pro` is a placeholder until confirmed.

## Evidence on Hand

Fifteen finished projects in `F:/UNREAL_ENGINE/PORTFOLIO` (Sky Race = ESM2026/VIDEO_2 with full breakdown materials; ESM 2026 teaser; ESM 2025 ×4; Lexus Wangan Beat; Mercedes W124 Autumn; Skoda Superb Carbon; Stance Kodiaq; Toyota Aristo JZS161 ×3; Weds Bazreia; Electrobus; Airstatic Service; MetaHuman; MIA & Pine Creek). `F:/UNREAL_ENGINE/PORTFOLIO/REF` holds two showreels by other artists (Motion Illusion, Motion by Rohit) as editing references only — never page content. No testimonials, press, client logos or metrics exist — none may be invented.

## Product Principles

1. The work leads; the interface recedes (Experience mode).
2. Every claim on the page is shown in footage, not stated.
3. Real cars, real parts, real names — accuracy is respect for the community.
4. Fast on a phone: nothing heavy loads until it is about to be seen.

## Accessibility & Inclusion

Keyboard-operable carousel and player, captions/labels for every control, `prefers-reduced-motion` honoured, autoplay video always muted with a pause control.
