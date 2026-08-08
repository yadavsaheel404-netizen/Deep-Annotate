// coverage.js - India GeoJSON D3 Map rendering (post-2019, Telangana+Ladakh accurate)
export function initCoverage() {
  const container = document.getElementById('india-map-container');
  if (!container) return;

  // Clear the container first
  container.innerHTML = '';

  // Create tooltip element (shared, appended to body once)
  let tooltip = document.getElementById('cov-state-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'cov-state-tooltip';
    tooltip.style.cssText = [
      'position:fixed',
      'pointer-events:none',
      'z-index:9999',
      'background:#0E1F3E',
      'color:#FFFFFF',
      'font-family:Inter,sans-serif',
      'font-size:11px',
      'font-weight:600',
      'letter-spacing:0.04em',
      'padding:5px 12px',
      'border-radius:100px',
      'white-space:nowrap',
      'opacity:0',
      'transition:opacity 0.15s ease',
      'box-shadow:0 4px 12px rgba(14,31,62,0.25)',
    ].join(';');
    document.body.appendChild(tooltip);
  }

  // Cities and coordinates
  const cities = [
    { name: 'Delhi',       coords: [77.2090, 28.6139] },
    { name: 'Jaipur',      coords: [75.7873, 26.9124] },
    { name: 'Ahmedabad',   coords: [72.5714, 23.0225] },
    { name: 'Varanasi',    coords: [82.9739, 25.3176] },
    { name: 'Patna',       coords: [85.1376, 25.5941] },
    { name: 'Kolkata',     coords: [88.3639, 22.5726] },
    { name: 'Mumbai',      coords: [72.8777, 19.0760] },
    { name: 'Pune',        coords: [73.8567, 18.5204] },
    { name: 'Goa',         coords: [73.8278, 15.4909] },
    { name: 'Hyderabad',   coords: [78.4867, 17.3850] },
    { name: 'Bhubaneswar', coords: [85.8245, 20.2961] },
    { name: 'Bengaluru',   coords: [77.5946, 12.9716] },
    { name: 'Chennai',     coords: [80.2707, 13.0827] },
    { name: 'Coimbatore',  coords: [76.9558, 11.0168] },
    { name: 'Madurai',     coords: [78.1198,  9.9252] },
  ];

  // Load native GeoJSON (post-2019: Telangana split, Ladakh UT, J&K UT)
  d3.json('./data/india_states.geojson').then(geojson => {
    console.log('India State features count:', geojson.features.length);

    // Build the map once and set up resize observer
    let currentSvg = null;
    let currentMarkersG = null;
    let currentProjection = null;

    function buildMap() {
      // Clear previous render
      container.innerHTML = '';

      // Use getBoundingClientRect for reliable actual rendered dimensions
      const rect = container.getBoundingClientRect();
      const PAD = 20; // padding inside the SVG so nothing touches the edge

      // Fall back to reasonable defaults if container hasn't laid out yet
      let width  = rect.width  > 50 ? rect.width  : 520;
      let height = rect.height > 50 ? rect.height : 560;

      const svg = d3.select('#india-map-container')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');
        // NOTE: NO overflow:visible — keeps everything clipped within the SVG bounds

      // SVG drop-shadow filter for hover glow
      const defs = svg.append('defs');
      const filter = defs.append('filter')
        .attr('id', 'state-hover-glow')
        .attr('x', '-20%').attr('y', '-20%')
        .attr('width', '140%').attr('height', '140%');
      filter.append('feDropShadow')
        .attr('dx', 0).attr('dy', 0)
        .attr('stdDeviation', 4)
        .attr('flood-color', '#0BA8D3')
        .attr('flood-opacity', 0.5);

      const PAD_SIDE   = 2;  // left / right / bottom padding
      const PAD_TOP    = 12; // extra room so J&K/Ladakh never clips

      // fitExtent: [[x0,y0],[x1,y1]] — leaves PAD px on every side, no clipping
      const projection = d3.geoMercator()
        .fitExtent([[PAD_SIDE, PAD_TOP], [width - PAD_SIDE, height - PAD_SIDE]], geojson);

      currentProjection = projection;
      const path = d3.geoPath().projection(projection);

      // States base layer — never reordered (avoids mouseleave flicker)
      const statesGroup = svg.append('g').attr('class', 'states-base');
      statesGroup
        .selectAll('path')
        .data(geojson.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', '#E6F8FC')
        .attr('stroke', '#B8E3ED')
        .attr('stroke-width', '0.8')
        .style('cursor', 'pointer')
        .on('mouseenter', function(event, d) {
          d3.select(this)
            .attr('fill', '#B2EBF7')
            .attr('stroke', '#0BA8D3')
            .attr('stroke-width', '1.5')
            .style('filter', 'url(#state-hover-glow)');
          const stateName = d.properties.ST_NM || '';
          tooltip.textContent = stateName;
          tooltip.style.opacity = '1';
          positionTooltip(event);
        })
        .on('mousemove', function(event) {
          positionTooltip(event);
        })
        .on('mouseleave', function() {
          d3.select(this)
            .attr('fill', '#E6F8FC')
            .attr('stroke', '#B8E3ED')
            .attr('stroke-width', '0.8')
            .style('filter', null);
          tooltip.style.opacity = '0';
        });

      // City markers layer (above states, so they're always visible)
      const markersG = svg.append('g').attr('class', 'city-markers');
      cities.forEach(city => {
        const proj = projection(city.coords);
        if (!proj) return;
        const [cx, cy] = proj;

        const g = markersG.append('g').attr('transform', `translate(${cx}, ${cy})`);

        g.append('circle')
          .attr('r', 3)
          .attr('fill', '#0BA8D3');

        let dx = 8, dy = 3.5, anchor = 'start';
        if (['Mumbai', 'Goa', 'Ahmedabad', 'Bengaluru', 'Coimbatore'].includes(city.name)) {
          dx = -8; anchor = 'end';
        }
        g.append('text')
          .text(city.name)
          .attr('x', dx).attr('y', dy)
          .attr('text-anchor', anchor)
          .style('font-family', "'Inter', sans-serif")
          .style('font-size', '10px')
          .style('font-weight', '500')
          .style('fill', '#333333')
          .style('pointer-events', 'none');
      });

      currentSvg = svg;
      currentMarkersG = markersG;
    }

    // Initial render — defer one frame so the flex layout has resolved heights
    requestAnimationFrame(() => {
      buildMap();
    });

    // Redraw on container resize (debounced)
    let resizeTimer;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        buildMap();
      }, 150);
    });
    ro.observe(container);

  }).catch(err => {
    console.error('Error loading India GeoJSON map:', err);
  });

  // Position tooltip near cursor with small offset
  function positionTooltip(event) {
    tooltip.style.left = (event.clientX + 14) + 'px';
    tooltip.style.top  = (event.clientY - 28) + 'px';
  }
}
