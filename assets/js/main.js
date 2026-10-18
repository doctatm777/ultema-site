/* ultema.pro — site scripts (vanilla, no deps) */
(() => {
  'use strict';

  /* ============ CONFIG — заполнить перед запуском ============ */
  const CONFIG = {
    // Ключ Web3Forms (https://web3forms.com — бесплатно, письма приходят на почту).
    // Пока пусто — форма откроет почтовый клиент (mailto) с заполненным письмом.
    web3formsKey: '',
    email: 'hello@ultema.pro',          // заменить на реальную почту Артёма
    telegram: '',                        // напр. 'ultema' (без @) — если пусто, кнопка Telegram скрывается
    instagram: 'https://www.instagram.com/ruby_gs300',
    behance: 'https://www.behance.net/artemryakin',
  };
  window.ULTEMA_CONFIG = CONFIG;

  // черновой режим: TODO-блоки видны при открытии файла локально или по ссылке с ?draft
  if (location.protocol === 'file:' || /^(localhost|127\.0\.0\.1)$/.test(location.hostname) || /[?&]draft\b/.test(location.search)) {
    document.documentElement.classList.add('draft');
  }

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ---------- header / menu / progress ---------- */
  const header = $('.site-header');
  const progress = $('.progress');
  const onScroll = () => {
    const y = scrollY;
    header && header.classList.toggle('solid', y > 40);
    if (progress) {
      const h = document.documentElement.scrollHeight - innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const burger = $('.burger');
  burger && burger.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', open);
  });
  $$('.nav a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));

  /* ---------- language: EN+RU (default) / EN only ---------- */
  const langBtn = $('.lang');
  const applyLang = () => {
    const only = localStorage.getItem('ultema-lang') === 'en';
    document.documentElement.classList.toggle('ru-hide', only);
    if (langBtn) langBtn.innerHTML = only ? '<b>EN</b> / RU' : 'EN / <b>RU</b>';
  };
  try { applyLang(); } catch (e) {}
  langBtn && langBtn.addEventListener('click', () => {
    try {
      const only = localStorage.getItem('ultema-lang') === 'en';
      localStorage.setItem('ultema-lang', only ? 'both' : 'en');
      applyLang();
    } catch (e) {}
  });

  /* ---------- contact links from CONFIG ---------- */
  $$('[data-link="email"]').forEach(a => { a.href = 'mailto:' + CONFIG.email; const t = $('.val', a); if (t) t.textContent = CONFIG.email; });
  $$('[data-link="telegram"]').forEach(a => {
    if (!CONFIG.telegram) { a.remove(); return; }
    a.href = 'https://t.me/' + CONFIG.telegram; const t = $('.val', a); if (t) t.textContent = '@' + CONFIG.telegram;
  });
  $$('[data-link="instagram"]').forEach(a => a.href = CONFIG.instagram);
  $$('[data-link="behance"]').forEach(a => a.href = CONFIG.behance);

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver((es) => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });
  $$('.reveal,.reveal-x').forEach(el => io.observe(el));

  /* ---------- lazy video: load + autoplay when near viewport ---------- */
  const vio = new IntersectionObserver((es) => {
    es.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) {
        if (v.dataset.src && !v.src) { v.src = v.dataset.src; v.load(); }
        if (v.autoplay || v.dataset.autoplay !== undefined) { const p = v.play(); p && p.catch(() => {}); }
      } else if (!v.paused && (v.dataset.autoplay !== undefined)) {
        v.pause();
      }
    });
  }, { rootMargin: '300px 0px' });
  $$('video[data-src],video[data-autoplay]').forEach(v => vio.observe(v));

  /* ---------- work cards: hover preview + glow + tilt ---------- */
  $$('.card').forEach(card => {
    const v = $('video', card);
    const glow = $('.card-glow', card);
    let timer;
    card.addEventListener('pointerenter', () => {
      if (!fine) return;
      if (v) {
        if (v.dataset.src && !v.src) { v.src = v.dataset.src; v.load(); }
        timer = setTimeout(() => { v.play().then(() => card.classList.add('playing')).catch(() => {}); }, 120);
      }
    });
    card.addEventListener('pointerleave', () => {
      clearTimeout(timer);
      if (v) { v.pause(); card.classList.remove('playing'); }
      card.style.transform = '';
    });
    card.addEventListener('pointermove', (e) => {
      if (!fine || reduce) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      if (glow) { glow.style.setProperty('--mx', (x * 100) + '%'); glow.style.setProperty('--my', (y * 100) + '%'); }
      const rx = (0.5 - y) * 4, ry = (x - 0.5) * 4;
      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    // на тач-устройствах: играем превью, когда карточка в кадре
    if (!fine && v) {
      const tio = new IntersectionObserver(es => es.forEach(en => {
        if (en.isIntersecting) { if (v.dataset.src && !v.src) { v.src = v.dataset.src; v.load(); } v.play().then(() => card.classList.add('playing')).catch(() => {}); }
        else { v.pause(); card.classList.remove('playing'); }
      }), { threshold: 0.6 });
      tio.observe(card);
    }
  });

  /* ---------- lightbox ---------- */
  const lb = $('.lb');
  if (lb) {
    const img = $('img', lb), count = $('.count', lb);
    let items = [], idx = 0;
    const show = (i) => {
      idx = (i + items.length) % items.length;
      img.src = items[idx].href; img.alt = items[idx].dataset.alt || '';
      count.textContent = (idx + 1) + ' / ' + items.length;
    };
    const open = (group, i) => { items = group; show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; };
    const close = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };
    $$('[data-lightbox]').forEach(a => a.addEventListener('click', (e) => {
      e.preventDefault();
      const group = $$(`[data-lightbox="${a.dataset.lightbox}"]`);
      open(group, group.indexOf(a));
    }));
    $('.close', lb).addEventListener('click', close);
    $('.prev', lb).addEventListener('click', () => show(idx - 1));
    $('.next', lb).addEventListener('click', () => show(idx + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
    let sx = 0;
    lb.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
    lb.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1)); });
  }

  /* ---------- subnav active section ---------- */
  const subLinks = $$('.subnav a');
  if (subLinks.length) {
    const map = new Map(subLinks.map(a => [a.getAttribute('href').slice(1), a]));
    const sio = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) { subLinks.forEach(a => a.classList.remove('active')); const a = map.get(e.target.id); a && a.classList.add('active'); } });
    }, { rootMargin: '-40% 0px -55% 0px' });
    map.forEach((a, id) => { const s = document.getElementById(id); s && sio.observe(s); });
  }

  /* ---------- custom cursor ---------- */
  if (fine && !reduce) {
    const c = document.createElement('div'); c.className = 'cursor'; document.body.appendChild(c);
    let x = 0, y = 0, cx = 0, cy = 0;
    addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; c.classList.remove('hide'); });
    addEventListener('pointerleave', () => c.classList.add('hide'));
    const loop = () => { cx += (x - cx) * .25; cy += (y - cy) * .25; c.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`; requestAnimationFrame(loop); };
    loop();
    $$('a,button,.card,[data-lightbox]').forEach(el => {
      el.addEventListener('pointerenter', () => c.classList.add('big'));
      el.addEventListener('pointerleave', () => c.classList.remove('big'));
    });
  }

  /* ---------- glitch on hero title (periodic) ---------- */
  const gl = $('.glitch');
  if (gl && !reduce) setInterval(() => { gl.classList.add('on'); setTimeout(() => gl.classList.remove('on'), 900); }, 6000);

  /* ---------- brief form ---------- */
  const form = $('form.brief');
  if (form) {
    const status = $('.form-status', form);
    const btn = $('button[type=submit]', form);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if ($('.hp input', form) && $('.hp input', form).value) return; // honeypot
      const empty = $$('[required]', form).find(f => !f.value.trim());
      if (empty) {
        status.className = 'form-status err';
        status.textContent = 'Заполните имя, контакт и описание проекта. / Please fill in name, contact and project.';
        empty.focus();
        return;
      }
      const data = new FormData(form);
      const services = data.getAll('services').join(', ');
      const payload = {
        name: data.get('name'), contact: data.get('contact'),
        budget: data.get('budget'), services, message: data.get('message'),
      };
      if (!CONFIG.web3formsKey) {
        // Fallback: открыть почтовый клиент с готовым письмом
        const body = `Имя: ${payload.name}\nКонтакт: ${payload.contact}\nБюджет: ${payload.budget}\nЧто нужно: ${services}\n\n${payload.message}`;
        location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent('Заявка с ultema.pro — ' + payload.name)}&body=${encodeURIComponent(body)}`;
        status.className = 'form-status ok';
        status.textContent = 'Открываю почтовый клиент… Если письмо не открылось — напишите напрямую на ' + CONFIG.email;
        return;
      }
      btn.disabled = true; status.className = 'form-status'; status.textContent = '';
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ access_key: CONFIG.web3formsKey, subject: 'Заявка с ultema.pro — ' + payload.name, from_name: 'ultema.pro', ...payload }),
        });
        const j = await res.json();
        if (j.success) { status.className = 'form-status ok'; status.textContent = 'Спасибо! Заявка отправлена — отвечу в ближайшее время. / Thanks! Your request has been sent.'; form.reset(); }
        else throw new Error(j.message || 'error');
      } catch (err) {
        status.className = 'form-status err';
        status.textContent = 'Не удалось отправить. Напишите на ' + CONFIG.email;
      } finally { btn.disabled = false; }
    });
  }

  /* ---------- year ---------- */
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
