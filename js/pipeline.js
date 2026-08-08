// Pipeline component JS (ES6 Module)
let cachedSteps = [];
let isDirty = false;
let scrollListenerActive = false;

export function initPipeline() {
  cacheStepGeometry();
  
  if (!scrollListenerActive) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    scrollListenerActive = true;
  }
  
  trackPipeline();
}

function cacheStepGeometry() {
  const steps = document.querySelectorAll('#pipeline .pipeline-step');
  cachedSteps = Array.from(steps).map(step => {
    return {
      element: step,
      top: step.offsetTop,
      height: step.offsetHeight,
      badge: step.querySelector('.p-badge')
    };
  });
}

// Debounce resize to prevent layout thrashing on window resizing
let resizeTimeout;
function onResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    cacheStepGeometry();
    trackPipeline();
  }, 150);
}

function onScroll() {
  if (!isDirty) {
    isDirty = true;
    requestAnimationFrame(() => {
      trackPipeline();
      isDirty = false;
    });
  }
}

function trackPipeline() {
  if (cachedSteps.length === 0) return;
  const scrollYPosition = window.scrollY + window.innerHeight * 0.5;
  
  cachedSteps.forEach(step => {
    const top = step.top;
    const bottom = top + step.height;
    const badge = step.badge;
    
    if (scrollYPosition >= top && scrollYPosition <= bottom) {
      if (badge) {
        badge.style.borderColor = 'var(--cyan)';
        badge.style.boxShadow = '0 0 15px var(--cyan)';
      }
      step.element.style.transform = 'scale(1.01)';
      step.element.style.transition = 'all 0.3s ease';
    } else {
      if (badge) {
        badge.style.borderColor = 'var(--amber)';
        badge.style.boxShadow = 'none';
      }
      step.element.style.transform = 'none';
    }
  });
}
