/* ============================================================
   CampusFlow — interactions
   ============================================================ */

// ---------- Nav scroll state ----------
const nav = document.getElementById('nav');
const onScroll = () => {
  if (window.scrollY > 20) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- Mobile burger (smooth scroll to sections list) ----------
const burger = document.getElementById('burger');
if (burger) {
  burger.addEventListener('click', () => {
    document.getElementById('modules').scrollIntoView({ behavior: 'smooth' });
  });
}

// ---------- Scroll reveal (progressive enhancement) ----------
// Content is visible by default (CSS). We only HIDE below-the-fold elements
// (adding .js-pre) so they can animate in on scroll. Above-the-fold content
// is never touched, and if JS fails everything simply stays visible.
const revealEls = Array.from(document.querySelectorAll('.reveal'));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

  const vh = window.innerHeight;
  revealEls.forEach((el) => {
    const r = el.getBoundingClientRect();
    const inView = r.top < vh * 0.92 && r.bottom > 0;
    if (!inView) {
      el.classList.add('js-pre');   // hide, then animate in when scrolled to
      io.observe(el);
    }
  });

  // Failsafe: never leave anything hidden if the observer doesn't fire.
  setTimeout(() => revealEls.forEach((el) => el.classList.add('in')), 1500);
}

// ---------- FAQ accordion ----------
document.querySelectorAll('.faq-item').forEach((item) => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    // close others
    document.querySelectorAll('.faq-item.open').forEach((other) => {
      if (other !== item) {
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = null;
      }
    });
    if (isOpen) {
      item.classList.remove('open');
      a.style.maxHeight = null;
    } else {
      item.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });
});

// ---------- Feature tabs (visual toggle) ----------
document.querySelectorAll('.feature-tabs').forEach((group) => {
  const tabs = group.querySelectorAll('.ftab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
});

// ---------- Duplicate marquee track for seamless loop ----------
const track = document.getElementById('marqueeTrack');
if (track) {
  track.innerHTML += track.innerHTML;
}

// ---------- Subtle parallax on hero glow ----------
const heroStage = document.querySelector('.hero-stage');
if (heroStage && window.matchMedia('(min-width: 980px)').matches) {
  let raf = null;
  window.addEventListener('scroll', () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const y = Math.min(window.scrollY, 600);
      heroStage.style.transform = `translateY(${y * -0.04}px) rotateX(${Math.min(y * 0.006, 3)}deg)`;
      raf = null;
    });
  }, { passive: true });
}

// ---------- Animate dashboard bars on first view ----------
const barsObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.bar').forEach((bar, i) => {
        const h = bar.style.height;
        bar.style.height = '0%';
        bar.style.transition = 'height .8s cubic-bezier(.2,.7,.2,1)';
        setTimeout(() => { bar.style.height = h; }, 60 + i * 55);
      });
      barsObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.bars').forEach((b) => barsObserver.observe(b));
