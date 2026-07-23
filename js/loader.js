import { initHero } from './hero.js';
import { initIntro } from './intro.js';
import { initServices } from './services.js';
import { initResults } from './results.js';
import { initCoverage } from './coverage.js';

// Configuration array mapping placeholder divs, HTML paths, and initializer callbacks
const components = [
  { id: 'hero-placeholder', url: './components/hero.html', init: initHero },
  { id: 'intro-placeholder', url: './components/intro.html', init: initIntro },
  { id: 'results-placeholder', url: './components/results.html', init: initResults },
  { id: 'services-placeholder', url: './components/services.html', init: initServices },
  { id: 'coverage-placeholder', url: './components/coverage.html', init: initCoverage },
  { id: 'case-studies-placeholder', url: './components/case-studies.html', init: null },
  { id: 'cta-placeholder', url: './components/cta.html', init: null },
  { id: 'footer-placeholder', url: './components/footer.html', init: null }
];

async function loadComponent(comp) {
  const container = document.getElementById(comp.id);
  if (!container) return;
  try {
    const response = await fetch(comp.url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const html = await response.text();
    container.innerHTML = html;
    
    // Trigger Intersection Observer once on the loaded parent block wrapper
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // If results sub-components are loaded, make child sub-blocks visible
          container.querySelectorAll('.fade-in-section').forEach(sec => sec.classList.add('is-visible'));
          const mainSec = container.querySelector('.fade-in-section');
          if (mainSec) mainSec.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });
    
    observer.observe(container);
    
    // Execute ES6 component module initializers
    if (comp.init) {
      comp.init();
    }
  } catch (error) {
    console.error(`Failed to load component ${comp.id}:`, error);
  }
}

export function loadAllComponents() {
  // Load components sequentially to preserve document flow ordering correctly
  components.reduce((prevPromise, comp) => {
    return prevPromise.then(() => loadComponent(comp));
  }, Promise.resolve());
}
