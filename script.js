document.querySelectorAll('.carousel').forEach((carousel, ci) => {
      const track     = carousel.querySelector('.carousel-track');
      const slides    = Array.from(track.querySelectorAll('img'));
      const prev      = carousel.querySelector('.prev');
      const next      = carousel.querySelector('.next');
      const dotsWrap  = carousel.querySelector('.dots');
      let current     = 0;
      let timer;
 
      // build dots
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Foto ${i + 1}`);
        dot.addEventListener('click', () => go(i));
        dotsWrap.appendChild(dot);
      });
 
      const dots = Array.from(dotsWrap.children);
      slides[0].classList.add('active');
 
      function update() {
        slides.forEach((s, i) => s.classList.toggle('active', i === current));
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
      }
 
      function go(index) {
        current = ((index % slides.length) + slides.length) % slides.length;
        update();
        resetTimer();
      }
 
      prev.addEventListener('click', () => go(current - 1));
      next.addEventListener('click', () => go(current + 1));
 
      // touch/swipe
      let startX = 0;
      track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
      track.addEventListener('touchend',   e => {
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) go(current + (dx < 0 ? 1 : -1));
      });
 
      // auto-advance
      function resetTimer() {
        clearInterval(timer);
        timer = setInterval(() => go(current + 1), 4000 + ci * 300);
      }
      resetTimer();
    });
 
    // ── SCROLL REVEAL ──
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          // stagger children if it's the grid
          if (e.target.classList.contains('carousel-grid')) {
            Array.from(e.target.children).forEach((child, i) => {
              child.style.transitionDelay = `${i * 80}ms`;
              child.classList.add('visible');
            });
          }
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
 
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));