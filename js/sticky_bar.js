/* js/sticky_bar.js — Sticky Floating Bottom Bar & Continuous Page Scroll */

const PAGE_FLOW = [
  { path: 'index.html', title: 'Services' },
  { path: 'services.html', title: 'How It Works' },
  { path: 'how-it-works.html', title: 'Datasets' },
  { path: 'datasets.html', title: 'Case Studies' },
  { path: 'case-studies.html', title: 'Blog' },
  { path: 'blog.html', title: 'Careers' },
  { path: 'careers.html', title: 'About' },
  { path: 'about.html', title: 'Home' }
];

export function initStickyBottomBar() {
  if (!document.getElementById('global-sticky-bar')) {
    const bar = document.createElement('div');
    bar.id = 'global-sticky-bar';
    bar.className = 'sticky-bottom-bar';
    
    if (sessionStorage.getItem('sticky_bar_dismissed') === 'true') {
      bar.classList.add('hidden');
    }

    bar.innerHTML = `
      <div class="sticky-bar-left">
        <span class="sticky-bar-brand">DeepAnnotate.ai</span>
        <span class="sticky-bar-sep">—</span>
        <span class="sticky-bar-tag">India's Physical AI Data Platform</span>
      </div>
      <div class="sticky-bar-right">
        <a href="dataset-library.html" class="sticky-btn-sec">Request Dataset</a>
        <a href="https://calendly.com" target="_blank" rel="noopener noreferrer" class="sticky-btn-pri">Book Demo &rarr;</a>
        <button class="sticky-close-btn" id="sticky-bar-close" aria-label="Dismiss sticky bar">&times;</button>
      </div>
    `;

    document.body.appendChild(bar);

    const closeBtn = document.getElementById('sticky-bar-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        bar.classList.add('hidden');
        try { sessionStorage.setItem('sticky_bar_dismissed', 'true'); } catch (e) {}
      });
    }
  }

  initContinuousPageScroll();
}

function initContinuousPageScroll() {
  let currentPath = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPath === '') currentPath = 'index.html';

  const currentIndex = PAGE_FLOW.findIndex(p => p.path === currentPath);
  if (currentIndex === -1) return;

  const nextPageObj = PAGE_FLOW[(currentIndex + 1) % PAGE_FLOW.length];
  let transitionTriggered = false;

  window.addEventListener('scroll', () => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.scrollHeight - 30;

    if (scrollPosition >= threshold && !transitionTriggered) {
      transitionTriggered = true;
      
      const navToast = document.createElement('div');
      navToast.style.cssText = `
        position: fixed;
        bottom: 70px;
        right: 24px;
        z-index: 10000;
        background: #0E1F3E;
        color: #00D4FF;
        border: 1px solid rgba(0, 212, 255, 0.4);
        padding: 10px 20px;
        border-radius: 100px;
        font-family: 'Inter', sans-serif;
        font-size: 13px;
        font-weight: 700;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      `;
      navToast.textContent = `Continuing to ${nextPageObj.title} →`;
      document.body.appendChild(navToast);

      setTimeout(() => {
        window.location.href = nextPageObj.path;
      }, 700);
    }
  });
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStickyBottomBar);
  } else {
    initStickyBottomBar();
  }
}
