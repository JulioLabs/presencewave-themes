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

// Season switch: the hero copy and the accent color change with the season
const seasons = {
  cooling: {
    title: 'Stay cool when it\'s <span>98° outside.</span>',
    lead: 'Same-day AC repair, honest advice on when to replace, and a spring tune-up that catches small problems before the first heat wave.',
    cta: 'Book an AC tune-up', mode: 'Cooling to', temp: '72', visit: 'tune-up',
  },
  heating: {
    title: 'Warm and cozy when it\'s <span>18° outside.</span>',
    lead: 'Fast furnace and heat pump repair, safety checks for gas appliances, and a fall tune-up so your heat comes on the first cold night.',
    cta: 'Book a furnace tune-up', mode: 'Heating to', temp: '70', visit: 'tune-up',
  },
};

function setSeason(name) {
  const season = seasons[name];
  document.body.dataset.season = name;
  document.querySelectorAll('[data-season-button]').forEach(b => b.setAttribute('aria-pressed', b.dataset.seasonButton === name));
  document.querySelectorAll('[data-season-text]').forEach(el => {
    const key = el.dataset.seasonText;
    if (key === 'title') el.innerHTML = season.title; else el.textContent = season[key];
  });
}

document.querySelectorAll('[data-season-button]').forEach(b => b.addEventListener('click', () => setSeason(b.dataset.seasonButton)));
// Start in the season that matches the month (Northern Hemisphere): October to March is heating
const month = new Date().getMonth();
setSeason(month >= 9 || month <= 2 ? 'heating' : 'cooling');

// Care plan builder: replace with your own prices (per system, per month)
const tiers = [
  { id: 'essential', name: 'Essential', note: '2 tune-ups', price: 14, perks: ['2 tune-ups a year', 'Priority booking', '10% off repairs'] },
  { id: 'plus', name: 'Plus', note: 'Most popular', price: 21, perks: ['2 tune-ups a year', 'Priority booking', '15% off repairs', 'No after-hours fees', 'Filters delivered'] },
  { id: 'total', name: 'Total', note: 'Repairs covered', price: 34, perks: ['2 tune-ups a year', 'Same-day priority', 'Covered parts and labor on repairs', 'No after-hours fees', 'Filters delivered'] },
];
const tuneUpPrice = 149; // the regular price of one tune-up, for the savings line
let systems = 1;
let tier = tiers[1];

const tierRow = document.querySelector('[data-tiers]');
const systemsOut = document.querySelector('[data-systems]');
const money = n => '$' + n.toLocaleString('en-US');

function renderPlan() {
  systemsOut.textContent = systems;
  document.querySelector('[data-step="-1"]').disabled = systems <= 1;
  document.querySelector('[data-step="1"]').disabled = systems >= 5;
  tierRow.querySelectorAll('.tier').forEach(b => b.setAttribute('aria-pressed', b.dataset.tier === tier.id));
  // Each extra system is 30% off
  const monthly = Math.round(tier.price * (1 + (systems - 1) * 0.7));
  document.querySelector('[data-plan-name]').textContent = `${tier.name} · ${systems} system${systems > 1 ? 's' : ''}`;
  document.querySelector('[data-plan-month]').textContent = money(monthly);
  document.querySelector('[data-plan-year]').textContent = `${money(monthly * 12)} a year, billed monthly. Cancel any time.`;
  document.querySelector('[data-plan-perks]').innerHTML = tier.perks.map(p => `<li>${p}</li>`).join('');
  const tuneUps = systems * 2 * tuneUpPrice;
  document.querySelector('[data-plan-save]').textContent = `Tune-ups alone would cost ${money(tuneUps)} a year.`;
}

if (tierRow) {
  tierRow.innerHTML = tiers.map(t => `<button class="tier" type="button" aria-pressed="false" data-tier="${t.id}"><strong>${t.name}</strong><span>${t.note}</span></button>`).join('');
  tierRow.addEventListener('click', event => {
    const button = event.target.closest('.tier');
    if (button) { tier = tiers.find(t => t.id === button.dataset.tier); renderPlan(); }
  });
  document.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => {
    systems = Math.min(5, Math.max(1, systems + Number(b.dataset.step)));
    renderPlan();
  }));
  renderPlan();
}

// Repair or replace: advice by system age
const age = document.querySelector('[data-age]');
function renderAge() {
  const years = Number(age.value);
  document.querySelector('[data-age-value]').textContent = years;
  let advice = 'Keep it running. A yearly tune-up is all it needs.';
  if (years >= 15) advice = 'Time to plan a replacement. A new system can cut your energy bills by a third, and rebates help.';
  else if (years >= 10) advice = 'Repair if it\'s small. If a big repair comes up, ask us for a free replacement estimate.';
  document.querySelector('[data-age-advice]').textContent = advice;
}
age?.addEventListener('input', renderAge);
if (age) renderAge();

// Booking form
const bookForm = document.querySelector('[data-book-form]');
const day = bookForm?.querySelector('[name="day"]');
if (day) day.min = new Date().toISOString().slice(0, 10);
bookForm?.addEventListener('submit', event => {
  event.preventDefault();
  const name = bookForm.name.value.trim().split(' ')[0];
  const date = new Date(bookForm.day.value + 'T12:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  document.querySelector('[data-book-note]').textContent = `Thanks ${name}! We'll text you a time for ${date}.`;
  bookForm.reset();
});
document.querySelector('[data-plan-cta]')?.addEventListener('click', () => {
  const select = document.querySelector('[data-visit-select]');
  if (select) select.value = 'tune-up';
});

// Footer year
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
