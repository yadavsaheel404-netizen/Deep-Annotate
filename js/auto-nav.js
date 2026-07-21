// js/auto-nav.js

(function() {
  const sequence = [
    'index.html',
    'services.html',
    'how-it-works.html',
    'datasets.html',
    'case-studies.html',
    'blog.html',
    'about.html'
  ];

  // Get current filename
  let currentPath = window.location.pathname;
  let currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1);
  
  // Default to index.html if on root
  if (!currentFile || currentFile === '') {
    currentFile = 'index.html';
  }

  const currentIndex = sequence.indexOf(currentFile);
  
  // If not in sequence, do nothing
  if (currentIndex === -1) return;

  // Determine next page, looping back to index.html
  const nextIndex = (currentIndex + 1) % sequence.length;
  const nextPage = sequence[nextIndex];

  let isNavigating = false;
  let firstBottomTime = null;

  function checkBottomScroll(deltaY) {
    if (isNavigating) return;

    // Only trigger if scrolling down
    if (deltaY > 0) {
      const scrollPosition = Math.ceil(window.innerHeight + window.scrollY);
      const bottomPosition = document.body.offsetHeight;

      if (scrollPosition >= bottomPosition - 5) {
        if (!firstBottomTime) {
          // Record the first time they hit the bottom
          firstBottomTime = Date.now();
        } else if (Date.now() - firstBottomTime > 100) {
          // Require them to be at the bottom for just 0.1 seconds before scrolling down triggers the jump
          isNavigating = true;
          window.location.href = `./${nextPage}`;
        }
      }
    } else {
      // Reset if user scrolls up
      firstBottomTime = null;
    }
  }

  // Mouse wheel listener
  window.addEventListener('wheel', (e) => {
    checkBottomScroll(e.deltaY);
  }, { passive: true });

  // Touch listener for mobile
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    const touchEndY = e.touches[0].clientY;
    // delta is positive if swiping up (scrolling down the page)
    const deltaY = touchStartY - touchEndY;
    
    // Only check if there's a meaningful swipe
    if (Math.abs(deltaY) > 2) {
      checkBottomScroll(deltaY);
      touchStartY = touchEndY;
    }
  }, { passive: true });

})();
