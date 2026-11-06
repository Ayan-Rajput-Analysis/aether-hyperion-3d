// ============================================================
// SafarGuide — Schedule Page Controller
// Filtering, Sorting, Direction Swap, Tab Switching
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initSchedulePage();
});

function initSchedulePage() {
  // Check if we're on the schedule page
  const scheduleContainer = document.getElementById('scheduleContainer');
  if (!scheduleContainer) return;

  // State
  const state = {
    direction: 'sukkurToKarachi',
    shift: 'night',
    sortBy: 'departure',
    filterCompany: '',
    filterMaxPrice: '',
    filterTier: ''
  };

  // DOM Elements
  const directionBtn = document.getElementById('swapDirection');
  const cityFrom = document.getElementById('cityFrom');
  const cityTo = document.getElementById('cityTo');
  const tabBtns = document.querySelectorAll('.shift-tab');
  const filterCompany = document.getElementById('filterCompany');
  const filterSort = document.getElementById('filterSort');
  const filterPrice = document.getElementById('filterPrice');
  const resultCount = document.getElementById('resultCount');

  // Direction Swap
  if (directionBtn) {
    directionBtn.addEventListener('click', () => {
      directionBtn.classList.toggle('swapped');
      if (state.direction === 'sukkurToKarachi') {
        state.direction = 'karachiToSukkur';
        if (cityFrom) cityFrom.textContent = 'Karachi';
        if (cityTo) cityTo.textContent = 'Sukkur';
      } else {
        state.direction = 'sukkurToKarachi';
        if (cityFrom) cityFrom.textContent = 'Sukkur';
        if (cityTo) cityTo.textContent = 'Karachi';
      }
      renderSchedule();
    });
  }

  // Shift Tabs
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.shift = btn.dataset.shift;
      renderSchedule();
    });
  });

  // Filters
  if (filterCompany) {
    filterCompany.addEventListener('change', (e) => {
      state.filterCompany = e.target.value;
      renderSchedule();
    });
  }

  if (filterSort) {
    filterSort.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderSchedule();
    });
  }

  if (filterPrice) {
    filterPrice.addEventListener('change', (e) => {
      state.filterMaxPrice = e.target.value ? parseInt(e.target.value) : '';
      renderSchedule();
    });
  }

  // Render Function
  function renderSchedule() {
    const schedules = getSchedules(state.direction, state.shift);
    let filtered = filterSchedules(schedules, {
      company: state.filterCompany,
      maxPrice: state.filterMaxPrice,
      sortBy: state.sortBy,
      tier: state.filterTier
    });

    if (resultCount) {
      resultCount.textContent = `${filtered.length} buses found`;
    }

    if (filtered.length === 0) {
      scheduleContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <h3>Koi bus nahi mili</h3>
          <p>Apne filters change karke dobara try karein, ya doosri shift dekhein.</p>
        </div>
      `;
      return;
    }

    scheduleContainer.innerHTML = filtered.map((schedule, index) => {
      const company = getCompanyById(schedule.companyId);
      if (!company) return '';

      const amenities = company.amenities.slice(0, 4).map(a => {
        const info = AMENITY_ICONS[a];
        return info ? `<span class="amenity-icon" data-tooltip="${info.label}">${info.icon}</span>` : '';
      }).join('');

      return `
        <div class="bus-card animate-on-scroll" 
             style="--company-color: ${company.color}; --company-color-light: ${company.colorLight}; transition-delay: ${index * 0.05}s">
          <div class="bus-card-header">
            <div class="bus-card-company">
              <div class="company-logo-circle" style="background: ${company.colorLight}">
                ${company.logo}
              </div>
              <div>
                <h4>${company.name}</h4>
                <span class="tier-badge">${schedule.tier}</span>
              </div>
            </div>
            <span class="badge badge-${state.shift === 'night' ? 'night' : 'accent'}">
              ${state.shift === 'night' ? '🌙 Night' : '☀️ Day'}
            </span>
          </div>
          
          <div class="bus-card-time">
            <div class="time-point">
              <div class="time-value">${formatTime(schedule.departure)}</div>
              <div class="time-label">${state.direction === 'sukkurToKarachi' ? 'Sukkur' : 'Karachi'}</div>
            </div>
            <div class="time-connector">
              <span class="time-duration">${schedule.duration}</span>
              <div class="time-line"></div>
            </div>
            <div class="time-point">
              <div class="time-value">${formatTime(schedule.arrival)}</div>
              <div class="time-label">${state.direction === 'sukkurToKarachi' ? 'Karachi' : 'Sukkur'}</div>
            </div>
          </div>

          <div class="bus-card-footer">
            <div class="bus-card-price">${formatPrice(schedule.price)}</div>
            <div class="bus-card-amenities">${amenities}</div>
          </div>
        </div>
      `;
    }).join('');

    // Re-init scroll animations for new elements
    initScrollAnimations();
  }

  // Initial render
  renderSchedule();
}
