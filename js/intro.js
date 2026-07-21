/* intro.js - Introduction section timeline animation controller */

export function initIntro() {
  const introSection = document.getElementById('homepage-intro');
  if (!introSection) return;

  const steps = introSection.querySelectorAll('.timeline-step');
  const progressBar = document.getElementById('timeline-progress-bar');
  const scrollCue = introSection.querySelector('.intro-scroll-cue');

  // Wire scroll cue to scroll down past the intro section
  if (scrollCue) {
    const triggerScroll = () => {
      // Offset by 68px for the fixed navbar height
      const targetScroll = introSection.offsetTop + introSection.offsetHeight - 68;
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    };
    
    scrollCue.addEventListener('click', triggerScroll);
    scrollCue.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerScroll();
      }
    });
  }

  // Intersection Observer to trigger process animation steps in order
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateTimeline();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  observer.observe(introSection);

  function animateTimeline() {
    let activeSteps = 0;
    
    // Stagger activation of timeline steps and fill progress bar
    steps.forEach((step, idx) => {
      setTimeout(() => {
        step.classList.add('active');
        activeSteps++;
        
        if (progressBar) {
          // Progress bar percentage increases for each step
          const pct = ((activeSteps - 1) / (steps.length - 1)) * 100;
          progressBar.style.width = `${pct}%`;
        }
      }, idx * 450); // 450ms staggering delay
    });
  }
}
