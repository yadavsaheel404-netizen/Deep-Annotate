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

    // Update active button list styling
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

    // Animate content swap
    if (animate) {
      panelWrapper.classList.add('animating');
      setTimeout(() => {
        updatePanelDOM(itemData);
        panelWrapper.classList.remove('animating');
      }, 150);
    } else {
      updatePanelDOM(itemData);
    }

    // Update horizontal progress bar width (16.6% -> 100%)
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

  // Build list buttons
  listContainer.innerHTML = STEPPER_DATA.map((item, idx) => `
    <button class="stepper-item ${idx === 0 ? 'active' : ''}" data-idx="${idx}" aria-selected="${idx === 0 ? 'true' : 'false'}">
      <div class="stepper-num">${item.num}</div>
      <div class="stepper-text">
        <span class="stepper-title">${item.title}</span>
        <span class="stepper-sub">${item.sub}</span>
      </div>
    </button>
  `).join('');

  // Add event listeners
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

  // Auto-advance timer (every 6 seconds)
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

  // Initial render
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
  
  let annotations = [
    { id: 1, type: 'bbox', class: 'Person', rect: { x: 90, y: 140, w: 95, h: 200 } },
    { id: 2, type: 'bbox', class: 'Robot', rect: { x: 270, y: 160, w: 120, h: 180 } },
    { id: 3, type: 'bbox', class: 'Object', rect: { x: 470, y: 220, w: 110, h: 110 } }
  ];

  let history = [JSON.stringify(annotations)];

  let isDrawing = false;
  let startX = 0, startY = 0;
  let currentRect = null;
  let polyPoints = [];
  let pendingAnnotation = null;

  // Set canvas resolution
  const resizeCanvas = () => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio || rect.width;
    canvas.height = rect.height * window.devicePixelRatio || rect.height;
    drawCanvas();
  };

  window.addEventListener('resize', resizeCanvas);

  // Colors per class
  const CLASS_COLORS = {
    Person: '#0BA8D3',
    Robot: '#8B5CF6',
    Object: '#FFBA08',
    Surface: '#10B981'
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

  // Draw background scenes
  const drawBackground = () => {
    const w = canvas.width;
    const h = canvas.height;
    const scale = w / 700;

    if (currentSensor === 'scene') {
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, w, h);

      // Grid dots
      ctx.fillStyle = '#CBD5E1';
      for (let x = 20 * scale; x < w; x += 30 * scale) {
        for (let y = 20 * scale; y < h; y += 30 * scale) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5 * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Ground plane
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(0, 340 * scale, w, h - 340 * scale);

      // Silhouette Person (left)
      ctx.fillStyle = '#94A3B8';
      ctx.beginPath();
      ctx.arc(135 * scale, 175 * scale, 18 * scale, 0, Math.PI * 2); // head
      ctx.fill();
      ctx.fillRect(120 * scale, 198 * scale, 30 * scale, 85 * scale); // body
      ctx.fillRect(118 * scale, 285 * scale, 14 * scale, 55 * scale); // leg L
      ctx.fillRect(138 * scale, 285 * scale, 14 * scale, 55 * scale); // leg R

      // Silhouette Robot Arm / Bot (center)
      ctx.fillStyle = '#64748B';
      ctx.fillRect(280 * scale, 260 * scale, 100 * scale, 80 * scale); // base bot
      ctx.beginPath();
      ctx.arc(330 * scale, 230 * scale, 24 * scale, 0, Math.PI * 2); // joint
      ctx.fill();
      ctx.fillRect(324 * scale, 175 * scale, 12 * scale, 60 * scale); // arm

      // Silhouette Surface Object (right)
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(470 * scale, 240 * scale, 110 * scale, 100 * scale);

    } else if (currentSensor === 'depth') {
      // Depth Map Heat Gradient
      const grad = ctx.createRadialGradient(w / 2, h / 2, 50 * scale, w / 2, h / 2, w / 1.2);
      grad.addColorStop(0, '#0F172A');
      grad.addColorStop(0.3, '#1E1B4B');
      grad.addColorStop(0.6, '#4338CA');
      grad.addColorStop(0.9, '#DB2777');
      grad.addColorStop(1, '#F43F5E');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Depth silhouette shapes
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.fillRect(120 * scale, 175 * scale, 30 * scale, 165 * scale);
      ctx.fillRect(280 * scale, 175 * scale, 100 * scale, 165 * scale);
      ctx.fillRect(470 * scale, 240 * scale, 110 * scale, 100 * scale);

    } else if (currentSensor === 'thermal') {
      // Thermal Camera Palette
      ctx.fillStyle = '#050B14';
      ctx.fillRect(0, 0, w, h);

      // Warm heat blobs
      const drawHeatBlob = (cx, cy, r, color1, color2) => {
        const bg = ctx.createRadialGradient(cx, cy, 2, cx, cy, r);
        bg.addColorStop(0, color1);
        bg.addColorStop(0.6, color2);
        bg.addColorStop(1, 'transparent');
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      };

      drawHeatBlob(135 * scale, 220 * scale, 65 * scale, '#FACC15', '#EF4444'); // Person thermal
      drawHeatBlob(330 * scale, 240 * scale, 75 * scale, '#F97316', '#DC2626'); // Robot thermal
      drawHeatBlob(525 * scale, 290 * scale, 45 * scale, '#3B82F6', '#1E3A8A'); // Object cool thermal
    }
  };

  // Draw canvas scene + annotations
  const drawCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    const scale = canvas.width / 700;

    // Draw saved annotations
    annotations.forEach((ann) => {
      const color = CLASS_COLORS[ann.class] || '#0BA8D3';

      if (ann.type === 'bbox' && ann.rect) {
        const { x, y, w, h } = ann.rect;
        const rx = x * scale, ry = y * scale, rw = w * scale, rh = h * scale;

        // Box fill
        ctx.fillStyle = hexToRgba(color, 0.18);
        ctx.fillRect(rx, ry, rw, rh);

        // Box border
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5 * scale;
        ctx.strokeRect(rx, ry, rw, rh);

        // Label pill
        ctx.fillStyle = color;
        ctx.fillRect(rx, ry - 22 * scale, ctx.measureText(ann.class).width * scale + 24 * scale, 22 * scale);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${11 * scale}px Inter`;
        ctx.fillText(ann.class, rx + 6 * scale, ry - 6 * scale);

      } else if (ann.type === 'polygon' && ann.points && ann.points.length > 1) {
        ctx.fillStyle = hexToRgba(color, 0.2);
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

      } else if (ann.type === 'keypoint' && ann.points) {
        ann.points.forEach((pt, i) => {
          const px = pt.x * scale, py = pt.y * scale;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(px, py, 6 * scale, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FFFFFF';
          ctx.font = `bold ${9 * scale}px IBM Plex Mono`;
          ctx.fillText(`${i + 1}`, px - 3 * scale, py + 3 * scale);
        });
      }
    });

    // Draw current live drawing rect
    if (isDrawing && currentRect) {
      const { x, y, w, h } = currentRect;
      ctx.setLineDash([6, 4]);
      ctx.strokeStyle = '#0BA8D3';
      ctx.lineWidth = 2;
      ctx.strokeRect(x * scale, y * scale, w * scale, h * scale);
      ctx.setLineDash([]);
    }

    // Draw current live polygon vertices
    if (polyPoints.length > 0) {
      ctx.strokeStyle = '#0BA8D3';
      ctx.lineWidth = 2;
      ctx.beginPath();
      polyPoints.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x * scale, pt.y * scale);
        else ctx.lineTo(pt.x * scale, pt.y * scale);
      });
      ctx.stroke();

      polyPoints.forEach((pt) => {
        ctx.fillStyle = '#0BA8D3';
        ctx.beginPath();
        ctx.arc(pt.x * scale, pt.y * scale, 4 * scale, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  };

  const getCanvasMousePos = (e) => {
    const rect = canvas.getBoundingClientRect();
    const scale = 700 / rect.width;
    return {
      x: (e.clientX - rect.left) * scale,
      y: (e.clientY - rect.top) * scale
    };
  };

  // Show inline class picker popup
  const showClassPicker = (x, y, onSelect) => {
    hideClassPicker();

    const rect = canvas.getBoundingClientRect();
    const pop = document.createElement('div');
    pop.className = 'class-picker-pop';
    pop.id = 'class-picker';
    pop.style.left = `${(x / 700) * rect.width}px`;
    pop.style.top = `${(y / 420) * rect.height}px`;

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
        hideClassPicker();
      });
    });
  };

  const hideClassPicker = () => {
    const existing = document.getElementById('class-picker');
    if (existing) existing.remove();
  };

  // Mouse handlers on canvas
  canvas.addEventListener('mousedown', (e) => {
    const { x, y } = getCanvasMousePos(e);

    if (currentTool === 'bbox') {
      isDrawing = true;
      startX = x;
      startY = y;
      currentRect = { x, y, w: 0, h: 0 };
      updateStatus('DRAWING');

    } else if (currentTool === 'keypoint') {
      polyPoints.push({ x, y });
      showClassPicker(x, y, (cls) => {
        annotations.push({
          id: Date.now(),
          type: 'keypoint',
          class: cls,
          points: [...polyPoints]
        });
        polyPoints = [];
        saveHistory();
        updateStats();
        drawCanvas();
        updateStatus('READY');
      });
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

      drawCanvas();
    }
  });

  canvas.addEventListener('mouseup', (e) => {
    if (isDrawing && currentTool === 'bbox' && currentRect) {
      isDrawing = false;
      if (currentRect.w > 15 && currentRect.h > 15) {
        const finalRect = { ...currentRect };
        showClassPicker(finalRect.x + finalRect.w / 2, finalRect.y, (cls) => {
          annotations.push({
            id: Date.now(),
            type: 'bbox',
            class: cls,
            rect: finalRect
          });
          saveHistory();
          updateStats();
          drawCanvas();
          updateStatus('READY');
        });
      } else {
        updateStatus('READY');
      }
      currentRect = null;
      drawCanvas();
    }
  });

  canvas.addEventListener('click', (e) => {
    const { x, y } = getCanvasMousePos(e);

    if (currentTool === 'polygon') {
      // Check if closing polygon
      if (polyPoints.length > 2 && Math.hypot(x - polyPoints[0].x, y - polyPoints[0].y) < 15) {
        showClassPicker(x, y, (cls) => {
          annotations.push({
            id: Date.now(),
            type: 'polygon',
            class: cls,
            points: [...polyPoints]
          });
          polyPoints = [];
          saveHistory();
          updateStats();
          drawCanvas();
          updateStatus('READY');
        });
      } else {
        polyPoints.push({ x, y });
        updateStatus('DRAWING');
        drawCanvas();
      }
    }
  });

  canvas.addEventListener('dblclick', () => {
    if (currentTool === 'polygon' && polyPoints.length > 2) {
      const pt = polyPoints[polyPoints.length - 1];
      showClassPicker(pt.x, pt.y, (cls) => {
        annotations.push({
          id: Date.now(),
          type: 'polygon',
          class: cls,
          points: [...polyPoints]
        });
        polyPoints = [];
        saveHistory();
        updateStats();
        drawCanvas();
        updateStatus('READY');
      });
    }
  });

  // Auto-Label Tool
  const triggerAutoLabel = () => {
    const shimmer = document.getElementById('demo-shimmer');
    if (shimmer) shimmer.classList.add('active');

    setTimeout(() => {
      if (shimmer) shimmer.classList.remove('active');

      // Auto-add simulated bounding box for person/robot/surface
      const autoBoxes = [
        { id: Date.now(), type: 'bbox', class: 'Person', rect: { x: 110, y: 160, w: 50, h: 180 } },
        { id: Date.now() + 1, type: 'bbox', class: 'Robot', rect: { x: 275, y: 170, w: 110, h: 170 } }
      ];

      annotations.push(...autoBoxes);
      saveHistory();
      updateStats();
      drawCanvas();
    }, 450);
  };

  // Tab switching
  document.querySelectorAll('.demo-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.demo-tab-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentSensor = btn.getAttribute('data-sensor');
      document.getElementById('demo-mode-lbl').textContent = currentSensor.toUpperCase();
      drawCanvas();
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
      document.getElementById('demo-tool-lbl').textContent = tool.toUpperCase();
      polyPoints = [];
      drawCanvas();
    });
  });

  // Action Buttons
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

  const updateStatus = (st) => {
    const pill = document.getElementById('demo-status-pill');
    if (pill) {
      pill.textContent = st;
      if (st === 'DRAWING') pill.classList.add('drawing');
      else pill.classList.remove('drawing');
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

      // Trigger automatic JSON file download
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
    // Measure FPS
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

      // Nearest point on rect to robot
      const closestX = Math.max(obs.x, Math.min(rx, obs.x + obs.w));
      const closestY = Math.max(obs.y, Math.min(ry, obs.y + obs.h));
      const d = Math.hypot(rx - closestX, ry - closestY);

      if (d < sensorRange) {
        obs.proxHighlight = true;
        if (currentMode === 'slam') obs.discovered = true;
      }

      if (d < 18) { // Collision threshold
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
