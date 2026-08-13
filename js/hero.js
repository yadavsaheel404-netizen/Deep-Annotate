/* hero.js - High-Performance Smooth "Digital Dust" Robot Portrait Particle Animation Engine */

export function initHero() {
  const canvas = document.getElementById('hero-nodes-canvas');
  const heroSection = document.getElementById('homepage-hero');
  if (!canvas || !heroSection) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId = null;
  let particles = [];
  let ambientParticles = [];
  let loadedImage = null;
  let isHeroVisible = true;
  let runRender = null;

  // Real-time Mouse & Touch tracking state
  let isMouseActive = false;
  let targetMouse = { x: -1000, y: -1000 };
  let mouse = { x: -1000, y: -1000 };

  let scrollY = window.scrollY || 0;
  let prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let startTime = null;
  let lastTime = performance.now();

  // Track prefers-reduced-motion changes
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handleMotionChange = (e) => { prefersReducedMotion = e.matches; };
  if (motionQuery.addEventListener) {
    motionQuery.addEventListener('change', handleMotionChange);
  }

  // Track window scroll position in real time for scroll-reactive parallax
  const onScroll = () => {
    scrollY = window.scrollY || 0;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Pre-render soft glowing particle sprite canvas for smooth, cohesive "digital dust" texture
  const glowSprite = document.createElement('canvas');
  glowSprite.width = 32;
  glowSprite.height = 32;
  const gCtx = glowSprite.getContext('2d');
  const grad = gCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, 'rgba(11, 168, 211, 0.40)');
  grad.addColorStop(0.35, 'rgba(11, 168, 211, 0.20)');
  grad.addColorStop(0.70, 'rgba(11, 168, 211, 0.05)');
  grad.addColorStop(1, 'rgba(11, 168, 211, 0)');
  gCtx.fillStyle = grad;
  gCtx.beginPath();
  gCtx.arc(16, 16, 16, 0, Math.PI * 2);
  gCtx.fill();

  // Load exact user robot head/face portrait image with fallback path array
  function loadRobotImage() {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      // Confirmed real paths first, then fallbacks
      const candidatePaths = [
        '/robot-portrait.png',
        '/images/robot-portrait.png',
        './robot-portrait.png',
        './images/robot-portrait.png',
        '/public/robot-portrait.png',
        '/public/images/robot-portrait.png'
      ];
      
      let attempts = 0;
      function tryNext() {
        if (attempts >= candidatePaths.length) {
          reject(new Error('Robot head asset image not found'));
          return;
        }
        const src = candidatePaths[attempts++];
        img.onload = () => {
          console.log('[particle-hero] Successfully loaded robot head image from:', src);
          resolve(img);
        };
        img.onerror = () => tryNext();
        img.src = src;
      }
      tryNext();
    });
  }

  function setupParticles(img) {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const rect = heroSection.getBoundingClientRect();
    
    const width = Math.max(heroSection.clientWidth || 0, rect.width || 0, window.innerWidth);
    const height = Math.max(heroSection.clientHeight || 0, heroSection.offsetHeight || 0, rect.height || 0, 700);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    const isMobile = width < 960;

    // Robot portrait dimensions
    const drawH = isMobile ? height * 0.90 : height * 0.82;
    const aspect = img.width / img.height;
    const drawW = drawH * aspect;

    // Center layout logic: desktop shifted rightwards to 76% width anchor; mobile centered at 50%
    const desktopTargetCenterX = width * 0.76;
    const centerX = isMobile ? width * 0.50 : desktopTargetCenterX;
    const centerY = height * 0.50;

    let startX = centerX - drawW / 2;
    const startY = centerY - drawH / 2;

    // Ensure figure NEVER clips off the right viewport edge on desktop (28px minimum right margin)
    if (!isMobile) {
      const maxAllowedStartX = width - drawW - 28;
      if (startX > maxAllowedStartX) {
        startX = maxAllowedStartX;
      }
    }

    // NATIVE RESOLUTION UNIFORM SAMPLING
    const sampleW = img.width;
    const sampleH = img.height;
    const offscreen = document.createElement('canvas');
    offscreen.width = sampleW;
    offscreen.height = sampleH;
    const offCtx = offscreen.getContext('2d');
    offCtx.drawImage(img, 0, 0);

    let imgData;
    try {
      imgData = offCtx.getImageData(0, 0, sampleW, sampleH);
    } catch (e) {
      console.error('Failed to read image data for particles:', e);
      return;
    }
    const data = imgData.data;

    // Text element bounding rects for local opacity attenuation behind copy
    const textEls = heroSection.querySelectorAll('.hero-title, .hero-subtitle, .hero-ctas, .hero-label');
    const textRects = Array.from(textEls).map(el => {
      const r = el.getBoundingClientRect();
      return {
        left: r.left - rect.left - 25,
        top: r.top - rect.top - 25,
        right: r.right - rect.left + 25,
        bottom: r.bottom - rect.top + 25
      };
    });

    const allPoints = [];
    const step = isMobile ? 4.0 : 2.9;

    for (let y = 1; y < sampleH - 1; y += step) {
      for (let x = 1; x < sampleW - 1; x += step) {
        const px = Math.floor(x);
        const py = Math.floor(y);
        const idx = (py * sampleW + px) * 4;

        const a = data[idx + 3];
        if (a < 30) continue; // Skip transparent pixels

        // Background mask for near-white pixels
        let r = data[idx];
        let g = data[idx + 1];
        let b = data[idx + 2];
        if (r > 248 && g > 248 && b > 248) continue;

        const normX = px / sampleW;
        const normY = py / sampleH;

        // Sub-pixel organic position jitter (±1.5px) to break grid alignment
        const jitterX = (Math.random() - 0.5) * 1.5 * step;
        const jitterY = (Math.random() - 0.5) * 1.5 * step;

        const targetX = startX + ((px + jitterX) / sampleW) * drawW;
        const targetY = startY + ((py + jitterY) / sampleH) * drawH;

        // Eye region tracking identification
        let isEye = null;
        if (normY >= 0.30 && normY <= 0.40) {
          if (normX >= 0.25 && normX <= 0.45) isEye = 'left';
          else if (normX >= 0.55 && normX <= 0.75) isEye = 'right';
        }

        // Facial feature opacity & contrast boost
        const isEyeZone = normY >= 0.30 && normY <= 0.40 && normX >= 0.25 && normX <= 0.75;
        const isNoseZone = normY >= 0.40 && normY <= 0.52 && normX >= 0.40 && normX <= 0.60;
        const isMouthZone = normY >= 0.52 && normY <= 0.62 && normX >= 0.35 && normX <= 0.65;
        const isFacialFeatureZone = isEyeZone || isNoseZone || isMouthZone;

        // Text overlay opacity attenuation
        const insideText = textRects.some(tr => 
          targetX >= tr.left && targetX <= tr.right &&
          targetY >= tr.top && targetY <= tr.bottom
        );

        let baseAlpha = 1.0;
        const rawLum = r * 0.299 + g * 0.587 + b * 0.114;
        
        // Brighter source areas -> closer to pure white ~255,255,255
        // Darker/shadow source areas -> light grey ~190-210
        // Formula: grayVal = 190 + (rawLum / 255) * (255 - 190)
        let grayVal = Math.floor(190 + (rawLum / 255) * 65);
        r = grayVal;
        g = grayVal;
        b = grayVal;

        if (insideText) {
          baseAlpha = 0.12; // Low opacity behind text so copy stays 100% readable
        } else {
          if (isFacialFeatureZone) {
            if (rawLum < 110) {
              // Shadows in facial features: make them slightly darker (e.g. 140-160) to keep detail clear
              const shadowVal = Math.floor(140 + (rawLum / 110) * 20);
              r = shadowVal;
              g = shadowVal;
              b = shadowVal;
              baseAlpha = 1.0;
            } else {
              baseAlpha = Math.min(1.0, baseAlpha * 1.20);
            }
          }
        }

        const particleSize = Math.random() * 0.4 + 1.4;

        allPoints.push({
          targetX,
          targetY,
          r, g, b,
          baseAlpha,
          size: particleSize,
          isEye,
          normY
        });
      }
    }
    // Optimize budget
    const maxParticles = isMobile ? 2800 : 7200;
    let finalPoints = [];
    if (allPoints.length > maxParticles) {
      const stride = allPoints.length / maxParticles;
      for (let i = 0; i < maxParticles; i++) {
        const index = Math.floor(i * stride);
        if (allPoints[index]) finalPoints.push(allPoints[index]);
      }
    } else {
      finalPoints = allPoints;
    }

    // Morph-in entrance & idle drift initialization
    particles = finalPoints.map(pt => {
      const localOffsetY = -(15 + Math.random() * 20);
      return {
        x: pt.targetX,
        y: prefersReducedMotion ? pt.targetY : pt.targetY + localOffsetY,
        baseX: pt.targetX,
        baseY: pt.targetY,
        targetX: pt.targetX,
        targetY: pt.targetY,
        r: pt.r,
        g: pt.g,
        b: pt.b,
        baseAlpha: pt.baseAlpha,
        currentAlpha: prefersReducedMotion ? pt.baseAlpha : 0,
        size: pt.size,
        ease: 0.14 + Math.random() * 0.04,
        isEye: pt.isEye,
        phase: Math.random() * Math.PI * 2,
        freq: 0.0012 + Math.random() * 0.0018,
        driftAmpX: 0.6 + Math.random() * 1.0,
        driftAmpY: 0.6 + Math.random() * 1.0,
        normY: pt.normY,
        activated: prefersReducedMotion,
        activationTime: 0
      };
    });

    // Ambient floating dust particles
    ambientParticles = [];
    if (!isMobile) {
      const ambientCount = 35;
      for (let i = 0; i < ambientCount; i++) {
        ambientParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vy: -(0.12 + Math.random() * 0.20),
          vx: (Math.random() - 0.5) * 0.10,
          size: Math.random() * 1.2 + 0.6,
          alpha: Math.random() * 0.30 + 0.10
        });
      }
    }

    startTime = performance.now();
    lastTime = performance.now();
    startAnimationLoop(width, height, startX, startY, drawW, drawH, isMobile);
  }

  function startAnimationLoop(width, height, startX, startY, drawW, drawH, isMobile) {
    const repelRadius = isMobile ? 80 : 120;
    const repelMaxDist = isMobile ? 45 : 75;
    const repelRadiusSq = repelRadius * repelRadius;

    // Boot-Up Scan Line Setup
    let scanY = 0;
    const scanDuration = 1.8;
    const scanSpeed = (drawH + 40) / (scanDuration * 60);

    // Robot eyes centers for cursor tracking
    const leftEyeCenter = { x: startX + 0.35 * drawW, y: startY + 0.35 * drawH };
    const rightEyeCenter = { x: startX + 0.65 * drawW, y: startY + 0.35 * drawH };

    function render(now) {
      if (!isHeroVisible) {
        animationFrameId = null;
        return;
      }
      const dt = Math.min(32, now - lastTime);
      lastTime = now;
      const dtFactor = dt / 16.67;

      ctx.clearRect(0, 0, width, height);

      if (isMouseActive) {
        mouse.x += (targetMouse.x - mouse.x) * 0.35 * dtFactor;
        mouse.y += (targetMouse.y - mouse.y) * 0.35 * dtFactor;
      }

      // Scroll parallax calculation
      let scrollShiftY = 0;
      let scrollScale = 1.0;
      let scrollFade = 1.0;

      if (!prefersReducedMotion && scrollY > 0) {
        const maxShift = isMobile ? 25 : 50;
        const shiftMult = isMobile ? 0.12 : 0.22;
        scrollShiftY = Math.min(maxShift, scrollY * shiftMult);
        scrollScale = Math.max(0.88, 1 - scrollY * 0.0003);
        scrollFade = Math.max(0.25, 1 - scrollY * 0.0008);
      }

      // Parallax mouse shifts
      let sceneShiftX = 0;
      let sceneShiftY = 0;

      if (isMouseActive && !prefersReducedMotion) {
        sceneShiftX = (mouse.x - width / 2) * 0.012;
        sceneShiftY = (mouse.y - height / 2) * 0.012;
      }

      // Ambient dust particles
      const ambLen = ambientParticles.length;
      ctx.fillStyle = 'rgba(11, 168, 211, 0.12)';
      for (let i = 0; i < ambLen; i++) {
        const ap = ambientParticles[i];
        if (!prefersReducedMotion) {
          ap.y += ap.vy * dtFactor;
          ap.x += ap.vx * dtFactor;
          if (ap.y < 0) ap.y = height;
          if (ap.x < 0) ap.x = width;
          else if (ap.x > width) ap.x = 0;
        }
        ctx.beginPath();
        ctx.arc(ap.x, ap.y + scrollShiftY * 0.2, ap.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Scanline sweep progression
      if (!prefersReducedMotion && scanY < drawH + 60) {
        scanY += scanSpeed * dtFactor;
      }
      const currentScanPos = startY + scanY + scrollShiftY;

      // Eye tracking shifts
      let leftEyeTrack = { x: 0, y: 0 };
      let rightEyeTrack = { x: 0, y: 0 };

      if (isMouseActive) {
        const ldx = mouse.x - leftEyeCenter.x;
        const ldy = mouse.y - (leftEyeCenter.y + scrollShiftY);
        const ldist = Math.sqrt(ldx * ldx + ldy * ldy);
        const lAngle = Math.atan2(ldy, ldx);
        const lShift = Math.min(6.5, (ldist / width) * 12);
        leftEyeTrack.x = Math.cos(lAngle) * lShift;
        leftEyeTrack.y = Math.sin(lAngle) * lShift;

        const rdx = mouse.x - rightEyeCenter.x;
        const rdy = mouse.y - (rightEyeCenter.y + scrollShiftY);
        const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
        const rAngle = Math.atan2(rdy, rdx);
        const rShift = Math.min(6.5, (rdist / width) * 12);
        rightEyeTrack.x = Math.cos(rAngle) * rShift;
        rightEyeTrack.y = Math.sin(rAngle) * rShift;
      }

      const len = particles.length;

      // HIGH-PERFORMANCE RENDER LOOP
      for (let i = 0; i < len; i++) {
        const p = particles[i];

        // Activation on scanline pass
        if (!p.activated && !prefersReducedMotion) {
          if (currentScanPos >= p.baseY + scrollShiftY) {
            p.activated = true;
            p.activationTime = now;
          }
        }

        if (!p.activated) continue;

        // Smooth fade-in on activation
        if (p.currentAlpha < p.baseAlpha) {
          p.currentAlpha = Math.min(p.baseAlpha, p.currentAlpha + 0.08 * dtFactor);
        }

        let effectiveBaseX = p.baseX + sceneShiftX * 0.6;
        let effectiveBaseY = p.baseY + sceneShiftY * 0.6 + scrollShiftY;

        if (p.isEye === 'left') {
          effectiveBaseX += leftEyeTrack.x;
          effectiveBaseY += leftEyeTrack.y;
        } else if (p.isEye === 'right') {
          effectiveBaseX += rightEyeTrack.x;
          effectiveBaseY += rightEyeTrack.y;
        }

        // SQUARED DISTANCE MOUSE REPULSION
        if (!prefersReducedMotion && isMouseActive) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < repelRadiusSq && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (repelRadius - dist) / repelRadius;
            const angle = Math.atan2(dy, dx);
            p.targetX = effectiveBaseX + Math.cos(angle) * force * repelMaxDist;
            p.targetY = effectiveBaseY + Math.sin(angle) * force * repelMaxDist;
          } else {
            p.targetX = effectiveBaseX;
            p.targetY = effectiveBaseY;
          }
        } else {
          p.targetX = effectiveBaseX;
          p.targetY = effectiveBaseY;
        }

        // Position interpolation with delta-time adjustment
        const easeFactor = Math.min(1.0, p.ease * dtFactor);
        p.x += (p.targetX - p.x) * easeFactor;
        p.y += (p.targetY - p.y) * easeFactor;

        // Glow trail on repel displacement
        const dispX = p.x - effectiveBaseX;
        const dispY = p.y - effectiveBaseY;
        const dispDistSq = dispX * dispX + dispY * dispY;

        if (dispDistSq > 16) {
          const dispDist = Math.sqrt(dispDistSq);
          const trailAlpha = Math.min(0.25, (dispDist / repelMaxDist) * 0.25) * scrollFade;
          ctx.strokeStyle = `rgba(11, 168, 211, ${trailAlpha.toFixed(2)})`;
          ctx.lineWidth = p.size * 0.85;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - dispX * 0.40, p.y - dispY * 0.40);
          ctx.stroke();
        }

        // Activation flash
        let alphaToDraw = p.currentAlpha * scrollFade;
        if (now - p.activationTime < 140 && !prefersReducedMotion) {
          const flashIntensity = 1 - (now - p.activationTime) / 140;
          alphaToDraw = Math.min(1.0, alphaToDraw + flashIntensity * 0.40);
        }

        if (alphaToDraw <= 0.02) continue;

        ctx.globalAlpha = alphaToDraw;
        const size = p.size * 1.5 * scrollScale;

        // SOFT GLOW SPRITE OVERLAY
        ctx.drawImage(glowSprite, p.x - size / 2, p.y - size / 2, size, size);

        // TRUE SOURCE COLOR CORE DOT
        ctx.fillStyle = `rgb(${p.r}, ${p.g}, ${p.b})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.9 * scrollScale, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;

      // Horizontal cyan scan line drawing
      if (!prefersReducedMotion && currentScanPos <= startY + drawH + 30 + scrollShiftY) {
        const lineY = currentScanPos;
        const lineGrad = ctx.createLinearGradient(startX, lineY, startX + drawW, lineY);
        lineGrad.addColorStop(0, 'rgba(11, 168, 211, 0)');
        lineGrad.addColorStop(0.15, `rgba(11, 168, 211, ${(0.90 * scrollFade).toFixed(2)})`);
        lineGrad.addColorStop(0.5, `rgba(255, 255, 255, ${(1.0 * scrollFade).toFixed(2)})`);
        lineGrad.addColorStop(0.85, `rgba(11, 168, 211, ${(0.90 * scrollFade).toFixed(2)})`);
        lineGrad.addColorStop(1, 'rgba(11, 168, 211, 0)');

        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(startX - 25, lineY);
        ctx.lineTo(startX + drawW + 25, lineY);
        ctx.stroke();

        ctx.fillStyle = `rgba(11, 168, 211, ${(0.12 * scrollFade).toFixed(2)})`;
        ctx.fillRect(startX - 20, lineY - 6, drawW + 40, 12);
      }

      animationFrameId = requestAnimationFrame(render);
    }

    runRender = render;
    render(performance.now());
  }

  const onMouseMove = (e) => {
    const rect = heroSection.getBoundingClientRect();
    targetMouse.x = e.clientX - rect.left;
    targetMouse.y = e.clientY - rect.top;
    isMouseActive = true;
  };

  const onMouseLeave = () => {
    isMouseActive = false;
    targetMouse.x = -1000;
    targetMouse.y = -1000;
  };

  const onTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      const rect = heroSection.getBoundingClientRect();
      targetMouse.x = e.touches[0].clientX - rect.left;
      targetMouse.y = e.touches[0].clientY - rect.top;
      isMouseActive = true;
    }
  };

  heroSection.addEventListener('mousemove', onMouseMove);
  heroSection.addEventListener('mouseleave', onMouseLeave);
  heroSection.addEventListener('touchmove', onTouchMove, { passive: true });
  heroSection.addEventListener('touchstart', onTouchMove, { passive: true });
  heroSection.addEventListener('touchend', onMouseLeave, { passive: true });

  let resizeTimeout;
  const onResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (loadedImage) {
        setupParticles(loadedImage);
      }
    }, 150);
  };
  window.addEventListener('resize', onResize);

  // IntersectionObserver to pause/resume rendering when offscreen
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isHeroVisible = entry.isIntersecting;
      if (isHeroVisible) {
        if (loadedImage && runRender && !animationFrameId) {
          lastTime = performance.now();
          animationFrameId = requestAnimationFrame(runRender);
        }
      } else {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      }
    });
  }, { threshold: 0 });
  observer.observe(heroSection);

  loadRobotImage().then(img => {
    loadedImage = img;
    setupParticles(img);
  }).catch(err => {
    console.warn('Particle image load notice:', err);
  });
}
