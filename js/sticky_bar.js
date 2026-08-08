/* js/sticky_bar.js — Sticky Floating Bottom Bar */

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

}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStickyBottomBar);
  } else {
    initStickyBottomBar();
  }
}
