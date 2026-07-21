// how_it_works_page.js - Optimized 60fps Card Stacking Interaction Logic
export function initHowItWorks() {
  initCardStacking();
  initMetricsCounters();
  initFAQ();
}

// 1. Stacked storytelling overlap calculations (Optimized 60fps Cache-linked scrolling)
function initCardStacking() {
  const cards = document.querySelectorAll('.tl-stack-card');
  if (cards.length === 0) return;

  const wrapper = document.querySelector('.tl-stack-wrapper');
  if (!wrapper) return;

  let wrapperTop = 0;
  let cachedOffsets = [];
  let ticking = false;

  const cachePositions = () => {
    // Read elements static top offsets relative to wrapper
    const wrapperRect = wrapper.getBoundingClientRect();
    wrapperTop = wrapperRect.top + window.scrollY;
    
    cachedOffsets = Array.from(cards).map(card => {
      const cardRect = card.getBoundingClientRect();
      return (cardRect.top + window.scrollY) - wrapperTop;
    });
  };

  // Initial cache read
  cachePositions();

  // Re-read on resize or font loading changes
  window.addEventListener('resize', cachePositions);
  window.addEventListener('load', cachePositions);

  const navBtns = document.querySelectorAll('.hiw-step-nav-btn');
  const fillLine = document.getElementById('pipeline-progress-fill');

  // Click handler to smooth scroll to corresponding card
  navBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const stepIdx = parseInt(btn.getAttribute('data-step') || '0', 10);
      const targetCard = document.getElementById(`hiw-card-${stepIdx}`);
      if (targetCard) {
        const targetTop = targetCard.getBoundingClientRect().top + window.scrollY - 110;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const triggerPos = window.innerHeight * 0.25;
    let activeIndex = 0;
    
    cards.forEach((card, idx) => {
      const cardViewportTop = (wrapperTop + cachedOffsets[idx]) - scrollY;
      
      if (cardViewportTop <= triggerPos + 20) {
        card.classList.add('active');
        activeIndex = idx;
        
        if (idx < cards.length - 1) {
          const nextCardViewportTop = (wrapperTop + cachedOffsets[idx + 1]) - scrollY;
          const overlap = triggerPos + 120 - nextCardViewportTop;
          
          if (overlap > 0) {
            const factor = Math.min(1, overlap / 300);
            const opacity = 1 - (factor * 0.4);
            const scale = 1 - (factor * 0.03);
            const translateY = -factor * 15;
            
            card.style.opacity = opacity;
            card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
          } else {
            card.style.opacity = 1;
            card.style.transform = 'translate3d(0, 0, 0) scale(1)';
          }
        }
      } else {
        card.classList.remove('active');
        card.style.opacity = 1;
        card.style.transform = 'translate3d(0, 0, 0) scale(1)';
      }
    });

    // Update left pipeline sidebar active state and progress fill line
    navBtns.forEach((btn, idx) => {
      if (idx === activeIndex) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (fillLine && cards.length > 1) {
      const fillPct = (activeIndex / (cards.length - 1)) * 100;
      fillLine.style.height = `${fillPct}%`;
    }
    
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(handleScroll);
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  handleScroll(); // Initial run
}

// 2. Metrics counters counting up (throttled)
function initMetricsCounters() {
  const metricsSection = document.getElementById('metrics-section');
  if (!metricsSection) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateNumbers();
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(metricsSection);
}

function animateNumbers() {
  const targets = [
    { el: document.querySelector('.metric-num[data-metric="accuracy"]'), end: 95, suffix: '%' },
    { el: document.querySelector('.metric-num[data-metric="delivery"]'), end: 5, suffix: ' days' },
    { el: document.querySelector('.metric-num[data-metric="response"]'), end: 24, suffix: ' hr' },
    { el: document.querySelector('.metric-num[data-metric="reannotation"]'), end: 100, suffix: '%' }
  ];

  targets.forEach(t => {
    if (!t.el) return;
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress * (2 - progress);
      const current = start + (t.end - start) * ease;

      t.el.textContent = Math.round(current) + t.suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  });
}

// 3. Compact FAQ Accordion panel toggle animation
function initFAQ() {
  const triggers = document.querySelectorAll('.faq-trigger');
  triggers.forEach(trig => {
    trig.addEventListener('click', () => {
      const item = trig.parentElement;
      const panel = item.querySelector('.faq-panel');
      const icon = trig.querySelector('.faq-icon');
      
      const isOpen = panel.style.maxHeight && panel.style.maxHeight !== '0px';
      
      // Close all other panels
      document.querySelectorAll('.faq-panel').forEach(p => p.style.maxHeight = '0px');
      document.querySelectorAll('.faq-icon').forEach(i => i.textContent = '+');
      
      if (!isOpen) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        icon.textContent = '−';
      } else {
        panel.style.maxHeight = '0px';
        icon.textContent = '+';
      }
    });
  });
}
