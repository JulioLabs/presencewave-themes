// Mobile navigation
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

// Trips: replace with your own. level 1 easy, 2 moderate, 3 challenging; sky colours the card art
const trips = [
  { name: 'Yosemite High Sierra Camps', region: 'US West', months: ['Jul', 'Aug'], level: 2, days: 6, price: 2490, sky: '#f2c48d', text: 'Granite domes, alpine lakes and five nights in tented camps.' },
  { name: 'Grand Canyon Rim to River', region: 'US West', months: ['Sep', 'Oct'], level: 3, days: 5, price: 1990, sky: '#f0a58f', text: 'Down the South Kaibab to the Colorado and back up Bright Angel.' },
  { name: 'Olympic Coast Wander', region: 'US West', months: ['Jun', 'Jul', 'Aug'], level: 1, days: 4, price: 1390, sky: '#b9d3d0', text: 'Tide pools, sea stacks and rainforest walks with cabin nights.' },
  { name: 'Dolomites Hut to Hut', region: 'Europe', months: ['Jul', 'Aug', 'Sep'], level: 2, days: 8, price: 3290, sky: '#cfd8e8', text: 'Mountain huts, strudel stops and a different jagged view every day.' },
  { name: 'Tour du Mont Blanc', region: 'Europe', months: ['Jul', 'Aug'], level: 3, days: 10, price: 3890, sky: '#d7e3f0', text: 'Three countries and the full classic loop around the highest Alp.' },
  { name: 'Cinque Terre Coastal Paths', region: 'Europe', months: ['Jun', 'Sep', 'Oct'], level: 1, days: 6, price: 2390, sky: '#f5d9a6', text: 'Village to village above the sea, with swims and seafood lunches.' },
  { name: 'Torres del Paine W Trek', region: 'South America', months: ['Oct'], level: 3, days: 7, price: 3490, sky: '#c9dbe3', text: 'The granite towers, glacier lakes and Patagonian wind.' },
  { name: 'Japan Kumano Kodo', region: 'Asia', months: ['Oct'], level: 2, days: 7, price: 3690, sky: '#e8c9c2', text: 'Ancient pilgrim trails, hot springs and family-run inns.' },
];

const filters = document.querySelector('[data-filters]');
const grid = document.querySelector('[data-trips]');
const count = document.querySelector('[data-count]');
const levelNames = { 1: 'Easy', 2: 'Moderate', 3: 'Challenging' };

function render() {
  const region = filters.elements.region.value;
  const month = filters.elements.month.value;
  const levels = [...filters.querySelectorAll('[name="level"]:checked')].map(input => Number(input.value));
  const matches = trips.filter(t => (!region || t.region === region) && (!month || t.months.includes(month)) && levels.includes(t.level));
  count.textContent = `${matches.length} trip${matches.length === 1 ? '' : 's'} match`;
  grid.innerHTML = matches.map(t => `
    <article class="trip">
      <div class="trip-art" style="background:${t.sky}" aria-hidden="true"></div>
      <div class="trip-body">
        <h3>${t.name}</h3>
        <div class="trip-meta"><span>${t.region}</span><span>${t.days} days</span><span>Level ${t.level} · ${levelNames[t.level]}</span><span>${t.months.join(', ')}</span></div>
        <p>${t.text}</p>
        <div class="trip-foot"><strong>$${t.price.toLocaleString('en-US')}</strong><a href="#enquire" data-trip="${t.name}">Ask a guide →</a></div>
      </div>
    </article>`).join('') || '<p class="no-results">No trips match yet. Try another month or level, or ask a guide about a private departure.</p>';
}

if (filters && grid) {
  filters.addEventListener('input', render);
  render();
}

const tripSelect = document.querySelector('[data-trip-select]');
if (tripSelect) tripSelect.innerHTML = trips.map(t => `<option>${t.name}</option>`).join('');
grid?.addEventListener('click', event => {
  const link = event.target.closest('[data-trip]');
  if (link && tripSelect) tripSelect.value = link.dataset.trip;
});

const enquire = document.querySelector('[data-enquire]');
enquire?.addEventListener('submit', event => {
  event.preventDefault();
  const name = enquire.elements.name.value.trim().split(' ')[0] || 'there';
  enquire.querySelector('.form-success').textContent = `Thanks, ${name}. A guide on ${enquire.elements.trip.value} will reply within a day.`;
});

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
