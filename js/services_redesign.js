/* js/services_redesign.js — Interactive Logic for Services Page Redesign */

export function initServicesRedesign() {
  initPipelineStepper();
  initAnnotationDemo();
  initNavigationSimulation();
}

/* ─────────────────────────────────────────────────────────────
   SECTION 1: PIPELINE STEPPER LOGIC
─────────────────────────────────────────────────────────────── */
const STEPPER_DATA = [
  {
    num: '01',
    title: 'Audio AI',
    sub: 'Acoustic Modality',
    tag: 'ACOUSTIC',
    desc: 'Speech transcription, diarization, emotion tagging, and phonetic stress annotation across 34+ global languages and regional dialects.',
    stat1Lbl: 'Languages',
    stat1Val: '34+',
    stat2Lbl: 'Accuracy SLA',
    stat2Val: '99.2%'
  },
  {
    num: '02',
    title: 'Physical AI',
    sub: 'Embodied Systems',
    tag: 'EMBODIED SYSTEMS',
    desc: 'Kinematic trajectories, hand-object pose estimation, and depth mapping engineered specifically for robotic arms, quadrupeds, and autonomous bots.',
    stat1Lbl: 'Models Trained',
    stat1Val: '200+',
    stat2Lbl: 'Timeline',
    stat2Val: '6 Months'
  },
  {
    num: '03',
    title: 'Image & Vision',
    sub: 'Computer Vision',
    tag: 'COMPUTER VISION',
    desc: 'Pixel-perfect semantic and instance segmentation, 2D/3D bounding boxes, OCR, and document layout parsing for high-throughput vision pipelines.',
    stat1Lbl: 'Formats',
    stat1Val: 'COCO, YOLO, VOC',
    stat2Lbl: 'Latency',
    stat2Val: '<2 Min'
  },
  {
    num: '04',
    title: 'Video AI',
    sub: 'Dynamic Video',
    tag: 'DYNAMIC VIDEO',
    desc: 'Cross-frame object tracking, event boundary labeling, occlusion persistence, and temporal action segmentation across 4K video streams.',
    stat1Lbl: 'FPS Handled',
    stat1Val: '30+',
    stat2Lbl: 'Objects / Frame',
    stat2Val: '50+'
  },
  {
    num: '05',
    title: '3D LiDAR',
    sub: 'Spatial Point Cloud',
    tag: 'SPATIAL POINT CLOUD',
    desc: '3D bounding cuboids, LiDAR point cloud segmentation, and sub-millisecond sensor-camera projection synchronization for autonomous driving fleets.',
    stat1Lbl: 'Formats',
    stat1Val: 'ROS2, HDF5',
    stat2Lbl: 'Point Density',
    stat2Val: '10x'
  },
  {
    num: '06',
    title: 'RLHF',
    sub: 'Foundation Models',
    tag: 'FOUNDATION MODELS',
    desc: 'Preference ranking, constitutional AI prompt evaluation, red-teaming, and domain-expert instruction tuning for frontier LLMs.',
    stat1Lbl: 'Prompt Pairs',
    stat1Val: '1M+',
    stat2Lbl: 'Safety Checks',
    stat2Val: 'Automated'
  }
];

function initPipelineStepper() {
  const listContainer = document.getElementById('stepper-list');
  const panelWrapper = document.getElementById('stepper-panel-content');
  const progressBar = document.getElementById('stepper-progress-bar');
  if (!listContainer || !panelWrapper || !progressBar) return;

  let activeIndex = 0;
  let autoAdvanceTimer = null;
  let isUserInteracting = false;

  const renderStep = (index, animate = true) => {
    activeIndex = index;
    const itemData = STEPPER_DATA[index];

    const buttons = listContainer.querySelectorAll('.stepper-item');
    buttons.forEach((btn, idx) => {
      if (idx === index) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    if (animate) {
      panelWrapper.classList.add('animating');
      setTimeout(() => {
        updatePanelDOM(itemData);
        panelWrapper.classList.remove('animating');
      }, 150);
    } else {
      updatePanelDOM(itemData);
    }

    const pct = ((index + 1) / STEPPER_DATA.length) * 100;
    progressBar.style.width = `${pct}%`;
  };

  const updatePanelDOM = (data) => {
    panelWrapper.innerHTML = `
      <span class="stepper-tag-pill">${data.tag}</span>
      <h3 class="stepper-panel-title">${data.title}</h3>
      <p class="stepper-panel-desc">${data.desc}</p>
      <div class="stepper-stats-row">
        <div class="stepper-stat-card">
          <div class="stepper-stat-lbl">${data.stat1Lbl}</div>
          <div class="stepper-stat-val">${data.stat1Val}</div>
        </div>
        <div class="stepper-stat-card">
          <div class="stepper-stat-lbl">${data.stat2Lbl}</div>
          <div class="stepper-stat-val">${data.stat2Val}</div>
        </div>
      </div>
    `;
  };

  listContainer.innerHTML = STEPPER_DATA.map((item, idx) => `
    <button class="stepper-item ${idx === 0 ? 'active' : ''}" data-idx="${idx}" aria-selected="${idx === 0 ? 'true' : 'false'}">
      <div class="stepper-num">${item.num}</div>
      <div class="stepper-text">
        <span class="stepper-title">${item.title}</span>
        <span class="stepper-sub">${item.sub}</span>
      </div>
    </button>
  `).join('');

  const buttons = listContainer.querySelectorAll('.stepper-item');
  buttons.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      isUserInteracting = true;
      renderStep(idx);
    });

    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const next = (idx + 1) % STEPPER_DATA.length;
        buttons[next].focus();
        renderStep(next);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = (idx - 1 + STEPPER_DATA.length) % STEPPER_DATA.length;
        buttons[prev].focus();
        renderStep(prev);
      }
    });
  });

  const startAutoAdvance = () => {
    stopAutoAdvance();
    autoAdvanceTimer = setInterval(() => {
      if (!isUserInteracting) {
        const nextIdx = (activeIndex + 1) % STEPPER_DATA.length;
        renderStep(nextIdx);
      }
    }, 6000);
  };

  const stopAutoAdvance = () => {
    if (autoAdvanceTimer) clearInterval(autoAdvanceTimer);
  };

  const stepperGrid = document.getElementById('pipeline-stepper');
  if (stepperGrid) {
    stepperGrid.addEventListener('mouseenter', () => { isUserInteracting = true; });
    stepperGrid.addEventListener('mouseleave', () => { isUserInteracting = false; });
  }

  renderStep(0, false);
  startAutoAdvance();
}


/* ─────────────────────────────────────────────────────────────
   SECTION 2: INTERACTIVE ANNOTATION DEMO LOGIC
─────────────────────────────────────────────────────────────── */
function initAnnotationDemo() {
  const canvas = document.getElementById('annotation-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let currentSensor = 'scene'; // 'scene' | 'depth' | 'thermal'
  let currentTool = 'bbox'; // 'bbox' | 'polygon' | 'keypoint' | 'auto'
  
  // Ground truth scene figures with depth indices and anchor points
  const SCENE_FIGURES = [
    {
      id: 'person_standing',
      class: 'Person',
      rect: { x: 60, y: 110, w: 110, h: 220 },
      anchors: [{ x: 115, y: 140 }, { x: 115, y: 200 }, { x: 100, y: 300 }]
    },
    {
      id: 'robot_arm',
      class: 'Robot',
      rect: { x: 260, y: 130, w: 150, h: 200 },
      anchors: [{ x: 335, y: 160 }, { x: 335, y: 220 }, { x: 335, y: 290 }]
    },
    {
      id: 'crate_pallet',
      class: 'Object',
      rect: { x: 480, y: 220, w: 160, h: 110 },
      anchors: [{ x: 560, y: 240 }, { x: 560, y: 290 }]
    },
    {
      id: 'person_crouched',
      class: 'Person',
      rect: { x: 480, y: 60, w: 90, h: 120 },
      anchors: [{ x: 525, y: 80 }, { x: 525, y: 120 }]
    },
    {
      id: 'conveyor_surface',
      class: 'Surface',
      rect: { x: 240, y: 340, w: 200, h: 40 },
      anchors: [{ x: 340, y: 360 }]
    }
  ];

  let annotations = [];
  let history = [JSON.stringify(annotations)];

  let isDrawing = false;
  let startX = 0, startY = 0;
  let currentRect = null;
  let polyPoints = [];
  let hasInteracted = false;

  const resizeCanvas = () => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * (window.devicePixelRatio || 1);
    canvas.height = rect.height * (window.devicePixelRatio || 1);
    drawCanvas();
  };

  window.addEventListener('resize', resizeCanvas);

  const CLASS_COLORS = {
    Person: '#3B82F6',   // Blue
    Robot: '#8B5CF6',    // Violet
    Object: '#F59E0B',   // Amber
    Surface: '#10B981'   // Emerald
  };

  const CLASS_TEXT_COLORS = {
    Person: '#FFFFFF',
    Robot: '#FFFFFF',
    Object: '#1F2937',   // Dark text for contrast on Amber
    Surface: '#FFFFFF'
  };

  const saveHistory = () => {
    history.push(JSON.stringify(annotations));
    if (history.length > 20) history.shift();
  };

  const undo = () => {
    if (history.length > 1) {
      history.pop();
      annotations = JSON.parse(history[history.length - 1]);
      updateStats();
      drawCanvas();
    }
  };

  const clearAll = () => {
    annotations = [];
    saveHistory();
    updateStats();
    drawCanvas();
  };

  const hideHintPrompt = () => {
    if (!hasInteracted) {
      hasInteracted = true;
      const hint = document.getElementById('demo-hint-prompt');
      if (hint) hint.classList.add('hidden');
      try { sessionStorage.setItem('demo_hint_seen', 'true'); } catch (e) {}
    }
  };

  if (sessionStorage.getItem('demo_hint_seen') === 'true') {
    const hint = document.getElementById('demo-hint-prompt');
    if (hint) hint.classList.add('hidden');
    hasInteracted = true;
  }

  const showEmptyToast = (x, y) => {
    const rect = canvas.getBoundingClientRect();
    const toast = document.createElement('div');
    toast.className = 'demo-toast';
    toast.textContent = 'No object detected — drag over a figure';
    toast.style.left = `${(x / 700) * rect.width}px`;
    toast.style.top = `${(y / 420) * rect.height}px`;
    canvas.parentElement.appendChild(toast);

    setTimeout(() => toast.remove(), 1600);
  };

  // Draw Background Scene matching Reference Screenshots Exactly
  const drawBackground = () => {
    const w = canvas.width;
    const h = canvas.height;
    const scale = w / 700;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const now = performance.now();

    const swayOffset = prefersReducedMotion ? 0 : Math.sin(now * 0.002) * 2 * scale;
    const ledAlpha = prefersReducedMotion ? 1 : 0.4 + Math.sin(now * 0.005) * 0.6;

    if (currentSensor === 'scene') {
      // 1. Scene View Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#F1F5F9');
      bgGrad.addColorStop(0.7, '#E2E8F0');
      bgGrad.addColorStop(1, '#CBD5E1');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Low-opacity refined dot grid
      ctx.fillStyle = 'rgba(148, 163, 184, 0.25)';
      for (let x = 25 * scale; x < w; x += 30 * scale) {
        for (let y = 25 * scale; y < h; y += 30 * scale) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2 * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Grounding Shadows
      const drawShadow = (cx, cy, rx, ry) => {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.12)';
        ctx.beginPath();
        ctx.ellipse(cx * scale, cy * scale, rx * scale, ry * scale, 0, 0, Math.PI * 2);
        ctx.fill();
      };

      drawShadow(115, 335, 45, 10);
      drawShadow(335, 335, 75, 14);
      drawShadow(560, 335, 85, 12);

      // Conveyor Surface (Bottom Center)
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(240 * scale, 345 * scale, 200 * scale, 30 * scale);
      ctx.fillStyle = '#64748B';
      ctx.fillRect(240 * scale, 370 * scale, 200 * scale, 10 * scale);

      // Standing Human (Left: x=60..170)
      ctx.fillStyle = '#64748B';
      ctx.beginPath();
      ctx.arc(115 * scale + swayOffset, 140 * scale, 18 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(100 * scale + swayOffset, 163 * scale, 30 * scale, 95 * scale);
      ctx.fillRect(96 * scale + swayOffset, 258 * scale, 14 * scale, 72 * scale);
      ctx.fillRect(118 * scale + swayOffset, 258 * scale, 14 * scale, 72 * scale);

      // Crouched Human (Top Right: x=480..570)
      ctx.fillStyle = '#64748B';
      ctx.beginPath();
      ctx.arc(525 * scale, 80 * scale, 14 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(510 * scale, 98 * scale, 30 * scale, 50 * scale);
      ctx.fillRect(505 * scale, 148 * scale, 40 * scale, 30 * scale);

      // Robot Unit with Sensor Eye (Center: x=260..410)
      ctx.fillStyle = '#475569';
      ctx.fillRect(270 * scale, 250 * scale, 130 * scale, 80 * scale);
      ctx.fillRect(290 * scale, 315 * scale, 90 * scale, 15 * scale);

      ctx.beginPath();
      ctx.arc(335 * scale, 210 * scale, 22 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(328 * scale, 145 * scale, 14 * scale, 65 * scale);

      // Blinking Robot LED
      ctx.fillStyle = `rgba(0, 212, 255, ${ledAlpha})`;
      ctx.beginPath();
      ctx.arc(335 * scale, 210 * scale, 6 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Industrial Crate (Right: x=480..640)
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(480 * scale, 230 * scale, 160 * scale, 100 * scale);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2 * scale;
      ctx.strokeRect(480 * scale, 230 * scale, 160 * scale, 100 * scale);

    } else if (currentSensor === 'depth') {
      // 2. Depth Map View (Exactly like Screenshot 1 Reference)
      // Concentric Radial Heat Gradient centered on Canvas
      const cx = w / 2;
      const cy = h / 2;
      const radGrad = ctx.createRadialGradient(cx, cy, 10 * scale, cx, cy, w * 0.75);
      
      radGrad.addColorStop(0, '#EF4444');    // Center: Red / Pink (NEAR)
      radGrad.addColorStop(0.18, '#EC4899');
      radGrad.addColorStop(0.38, '#F97316'); // Orange / Yellow
      radGrad.addColorStop(0.55, '#EAB308');
      radGrad.addColorStop(0.72, '#84CC16'); // Green / Emerald
      radGrad.addColorStop(0.88, '#06B6D4'); // Cyan / Blue (FAR)
      radGrad.addColorStop(1, '#2563EB');

      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, w, h);

      // Header Text Overlay (Matching Screenshot 1)
      ctx.font = `bold ${10 * scale}px "IBM Plex Mono", monospace`;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('NEAR', 20 * scale, 26 * scale);

      ctx.font = `bold ${11 * scale}px "IBM Plex Mono", monospace`;
      ctx.fillStyle = '#FACC15';
      ctx.textAlign = 'center';
      ctx.fillText('DEPTH MAP VIEW', w / 2, 26 * scale);

      ctx.font = `bold ${10 * scale}px "IBM Plex Mono", monospace`;
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'right';
      ctx.fillText('FAR', w - 20 * scale, 26 * scale);
      ctx.textAlign = 'left'; // Reset alignment

    } else if (currentSensor === 'thermal') {
      // 3. Thermal IR View (Exactly like Screenshot 2 Reference)
      // Dark Navy Background
      ctx.fillStyle = '#070B19';
      ctx.fillRect(0, 0, w, h);

      // Header Text Overlay (Matching Screenshot 2)
      ctx.font = `bold ${11 * scale}px "IBM Plex Mono", monospace`;
      ctx.fillStyle = '#FACC15';
      ctx.textAlign = 'center';
      ctx.fillText('THERMAL IR VIEW', w / 2, 26 * scale);
      ctx.textAlign = 'left'; // Reset alignment

      // Radial Heat Blobs (Matching Thermal Camera Output in Reference)
      const drawThermalHeatBlob = (bx, by, radius, tempText) => {
        const hg = ctx.createRadialGradient(bx * scale, by * scale, 2 * scale, bx * scale, by * scale, radius * scale);
        hg.addColorStop(0, '#FFFFFF');        // White core
        hg.addColorStop(0.25, '#FACC15');     // Yellow
        hg.addColorStop(0.55, '#F97316');     // Orange / Red
        hg.addColorStop(0.85, 'rgba(239, 68, 68, 0.4)');
        hg.addColorStop(1, 'transparent');

        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.arc(bx * scale, by * scale, radius * scale, 0, Math.PI * 2);
        ctx.fill();

        // Temperature Badge Overlay (e.g., 37.2°C as in Screenshot 2)
        if (tempText) {
          ctx.font = `bold ${10.5 * scale}px "IBM Plex Mono", monospace`;
          ctx.fillStyle = '#F97316';
          ctx.fillText(tempText, bx * scale - 18 * scale, by * scale - 28 * scale);
        }
      };

      drawThermalHeatBlob(115, 230, 75, '37.2°C');  // Human Standing Heat
      drawThermalHeatBlob(345, 230, 85, '42.8°C');  // Robot Motor Heat
      drawThermalHeatBlob(525, 120, 50, '36.8°C');  // Human Crouched Heat
      drawThermalHeatBlob(560, 275, 40, null);      // Crate ambient
    }
  };

  // Draw Canvas & High-Contrast Annotations
  const drawCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    const scale = canvas.width / 700;

    // Render Saved Annotations
    annotations.forEach((ann) => {
      const color = CLASS_COLORS[ann.class] || '#3B82F6';
      const textColor = CLASS_TEXT_COLORS[ann.class] || '#FFFFFF';

      if (ann.type === 'bbox' && ann.rect) {
        const { x, y, w, h } = ann.rect;
        const rx = x * scale, ry = y * scale, rw = w * scale, rh = h * scale;

        // Shape fill (14% opacity)
        ctx.fillStyle = hexToRgba(color, 0.14);
        ctx.fillRect(rx, ry, rw, rh);

        // Solid 2.5px border
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5 * scale;
        ctx.strokeRect(rx, ry, rw, rh);

        // Exactly ONE single label tag outside top-left edge (gap 4px)
        const tagText = ann.class;
        ctx.font = `bold ${11 * scale}px Inter`;
        const textWidth = ctx.measureText(tagText).width;
        const tagH = 20 * scale;
        const tagW = textWidth + 16 * scale;
        const tagX = rx;
        const tagY = ry - tagH - 4 * scale;

        // Tag background
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(tagX, tagY, tagW, tagH, 4 * scale);
        ctx.fill();

        // Tag text
        ctx.fillStyle = textColor;
        ctx.fillText(tagText, tagX + 8 * scale, tagY + 14 * scale);

      } else if (ann.type === 'polygon' && ann.points && ann.points.length > 1) {
        ctx.fillStyle = hexToRgba(color, 0.14);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5 * scale;

        ctx.beginPath();
        ann.points.forEach((pt, i) => {
          if (i === 0) ctx.moveTo(pt.x * scale, pt.y * scale);
          else ctx.lineTo(pt.x * scale, pt.y * scale);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Tag on first vertex
        const firstPt = ann.points[0];
        const tagText = ann.class;
        ctx.font = `bold ${11 * scale}px Inter`;
        const tagW = ctx.measureText(tagText).width + 16 * scale;
        ctx.fillStyle = color;
        ctx.fillRect(firstPt.x * scale, firstPt.y * scale - 24 * scale, tagW, 20 * scale);
        ctx.fillStyle = textColor;
        ctx.fillText(tagText, firstPt.x * scale + 8 * scale, firstPt.y * scale - 9 * scale);

      } else if (ann.type === 'keypoint' && ann.points) {
        // Connect consecutive keypoints with dashed line
        if (ann.points.length > 1) {
          ctx.beginPath();
          ann.points.forEach((pt, i) => {
            if (i === 0) ctx.moveTo(pt.x * scale, pt.y * scale);
            else ctx.lineTo(pt.x * scale, pt.y * scale);
          });
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5 * scale;
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Keypoint dots with numbered badges
        ann.points.forEach((pt, i) => {
          const px = pt.x * scale, py = pt.y * scale;

          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(px, py, 7 * scale, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = textColor;
          ctx.font = `bold ${9 * scale}px IBM Plex Mono`;
          ctx.fillText(`${i + 1}`, px - 3 * scale, py + 3 * scale);
        });
      }
    });

    // Draw live drag rectangle
    if (isDrawing && currentRect) {
      const { x, y, w, h } = currentRect;
      ctx.setLineDash([6, 4]);
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 2 * scale;
      ctx.strokeRect(x * scale, y * scale, w * scale, h * scale);
      ctx.setLineDash([]);
    }

    // Draw live polygon vertices
    if (polyPoints.length > 0) {
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 2 * scale;
      ctx.beginPath();
      polyPoints.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x * scale, pt.y * scale);
        else ctx.lineTo(pt.x * scale, pt.y * scale);
      });
      ctx.stroke();

      polyPoints.forEach((pt) => {
        ctx.fillStyle = '#3B82F6';
        ctx.beginPath();
        ctx.arc(pt.x * scale, pt.y * scale, 4 * scale, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    requestAnimationFrame(drawCanvas);
  };

  const getCanvasMousePos = (e) => {
    const rect = canvas.getBoundingClientRect();
    const scale = 700 / rect.width;
    return {
      x: (e.clientX - rect.left) * scale,
      y: (e.clientY - rect.top) * scale
    };
  };

  // Smart Find Best Overlapping Figure
  const findBestFigureOverlap = (dragRect) => {
    let bestFigure = null;
    let maxOverlapArea = 0;

    SCENE_FIGURES.forEach((fig) => {
      const { x: x1, y: y1, w: w1, h: h1 } = dragRect;
      const { x: x2, y: y2, w: w2, h: h2 } = fig.rect;

      const interX1 = Math.max(x1, x2);
      const interY1 = Math.max(y1, y2);
      const interX2 = Math.min(x1 + w1, x2 + w2);
      const interY2 = Math.min(y1 + h1, y2 + h2);

      if (interX2 > interX1 && interY2 > interY1) {
        const area = (interX2 - interX1) * (interY2 - interY1);
        if (area > maxOverlapArea) {
          maxOverlapArea = area;
          bestFigure = fig;
        }
      }
    });

    return bestFigure;
  };

  // Edit-Class Popup (Only shown on clicking ALREADY-LABELED shape)
  const showClassEditPicker = (anchorX, anchorY, currentClass, onSelect) => {
    hideClassEditPicker();

    const rect = canvas.getBoundingClientRect();
    const pop = document.createElement('div');
    pop.className = 'class-edit-pop';
    pop.id = 'class-edit-pop';

    const screenX = (anchorX / 700) * rect.width;
    let screenY = (anchorY / 420) * rect.height;

    pop.style.left = `${screenX}px`;
    pop.style.top = `${screenY}px`;

    pop.innerHTML = `
      <button class="class-chip-btn chip-person" data-class="Person">Person</button>
      <button class="class-chip-btn chip-robot" data-class="Robot">Robot</button>
      <button class="class-chip-btn chip-object" data-class="Object">Object</button>
      <button class="class-chip-btn chip-surface" data-class="Surface">Surface</button>
    `;

    canvas.parentElement.appendChild(pop);

    pop.querySelectorAll('.class-chip-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cls = btn.getAttribute('data-class');
        onSelect(cls);
        hideClassEditPicker();
      });
    });

    const onOutsideClick = (e) => {
      if (!pop.contains(e.target) && e.target !== canvas) {
        hideClassEditPicker();
        document.removeEventListener('click', onOutsideClick);
      }
    };

    setTimeout(() => {
      document.addEventListener('click', onOutsideClick);
    }, 50);
  };

  const hideClassEditPicker = () => {
    const existing = document.getElementById('class-edit-pop');
    if (existing) existing.remove();
  };

  // Canvas Mouse Handlers with Instant Auto-Classification
  canvas.addEventListener('mousedown', (e) => {
    hideHintPrompt();
    hideClassEditPicker();

    const { x, y } = getCanvasMousePos(e);

    // Check if clicking an ALREADY-LABELED annotation to edit label
    const clickedExisting = annotations.find((ann) => {
      if (ann.rect) {
        return (
          x >= ann.rect.x && x <= ann.rect.x + ann.rect.w &&
          y >= ann.rect.y && y <= ann.rect.y + ann.rect.h
        );
      }
      return false;
    });

    if (clickedExisting) {
      showClassEditPicker(clickedExisting.rect.x + clickedExisting.rect.w / 2, clickedExisting.rect.y, clickedExisting.class, (newClass) => {
        clickedExisting.class = newClass;
        saveHistory();
        updateStats();
      });
      return;
    }

    if (currentTool === 'bbox') {
      isDrawing = true;
      startX = x;
      startY = y;
      currentRect = { x, y, w: 0, h: 0 };
      updateStatus('DRAWING');

    } else if (currentTool === 'keypoint') {
      let targetPt = { x, y };
      let matchedFig = null;

      SCENE_FIGURES.forEach((fig) => {
        fig.anchors.forEach((anc) => {
          if (Math.hypot(x - anc.x, y - anc.y) < 25) {
            targetPt = { x: anc.x, y: anc.y };
            matchedFig = fig;
          }
        });
      });

      polyPoints.push(targetPt);
      const autoClass = matchedFig ? matchedFig.class : 'Person';

      // INSTANT AUTO-CLASSIFY (NO POPUP)
      annotations.push({
        id: Date.now(),
        type: 'keypoint',
        class: autoClass,
        points: [...polyPoints]
      });
      polyPoints = [];
      saveHistory();
      updateStats();
      updateStatus('READY');
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    if (isDrawing && currentTool === 'bbox') {
      const { x, y } = getCanvasMousePos(e);
      const w = x - startX;
      const h = y - startY;

      currentRect = {
        x: w > 0 ? startX : x,
        y: h > 0 ? startY : y,
        w: Math.abs(w),
        h: Math.abs(h)
      };
    }
  });

  canvas.addEventListener('mouseup', (e) => {
    if (isDrawing && currentTool === 'bbox' && currentRect) {
      isDrawing = false;
      const dragRect = { ...currentRect };
      currentRect = null;

      if (dragRect.w > 10 || dragRect.h > 10) {
        const bestFigure = findBestFigureOverlap(dragRect);

        if (bestFigure) {
          // Snap tightly to the figure's true bounds with 6px padding
          const snappedRect = {
            x: bestFigure.rect.x - 6,
            y: bestFigure.rect.y - 6,
            w: bestFigure.rect.w + 12,
            h: bestFigure.rect.h + 12
          };

          // INSTANT AUTO-CLASSIFY ON SELECT (NO MANUAL POPUP)
          annotations.push({
            id: Date.now(),
            type: 'bbox',
            class: bestFigure.class, // Auto-applies ground-truth class!
            rect: snappedRect
          });
          saveHistory();
          updateStats();
          updateStatus('READY');

        } else {
          // Dragged in empty space -> Toast notification
          showEmptyToast(dragRect.x + dragRect.w / 2, dragRect.y + dragRect.h / 2);
          updateStatus('READY');
        }
      } else {
        updateStatus('READY');
      }
    }
  });

  canvas.addEventListener('click', (e) => {
    hideHintPrompt();
    const { x, y } = getCanvasMousePos(e);

    if (currentTool === 'polygon') {
      if (polyPoints.length > 2 && Math.hypot(x - polyPoints[0].x, y - polyPoints[0].y) < 15) {
        // INSTANT AUTO-CLASSIFY
        annotations.push({
          id: Date.now(),
          type: 'polygon',
          class: 'Person',
          points: [...polyPoints]
        });
        polyPoints = [];
        saveHistory();
        updateStats();
        updateStatus('READY');
      } else {
        polyPoints.push({ x, y });
        updateStatus('DRAWING');
      }
    }
  });

  // Auto-Label Tool
  const triggerAutoLabel = () => {
    hideHintPrompt();
    const shimmer = document.getElementById('demo-shimmer');
    if (shimmer) shimmer.classList.add('active');
    updateStatus('DRAWING');

    setTimeout(() => {
      if (shimmer) shimmer.classList.remove('active');

      const autoBoxes = [
        { id: Date.now(), type: 'bbox', class: 'Person', rect: { x: 54, y: 104, w: 122, h: 232 } },
        { id: Date.now() + 1, type: 'bbox', class: 'Robot', rect: { x: 254, y: 124, w: 162, h: 212 } }
      ];

      annotations.push(...autoBoxes);
      saveHistory();
      updateStats();
      updateStatus('READY');
    }, 450);
  };

  // Tab switching
  document.querySelectorAll('.demo-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.demo-tab-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentSensor = btn.getAttribute('data-sensor');
      document.getElementById('demo-mode-lbl').textContent = currentSensor === 'depth' ? 'Depth' : (currentSensor === 'thermal' ? 'Thermal' : 'Scene View');
    });
  });

  // Tool switching
  document.querySelectorAll('.demo-tool-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tool = btn.getAttribute('data-tool');
      if (tool === 'auto') {
        triggerAutoLabel();
        return;
      }

      document.querySelectorAll('.demo-tool-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentTool = tool;
      document.getElementById('demo-tool-lbl').textContent = tool === 'bbox' ? 'Bounding Box' : (tool === 'keypoint' ? 'Keypoints' : 'Polygon');
      polyPoints = [];
      updateStatus('READY');
    });
  });

  // Actions
  const btnUndo = document.getElementById('btn-demo-undo');
  if (btnUndo) btnUndo.addEventListener('click', undo);

  const btnClear = document.getElementById('btn-demo-clear');
  if (btnClear) btnClear.addEventListener('click', clearAll);

  // Keyboard shortcut Ctrl+Z
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      undo();
    }
  });

  // Update Stats & Distribution Bars
  const updateStats = () => {
    const totalCount = annotations.length;
    document.getElementById('demo-obj-count').textContent = totalCount;

    const counts = { Person: 0, Robot: 0, Object: 0, Surface: 0 };
    annotations.forEach((a) => {
      if (counts[a.class] !== undefined) counts[a.class]++;
    });

    Object.keys(counts).forEach((cls) => {
      const cnt = counts[cls];
      const pct = totalCount > 0 ? (cnt / totalCount) * 100 : 0;
      const cntEl = document.getElementById(`dist-cnt-${cls.toLowerCase()}`);
      const barEl = document.getElementById(`dist-bar-${cls.toLowerCase()}`);

      if (cntEl) cntEl.textContent = cnt;
      if (barEl) barEl.style.width = `${pct}%`;
    });
  };

  // Color-coded Status Pill
  const updateStatus = (st) => {
    const pill = document.getElementById('demo-status-pill');
    if (pill) {
      pill.textContent = st;
      pill.className = 'status-pill';
      if (st === 'DRAWING') pill.classList.add('drawing');
      else if (st === 'READY') pill.classList.add('ready');
      else pill.classList.add('idle');
    }
  };

  // Export JSON Modal
  const btnExport = document.getElementById('btn-export-json');
  const modalBackdrop = document.getElementById('json-modal');
  const modalClose = document.getElementById('json-modal-close');
  const jsonCodeBox = document.getElementById('json-code-preview');

  if (btnExport && modalBackdrop) {
    btnExport.addEventListener('click', () => {
      const exportData = annotations.map((a) => ({
        id: a.id,
        type: a.type,
        class: a.class,
        coordinates: a.rect || a.points
      }));

      const jsonStr = JSON.stringify(exportData, null, 2);
      jsonCodeBox.textContent = jsonStr;
      modalBackdrop.classList.add('open');

      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'deepannotate_annotations.json';
      a.click();
      URL.revokeObjectURL(url);
    });

    modalClose.addEventListener('click', () => {
      modalBackdrop.classList.remove('open');
    });

    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) modalBackdrop.classList.remove('open');
    });
  }

  // Helper
  function hexToRgba(hex, alpha) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
  }

  resizeCanvas();
  updateStats();
  updateStatus('READY');
  drawCanvas();
}


/* ─────────────────────────────────────────────────────────────
   SECTION 3: NAVIGATION SIMULATION LOGIC
─────────────────────────────────────────────────────────────── */
function initNavigationSimulation() {
  const canvas = document.getElementById('nav-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  let currentMode = 'nav'; // 'nav' | 'slam' | 'manipulation'
  let lerpFactor = 0.05;
  let sensorRange = 70;
  let obstacleDensity = 'medium'; // 'low' | 'medium' | 'high'

  // Robot / Arm State
  let rx = 350, ry = 220;
  let targetX = 350, targetY = 220;
  let angle = 0;

  let trailPoints = [];
  let slamMapLines = [];
  let distanceTraveled = 0;
  let collisionCount = 0;

  // FPS calculation
  let lastTime = performance.now();
  let frameCount = 0;
  let measuredFps = 60;

  // Obstacles list
  let obstacles = [];

  const generateObstacles = () => {
    obstacles = [];
    let count = 6;
    if (obstacleDensity === 'low') count = 3;
    if (obstacleDensity === 'high') count = 10;

    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    for (let i = 0; i < count; i++) {
      obstacles.push({
        x: 80 + Math.random() * (w - 160),
        y: 60 + Math.random() * (h - 120),
        w: 50 + Math.random() * 40,
        h: 40 + Math.random() * 30,
        discovered: false,
        proxHighlight: false
      });
    }
  };

  const resizeSimCanvas = () => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * (window.devicePixelRatio || 1);
    canvas.height = rect.height * (window.devicePixelRatio || 1);
    generateObstacles();
  };

  window.addEventListener('resize', resizeSimCanvas);

  // Track mouse target
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    targetX = e.clientX - rect.left;
    targetY = e.clientY - rect.top;
  });

  // Controls Event Listeners
  document.querySelectorAll('.sim-mode-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sim-mode-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.getAttribute('data-mode');
      generateObstacles();
      document.getElementById('sim-mode-readout').textContent = currentMode.toUpperCase();
    });
  });

  const speedSlider = document.getElementById('sim-speed-slider');
  if (speedSlider) {
    speedSlider.addEventListener('input', (e) => {
      lerpFactor = parseFloat(e.target.value);
    });
  }

  const rangeSlider = document.getElementById('sim-range-slider');
  if (rangeSlider) {
    rangeSlider.addEventListener('input', (e) => {
      sensorRange = parseInt(e.target.value, 10);
    });
  }

  const obsSlider = document.getElementById('sim-obs-slider');
  if (obsSlider) {
    obsSlider.addEventListener('input', (e) => {
      const vals = ['low', 'medium', 'high'];
      obstacleDensity = vals[parseInt(e.target.value, 10)];
      generateObstacles();
      document.getElementById('sim-obs-readout').textContent = obstacles.length;
    });
  }

  const btnReset = document.getElementById('btn-sim-reset');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      trailPoints = [];
      slamMapLines = [];
      distanceTraveled = 0;
      collisionCount = 0;
      generateObstacles();
    });
  }

  // Animation Loop
  const renderLoop = (now) => {
    frameCount++;
    if (now - lastTime >= 1000) {
      measuredFps = frameCount;
      frameCount = 0;
      lastTime = now;
      const fpsEl = document.getElementById('sim-fps-readout');
      if (fpsEl) fpsEl.textContent = measuredFps;
    }

    const scale = window.devicePixelRatio || 1;
    const w = canvas.width / scale;
    const h = canvas.height / scale;

    ctx.save();
    ctx.scale(scale, scale);

    // Clear Canvas
    ctx.fillStyle = '#060E1C';
    ctx.fillRect(0, 0, w, h);

    // Dot grid
    ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
    for (let x = 20; x < w; x += 30) {
      for (let y = 20; y < h; y += 30) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Update Lerp Robot Movement
    const dx = targetX - rx;
    const dy = targetY - ry;
    const dist = Math.hypot(dx, dy);

    if (dist > 1.5) {
      rx += dx * lerpFactor;
      ry += dy * lerpFactor;
      angle = Math.atan2(dy, dx);
      distanceTraveled += Math.hypot(dx * lerpFactor, dy * lerpFactor);

      if (currentMode === 'nav') {
        trailPoints.push({ x: rx, y: ry });
        if (trailPoints.length > 35) trailPoints.shift();
      } else if (currentMode === 'slam') {
        slamMapLines.push({ x: rx, y: ry });
      }
    }

    // Check Obstacles Collisions & Proximity
    obstacles.forEach((obs) => {
      obs.proxHighlight = false;

      const closestX = Math.max(obs.x, Math.min(rx, obs.x + obs.w));
      const closestY = Math.max(obs.y, Math.min(ry, obs.y + obs.h));
      const d = Math.hypot(rx - closestX, ry - closestY);

      if (d < sensorRange) {
        obs.proxHighlight = true;
        if (currentMode === 'slam') obs.discovered = true;
      }

      if (d < 18) {
        collisionCount++;
      }
    });

    // Draw Obstacles
    obstacles.forEach((obs) => {
      ctx.fillStyle = obs.discovered ? 'rgba(11, 168, 211, 0.2)' : 'rgba(255, 255, 255, 0.05)';
      ctx.strokeStyle = obs.proxHighlight ? '#00D4FF' : (obs.discovered ? '#0BA8D3' : 'rgba(255, 255, 255, 0.15)');
      ctx.lineWidth = obs.proxHighlight ? 2.5 : 1.5;

      ctx.beginPath();
      ctx.roundRect(obs.x, obs.y, obs.w, obs.h, 10);
      ctx.fill();
      ctx.stroke();

      if (obs.proxHighlight) {
        ctx.fillStyle = '#00D4FF';
        ctx.font = 'bold 9px IBM Plex Mono';
        ctx.fillText('DETECTED', obs.x + 6, obs.y + 16);
      }
    });

    // Render Mode Specific Visualizations
    if (currentMode === 'nav') {
      // Fading trail
      if (trailPoints.length > 1) {
        ctx.beginPath();
        trailPoints.forEach((pt, i) => {
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.strokeStyle = '#00D4FF';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Sensor Range Circle
      ctx.beginPath();
      ctx.arc(rx, ry, sensorRange, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
      ctx.fillStyle = 'rgba(0, 212, 255, 0.04)';
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();

      // Robot Icon (Directional Arrow)
      ctx.save();
      ctx.translate(rx, ry);
      ctx.rotate(angle);
      ctx.fillStyle = '#0BA8D3';
      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.lineTo(-10, -10);
      ctx.lineTo(-6, 0);
      ctx.lineTo(-10, 10);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

    } else if (currentMode === 'slam') {
      // Permanent SLAM Map Lines
      if (slamMapLines.length > 1) {
        ctx.beginPath();
        slamMapLines.forEach((pt, i) => {
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // Robot Icon
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(rx, ry, 10, 0, Math.PI * 2);
      ctx.fill();

    } else if (currentMode === 'manipulation') {
      // 2-Joint Robotic Arm
      const baseX = w / 2;
      const baseY = h - 30;

      const L1 = 120;
      const L2 = 100;

      // Calculate Inverse Kinematics
      const targetDist = Math.hypot(targetX - baseX, targetY - baseY);
      const reachDist = Math.min(targetDist, L1 + L2 - 5);

      const targetAngle = Math.atan2(targetY - baseY, targetX - baseX);
      const cosAngle2 = (reachDist * reachDist - L1 * L1 - L2 * L2) / (2 * L1 * L2);
      const angle2 = Math.acos(Math.max(-1, Math.min(1, cosAngle2)));

      const cosAngle1 = (L1 * L1 + reachDist * reachDist - L2 * L2) / (2 * L1 * reachDist);
      const angle1 = targetAngle - Math.acos(Math.max(-1, Math.min(1, cosAngle1)));

      const joint1X = baseX + L1 * Math.cos(angle1);
      const joint1Y = baseY + L1 * Math.sin(angle1);

      const endX = joint1X + L2 * Math.cos(angle1 + angle2);
      const endY = joint1Y + L2 * Math.sin(angle1 + angle2);

      // Reach Limit Arc
      ctx.beginPath();
      ctx.arc(baseX, baseY, L1 + L2, 0, Math.PI * 2);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(255, 186, 8, 0.3)';
      ctx.stroke();
      ctx.setLineDash([]);

      // Arm Segment 1
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(joint1X, joint1Y);
      ctx.strokeStyle = '#FFBA08';
      ctx.lineWidth = 6;
      ctx.stroke();

      // Arm Segment 2
      ctx.beginPath();
      ctx.moveTo(joint1X, joint1Y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = '#0BA8D3';
      ctx.lineWidth = 5;
      ctx.stroke();

      // Joints
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(baseX, baseY, 10, 0, Math.PI * 2);
      ctx.arc(joint1X, joint1Y, 8, 0, Math.PI * 2);
      ctx.fill();

      // End Effector Gripper Tip
      ctx.fillStyle = '#FFBA08';
      ctx.beginPath();
      ctx.arc(endX, endY, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // Update Telemetry Panel Numbers
    document.getElementById('sim-dist-readout').textContent = `${Math.round(distanceTraveled)} px`;
    document.getElementById('sim-coll-readout').textContent = Math.floor(collisionCount / 40);

    const conf = Math.max(50, Math.min(99, Math.round(100 - (lerpFactor * 200) - (collisionCount / 20))));
    document.getElementById('sim-conf-readout').textContent = `${conf}%`;

    requestAnimationFrame(renderLoop);
  };

  resizeSimCanvas();
  requestAnimationFrame(renderLoop);
}
