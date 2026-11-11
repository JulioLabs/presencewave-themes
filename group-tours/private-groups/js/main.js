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

// Quote builder: change to your own per-person rates per night and fixed costs per trip
const nightly = { city: 190, nature: 230, europe: 320, faith: 280 };
const fixedPerTrip = { city: 2400, nature: 3200, europe: 4200, faith: 3800 };
const quote = document.querySelector('[data-quote]');
const money = n => `$${Math.round(n / 10) * 10}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

function updateQuote() {
  const type = quote.elements.type.value;
  const size = Number(quote.elements.size.value);
  const nights = Number(quote.elements.nights.value);
  const comfort = Number(quote.querySelector('[name="comfort"]:checked').value);
  quote.elements.sizeLabel.value = `${size} travelers`;
  quote.elements.nightsLabel.value = `${nights} night${nights === 1 ? '' : 's'}`;
  // Bigger groups share the fixed costs (coach, tour manager), so the price per person drops
  const perPerson = (nightly[type] * nights + fixedPerTrip[type] / size * 4) * comfort;
  quote.querySelector('[data-estimate]').textContent = `${money(perPerson * 0.94)} – ${money(perPerson * 1.06)}`;
  const free = Math.floor(size / 15);
  quote.querySelector('[data-free]').textContent = free ? `Includes ${free} free organizer place${free === 1 ? '' : 's'}` : 'Free organizer place from 15 travelers';
}

quote?.addEventListener('input', updateQuote);
quote?.addEventListener('submit', event => {
  event.preventDefault();
  quote.querySelector('.form-success').textContent = `Thanks! A planner will send ${quote.elements.org.value.trim() || 'your group'} a written proposal within two working days.`;
});
if (quote) updateQuote();

const contact = document.querySelector('[data-contact]');
contact?.addEventListener('submit', event => {
  event.preventDefault();
  const name = contact.elements.name.value.trim().split(' ')[0] || 'there';
  contact.querySelector('.form-success').textContent = `Thanks, ${name}. A planner will reply within one working day.`;
});

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
