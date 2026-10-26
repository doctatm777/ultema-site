// Builds index.html and work/<slug>/index.html from tools/works.mjs and tools/sky-race.mjs.
// Run from the repo root: node tools/build.mjs
import { readFileSync, writeFileSync as writeOnce, mkdirSync, existsSync } from 'node:fs';

// Windows briefly locks a file that the preview server or a browser is reading; retry instead of failing the build.
function writeFileSync(path, data) {
  for (let attempt = 1; ; attempt++) {
    try { return writeOnce(path, data); } catch (e) {
      if (attempt >= 20 || !['UNKNOWN', 'EBUSY', 'EPERM'].includes(e.code)) throw e;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);
    }
  }
}
import { works as allWorks, ratio } from './works.mjs';

// Wall order: widescreen and vertical films interleaved so every row of the wall mixes frames.
const wallOrder = ['sky-race', 'esm-2026', 'mercedes-w124-autumn', 'weds-bazreia', 'aristo-rakku', 'lexus-wangan-beat', 'aristo-burnout',
  'esm-2025', 'skoda-superb-carbon', 'stance-kodiaq', 'airstatic-service', 'metahuman', 'aristo-osushi', 'electrobus', 'mia-pine-creek'];
const works = wallOrder.map((slug) => allWorks.find((w) => w.slug === slug));
import { skyRace } from './sky-race.mjs';

const CONFIG = {
  site: 'https://ultema.pro',
  email: 'hello@ultema.pro', // placeholder until Artem confirms the address
  telegram: '',              // e.g. https://t.me/<handle>; hidden while empty
  instagram: 'https://www.instagram.com/ruby_gs300/',
  behance: 'https://www.behance.net/artemryakin',
};

const logoPath = readFileSync('assets/img/ultema-logo.svg', 'utf8').match(/ d="([^"]+)"/)[1];
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Both languages ship; CSS shows the active one.
const t = (o) => `<span lang="en">${o.en}</span><span lang="ru">${o.ru}</span>`;
const tAttr = (attr, o) => `${attr}="${esc(o.en)}" data-i18n-attr="${attr}" data-${attr}-en="${esc(o.en)}" data-${attr}-ru="${esc(o.ru)}"`;
const newTab = t({ en: ' (opens in a new tab)', ru: ' (откроется в новой вкладке)' }).replace(/<span /g, '<span class="vh" ');
const frameName = { '2.39:1': '2.39:1', '9:16': '9:16', '1:1': '1:1' };
const mailto = `mailto:${CONFIG.email}?subject=${encodeURIComponent('Project for ULTEMA')}`;

const icons = {
  pause: '<svg viewBox="0 0 16 16" aria-hidden="true" data-icon="pause"><path fill="currentColor" d="M3 2h3.5v12H3zM9.5 2H13v12H9.5z"/></svg>',
  play: '<svg viewBox="0 0 16 16" aria-hidden="true" data-icon="play" style="display:none"><path fill="currentColor" d="M4 2l10 6-10 6z"/></svg>',
};

function head({ rel, title, desc, path, image = 'assets/img/og.jpg' }) {
  return `<!doctype html>
<html lang="en" data-lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title.en)}</title>
<meta name="ultema-title" data-en="${esc(title.en)}" data-ru="${esc(title.ru)}">
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${CONFIG.site}${path}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title.en)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${CONFIG.site}${path}">
<meta property="og:image" content="${CONFIG.site}/${image}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0c0a08">
<link rel="icon" href="${rel}assets/img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="${rel}assets/fonts/unbounded-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${rel}assets/fonts/onest-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${rel}assets/css/site.css">
<script>(()=>{const d=document.documentElement;d.classList.add('js');let l=null,seen=null;try{l=localStorage.getItem('ultema-lang');seen=sessionStorage.getItem('ultema-intro')}catch(e){}if(l==='ru'){d.dataset.lang='ru';d.lang='ru'}if(${rel === '' ? 'true' : 'false'}&&!seen&&!location.hash&&!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('intro-on')})()</script>
<script src="${rel}assets/js/site.js" defer></script>
</head>`;
}

const symbol = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><symbol id="logo" viewBox="0 0 1796 180"><path fill="currentColor" d="${logoPath}"/></symbol></svg>`;
const logo = (attrs = 'aria-hidden="true" focusable="false"') => `<svg viewBox="0 0 1796 180" ${attrs}><use href="#logo"/></svg>`;
const lang = `<div class="lang" role="group" ${tAttr('aria-label', { en: 'Language', ru: 'Язык' })}><button type="button" data-set-lang="en" aria-pressed="true">EN</button><button type="button" data-set-lang="ru" aria-pressed="false">RU</button></div>`;

function bar({ rel, home, solid = false, links }) {
  return `<header class="bar${solid ? ' is-solid' : ''}">
  <a class="bar__home" href="${home}" ${tAttr('aria-label', { en: 'ULTEMA, home', ru: 'ULTEMA, на главную' })}>${logo()}</a>
  <nav class="bar__nav" ${tAttr('aria-label', { en: 'Main', ru: 'Основное меню' })}>
    ${links}
    ${lang}
  </nav>
</header>`;
}

const socials = () => [
  CONFIG.telegram && `<a class="link" href="${CONFIG.telegram}" rel="me noopener">Telegram</a>`,
  `<a class="link" href="${CONFIG.instagram}" rel="me noopener">Instagram</a>`,
  `<a class="link" href="${CONFIG.behance}" rel="me noopener">Behance</a>`,
].filter(Boolean);

function footer(rel, withMark = true) {
  const home = rel ? `${rel}` : '';
  return `<footer class="foot">
  <div class="foot__grid">
    <div class="foot__brand">
      <a class="foot__mark" href="${home || '#top'}" ${tAttr('aria-label', { en: 'ULTEMA, home', ru: 'ULTEMA, на главную' })}>${logo()}</a>
      <p class="foot__line">${t({ en: 'Cinematic CGI car films by Artem Ryakin, CG generalist.', ru: 'Кинематографичные CGI-ролики об автомобилях. Артём Рякин, CG-дженералист.' })}</p>
    </div>
    <ul class="foot__nav" ${tAttr('aria-label', { en: 'Site', ru: 'Разделы' })}>
      <li><a class="link" href="${home}#work">${t({ en: 'Work', ru: 'Работы' })}</a></li>
      <li><a class="link" href="${home}#about">${t({ en: 'About', ru: 'Обо мне' })}</a></li>
      <li><a class="link" href="${home}#contact">${t({ en: 'Contact', ru: 'Контакты' })}</a></li>
    </ul>
    <ul class="foot__social">
      <li><a class="link" href="${mailto}">${CONFIG.email}</a></li>
      ${socials().map((a) => `<li>${a}</li>`).join('\n      ')}
    </ul>
  </div>
  <div class="foot__legal"><p>© <span data-year>2026</span> ULTEMA · ${t({ en: 'Artem Ryakin', ru: 'Артём Рякин' })}</p><a class="link" href="#top">${t({ en: 'Back to top', ru: 'Наверх' })}</a></div>
</footer>`;
}

// Which film is on screen in each showreel, matched frame by frame against the project films (2026-10-26).
const shotsH = [['sky-race', 0], ['skoda-superb-carbon', 2.25], ['lexus-wangan-beat', 4.5], ['weds-bazreia', 6.75], ['sky-race', 8.75],
  ['mercedes-w124-autumn', 10.75], ['metahuman', 12.75], ['lexus-wangan-beat', 14.75], ['sky-race', 16.75], ['mercedes-w124-autumn', 18.75],
  ['skoda-superb-carbon', 20.75], ['lexus-wangan-beat', 22.75], ['sky-race', 24.75]];
const shotsV = [['aristo-burnout', 0], ['esm-2025', 2.25], ['aristo-osushi', 4.5], ['esm-2026', 6.75], ['weds-bazreia', 8.75],
  ['airstatic-service', 10.75], ['esm-2025', 12.75], ['stance-kodiaq', 15], ['aristo-rakku', 17], ['electrobus', 18.75], ['esm-2025', 21.25]];
const titleOf = (slug) => works.find((w) => w.slug === slug).title;

// ---------- index.html ----------
function tile(w) {
  const lead = w.films[0].src;
  const ar = ratio[w.frame].toFixed(4);
  const [pw, ph] = w.frame === '2.39:1' ? [1920, 804] : w.frame === '9:16' ? [720, 1280] : [1080, 1080];
  return `<a class="tile" href="work/${w.slug}/" target="_blank" rel="noopener" data-group="${w.group}" style="--ar:${ar}" data-reveal>
        <div class="tile__media"><img src="assets/media/work/${lead}.webp" width="${pw}" height="${ph}" loading="lazy" decoding="async" ${tAttr('alt', { en: `${w.title}: a frame from the film`, ru: `${w.title}: кадр из ролика` })}><video muted loop playsinline preload="none" poster="assets/media/work/${lead}.webp" data-src="assets/media/hover/${lead}.mp4" aria-hidden="true"></video></div>
        <p class="tile__cap"><span>${w.title}${newTab}</span><span class="tile__cta" aria-hidden="true">${t({ en: 'Watch the film', ru: 'Смотреть ролик' })}</span></p>
      </a>`;
}

function index() {
  const title = { en: 'ULTEMA · Artem Ryakin, CGI car films', ru: 'ULTEMA · Артём Рякин, CGI-ролики об автомобилях' };
  const desc = 'Cinematic CGI car films for brands by Artem Ryakin (ULTEMA): art direction, modeling, animation, simulation, lighting, rendering and compositing, all by one person.';
  return `${head({ rel: '', title, desc, path: '/' })}
<body>
${symbol}
${bar({ rel: '', home: '#top', links: `<a class="link bar__wide" href="#work">${t({ en: 'Work', ru: 'Работы' })}</a>
    <a class="link bar__wide" href="#about">${t({ en: 'About', ru: 'Обо мне' })}</a>
    <a class="link" href="#contact">${t({ en: 'Contact', ru: 'Контакты' })}</a>` })}
<main>
  <section class="hero" id="top" ${tAttr('aria-label', { en: 'Showreel', ru: 'Шоурил' })}>
    <video id="reel" class="hero__video" muted loop playsinline autoplay preload="auto" poster="assets/media/reel-16x9.jpg"
      data-src-h="assets/media/reel-16x9.mp4" data-src-v="assets/media/reel-9x16.mp4" data-intro-v="13"
      data-poster-h="assets/media/reel-16x9.jpg" data-poster-v="assets/media/reel-9x16.jpg"
      data-shots-h='${JSON.stringify(shotsH.map(([s, at]) => [s, at, titleOf(s)]))}' data-shots-v='${JSON.stringify(shotsV.map(([s, at]) => [s, at, titleOf(s)]))}'
      ${tAttr('aria-label', { en: 'Showreel cut from Artem Ryakin’s car films', ru: 'Шоурил из автомобильных роликов Артёма Рякина' })}>
      <source src="assets/media/reel-16x9.mp4" type="video/mp4">
    </video>
    <div class="intro" aria-hidden="true"></div>
    <div class="hero__copy">
      <div class="hero__text">
        <h1 class="hero__title display">${t({ en: '<span>Artem Ryakin</span><span>CGI car films</span>', ru: '<span>Артём Рякин</span><span>CGI-ролики</span>' })}</h1>
        <p class="hero__lede">${t({ en: 'CG generalist. Every stage of a film, from storyboard to final comp, by one person.', ru: 'CG-дженералист. Все этапы ролика, от раскадровки до композа, в одних руках.' })}</p>
      </div>
      <div class="hero__actions">
        <a class="hero__now" href="work/${shotsH[0][0]}/" target="_blank" rel="noopener" data-now><span class="hero__now-k">${t({ en: 'In the reel', ru: 'В кадре' })}</span><b data-now-title>${titleOf(shotsH[0][0])}</b>${newTab}</a>
        <button type="button" class="icon-btn" data-reel-toggle aria-pressed="false" ${tAttr('aria-label', { en: 'Pause or play the showreel', ru: 'Пауза или запуск шоурила' })}>${icons.pause}${icons.play}</button>
      </div>
    </div>
  </section>

  <section class="work" id="work" aria-labelledby="work-title">
    <div class="work__head">
      <h2 class="work__title display" id="work-title" data-reveal>${t({ en: 'Work', ru: 'Работы' })}</h2>
      <div class="filter" role="group" ${tAttr('aria-label', { en: 'Show films by frame', ru: 'Показать ролики по формату' })} data-reveal>
        <button type="button" data-filter="all" aria-pressed="true">${t({ en: 'All', ru: 'Все' })}</button>
        <button type="button" data-filter="cinema" aria-pressed="false">${t({ en: 'Cinema', ru: 'Кино' })}</button>
        <button type="button" data-filter="social" aria-pressed="false">${t({ en: 'Social', ru: 'Соцсети' })}</button>
      </div>
    </div>
    <div class="wall" data-reveal-group>
      ${works.map(tile).join('\n      ')}
    </div>
  </section>

  <section class="about" id="about" aria-labelledby="about-title">
    <div class="about__grid">
    <div class="about__text" data-reveal-group>
      <h2 class="about__title display" id="about-title" data-reveal>${t({ en: '<span>Artem</span><span>Ryakin</span>', ru: '<span>Артём</span><span>Рякин</span>' })}</h2>
      <p class="about__lead" data-reveal>${t({
        en: 'I’m a CG generalist working in Unreal Engine, Blender, Cinema 4D and EmberGen. A car film like these is usually made by a studio with a team for every stage; I run all of them myself, from the first sketch to the last frame.',
        ru: 'Я CG-дженералист, работаю в Unreal Engine, Blender, Cinema 4D и EmberGen. Такие ролики обычно делает студия, где на каждый этап своя команда; я веду все этапы сам, от первого скетча до последнего кадра.' })}</p>
      <p class="about__more" data-reveal>${t({
        en: 'Most of my work is cinematic automotive CGI: real cars and real custom builds, with wheels and aero kits modelled from real parts.',
        ru: 'В основном это кинематографичный автомобильный CGI: реальные машины и кастомные проекты, диски и обвесы смоделированы по настоящим деталям.' })}</p>
    </div>
    <figure class="portrait" data-reveal>
      <img src="assets/media/about/portrait-round.webp" width="800" height="800" loading="lazy" decoding="async" ${tAttr('alt', { en: 'Artem Ryakin, black-and-white studio portrait', ru: 'Артём Рякин, чёрно-белый студийный портрет' })}>
      <figcaption><b>${t({ en: 'Artem Ryakin', ru: 'Артём Рякин' })}</b><span>CG Generalist</span></figcaption>
    </figure>
    </div>
  </section>

  <section class="contact" id="contact" aria-labelledby="contact-title">
    <h2 class="contact__ask" id="contact-title" data-reveal>${t({ en: 'For films and collaborations, write to me.', ru: 'По роликам и сотрудничеству пишите мне.' })}</h2>
    <a class="contact__mail" href="${mailto}" data-reveal>${CONFIG.email.replace('@', '@<wbr>')}</a>
    <div class="contact__foot"><p>${t({ en: 'English or Russian, either is fine.', ru: 'Можно на русском или на английском.' })}</p><nav ${tAttr('aria-label', { en: 'Social', ru: 'Соцсети' })}>${socials().join('')}</nav></div>
  </section>
</main>
${footer('')}
</body>
</html>
`;
}

// ---------- work/<slug>/index.html ----------
const R = '../../';
const loop = (name, w, h, alt) => `<video class="wide-loop" muted loop playsinline preload="none" poster="${R}assets/media/sky-race/${name}.webp" data-loop="${R}assets/media/sky-race/${name}.mp4" width="${w}" height="${h}" ${tAttr('aria-label', alt)}></video>`;

function skyRaceChapters() {
  const s = skyRace;
  const boards = Array.from({ length: 17 }, (_, i) => `<img src="${R}assets/media/sky-race/storyboard/${String(i + 1).padStart(2, '0')}.webp" width="960" height="540" loading="lazy" decoding="async" alt="" data-reveal>`).join('\n        ');
  return `
  <section class="chapter" aria-labelledby="ch-board">
    <h2 class="chapter__title display" id="ch-board" data-reveal>${t({ en: 'Storyboard', ru: 'Раскадровка' })}</h2>
    <div class="board" data-reveal-group>
        ${boards}
    </div>
  </section>

  <section class="chapter" aria-labelledby="ch-brief">
    <h2 class="chapter__title display" id="ch-brief" data-reveal>${t({ en: 'The brief', ru: 'Задача' })}</h2>
    <div class="two" data-reveal-group>
      <div data-reveal><h3>${t(s.goal.title)}</h3><ul>${s.goal.items.map((x) => `<li>${t(x)}</li>`).join('')}</ul></div>
      <div data-reveal><h3>${t(s.challenges.title)}</h3><ul>${s.challenges.items.map((x) => `<li>${t(x)}</li>`).join('')}</ul></div>
    </div>
  </section>

  <section class="chapter" aria-labelledby="ch-model">
    <h2 class="chapter__title display" id="ch-model" data-reveal>${t({ en: 'Modeling', ru: 'Моделинг' })}</h2>
    <div data-reveal>${loop('modeling-lineup', 1920, 538, { en: 'The three finished cars side by side', ru: 'Три готовые машины рядом' })}</div>
    <div data-reveal-group>
      ${s.cars.map((c) => `<div class="car" data-reveal>${loop(c.video, 1280, 464, { en: `${c.name}, wireframe turntable`, ru: `${c.name}, вайрфрейм на поворотном столе` })}<div><h3>${c.name}</h3><p>${t(c)}</p></div></div>`).join('\n      ')}
    </div>
  </section>

  <section class="chapter passes" aria-labelledby="ch-light">
    <h2 class="chapter__title display" id="ch-light" data-reveal>${t({ en: 'Lighting the hold', ru: 'Свет в отсеке' })}</h2>
    <div data-reveal>${loop('blocking', 1600, 580, { en: 'Grey blocking of the cargo hold', ru: 'Серый блокинг грузового отсека' })}</div>
    <figure data-reveal style="margin-top:var(--gap)">
      <img class="passes__big" src="${R}assets/media/sky-race/light/${s.light.length}.webp" width="1600" height="900" loading="lazy" decoding="async" ${tAttr('alt', { en: `Lighting pass: ${s.light.at(-1).en}`, ru: `Проход света: ${s.light.at(-1).ru}` })}>
      <div class="passes__steps" role="group" ${tAttr('aria-label', { en: 'Lighting passes, from the first key to the final frame', ru: 'Проходы света, от первого ключа до финального кадра' })}>${s.light.map((l, i) => `<button type="button" aria-pressed="${i === s.light.length - 1}" data-src="${R}assets/media/sky-race/light/${i + 1}.webp" data-alt-en="Lighting pass: ${esc(l.en)}" data-alt-ru="Проход света: ${esc(l.ru)}"><img src="${R}assets/media/sky-race/light/${i + 1}.webp" width="1600" height="900" loading="lazy" decoding="async" alt=""><span>${t(l)}</span></button>`).join('')}</div>
    </figure>
  </section>

  <section class="chapter" aria-labelledby="ch-scenes">
    <h2 class="chapter__title display" id="ch-scenes" data-reveal>${t({ en: 'The scenario', ru: 'Сценарий' })}</h2>
    <div data-reveal-group>
      ${s.scenes.map((sc) => `<div class="scene" data-reveal><video muted loop playsinline preload="none" poster="${R}assets/media/sky-race/${sc.video}.webp" data-loop="${R}assets/media/sky-race/${sc.video}.mp4" width="1600" height="670" ${tAttr('aria-label', { en: `${sc.title.en}, previs`, ru: `${sc.title.ru}, превиз` })}></video><div><h3>${t(sc.title)}</h3><p>${t(sc)}</p></div></div>`).join('\n      ')}
    </div>
  </section>

  <section class="chapter" aria-labelledby="ch-began">
    <h2 class="chapter__title display" id="ch-began" data-reveal>${t({ en: 'How it began', ru: 'С чего всё началось' })}</h2>
    <div class="began" data-reveal-group>
      ${s.began.map((b) => `<div data-reveal><h3>${t(b.title)}</h3><p>${t(b)}</p></div>`).join('\n      ')}
    </div>
  </section>

  <section class="chapter" aria-labelledby="ch-fix">
    <h2 class="chapter__title display" id="ch-fix" data-reveal>${t({ en: 'Problems solved', ru: 'Проблемы и решения' })}</h2>
    <div data-reveal-group>
      ${s.problems.map((p) => `<div class="fix" data-reveal><video muted loop playsinline preload="none" poster="${R}assets/media/sky-race/${p.video}.webp" data-loop="${R}assets/media/sky-race/${p.video}.mp4" width="1600" height="600" ${tAttr('aria-label', p.title)}></video><div><h3>${t(p.title)}</h3><h4>${t({ en: 'The problem', ru: 'Проблема' })}</h4><p class="fix__p">${t(p.problem)}</p></div><div><h4 style="margin-top:calc(var(--step-lead) * 1.35 + 12px)">${t({ en: 'The solution', ru: 'Решение' })}</h4><p>${t(p.solution)}</p></div></div>`).join('\n      ')}
    </div>
  </section>

  <section class="chapter" aria-labelledby="ch-stills">
    <h2 class="chapter__title display" id="ch-stills" data-reveal>${t({ en: 'Stills', ru: 'Стиллы' })}</h2>
    <div class="still-grid" data-reveal-group>
      ${[1, 2, 3, 4, 5].map((n) => `<img src="${R}assets/media/sky-race/still-${n}.webp" width="${n === 5 ? 2000 : 1388}" height="${n === 5 ? 835 : 582}" loading="lazy" decoding="async" alt="" data-reveal>`).join('\n      ')}
    </div>
  </section>

  <section class="thanks" aria-labelledby="ch-thanks">
    <div data-reveal>${loop('thanks', 1920, 538, { en: 'The three cars from behind, end frame', ru: 'Три машины сзади, финальный кадр' })}</div>
    <h2 class="chapter__title display" id="ch-thanks" style="margin-top:48px" data-reveal>${t({ en: 'Thanks for watching', ru: 'Спасибо за просмотр' })}</h2>
    <p data-reveal>${t({ en: 'Every frame of this film, from the storyboard to the final comp, was made by one person. More of the work is on the main page.', ru: 'Каждый кадр этого фильма, от раскадровки до композа, сделал один человек. Остальные работы на главной.' })}</p>
  </section>`;
}

const roleText = (w) => `<p class="case-text__role" data-reveal><b>${t({ en: 'What I did', ru: 'Что я делал' })}</b>${t(w.role)}</p>`;
const filmTag = (w, f, cls = '') => `<video${cls ? ` class="${cls}"` : ''} controls muted playsinline preload="metadata" data-autoplay poster="${R}assets/media/work/${f.src}.webp" src="${R}assets/media/work/${f.src}.mp4" ${tAttr('aria-label', { en: `${w.title}, the film`, ru: `${w.title}, ролик` })}></video>`;

// The film and the words about it. A vertical film keeps its words beside it, so the first screen has no void.
function filmBlock(w) {
  if (w.films.length > 1) {
    return `<div class="films" data-reveal>${w.films.map((f) => filmTag(w, f, (f.frame || w.frame) === '2.39:1' ? 'is-wide' : '')).join('')}</div>
  <div class="case-text" data-reveal-group><p data-reveal>${t(w.desc)}</p>${roleText(w)}</div>`;
  }
  const f = w.films[0];
  if (w.frame === '9:16') {
    return `<div class="film film--v" data-reveal-group>${filmTag(w, f)}<div class="film__side"><p data-reveal>${t(w.desc)}</p>${roleText(w)}${stillsBlock(w)}</div></div>`;
  }
  const cls = w.frame === '1:1' ? ' film--s' : '';
  return `<div class="film${cls}" data-reveal>${filmTag(w, f)}</div>
  <div class="case-text" data-reveal-group><p data-reveal>${t(w.desc)}</p>${roleText(w)}</div>`;
}

function stillsBlock(w) {
  const srcs = w.films.length > 1 ? w.films.map((f) => `${f.src}-2`) : [1, 2, 3].map((k) => `${w.films[0].src}-${k}`);
  return `<div class="stills" data-reveal-group>${srcs.map((s) => `<img src="${R}assets/media/stills/${s}.webp" loading="lazy" decoding="async" alt="" data-reveal>`).join('')}</div>`;
}

function project(w, i) {
  const title = { en: `${w.title} · ULTEMA`, ru: `${w.title} · ULTEMA` };
  const meta = [
    w.client && [{ en: 'Client', ru: 'Клиент' }, t(w.client)],
    w.year && [{ en: 'Year', ru: 'Год' }, w.year],
    [{ en: 'Length', ru: 'Длина' }, w.films.map((f) => f.dur).join(' · ')],
    [{ en: 'Frame', ru: 'Формат' }, [...new Set(w.films.map((f) => f.frame || w.frame))].join(' · ')],
  ].filter(Boolean);
  return `${head({ rel: R, title, desc: w.desc.en, path: `/work/${w.slug}/`, image: `assets/media/work/${w.films[0].src}.webp` })}
<body>
${symbol}
${bar({ rel: R, home: R, solid: true, links: `<a class="link" href="${R}#work">${t({ en: 'All work', ru: 'Все работы' })}</a>
    <a class="link bar__wide" href="${R}#contact">${t({ en: 'Contact', ru: 'Контакты' })}</a>` })}
<main id="top">
  <div class="case-top">
    <div class="case-top__head">
      <div><h1 class="case-top__title display" data-reveal>${w.title}</h1><p class="case-top__kind" data-reveal>${t(w.kind)}</p></div>
    </div>
    <p class="case-top__meta" data-reveal-group>${meta.map(([k, v]) => `<span data-reveal><b>${t(k)}</b> ${v}</span>`).join('')}</p>
  </div>
  ${filmBlock(w)}
  ${w.case ? skyRaceChapters() : w.frame === '9:16' && w.films.length === 1 ? '' : stillsBlock(w)}
  <section class="more" aria-labelledby="more-title">
    <h2 class="more__title display" id="more-title" data-reveal>${t({ en: 'More films', ru: 'Ещё работы' })}</h2>
    <div class="more__row" data-reveal-group>
      ${[1, 2, 3, 4].map((k) => works[(i + k) % works.length]).map((n) => `<a class="tile" href="${R}work/${n.slug}/" style="--ar:${ratio[n.frame].toFixed(4)}" data-reveal><div class="tile__media"><img src="${R}assets/media/work/${n.films[0].src}.webp" loading="lazy" decoding="async" ${tAttr('alt', { en: `${n.title}: a frame from the film`, ru: `${n.title}: кадр из ролика` })}></div><p class="tile__cap"><span>${n.title}</span><span class="tile__cta" aria-hidden="true">${t({ en: 'Watch the film', ru: 'Смотреть ролик' })}</span></p></a>`).join('\n      ')}
    </div>
  </section>
</main>
${footer(R, false)}
</body>
</html>
`;
}

// ---------- 404.html (served at any depth, so its paths are absolute) ----------
function notFound() {
  const title = { en: 'Page not found · ULTEMA', ru: 'Страница не найдена · ULTEMA' };
  return `${head({ rel: '/', title, desc: 'This page does not exist on ultema.pro.', path: '/404.html' }).replace('<meta name="theme-color"', '<meta name="robots" content="noindex">\n<meta name="theme-color"')}
<body>
${symbol}
${bar({ rel: '/', home: '/', solid: true, links: `<a class="link" href="/#work">${t({ en: 'Work', ru: 'Работы' })}</a>
    <a class="link bar__wide" href="/#contact">${t({ en: 'Contact', ru: 'Контакты' })}</a>` })}
<main id="top">
  <section class="lost" aria-labelledby="lost-title">
    <video class="lost__video" muted loop playsinline autoplay preload="auto" poster="/assets/media/work/sky-race.webp" src="/assets/media/hover/sky-race.mp4" aria-hidden="true"></video>
    <div class="lost__copy">
      <h1 class="case-top__title display" id="lost-title">${t({ en: 'Page not found', ru: 'Страница не найдена' })}</h1>
      <p class="case-top__kind">${t({ en: 'This page does not exist or has moved. Every film is on the main page.', ru: 'Такой страницы нет или она переехала. Все ролики на главной.' })}</p>
      <p style="margin-top:28px"><a class="btn" href="/#work">${t({ en: 'See the work', ru: 'Смотреть работы' })}</a></p>
    </div>
  </section>
  <section class="more" aria-labelledby="more-title">
    <h2 class="more__title display" id="more-title" data-reveal>${t({ en: 'Start with these', ru: 'Начните с этих' })}</h2>
    <div class="more__row" data-reveal-group>
      ${works.slice(0, 4).map((n) => `<a class="tile" href="/work/${n.slug}/" style="--ar:${ratio[n.frame].toFixed(4)}" data-reveal><div class="tile__media"><img src="/assets/media/work/${n.films[0].src}.webp" loading="lazy" decoding="async" ${tAttr('alt', { en: `${n.title}: a frame from the film`, ru: `${n.title}: кадр из ролика` })}></div><p class="tile__cap"><span>${n.title}</span><span class="tile__cta" aria-hidden="true">${t({ en: 'Watch the film', ru: 'Смотреть ролик' })}</span></p></a>`).join('\n      ')}
    </div>
  </section>
</main>
${footer('/', false)}
</body>
</html>
`;
}

writeFileSync('index.html', index());
writeFileSync('404.html', notFound());
works.forEach((w, i) => {
  const dir = `work/${w.slug}`;
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/index.html`, project(w, i));
});
writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${CONFIG.site}/</loc></url>
${works.map((w) => `  <url><loc>${CONFIG.site}/work/${w.slug}/</loc></url>`).join('\n')}
</urlset>
`);
console.log(`built index.html and ${works.length} project pages`);
