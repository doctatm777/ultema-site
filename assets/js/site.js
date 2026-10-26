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
    pauseBtn?.addEventListener('click', () => setPaused(!reel.dataset.paused));
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
    const shots = () => JSON.parse(reel.currentSrc.endsWith(reel.dataset.srcV) ? reel.dataset.shotsV : reel.dataset.shotsH);
    reel.addEventListener('timeupdate', () => {
      const list = shots();
      let cur = list[0];
      for (const sh of list) if (reel.currentTime >= sh[1]) cur = sh;
      if (cur[0] === shown) return;
      shown = cur[0];
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
    // The phone reel opens on a grey burnout; start the intro on the bright orange ESM 2025 shot (13s, chosen by measuring the letter band) so the letters read as film.
    if (reel && reel.dataset.introV && reel.src.endsWith(reel.dataset.srcV)) {   // src is set synchronously by pick(); currentSrc lags
      const seek = () => { reel.currentTime = parseFloat(reel.dataset.introV); };
      if (reel.readyState >= 1) seek(); else reel.addEventListener('loadedmetadata', seek, { once: true });
    }
    try { sessionStorage.setItem('ultema-intro', '1'); } catch { /* private mode */ }
    let done = false;
    const finish = () => { if (done) return; done = true; root.classList.add('intro-done'); };
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
})();
