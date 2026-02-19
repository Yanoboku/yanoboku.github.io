'use strict';

  /* Header scroll shadow */
  const hdr = document.getElementById('site-header');
  window.addEventListener('scroll', () => hdr.classList.toggle('scrolled', scrollY > 24), { passive: true });

  /* Burger menu */
  const burgerBtn = document.getElementById('burger-btn');
  const mobMenu   = document.getElementById('mob-menu');

  function closeMob() {
    mobMenu.classList.remove('open');
    burgerBtn.classList.remove('open');
    burgerBtn.setAttribute('aria-expanded', 'false');
  }
  burgerBtn.addEventListener('click', () => {
    const isOpen = mobMenu.classList.toggle('open');
    burgerBtn.classList.toggle('open', isOpen);
    burgerBtn.setAttribute('aria-expanded', String(isOpen));
  });
  document.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', closeMob));
  document.addEventListener('click', e => {
    if (!burgerBtn.contains(e.target) && !mobMenu.contains(e.target)) closeMob();
  });

  /* Benefits Slider */
  (function () {
    const track   = document.getElementById('sl-track');
    const prevBtn = document.getElementById('sl-prev');
    const nextBtn = document.getElementById('sl-next');
    const GAP     = 18;
    let idx       = 0;

    function cardW() {
      const c = track.children[0];
      return c ? c.offsetWidth + GAP : 276;
    }
    function maxIdx() {
      const vw = window.innerWidth;
      let visible = 3;
      if (vw < 480) visible = 1;
      else if (vw < 900) visible = 2;
      return Math.max(0, track.children.length - visible);
    }
    function render() {
      track.style.transform = `translateX(-${idx * cardW()}px)`;
      prevBtn.disabled = idx === 0;
      nextBtn.disabled = idx >= maxIdx();
    }

    prevBtn.addEventListener('click', () => { if (idx > 0) { idx--; render(); } });
    nextBtn.addEventListener('click', () => { if (idx < maxIdx()) { idx++; render(); } });

    /* Slider */
    let tx = 0;
    track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const d = tx - e.changedTouches[0].clientX;
      if (d > 44 && idx < maxIdx()) { idx++; render(); }
      if (d < -44 && idx > 0) { idx--; render(); }
    });

    window.addEventListener('resize', () => { idx = Math.min(idx, maxIdx()); render(); }, { passive: true });
    render();
  })();

  /* Contact Form */
  (function () {
    const form = document.getElementById('contact-form');
    const ok   = document.getElementById('form-ok');

    /* Real backend connection mockup */
    async function submitToAPI(data) {
      return new Promise(res => setTimeout(() => res({ success: true }), 900));
    }

    function mark(id, msg) {
      const input = document.getElementById('f-' + id);
      const err   = document.getElementById('err-' + id);
      input.classList.toggle('err', !!msg);
      if (err) err.textContent = msg || '';
    }
    function clearAll() {
      ['first','last','email','msg'].forEach(id => mark(id, ''));
    }

    form.addEventListener('submit', async e => {
      e.preventDefault();
      clearAll();

      const data = {
        firstName : form.firstName.value.trim(),
        lastName  : form.lastName.value.trim(),
        email     : form.email.value.trim(),
        message   : form.message.value.trim(),
      };

      let valid = true;
      if (!data.firstName) { mark('first', 'First name is required.'); valid = false; }
      if (!data.lastName)  { mark('last',  'Last name is required.');  valid = false; }
      if (!data.email) {
        mark('email', 'Email is required.'); valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        mark('email', 'Enter a valid email address.'); valid = false;
      }
      if (!data.message) { mark('msg', 'Message is required.'); valid = false; }
      if (!valid) return;

      const btn = document.getElementById('submit-btn');
      btn.textContent = 'Sending…';
      btn.disabled = true;
      try {
        await submitToAPI(data);
        form.reset();
        form.style.display = 'none';
        ok.classList.add('show');
        btn.remove()
      } catch {
        btn.textContent = 'Send Message';
        btn.disabled = false;
      }
    });
  })();

  /* Scroll reveal */
  (function () {
    const els = document.querySelectorAll('.reveal');
    if (!window.IntersectionObserver) { els.forEach(el => el.classList.add('visible')); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } });
    }, { threshold: 0.10 });
    els.forEach(el => io.observe(el));
  })();

  /* Active nav on scroll */
  (function () {
    const secs  = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('nav.desktop-nav a');
    window.addEventListener('scroll', () => {
      let cur = '';
      secs.forEach(s => { if (scrollY >= s.offsetTop - 100) cur = s.id; });
      links.forEach(a => {
        const active = a.getAttribute('href') === '#' + cur;
        if (!a.classList.contains('nav-contact')) a.style.color = active ? 'var(--red)' : '';
      });
    }, { passive: true });
  })();