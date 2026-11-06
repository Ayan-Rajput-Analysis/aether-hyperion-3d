// ============================================================
// SafarGuide — Route Animation Controller
// Scroll-based Exploded View for Route Map
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initRouteAnimation();
});

function initRouteAnimation() {
  const routeSection = document.getElementById('routeExplodedView');
  if (!routeSection) return;

  // Build the route nodes
  buildRouteView();

  // Create scroll-driven animation
  const nodes = document.querySelectorAll('.route-stop-item');
  const infoCards = document.querySelectorAll('.route-info-card');
  const routePath = document.getElementById('routePath');

  // Intersection Observer for each node
  const nodeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('exploded');

        // Show corresponding info card
        const idx = entry.target.dataset.index;
        const card = document.querySelector(`.route-info-card[data-index="${idx}"]`);
        if (card) {
          setTimeout(() => card.classList.add('visible'), 200);
        }
      } else {
        entry.target.classList.remove('exploded');

        const idx = entry.target.dataset.index;
        const card = document.querySelector(`.route-info-card[data-index="${idx}"]`);
        if (card) card.classList.remove('visible');
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-10% 0px -10% 0px'
  });

  nodes.forEach(node => nodeObserver.observe(node));

  // Draw SVG path animation on scroll
  if (routePath) {
    const pathLength = routePath.getTotalLength();
    routePath.style.strokeDasharray = pathLength;
    routePath.style.strokeDashoffset = pathLength;

    window.addEventListener('scroll', throttle(() => {
      const sectionRect = routeSection.getBoundingClientRect();
      const sectionHeight = routeSection.offsetHeight;
      const windowHeight = window.innerHeight;

      // Calculate scroll progress within the section
      const scrolled = windowHeight - sectionRect.top;
      const total = sectionHeight + windowHeight;
      const progress = Math.max(0, Math.min(1, scrolled / total));

      routePath.style.strokeDashoffset = pathLength * (1 - progress);
    }, 16), { passive: true });
  }
}

function buildRouteView() {
  const container = document.getElementById('routeExplodedView');
  if (!container || typeof ROUTE_STOPS === 'undefined') return;

  // Build SVG Path
  const svgHeight = ROUTE_STOPS.length * 220;

  let routeHTML = `
    <div class="route-map-container">
      <!-- SVG Route Line -->
      <svg class="route-svg" viewBox="0 0 100 ${svgHeight}" preserveAspectRatio="none">
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#22C55E" />
            <stop offset="50%" stop-color="#F5A623" />
            <stop offset="100%" stop-color="#EF4444" />
          </linearGradient>
        </defs>
        <!-- Background track -->
        <line x1="50" y1="20" x2="50" y2="${svgHeight - 20}" 
              stroke="#E4E7EB" stroke-width="3" />
        <!-- Animated line -->
        <line id="routePath" x1="50" y1="20" x2="50" y2="${svgHeight - 20}" 
              stroke="url(#routeGradient)" stroke-width="4" stroke-linecap="round" />
      </svg>

      <!-- Route Stops -->
      <div class="route-stops-list">
  `;

  ROUTE_STOPS.forEach((stop, index) => {
    const isEven = index % 2 === 0;
    const progressPercent = Math.round((stop.distanceFromStart / 485) * 100);

    routeHTML += `
      <div class="route-stop-item route-node" data-index="${index}">
        <!-- Node Dot -->
        <div class="route-dot-wrapper">
          <div class="route-dot ${stop.isMajorStop ? 'major' : ''} ${stop.isStart ? 'start' : ''} ${stop.isEnd ? 'end' : ''}">
            <span class="route-dot-icon">${stop.icon}</span>
          </div>
          ${!stop.isEnd ? `<div class="route-dot-connector"></div>` : ''}
        </div>

        <!-- Info Card -->
        <div class="route-info-card ${isEven ? '' : 'right'}" data-index="${index}">
          <div class="route-card-inner">
            <div class="route-card-header-bar" style="background: ${stop.isStart ? '#22C55E' : stop.isEnd ? '#EF4444' : stop.hasBreak ? '#F5A623' : '#3B82F6'}">
              <span class="route-city-name">${stop.city}</span>
              <span class="route-city-urdu">${stop.cityUrdu}</span>
            </div>
            <div class="route-card-body-content">
              <div class="route-card-stats">
                <div class="route-stat">
                  <span class="route-stat-value">${stop.distanceFromStart} km</span>
                  <span class="route-stat-label">Distance</span>
                </div>
                <div class="route-stat">
                  <span class="route-stat-value">${stop.timeFromStart}</span>
                  <span class="route-stat-label">Time</span>
                </div>
                <div class="route-stat">
                  <span class="route-stat-value">${progressPercent}%</span>
                  <span class="route-stat-label">Journey</span>
                </div>
              </div>
              <p class="route-card-desc">${stop.description}</p>
              ${stop.hasBreak ? '<div class="route-break-badge">☕ Chai & Dinner Break — 30-45 min</div>' : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  });

  routeHTML += `
      </div>
    </div>
  `;

  container.innerHTML = routeHTML;
}

// Additional route-specific styles injected
const routeStyles = document.createElement('style');
routeStyles.textContent = `
  .route-map-container {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 0;
  }

  .route-svg {
    position: absolute;
    left: 50%;
    top: 0;
    width: 4px;
    height: 100%;
    transform: translateX(-50%);
    z-index: 1;
    display: none; /* Using CSS instead */
  }

  .route-stops-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: relative;
  }

  /* Vertical line connector */
  .route-stops-list::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--color-gray-200);
    transform: translateX(-50%);
    z-index: 0;
  }

  .route-stop-item {
    display: flex;
    align-items: flex-start;
    position: relative;
    min-height: 160px;
    z-index: 2;
    padding: 1rem 0;
  }

  /* Alternate layout */
  .route-stop-item:nth-child(odd) {
    flex-direction: row;
    padding-left: 0;
    padding-right: calc(50% + 40px);
  }

  .route-stop-item:nth-child(even) {
    flex-direction: row-reverse;
    padding-right: 0;
    padding-left: calc(50% + 40px);
  }

  /* Dot wrapper */
  .route-dot-wrapper {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 5;
  }

  .route-dot {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--color-white);
    border: 3px solid var(--color-gray-300);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: var(--shadow-sm);
  }

  .route-dot.major {
    width: 52px;
    height: 52px;
    border-color: var(--color-primary);
    background: var(--color-primary-lightest);
  }

  .route-dot.start {
    border-color: #22C55E;
    background: #DCFCE7;
    box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.15);
  }

  .route-dot.end {
    border-color: #EF4444;
    background: #FEE2E2;
    box-shadow: 0 0 0 6px rgba(239, 68, 68, 0.15);
  }

  .route-stop-item.exploded .route-dot {
    transform: scale(1.2);
    box-shadow: 0 0 0 10px rgba(17, 94, 61, 0.1);
  }

  .route-dot-icon {
    line-height: 1;
  }

  /* Info Cards */
  .route-info-card {
    flex: 1;
    opacity: 0;
    transform: translateX(-30px) scale(0.95);
    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .route-info-card.right {
    transform: translateX(30px) scale(0.95);
  }

  .route-info-card.visible {
    opacity: 1;
    transform: translateX(0) scale(1);
  }

  .route-card-inner {
    background: var(--color-white);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--color-gray-200);
    transition: box-shadow 0.3s ease;
  }

  .route-card-inner:hover {
    box-shadow: var(--shadow-lg);
  }

  .route-card-header-bar {
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: white;
  }

  .route-city-name {
    font-weight: 700;
    font-size: 1.1rem;
  }

  .route-city-urdu {
    font-family: var(--font-urdu);
    font-size: 1rem;
    direction: rtl;
  }

  .route-card-body-content {
    padding: 1rem;
  }

  .route-card-stats {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }

  .route-stat {
    display: flex;
    flex-direction: column;
  }

  .route-stat-value {
    font-weight: 700;
    font-size: 0.95rem;
    color: var(--color-gray-800);
  }

  .route-stat-label {
    font-size: 0.7rem;
    color: var(--color-gray-500);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .route-card-desc {
    font-size: 0.85rem;
    color: var(--color-gray-600);
    line-height: 1.6;
    margin: 0;
  }

  .route-break-badge {
    margin-top: 0.75rem;
    padding: 0.5rem 0.75rem;
    background: #FFF8EB;
    border: 1px solid #FFD98E;
    border-radius: var(--radius-sm);
    font-size: 0.8rem;
    font-weight: 600;
    color: #92400E;
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .route-stops-list::before {
      left: 24px;
    }

    .route-stop-item,
    .route-stop-item:nth-child(odd),
    .route-stop-item:nth-child(even) {
      flex-direction: row;
      padding-left: 65px;
      padding-right: 0;
    }

    .route-dot-wrapper {
      left: 24px;
    }

    .route-info-card,
    .route-info-card.right {
      transform: translateX(20px) scale(0.95);
    }

    .route-info-card.visible {
      transform: translateX(0) scale(1);
    }

    .route-dot {
      width: 36px;
      height: 36px;
      font-size: 0.9rem;
    }

    .route-dot.major {
      width: 42px;
      height: 42px;
    }

    .route-card-stats {
      flex-wrap: wrap;
    }
  }
`;
document.head.appendChild(routeStyles);
