const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;

  // 1. Fix about.html missing Careers link
  if (f === 'about.html') {
    if (!content.includes('href="./careers.html"')) {
      content = content.replace(
        '<li><a href="./about.html"', 
        '<li><a href="./careers.html">Careers</a></li>\n    <li><a href="./about.html"'
      );
      changed = true;
    }
  }

  // 2. Add professional pill styles to nav-links a in ALL html files
  const overrideStyle = `
  <!-- Navbar Style Override -->
  <style>
    .nav-links a {
      padding: 8px 16px;
      border-radius: 100px;
      transition: all 0.3s ease !important;
      position: relative;
      overflow: hidden;
    }
    .nav-links a::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(11, 168, 211, 0.08);
      border-radius: 100px;
      transform: scale(0.8);
      opacity: 0;
      transition: all 0.3s ease;
      z-index: -1;
    }
    .nav-links a:hover::before, .nav-links a.active::before {
      transform: scale(1);
      opacity: 1;
    }
    .nav-links a:hover, .nav-links a.active {
      color: #0BA8D3 !important;
    }
  </style>
</head>`;
  
  if (!content.includes('<!-- Navbar Style Override -->')) {
      content = content.replace('</head>', overrideStyle);
      changed = true;
  }

  if (changed) {
    fs.writeFileSync(f, content, 'utf8');
    console.log(`Updated ${f}`);
  }
});
