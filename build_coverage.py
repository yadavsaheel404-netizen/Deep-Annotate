import re

with open('../india_states.svg', 'r', encoding='utf-8') as f:
    raw = f.read()

# Extract all paths. Use \sd= to avoid matching id=
paths = re.findall(r'<path[^>]*\sd="(.*?)"[^>]*>', raw, re.DOTALL)

paths_html = ""
for p in paths:
    d = p.replace('\n', ' ').strip()
    paths_html += f'            <path class="cov-map-state" d="{d}" />\n'

html = f"""<!-- Geographic Coverage Component -->
<section class="cov-section fade-in-section">
  <div class="section-wrap cov-container">
    <div class="cov-grid">
      <!-- Left side: Stats -->
      <div class="cov-left-col">
        <div class="cov-header">
          <div class="cov-eyebrow">
            <svg width="16" height="2" viewBox="0 0 16 2" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="16" height="2" fill="currentColor"/></svg>
            GEOGRAPHIC COVERAGE
          </div>
          <h2 class="cov-title">Mapping <span>Incredible India</span></h2>
        </div>

        <div class="cov-stats">
          <div class="cov-stat-card">
            <div class="cov-stat-num">100K+</div>
            <div class="cov-stat-label">VILLAGES COVERED</div>
            <div class="cov-stat-desc">Tier 1, 2, 3 cities plus rural India — the world's most diverse deployment environment.</div>
          </div>

          <div class="cov-stat-card">
            <div class="cov-stat-num">28</div>
            <div class="cov-stat-label">STATES ACTIVE</div>
            <div class="cov-tags">
              <span class="cov-tag">Bengaluru</span>
              <span class="cov-tag">Mumbai</span>
              <span class="cov-tag">Delhi</span>
              <span class="cov-tag">Hyderabad</span>
              <span class="cov-tag">Chennai</span>
              <span class="cov-tag">Pune</span>
              <span class="cov-tag">Kolkata</span>
              <span class="cov-tag cov-tag-more">+21 more</span>
            </div>
          </div>

          <div class="cov-stat-card">
            <div class="cov-stat-num">10M+</div>
            <div class="cov-stat-label">DATA COLLECTORS</div>
            <div class="cov-stat-desc">The largest human-in-the-loop data collection workforce in Asia-Pacific.</div>
          </div>

          <div class="cov-stat-card">
            <div class="cov-stat-num">30K</div>
            <div class="cov-stat-label">SQ FT INFRASTRUCTURE</div>
            <div class="cov-stat-desc">Annotation centers, data processing hubs, and R&D labs across India.</div>
          </div>
        </div>
      </div>

      <!-- Right side: Map container -->
      <div class="cov-right-col">
        <div class="cov-map-card">
          <svg class="cov-map-svg" viewBox="-5 -5 710 725" xmlns="http://www.w3.org/2000/svg">
            <g class="cov-map-states-group">
{paths_html}            </g>

            <!-- Pins -->
            <g transform="translate(195, 175)">
              <circle class="cov-map-dot" cx="0" cy="0" r="4" />
              <text class="cov-map-label" x="8" y="4">Delhi</text>
            </g>

            <g transform="translate(135, 255)">
              <circle class="cov-map-dot" cx="0" cy="0" r="3" />
              <text class="cov-map-label" x="-45" y="4">Jaipur</text>
            </g>

            <g transform="translate(425, 290)">
              <circle class="cov-map-dot" cx="0" cy="0" r="3" />
              <text class="cov-map-label" x="8" y="4">Patna</text>
            </g>

            <g transform="translate(350, 275)">
              <circle class="cov-map-dot" cx="0" cy="0" r="3" />
              <text class="cov-map-label" x="-55" y="4">Varanasi</text>
            </g>

            <g transform="translate(70, 345)">
              <circle class="cov-map-dot" cx="0" cy="0" r="3" />
              <text class="cov-map-label" x="-75" y="4">Ahmedabad</text>
            </g>

            <g transform="translate(485, 370)">
              <circle class="cov-map-dot" cx="0" cy="0" r="4" />
              <text class="cov-map-label" x="8" y="4">Kolkata</text>
            </g>

            <g transform="translate(75, 470)">
              <circle class="cov-map-dot" cx="0" cy="0" r="4" />
              <text class="cov-map-label" x="-55" y="4">Mumbai</text>
            </g>

            <g transform="translate(95, 490)">
              <circle class="cov-map-dot" cx="0" cy="0" r="3" />
              <text class="cov-map-label" x="8" y="4">Pune</text>
            </g>

            <g transform="translate(230, 500)">
              <circle class="cov-map-dot" cx="0" cy="0" r="4" />
              <text class="cov-map-label" x="8" y="4">Hyderabad</text>
            </g>

            <g transform="translate(100, 545)">
              <circle class="cov-map-dot" cx="0" cy="0" r="3" />
              <text class="cov-map-label" x="-30" y="4">Goa</text>
            </g>

            <g transform="translate(195, 605)">
              <circle class="cov-map-pulse" cx="0" cy="0" r="5" />
              <circle class="cov-map-dot" cx="0" cy="0" r="5" style="fill: var(--navy); stroke: var(--cyan); stroke-width: 2px;" />
              <text class="cov-map-label" x="-110" y="4">Bengaluru (HQ)</text>
            </g>

            <g transform="translate(255, 605)">
              <circle class="cov-map-dot" cx="0" cy="0" r="4" />
              <text class="cov-map-label" x="8" y="4">Chennai</text>
            </g>

            <g transform="translate(195, 655)">
              <circle class="cov-map-dot" cx="0" cy="0" r="3" />
              <text class="cov-map-label" x="-80" y="4">Coimbatore</text>
            </g>

            <g transform="translate(210, 680)">
              <circle class="cov-map-dot" cx="0" cy="0" r="3" />
              <text class="cov-map-label" x="8" y="4">Madurai</text>
            </g>
            
            <g transform="translate(420, 380)">
              <circle class="cov-map-dot" cx="0" cy="0" r="3" />
              <text class="cov-map-label" x="8" y="4">Bhubaneswar</text>
            </g>

          </svg>
          
          <div class="cov-live-badge">
            <span class="cov-live-dot"></span>
            DATA RECORDING NETWORK &mdash; LIVE
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
"""

with open('components/coverage.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Generated components/coverage.html')
