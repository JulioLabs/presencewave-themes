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

// Booking path: replace with your own services, artists and opening days
const services = [
  { id: 'gel', name: 'Gel manicure', minutes: 60, price: 45, skill: 'nails' },
  { id: 'ext', name: 'Gel extensions', minutes: 90, price: 70, skill: 'nails' },
  { id: 'pedi', name: 'Spa pedicure', minutes: 60, price: 55, skill: 'nails' },
  { id: 'lift', name: 'Lash lift and tint', minutes: 60, price: 75, skill: 'lashes' },
  { id: 'lashset', name: 'Classic lash set', minutes: 120, price: 140, skill: 'lashes' },
  { id: 'brows', name: 'Brow lamination', minutes: 45, price: 70, skill: 'brows' },
];
const artists = [
  { name: 'Kim', skills: ['nails'], note: 'Nail art and extensions' },
  { name: 'Jade', skills: ['nails'], note: 'Manicures and pedicures' },
  { name: 'Priya', skills: ['lashes', 'brows'], note: 'Lashes and lifts' },
  { name: 'Sofia', skills: ['brows', 'lashes'], note: 'Brows of every kind' },
];
const openDays = [0, 2, 3, 4, 5, 6]; // Sunday = 0; closed Mondays
const times = ['Morning (10–12)', 'Early afternoon (12–3)', 'Late afternoon (3–6)', 'Evening (6–8)'];

const booking = { service: null, artist: null, day: null, time: null };
const steps = [...document.querySelectorAll('[data-step]')];
const labels = [...document.querySelectorAll('[data-step-label]')];
const go = n => {
  steps.forEach(step => { step.hidden = Number(step.dataset.step) !== n; });
  labels.forEach((label, i) => {
    label.classList.toggle('is-current', i + 1 === n);
    label.classList.toggle('is-done', i + 1 < n);
  });
};

const serviceBox = document.querySelector('[data-services]');
const artistBox = document.querySelector('[data-artists]');
if (serviceBox && artistBox) {
  serviceBox.innerHTML = services.map(s => `<button class="choice" type="button" data-service="${s.id}"><span class="tag">${s.skill}</span><strong>${s.name}</strong><small>${s.minutes} min · $${s.price}</small></button>`).join('');
  serviceBox.addEventListener('click', event => {
    const button = event.target.closest('[data-service]');
    if (!button) return;
    booking.service = services.find(s => s.id === button.dataset.service);
    const matching = artists.filter(a => a.skills.includes(booking.service.skill));
    artistBox.innerHTML = `<button class="choice" type="button" data-artist="Anyone"><span class="tag">Fastest</span><strong>First available</strong><small>Whoever's free first</small></button>`
      + matching.map(a => `<button class="choice" type="button" data-artist="${a.name}"><span class="tag">${booking.service.skill}</span><strong>${a.name}</strong><small>${a.note}</small></button>`).join('');
    go(2);
  });
  artistBox.addEventListener('click', event => {
    const button = event.target.closest('[data-artist]');
    if (!button) return;
    booking.artist = button.dataset.artist;
    renderDays();
    go(3);
  });
}

const dayBox = document.querySelector('[data-days]');
const timeBox = document.querySelector('[data-times]');
const summary = document.querySelector('[data-summary]');
const fmt = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
const renderSummary = () => {
  if (!summary || !booking.service) return;
  summary.textContent = `${booking.service.name} with ${booking.artist === 'Anyone' ? 'the first available artist' : booking.artist}`
    + `${booking.day ? `, ${fmt.format(booking.day)}` : ''}${booking.time ? `, ${booking.time.toLowerCase()}` : ''} · $${booking.service.price}`;
};
function renderDays() {
  if (!dayBox || !timeBox) return;
  const days = [];
  for (let i = 0; days.length < 7 && i < 14; i += 1) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    if (openDays.includes(d.getDay())) days.push(d);
  }
  booking.day = null;
  booking.time = null;
  dayBox.innerHTML = days.map((d, i) => `<button class="pick" type="button" aria-pressed="false" data-day="${i}">${i === 0 && d.toDateString() === new Date().toDateString() ? 'Today' : fmt.format(d).split(',')[0]}<small>${fmt.format(d).split(', ')[1]}</small></button>`).join('');
  dayBox.querySelectorAll('[data-day]').forEach(button => button.addEventListener('click', () => {
    booking.day = days[Number(button.dataset.day)];
    dayBox.querySelectorAll('.pick').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    renderSummary();
  }));
  timeBox.innerHTML = times.map(t => `<button class="pick" type="button" aria-pressed="false">${t}</button>`).join('');
  timeBox.querySelectorAll('.pick').forEach(button => button.addEventListener('click', () => {
    booking.time = button.textContent;
    timeBox.querySelectorAll('.pick').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    renderSummary();
  }));
  renderSummary();
}

document.querySelectorAll('[data-back]').forEach(button => button.addEventListener('click', () => {
  const current = steps.findIndex(step => !step.hidden) + 1;
  go(Math.max(1, current - 1));
}));

// Request (demo: shows a confirmation; connect it to your booking tool or a PresenceWave form)
const confirm = document.querySelector('[data-confirm]');
confirm?.addEventListener('submit', event => {
  event.preventDefault();
  const result = document.querySelector('[data-result]');
  if (!booking.day || !booking.time) {
    result.textContent = 'Pick a day and a time first.';
    return;
  }
  result.textContent = `Yay, ${new FormData(confirm).get('name')}! We'll text you within the hour to confirm your exact time.`;
  confirm.reset();
});

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
