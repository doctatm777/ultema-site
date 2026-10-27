// ULTEMA site script: language, reel, the wordmark's flight into the bar, the wall, reveals, Sky Race light passes.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');

  // ---------- Language ----------
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  };
  function setLang(lang) {
    root.dataset.lang = lang;
    root.lang = lang;
    $$('[data-set-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setLang === lang)));
    $$('[data-i18n-attr]').forEach((el) => {
      for (const attr of el.dataset.i18nAttr.split(',')) {
        const v = el.dataset[`${attr.replace(/-./g, (m) => m[1].toUpperCase())}${lang === 'ru' ? 'Ru' : 'En'}`];
        if (v != null) el.setAttribute(attr, v);
      }
    });
    const t = $('meta[name="ultema-title"]');
    if (t) document.title = t.dataset[lang];
    store.set('ultema-lang', lang);
  }
  $$('[data-set-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.setLang)));
  setLang(root.dataset.lang === 'ru' ? 'ru' : 'en');

  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  // ---------- Reel ----------
  const hero = $('.hero');
  const reel = $('#reel');
  const pauseBtn = $('[data-reel-toggle]');
  if (reel) {
    const portrait = matchMedia('(orientation: portrait) and (max-width: 820px)');
    const pick = () => {
      const want = portrait.matches ? reel.dataset.srcV : reel.dataset.srcH;
      const poster = portrait.matches ? reel.dataset.posterV : reel.dataset.posterH;
      if (!reel.currentSrc.endsWith(want)) {
        reel.poster = poster; reel.src = want;
        if (!reel.dataset.paused) reel.play().catch(() => {});
      }
    };
    portrait.addEventListener('change', pick);
    const setPaused = (p) => {
      reel.dataset.paused = p ? '1' : '';
      pauseBtn?.setAttribute('aria-pressed', String(p));
      pauseBtn?.querySelectorAll('[data-icon]').forEach((i) => { i.style.display = i.dataset.icon === (p ? 'play' : 'pause') ? '' : 'none'; });
      if (p) reel.pause(); else reel.play().catch(() => {});
    };
    if (reduce.matches) reel.dataset.paused = '1';
    pick();
    setPaused(reduce.matches);
    // Held still for reduced motion: rest on the first bright shot, not on the opening logo, so a film is named.
    if (reduce.matches && reel.dataset.intro) {
      const rest = () => { reel.currentTime = parseFloat(reel.dataset.intro); };
      if (reel.readyState >= 1) rest(); else reel.addEventListener('loadedmetadata', rest, { once: true });
    }
    pauseBtn?.addEventListener('click', () => setPaused(!reel.dataset.paused));
    // Sound: the reel autoplays muted (browsers allow nothing else); one press turns the track on.
    const soundBtn = $('[data-reel-sound]');
    soundBtn?.addEventListener('click', () => {
      reel.muted = !reel.muted;
      soundBtn.setAttribute('aria-pressed', String(!reel.muted));
      soundBtn.querySelectorAll('[data-icon]').forEach((i) => { i.style.display = i.dataset.icon === (reel.muted ? 'muted' : 'sound') ? '' : 'none'; });
      if (!reel.muted && reel.dataset.paused) setPaused(false);
    });
    // Stop decoding when the reel is off screen.
    new IntersectionObserver(([e]) => {
      if (reel.dataset.paused) return;
      if (e.isIntersecting) reel.play().catch(() => {}); else reel.pause();
    }).observe(reel);
  }

  // ---------- The film on screen, named ----------
  const now = $('[data-now]');
  if (reel && now) {
    const title = $('[data-now-title]', now);
    let shown = '';
    const shots = () => JSON.parse(reel.dataset.shots);
    reel.addEventListener('timeupdate', () => {
      const list = shots();
      let cur = list[0];
      for (const sh of list) if (reel.currentTime >= sh[1]) cur = sh;
      if (cur[0] === shown) return;
      shown = cur[0];
      now.classList.toggle('is-empty', !cur[0]); now.inert = !cur[0];   // the opening logo names no film
      if (!cur[0]) return;
      now.href = `work/${cur[0]}/`;
      if (reduce.matches) { title.textContent = cur[2]; return; }
      title.classList.add('is-changing');                 // a short fade so the name changes with the cut, not as a jump
      setTimeout(() => { title.textContent = cur[2]; title.classList.remove('is-changing'); }, 180);
    });
  }

  // ---------- Load moment and the intro ----------
  // The reel shows through the ULTEMA letters, then the letters open to the full screen and the bar logo appears.
  const loaded = () => hero?.classList.add('is-loaded');
  requestAnimationFrame(() => requestAnimationFrame(loaded));
  setTimeout(loaded, 120); // a background tab may hold animation frames back
  if (root.classList.contains('intro-on')) {
    // The reel opens on its own logo over black; start the intro on the bright Weds wheel shot (7s) so the letters read as film, not as black.
    if (reel && reel.dataset.intro) {
      const seek = () => { reel.currentTime = parseFloat(reel.dataset.intro); };
      if (reel.readyState >= 1) seek(); else reel.addEventListener('loadedmetadata', seek, { once: true });
    }
    try { sessionStorage.setItem('ultema-intro', '1'); } catch { /* private mode */ }
    let done = false;
    const finish = () => { if (done) return; done = true; root.classList.add('intro-done'); document.dispatchEvent(new Event('ultema:intro-done')); };
    const zoom = () => { if (root.classList.contains('is-zooming')) return; root.classList.add('is-zooming'); setTimeout(finish, 1150); };
    const hold = setTimeout(zoom, 1500);
    // Any intent to move on skips the hold and opens the letters at once.
    const skip = () => { clearTimeout(hold); zoom(); };
    ['wheel', 'keydown', 'pointerdown', 'touchstart'].forEach((ev) => addEventListener(ev, skip, { once: true, passive: true }));
  }

  // ---------- Bar ----------
  const bar = $('.bar');
  const frame = () => {
    const heroH = hero ? hero.offsetHeight : 0;
    bar?.classList.toggle('is-solid', scrollY > heroH - bar.offsetHeight - 1);
  };
  addEventListener('scroll', frame, { passive: true });
  addEventListener('resize', frame);
  frame();

  // ---------- The wall ----------
  const wall = $('.wall');
  if (wall) {
    const tiles = $$('.tile', wall);
    const cycle = [300, 420, 260, 360];   // the uneven row heights of the wall, at 1440px
    const gap = 8;
    const arOf = (t) => parseFloat(t.style.getPropertyValue('--ar'));
    const fit = (row, W) => (W - gap * (row.length - 1) - 1) / row.reduce((s, t) => s + arOf(t), 0); // 1px of slack against rounding
    // Rows justified to both margins; each row breaks where its height lands closest to its target.
    function rowsDesktop(list, W) {
      const k = Math.max(0.75, Math.min(1.35, innerWidth / 1440));
      const rows = [];
      let i = 0;
      while (i < list.length) {
        const target = cycle[rows.length % cycle.length] * k;
        let best = i + 1, bestDiff = Infinity;
        for (let j = i + 1; j <= list.length; j++) {
          const h = fit(list.slice(i, j), W);
          const d = Math.abs(h - target);
          if (d < bestDiff) { best = j; bestDiff = d; }
          if (h < target * 0.6) break;
        }
        const rest = list.slice(best);
        const restWidth = rest.reduce((s, t) => s + arOf(t), 0) * cycle[(rows.length + 1) % cycle.length] * k;
        if (rest.length && restWidth < W * 0.6) best = list.length;   // never leave a stub of a row at the end
        rows.push(list.slice(i, best));
        i = best;
      }
      return rows;
    }
    // On a phone: a widescreen film takes the width alone, vertical and square films go in pairs.
    function rowsPhone(list) {
      const rows = [];
      let pair = [];
      for (const t of list) {
        if (arOf(t) > 1.2) { rows.push([t]); continue; }
        pair.push(t);
        if (pair.length === 2) { rows.push(pair); pair = []; }
      }
      if (pair.length) {
        const prev = rows.findLast((r) => r.length === 2);
        if (prev) prev.push(...pair); else rows.push(pair);
      }
      return rows;
    }
    function layout() {
      const W = wall.clientWidth;
      if (!W) return;
      const shown = tiles.filter((t) => !t.hidden);
      const rows = innerWidth <= 820 ? rowsPhone(shown) : rowsDesktop(shown, W);
      let order = 0;
      for (const row of rows) {
        const h = fit(row, W);
        for (const t of row) {
          const w = arOf(t) * h;
          t.style.width = `${w}px`; t.style.setProperty('--h', `${h}px`); t.style.order = String(order++);
        }
      }
      wall.classList.add('is-laid');
    }
    layout();
    new ResizeObserver(layout).observe(wall);

    // Filter by frame
    $$('[data-filter]').forEach((btn) => btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      $$('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      tiles.forEach((t) => { t.hidden = f !== 'all' && t.dataset.group !== f; });
      layout();
    }));

    // Video in each tile: hover on a mouse, in view on a phone.
    const play = (t) => {
      if (reduce.matches) return;
      const v = $('video', t);
      if (!v.src) v.src = v.dataset.src;
      v.play().then(() => t.classList.add('is-playing')).catch(() => {});
    };
    const stop = (t) => { const v = $('video', t); t.classList.remove('is-playing'); v.pause(); };
    if (finePointer.matches) {
      tiles.forEach((t) => {
        t.addEventListener('pointerenter', () => play(t));
        t.addEventListener('pointerleave', () => stop(t));
        t.addEventListener('focus', () => play(t));
        t.addEventListener('blur', () => stop(t));
      });
    } else {
      let current = null;
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio >= 0.75) { if (current && current !== e.target) stop(current); current = e.target; play(e.target); }
          else if (e.target === current) { stop(e.target); current = null; }
        }
      }, { threshold: [0, 0.75] });
      tiles.forEach((t) => io.observe(t));
    }
  }

  // ---------- Text rises out of a mask as it arrives: headings letter by letter, other text word by word ----------
  // Each word is a mask; what sits in it rises from below. Screen readers get the plain text from a visually hidden copy.
  // Interface text (bar, filter, tiles, the reel's film name, buttons) stays still so it is always ready to use.
  const heads = $$('.display:is(h1, h2)');
  const prose = $$('main :is(p, h3, figcaption, li, h2:not(.display)), .contact__mail, .foot__line')
    .filter((el) => !el.closest('.tile, .filter, .hero__now, nav, button, .bar'));
  const texts = prose.filter((el) => !prose.some((o) => o !== el && o.contains(el)));
  if ((heads.length || texts.length) && 'IntersectionObserver' in window) {
    const split = (node, n, letters) => {
      for (const child of [...node.childNodes]) {
        if (child.nodeType === 1) { n = split(child, child.hasAttribute('lang') ? 0 : n, letters); continue; }
        if (child.nodeType !== 3 || !child.textContent.trim()) continue;
        const frag = document.createDocumentFragment();
        const plain = document.createElement('span'); plain.className = 'vh'; plain.textContent = child.textContent;
        const shown = document.createElement('span'); shown.setAttribute('aria-hidden', 'true');
        child.textContent.split(/(\s+)/).forEach((word) => {
          if (!word) return;
          if (/^\s+$/.test(word)) { shown.append(word); return; }
          const w = document.createElement('span'); w.className = 'w';
          for (const part of letters ? word : [word]) {
            const c = document.createElement('span'); c.className = 'c'; c.style.setProperty('--i', String(n++)); c.textContent = part; w.append(c);
          }
          shown.append(w);
        });
        frag.append(plain, shown);
        child.replaceWith(frag);
      }
      return n;
    };
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -8% 0px' });
    const prep = (el, letters) => { split(el, 0, letters); el.removeAttribute('data-reveal'); el.classList.add('split', letters ? 'split--letters' : 'split--words'); io.observe(el); };
    heads.forEach((h) => prep(h, true));
    texts.forEach((p) => prep(p, false));
  }

  // ---------- Reveal on entry: stagger the parts of a group (the animation itself is CSS) ----------
  const groups = new Map();
  $$('[data-reveal]').forEach((el) => {
    const g = el.closest('[data-reveal-group]') || el.parentElement;
    const n = groups.get(g) || 0; groups.set(g, n + 1);
    el.style.setProperty('--k', String(n % 4));
  });

  // ---------- A project's film starts muted, unless motion is reduced ----------
  $$('video[data-autoplay]').forEach((v) => { if (!reduce.matches) v.play().catch(() => {}); });

  // ---------- Loops on project pages: play while on screen ----------
  const loops = $$('video[data-loop]');
  if (loops.length) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const v = e.target;
        if (e.isIntersecting && !reduce.matches) { if (!v.src) v.src = v.dataset.loop; v.play().catch(() => {}); }
        else v.pause();
      }
    }, { rootMargin: '200px 0px' });
    loops.forEach((v) => io.observe(v));
  }

  // ---------- Sky Race: step through the light passes ----------
  // One picture swaps; a short blur bridges the two states so they read as one light changing.
  $$('.passes').forEach((box) => {
    const big = $('.passes__big', box);
    const btns = $$('.passes__steps button', box);
    btns.forEach((b) => b.addEventListener('click', () => {
      if (b.getAttribute('aria-pressed') === 'true') return;
      btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      big.src = b.dataset.src;
      big.alt = root.dataset.lang === 'ru' ? b.dataset.altRu : b.dataset.altEn;
      if (!reduce.matches) big.animate([{ filter: 'blur(6px)', opacity: 0.7 }, { filter: 'blur(0)', opacity: 1 }], { duration: 240, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
    }));
  });

  // ---------- Logos draw themselves on: the outline is traced letter by letter, then the letters fill (owner's pick) ----------
  // The bar logo draws as the page opens (after the intro on a first visit), the footer logo as it comes on screen; both replay on hover.
  if (!reduce.matches) {
    const drawLogo = (svg) => {
      if (!svg || svg.classList.contains('is-drawing')) return;
      svg.classList.add('is-drawing');
      setTimeout(() => svg.classList.remove('is-drawing'), 1500 + 5 * 60 + 50);
    };
    const barLogo = $('.bar__home .logo');
    if (root.classList.contains('intro-on') && !root.classList.contains('intro-done')) document.addEventListener('ultema:intro-done', () => drawLogo(barLogo), { once: true });
    else drawLogo(barLogo);
    const footLogo = $('.foot__mark .logo');
    if (footLogo) {
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { drawLogo(footLogo); io.disconnect(); } }, { threshold: 1 });
      io.observe(footLogo);
    }
    if (finePointer.matches) $$('.bar__home, .foot__mark').forEach((a) => a.addEventListener('pointerenter', () => drawLogo($('.logo', a))));
  }

  // ---------- Cursor: a dot on the pointer and a ring that follows with weight (mouse only) ----------
  // Over a link the ring opens; over a film it fills and says Watch. Hidden until the first move and when the pointer leaves.
  if (finePointer.matches) {
    const ring = document.createElement('div');
    ring.className = 'cursor';
    ring.setAttribute('aria-hidden', 'true');
    ring.innerHTML = '<i></i><span><span lang="en">WATCH</span><span lang="ru">СМОТРЕТЬ</span></span>';
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    dot.setAttribute('aria-hidden', 'true');
    document.body.append(ring, dot);
    root.classList.add('has-cursor');

    const p = { x: 0, y: 0 }, r = { x: 0, y: 0 };
    let running = false, shown = false;
    const place = (n, x, y) => { n.style.transform = `translate3d(${x}px, ${y}px, 0)`; };
    const tick = () => {
      const k = reduce.matches ? 1 : 0.16;
      r.x += (p.x - r.x) * k; r.y += (p.y - r.y) * k;
      place(ring, r.x, r.y);
      if (Math.abs(p.x - r.x) + Math.abs(p.y - r.y) > 0.1) requestAnimationFrame(tick); else running = false;
    };
    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      p.x = e.clientX; p.y = e.clientY;
      if (!shown) { shown = true; r.x = p.x; r.y = p.y; root.classList.add('cursor-on'); }
      place(dot, p.x, p.y);
      const hit = e.target.closest?.('.tile, a, button, [role="button"], video[controls]');
      ring.classList.toggle('is-film', !!hit?.classList.contains('tile'));
      ring.classList.toggle('is-link', !!hit && !hit.classList.contains('tile'));
      if (!running) { running = true; requestAnimationFrame(tick); }
    }, { passive: true });
    document.addEventListener('pointerleave', () => { shown = false; root.classList.remove('cursor-on'); });
    addEventListener('pointerdown', () => ring.classList.add('is-down'));
    addEventListener('pointerup', () => ring.classList.remove('is-down'));
  }
})();
