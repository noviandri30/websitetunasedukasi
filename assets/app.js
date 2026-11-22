(() => {
  'use strict';
  const qs = selector => document.querySelector(selector);
  const qsa = selector => [...document.querySelectorAll(selector)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav = qs('#nav');
  const toggle = qs('#menu-toggle');
  const header = qs('.header');
  const backTop = qs('#back-to-top');
  const year = qs('#year');
  const progress = qs('#scroll-progress');
  if (year) year.textContent = new Date().getFullYear();

  function closeMenu() {
    if (!nav || !toggle) return;
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Buka navigasi');
  }
  if (nav && toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Tutup navigasi' : 'Buka navigasi');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    document.addEventListener('click', e => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) closeMenu();
    });
    window.addEventListener('resize', () => { if (window.innerWidth > 1020) closeMenu(); });
  }

  let scrollTick = false;
  function updateScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 14);
    if (backTop) backTop.classList.toggle('visible', window.scrollY > 600);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = `${max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 0}%`;
    }
    scrollTick = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollTick) { window.requestAnimationFrame(updateScroll); scrollTick = true; }
  }, { passive: true });
  window.addEventListener('resize', updateScroll);
  updateScroll();

  // Entrance animations: only enable after IO is attached, so content remains visible without JS.
  if ('IntersectionObserver' in window && !reduced) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -14px 0px' });
    qsa('.reveal').forEach(el => observer.observe(el));
    document.documentElement.classList.add('can-animate');
  }

  // Current page nav; keep homepage anchor links unchanged.
  const thisPage = location.pathname.split('/').pop() || 'index.html';
  qsa('.nav a[href$=".html"]').forEach(a => {
    const to = a.getAttribute('href');
    if (to === thisPage) a.setAttribute('aria-current', 'page');
  });

  // Keep hero interactive without changing its precise auto-height/contain layout.
  const visual = qs('#hero-visual');
  const hero = qs('.hero-animated');
  if (visual && hero && !reduced && window.matchMedia('(pointer: fine)').matches) {
    const layers = qsa('#hero-visual .floating, #hero-visual .hero-illustration, #hero-visual .hero-star');
    let raf = 0;
    hero.addEventListener('pointermove', evt => {
      const box = hero.getBoundingClientRect();
      const x = (evt.clientX - box.left) / box.width - .5;
      const y = (evt.clientY - box.top) / box.height - .5;
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => layers.forEach((layer,i) => {
        const scale = (i % 4 + 1) * 4;
        layer.style.translate = `${(x*scale).toFixed(2)}px ${(y*scale).toFixed(2)}px`;
      }));
    });
    hero.addEventListener('pointerleave', () => layers.forEach(layer => { layer.style.translate = ''; }));
  }

  // Gentle card interactions on fine-pointer devices.
  if (!reduced && window.matchMedia('(pointer: fine)').matches) {
    qsa('[data-tilt]').forEach(card => {
      card.addEventListener('pointermove', evt => {
        const r = card.getBoundingClientRect();
        const x = (evt.clientX - r.left) / r.width - .5;
        const y = (evt.clientY - r.top) / r.height - .5;
        card.style.setProperty('--tilt-x', `${(-y*1.5).toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${(x*1.5).toFixed(2)}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.removeProperty('--tilt-x');
        card.style.removeProperty('--tilt-y');
      });
    });
  }

  const matches = {
    dasar: ['Paket A — setara SD','Fokus awal pada literasi, numerasi, rasa ingin tahu, dan kebiasaan belajar positif.','paket-a.html','🌱'],
    menengah: ['Paket B — setara SMP','Mendukung penguatan penalaran, komunikasi, kemandirian, serta eksplorasi minat.','paket-b.html','🎨'],
    lanjut: ['Paket C — setara SMA','Membantu mempersiapkan kompetensi dan arah untuk pendidikan lanjut atau pengembangan diri.','paket-c.html','🚀'],
    fleksibel: ['Homeschooling — cara belajar fleksibel','Pendekatan yang mempertimbangkan ritme dan kebutuhan keluarga, dengan rencana dan evaluasi yang tetap jelas.','homeschooling.html','🏡']
  };
  const result = qs('#finder-result');
  qsa('[data-finder]').forEach(btn => btn.addEventListener('click', () => {
    qsa('[data-finder]').forEach(other => other.classList.toggle('is-active', other === btn));
    const [title,desc,link,icon] = matches[btn.dataset.finder];
    if (!result) return;
    result.replaceChildren();
    const emoji = document.createElement('span'); emoji.className='finder-result-icon'; emoji.textContent=icon;
    const h3 = document.createElement('h3'); h3.textContent=title;
    const p = document.createElement('p'); p.textContent=desc;
    const a = document.createElement('a'); a.className='card-link'; a.href=link; a.textContent='Jelajahi Halaman Program ↗';
    result.append(emoji,h3,p,a);
  }));

  // Filterable inspiration cards.
  qsa('[data-filter]').forEach(btn => btn.addEventListener('click', () => {
    const selected = btn.dataset.filter;
    qsa('[data-filter]').forEach(button => {
      const active = button === btn;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    qsa('[data-category]').forEach(card => {
      card.hidden = selected !== 'semua' && card.dataset.category !== selected;
    });
  }));

  // FAQ filters preserve accessibility and native details/summary behavior.
  qsa('[data-faq-filter]').forEach(btn => btn.addEventListener('click', () => {
    const selected = btn.dataset.faqFilter;
    qsa('[data-faq-filter]').forEach(button => {
      const active = button === btn;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    qsa('[data-faq-category]').forEach(item => {
      item.hidden = selected !== 'semua' && item.dataset.faqCategory !== selected;
      if (item.hidden) item.open = false;
    });
  }));

  // Form is intentionally a frontend draft, not a fake production submission.
  const form = qs('#contact-form');
  const program = qs('#program-select');
  const help = qs('#form-help');
  if (program) {
    const rawParam = new URLSearchParams(window.location.search).get('program');
    if (rawParam) {
      const norm = rawParam.toLowerCase().replaceAll('-', ' ').trim();
      const option = [...program.options].find(opt => opt.textContent.toLowerCase() === norm);
      if (option) program.value = option.value;
    }
    qsa('[data-program]').forEach(a => a.addEventListener('click', () => {
      if ([...program.options].some(opt => opt.value === a.dataset.program)) program.value = a.dataset.program;
    }));
  }
  if (form && program) form.addEventListener('submit', async evt => {
    evt.preventDefault();
    if (!form.reportValidity()) return;
    const name = (qs('#name')?.value || '').trim();
    const selection = program.value.trim();
    const question = (qs('#question')?.value || '').trim();
    if (!name || !selection || !question) return;
    const draft = `Subjek: Konsultasi Tunas Edukasi — ${selection}

Halo Tim Tunas Edukasi,

Nama orang tua/wali: ${name}
Program: ${selection}

Pertanyaan:
${question}

Terima kasih.`;
    if (help) help.textContent = 'Menyiapkan draft konsultasi...';
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(draft);
      if (help) help.textContent = '✓ Draft tersalin ke clipboard. Silakan kirimkan melalui kanal komunikasi resmi PKBM ketika tersedia.';
    } catch (_) {
      const blob = new Blob([draft],{type:'text/plain;charset=utf-8'});
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a');a.href=url;a.download='draft-konsultasi-tunas-edukasi.txt';
      document.body.append(a);a.click();a.remove();
      window.setTimeout(()=>URL.revokeObjectURL(url),2000);
      if (help) help.textContent = '✓ Draft konsultasi diunduh sebagai teks. Silakan kirimkan melalui kanal komunikasi resmi.';
    }
  });
})();