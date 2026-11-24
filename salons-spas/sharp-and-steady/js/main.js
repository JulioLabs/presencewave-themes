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

// Opening hours: [open, close] in 24-hour time, Sunday first. null = closed that day.
const hours = [
  ['10:00', '15:00'], // Sunday
  null,               // Monday
  ['09:00', '19:00'],
  ['09:00', '19:00'],
  ['09:00', '20:00'], // Thursday: late
  ['09:00', '19:00'],
  ['08:00', '16:00'], // Saturday
];

// The walk-in board: update this from the counter (or connect it to your booking system).
// status: 'free', 'busy' (minutesLeft = time left on the current cut) or 'off'
const chairs = [
  { barber: 'Ray', specialty: 'Classic cuts, shaves', status: 'busy', minutesLeft: 15 },
  { barber: 'Dante', specialty: 'Fades and designs', status: 'busy', minutesLeft: 25 },
  { barber: 'Mia', specialty: 'Textured crops, beards', status: 'free', minutesLeft: 0 },
  { barber: 'Luis', specialty: 'Kids\' cuts', status: 'off', minutesLeft: 0 },
];
// People already on the list, with the minutes their service takes
const queue = [30, 45];

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const toMinutes = time => { const [h, m] = time.split(':').map(Number); return h * 60 + m; };
const pretty = time => {
  const [h, m] = time.split(':').map(Number);
  const hour = h % 12 || 12;
  return `${hour}${m ? `:${String(m).padStart(2, '0')}` : ''}${h >= 12 ? 'pm' : 'am'}`;
};
const now = new Date();
const today = now.getDay();
const minutesNow = now.getHours() * 60 + now.getMinutes();
const todays = hours[today];
const isOpen = Boolean(todays && minutesNow >= toMinutes(todays[0]) && minutesNow < toMinutes(todays[1]));

const hoursTable = document.querySelector('[data-hours]');
if (hoursTable) {
  hoursTable.innerHTML = hours.map((h, i) => `<tr class="${i === today ? 'is-today' : ''}"><td>${dayNames[i]}${i === today ? ' (today)' : ''}</td><td>${h ? `${pretty(h[0])} – ${pretty(h[1])}` : 'Closed'}</td></tr>`).join('');
}

const status = document.querySelector('[data-status]');
if (status) {
  status.classList.add(isOpen ? 'is-open' : 'is-closed');
  if (isOpen) {
    status.textContent = `Open now · last walk-in ${pretty(`${Math.floor((toMinutes(todays[1]) - 30) / 60)}:${String((toMinutes(todays[1]) - 30) % 60).padStart(2, '0')}`)}`;
  } else {
    let next = todays && minutesNow < toMinutes(todays[0]) ? 0 : 1;
    while (!hours[(today + next) % 7] && next < 7) next += 1;
    const day = (today + next) % 7;
    status.textContent = `Closed now · opens ${next === 0 ? 'today' : next === 1 ? 'tomorrow' : dayNames[day]} at ${pretty(hours[day][0])}`;
  }
}

const chairList = document.querySelector('[data-chairs]');
const pill = chair => chair.status === 'free' ? '<span class="pill pill-free">Free now</span>'
  : chair.status === 'busy' ? `<span class="pill pill-busy">${chair.minutesLeft} min</span>`
  : '<span class="pill pill-off">Off today</span>';
if (chairList) {
  chairList.innerHTML = chairs.map((chair, i) => `<li class="chair"><span class="num">0${i + 1}</span><span><strong>${chair.barber}</strong><small>${chair.specialty}</small></span>${pill(chair)}</li>`).join('');
}

// Estimated wait: each person on the list goes to the first chair that comes free
const estimateWait = () => {
  const working = chairs.filter(c => c.status !== 'off').map(c => (c.status === 'busy' ? c.minutesLeft : 0));
  if (!working.length) return null;
  const free = [...working];
  queue.forEach(length => {
    free.sort((a, b) => a - b);
    free[0] += length;
  });
  return Math.min(...free);
};
const waitEl = document.querySelector('[data-wait]');
const queueEl = document.querySelector('[data-queue]');
const renderWait = () => {
  const wait = estimateWait();
  if (waitEl) waitEl.textContent = !isOpen ? 'Closed' : wait === null ? '—' : wait < 5 ? 'No wait' : `~${Math.round(wait / 5) * 5} min`;
  if (queueEl) queueEl.textContent = queue.length;
};
renderWait();

// Join the list (demo: adds you on this page only; connect the form to your queue or a PresenceWave form)
const form = document.querySelector('[data-join]');
const result = document.querySelector('[data-join-result]');
form?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const wait = estimateWait() ?? 0;
  queue.push(Number(data.get('service')));
  renderWait();
  if (result) result.textContent = `Thanks, ${data.get('name')}! You're number ${queue.length} on the list, about ${Math.max(5, Math.round(wait / 5) * 5)} minutes. We'll text you when you're next.`;
  form.reset();
});

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
