// Mobile navigation
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
});

// Spa day builder: replace with your own treatments and add-ons (minutes and price per person)
const treatments = [
  { id: 'swedish', name: 'Swedish massage', minutes: 60, price: 110 },
  { id: 'deep', name: 'Deep tissue massage', minutes: 60, price: 125 },
  { id: 'stone', name: 'Hot stone massage', minutes: 75, price: 145 },
  { id: 'facial', name: 'Signature facial', minutes: 60, price: 120 },
  { id: 'calm', name: 'Calm skin facial', minutes: 50, price: 105 },
  { id: 'wrap', name: 'Seaweed wrap', minutes: 60, price: 115 },
];
const addons = [
  { id: 'scalp', name: 'Scalp massage', minutes: 15, price: 25 },
  { id: 'eye', name: 'Cooling eye treatment', minutes: 10, price: 20 },
  { id: 'feet', name: 'Foot ritual', minutes: 20, price: 30 },
  { id: 'scrub', name: 'Salt glow scrub', minutes: 30, price: 55 },
];
const LUNCH_FROM = 180;       // days of 3 hours or more include lunch
const DAY_DISCOUNT = 0.1;     // 10% off when you book three or more treatments

const options = (list, name) => list.map(item => `<label class="option"><input type="checkbox" name="${name}" value="${item.id}"><span><strong>${item.name}</strong><small>${item.minutes} min · $${item.price}</small></span></label>`).join('');
const treatmentBox = document.querySelector('[data-treatments]');
const addonBox = document.querySelector('[data-addons]');
const builder = document.querySelector('[data-builder-form]');
if (treatmentBox && addonBox && builder) {
  treatmentBox.innerHTML = options(treatments, 'treatment');
  addonBox.innerHTML = options(addons, 'addon');

  const summary = document.querySelector('[data-summary]');
  const timeEl = document.querySelector('[data-time]');
  const totalEl = document.querySelector('[data-total]');
  const note = document.querySelector('[data-note]');
  const book = document.querySelector('[data-book]');
  const duration = minutes => `${Math.floor(minutes / 60) ? `${Math.floor(minutes / 60)} hr ` : ''}${minutes % 60 ? `${minutes % 60} min` : ''}`.trim();

  const update = () => {
    const data = new FormData(builder);
    const chosenTreatments = treatments.filter(t => data.getAll('treatment').includes(t.id));
    const chosen = [...chosenTreatments, ...addons.filter(a => data.getAll('addon').includes(a.id))];
    const guests = Number(data.get('guests'));
    const minutes = chosen.reduce((sum, item) => sum + item.minutes, 0);
    let total = chosen.reduce((sum, item) => sum + item.price, 0) * guests;
    const discounted = chosenTreatments.length >= 3;
    if (discounted) total = Math.round(total * (1 - DAY_DISCOUNT));

    summary.innerHTML = chosen.map(item => `<li><span>${item.name}</span><span>$${item.price * guests}</span></li>`).join('');
    timeEl.textContent = minutes ? duration(minutes) : '—';
    totalEl.textContent = `$${total}`;
    if (!chosenTreatments.length) note.textContent = 'Pick a treatment to start.';
    else note.textContent = [
      guests === 2 ? 'Side by side in our couples room.' : '',
      minutes >= LUNCH_FROM ? 'Includes lunch in the garden room.' : `Add ${duration(LUNCH_FROM - minutes)} more for a garden room lunch.`,
      discounted ? '10% off for three treatments.' : '',
    ].filter(Boolean).join(' ');
    const request = `${chosen.map(item => item.name).join(', ')}${guests === 2 ? ' (for two)' : ''} · ${duration(minutes)} · $${total}`;
    book.href = chosen.length ? `book.html?day=${encodeURIComponent(request)}` : 'book.html';
  };
  builder.addEventListener('change', update);
  update();
}

// Booking form: fill in the spa day from the builder (demo: shows a confirmation; connect it to your booking tool or a PresenceWave form)
const bookForm = document.querySelector('[data-book-form]');
if (bookForm) {
  const day = new URLSearchParams(location.search).get('day');
  if (day) bookForm.querySelector('[data-request]').value = `Spa day: ${day}`;
  bookForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = new FormData(bookForm).get('name');
    document.querySelector('[data-book-result]').textContent = `Thank you, ${name}. We'll email you within a few hours with a confirmed time.`;
    bookForm.reset();
  });
}

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
