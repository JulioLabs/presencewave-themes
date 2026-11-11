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

// Journeys to compare: replace with your own
const journeys = [
  { name: 'The Alpine Crossing', days: 8, price: 7950, hotels: 3, rail: '14 hours', pace: 'Gentle', season: 'Jun – Sep', highlight: 'Glacier Express panorama car' },
  { name: 'Venice to the Danube', days: 10, price: 9400, hotels: 3, rail: '2 nights on a sleeper', pace: 'Relaxed', season: 'May – Oct', highlight: 'An evening at the Vienna State Opera' },
  { name: 'The Scottish Highlands', days: 7, price: 6850, hotels: 3, rail: '9 hours', pace: 'Gentle', season: 'May – Sep', highlight: 'A private distillery tasting' },
  { name: 'Iberia by Rail', days: 9, price: 7300, hotels: 4, rail: '11 hours', pace: 'Moderate', season: 'Apr – Jun, Sep – Oct', highlight: 'Lunch at a Douro valley quinta' },
];
const rows = [
  ['Length', j => `${j.days} days`],
  ['From', j => `$${j.price.toLocaleString('en-US')}`],
  ['Per day', j => `$${Math.round(j.price / j.days).toLocaleString('en-US')}`],
  ['Hotels', j => `${j.hotels} hotels`],
  ['Time on rails', j => j.rail],
  ['Pace', j => j.pace],
  ['Season', j => j.season],
  ['Highlight', j => j.highlight],
];

const pickers = document.querySelector('[data-pickers]');
const table = document.querySelector('[data-compare]');

function renderCompare() {
  const a = journeys[Number(pickers.querySelector('[name="a"]').value)];
  const b = journeys[Number(pickers.querySelector('[name="b"]').value)];
  table.innerHTML = `<div class="compare-row head" role="row"><div role="columnheader"></div><div role="columnheader">${a.name}</div><div role="columnheader">${b.name}</div></div>` +
    rows.map(([label, value]) => `<div class="compare-row" role="row"><div role="rowheader">${label}</div><div role="cell">${value(a)}</div><div role="cell">${value(b)}</div></div>`).join('');
}

if (pickers && table) {
  pickers.querySelectorAll('select').forEach((select, i) => {
    select.innerHTML = journeys.map((j, n) => `<option value="${n}">${j.name}</option>`).join('');
    select.value = String(i);
  });
  pickers.addEventListener('input', renderCompare);
  renderCompare();
}

// Brochure: ask for a postal address only when sending by post
const brochure = document.querySelector('[data-brochure]');
const postal = brochure?.querySelector('.postal');
brochure?.addEventListener('change', () => {
  const byPost = brochure.elements.format.value === 'post';
  postal.hidden = !byPost;
  brochure.elements.address.required = byPost;
});
brochure?.addEventListener('submit', event => {
  event.preventDefault();
  const name = brochure.elements.name.value.trim().split(' ')[0] || 'there';
  brochure.querySelector('.form-success').textContent = brochure.elements.format.value === 'post'
    ? `Thank you, ${name}. Your brochure is on its way by post.`
    : `Thank you, ${name}. Your brochure is on its way to your inbox.`;
});

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
