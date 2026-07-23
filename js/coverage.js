// coverage.js - India TopoJSON D3 Map rendering
export function initCoverage() {
  const container = document.getElementById('india-map-container');
  if (!container) return;

  // Clear the container first
  container.innerHTML = '';

  // Load TopoJSON data
  d3.json('./components/india-states.json').then(topology => {
    // Extract GeoJSON features from TopoJSON
    const geojson = topojson.feature(topology, topology.objects.IND_adm1);
    
    // Log state count to console as requested: "verify state count = 28+ features in console log before styling"
    console.log('India State features count:', geojson.features.length);
    console.log('State features loaded:', geojson.features);

    // Get container size inside the callback so layout is calculated
    let width = container.clientWidth;
    let height = container.clientHeight;
    if (!width || width < 100) width = 550;
    if (!height || height < 100) height = 600;

    const svg = d3.select('#india-map-container')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('overflow', 'visible');

    // Setup projection
    const projection = d3.geoMercator()
      .fitSize([width, height], geojson);

    const path = d3.geoPath().projection(projection);

    // Draw states group
    svg.append('g')
      .selectAll('path')
      .data(geojson.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', '#E6F8FC') // Very soft, brand-harmonious light cyan fill
      .attr('stroke', '#B8E3ED') // Light, soft cyan border stroke
      .attr('stroke-width', '0.8px')
      .style('cursor', 'pointer')
      .style('transition', 'fill 0.3s ease')
      .on('mouseover', function() {
        d3.select(this).attr('fill', '#C2EFF7');
      })
      .on('mouseout', function() {
        d3.select(this).attr('fill', '#E6F8FC');
      });

    // Cities and coordinates: Delhi, Jaipur, Ahmedabad, Varanasi, Patna, Kolkata, Mumbai, Pune, Goa, Hyderabad, Bhubaneswar, Bengaluru (HQ), Chennai, Coimbatore, Madurai.
    const cities = [
      { name: 'Delhi', coords: [77.2090, 28.6139], pulse: false },
      { name: 'Jaipur', coords: [75.7873, 26.9124], pulse: false },
      { name: 'Ahmedabad', coords: [72.5714, 23.0225], pulse: false },
      { name: 'Varanasi', coords: [82.9739, 25.3176], pulse: false },
      { name: 'Patna', coords: [85.1376, 25.5941], pulse: false },
      { name: 'Kolkata', coords: [88.3639, 22.5726], pulse: false },
      { name: 'Mumbai', coords: [72.8777, 19.0760], pulse: false },
      { name: 'Pune', coords: [73.8567, 18.5204], pulse: false },
      { name: 'Goa', coords: [73.8278, 15.4909], pulse: false },
      { name: 'Hyderabad', coords: [78.4867, 17.3850], pulse: false },
      { name: 'Bhubaneswar', coords: [85.8245, 20.2961], pulse: false },
      { name: 'Bengaluru (HQ)', coords: [77.5946, 12.9716], pulse: true, hq: true },
      { name: 'Chennai', coords: [80.2707, 13.0827], pulse: false },
      { name: 'Coimbatore', coords: [76.9558, 11.0168], pulse: false },
      { name: 'Madurai', coords: [78.1198, 9.9252], pulse: false }
    ];

    // Draw markers
    const markers = svg.append('g');

    cities.forEach(city => {
      const [cx, cy] = projection(city.coords);

      const markerG = markers.append('g')
        .attr('transform', `translate(${cx}, ${cy})`);

      if (city.hq) {
        // HQ distinct ring
        markerG.append('circle')
          .attr('r', 8)
          .attr('fill', 'none')
          .attr('stroke', '#0BA8D3')
          .attr('stroke-width', '1.5px');
      }

      // Solid dot
      markerG.append('circle')
        .attr('r', city.hq ? 4.5 : 3)
        .attr('fill', '#0BA8D3');

      // Label offset
      // Position label relative to dot to prevent overlaps
      let dx = 8;
      let dy = 3.5;
      let textAnchor = 'start';

      if (city.name === 'Mumbai' || city.name === 'Goa' || city.name === 'Ahmedabad' || city.name === 'Bengaluru (HQ)' || city.name === 'Coimbatore') {
        dx = -8;
        textAnchor = 'end';
      }

      markerG.append('text')
        .text(city.name)
        .attr('x', dx)
        .attr('y', dy)
        .attr('text-anchor', textAnchor)
        .style('font-family', "'Inter', sans-serif")
        .style('font-size', '10px')
        .style('font-weight', '500')
        .style('fill', '#333333')
        .style('pointer-events', 'none');
    });
  }).catch(err => {
    console.error('Error loading TopoJSON India map:', err);
  });
}
