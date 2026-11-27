// Mobile navigation
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
});

// Opening hours: replace with your own. Hours in 24h, [open, close], or null when closed. Sunday first.
const hours = [
  { day: 'Sunday', open: [9, 15] },
  { day: 'Monday', open: [7, 20] },
  { day: 'Tuesday', open: [7, 20] },
  { day: 'Wednesday', open: [7, 20] },
  { day: 'Thursday', open: [7, 20] },
  { day: 'Friday', open: [7, 18] },
  { day: 'Saturday', open: [8, 16] },
];
// Estimated walk-in wait in minutes by hour of the day (demo data: connect it to your check-in system)
const waitByHour = { 7: 10, 8: 25, 9: 35, 10: 30, 11: 20, 12: 25, 13: 20, 14: 15, 15: 20, 16: 30, 17: 40, 18: 35, 19: 15 };

const time = hour => {
  const h = hour % 12 || 12;
  return `${h}${hour < 12 ? 'am' : 'pm'}`;
};

const status = (now = new Date()) => {
  const today = hours[now.getDay()];
  const hour = now.getHours() + now.getMinutes() / 60;
  if (today.open && hour >= today.open[0] && hour < today.open[1]) {
    return { open: true, text: `Open now · closes at ${time(today.open[1])}` };
  }
  for (let i = 0; i < 7; i++) {
    const day = hours[(now.getDay() + i) % 7];
    if (!day.open) continue;
    if (i === 0 && hour < day.open[0]) return { open: false, text: `Closed · opens today at ${time(day.open[0])}` };
    if (i === 1) return { open: false, text: `Closed · opens tomorrow at ${time(day.open[0])}` };
    if (i > 1) return { open: false, text: `Closed · opens ${day.day} at ${time(day.open[0])}` };
  }
  return { open: false, text: 'Closed' };
};

const now = new Date();
const current = status(now);
document.querySelectorAll('[data-status-text]').forEach(el => { el.textContent = current.text; });
document.querySelectorAll('[data-status-bar]').forEach(el => el.classList.toggle('closed', !current.open));
const openStatus = document.querySelector('[data-open-status]');
if (openStatus) {
  openStatus.textContent = current.text;
  openStatus.classList.toggle('closed', !current.open);
}
const wait = document.querySelector('[data-wait]');
if (wait) {
  const minutes = waitByHour[now.getHours()];
  wait.textContent = current.open && minutes ? `About ${minutes} min` : 'Closed now';
  if (!current.open) document.querySelector('[data-wait-note]').textContent = 'Request a same-day visit and we\'ll text you a time when we open.';
}

// Hours table on the visit page, with today highlighted
const table = document.querySelector('[data-hours] tbody');
if (table) {
  const order = [1, 2, 3, 4, 5, 6, 0];
  table.innerHTML = order.map(i => {
    const day = hours[i];
    return `<tr${i === now.getDay() ? ' class="today"' : ''}><td>${day.day}${i === now.getDay() ? ' <span>Today</span>' : ''}</td><td>${day.open ? `${time(day.open[0])} – ${time(day.open[1])}` : 'Closed'}</td></tr>`;
  }).join('');
}

// Same-day request (demo: shows a confirmation; connect it to your scheduling tool or a PresenceWave form)
document.querySelector('[data-request]')?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.target);
  const done = event.target.querySelector('[data-request-done]');
  done.textContent = `Thanks, ${data.get('name').split(' ')[0]}. We'll text you a ${data.get('window').toLowerCase()} time shortly.`;
  done.hidden = false;
});

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
