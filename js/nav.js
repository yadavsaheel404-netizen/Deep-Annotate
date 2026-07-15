// js/nav.js - Mobile navigation and hamburger toggle controller
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById('hamburger');
  const navbar = document.getElementById('navbar');
  
  if (hamburger && navbar) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      navbar.classList.toggle('mobile-open');
    });

    // Close menu when clicking outside of the navbar
    document.addEventListener('click', (e) => {
      if (navbar.classList.contains('mobile-open') && !navbar.contains(e.target)) {
        navbar.classList.remove('mobile-open');
      }
    });

    // Close menu when clicking any link inside
    const links = navbar.querySelectorAll('.nav-links a, .nav-cta');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('mobile-open');
      });
    });
  }
});
