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

// Home value estimate: replace with your neighborhoods and recent sale prices per square foot.
const areas = [
  { name: 'Maple Hollow', pricePerSqFt: 228 },
  { name: 'Quail Ridge', pricePerSqFt: 246 },
  { name: 'Old Town', pricePerSqFt: 284 },
  { name: 'Linden Park', pricePerSqFt: 262 },
  { name: 'Riverside Heights', pricePerSqFt: 211 },
  { name: 'Cedar Bend', pricePerSqFt: 198 },
];
const CONDITION = { work: 0.88, good: 1, updated: 1.09 };
const BEDROOMS = { 2: 0.97, 3: 1, 4: 1.03, 5: 1.05 };
const SPREAD = 0.06; // the range shown either side of the estimate

const money = value => '$' + (Math.round(value / 1000) * 1000).toLocaleString('en-US');
const areaList = document.querySelector('[data-area-list]');
if (areaList) areaList.innerHTML = areas.map(area => `<option>${area.name}</option>`).join('');

const result = document.querySelector('[data-value-result]');
document.querySelector('[data-value-form]')?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.target);
  const area = areas.find(item => item.name === data.get('area'));
  const size = Math.min(Math.max(Number(data.get('size')) || 0, 400), 10000);
  const estimate = size * area.pricePerSqFt * CONDITION[data.get('condition')] * BEDROOMS[data.get('beds')];
  result.innerHTML = `<div class="estimate">
      <p class="estimate-label">Estimated value</p>
      <p class="estimate-range">${money(estimate * (1 - SPREAD))} – ${money(estimate * (1 + SPREAD))}</p>
      <p>Based on recent sales in ${area.name}. For a precise number, get a free market analysis.</p>
      <a class="text-link" href="#request" data-cma>Get my free market analysis</a>
    </div>`;
  result.querySelector('[data-cma]').addEventListener('click', () => {
    const field = document.querySelector('[data-request-area]');
    if (field) field.value = area.name;
  });
});

// Contact form (demo: shows a confirmation; connect it to your CRM or a PresenceWave form)
document.querySelector('[data-request-form]')?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.target);
  const done = event.target.querySelector('[data-request-done]');
  done.textContent = `Thanks, ${data.get('name').split(' ')[0]}! I'll be in touch today about how to ${data.get('goal').toLowerCase()}.`;
  done.hidden = false;
});

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
