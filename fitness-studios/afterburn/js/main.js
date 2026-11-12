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

// Weekly schedule: replace with your own classes. spots = spots still open (0 = full, waitlist)
const schedule = [
  { day: 'Mon', time: '6:00am', name: 'Burn 45', coach: 'Jordan', length: 45, spots: 4 },
  { day: 'Mon', time: '12:15pm', name: 'Lift Lab', coach: 'Priya', length: 50, spots: 9 },
  { day: 'Mon', time: '5:30pm', name: 'Rhythm Ride', coach: 'Alex', length: 45, spots: 0 },
  { day: 'Mon', time: '7:00pm', name: 'Stretch & Restore', coach: 'Sam', length: 30, spots: 12 },
  { day: 'Tue', time: '6:00am', name: 'Rhythm Ride', coach: 'Alex', length: 45, spots: 2 },
  { day: 'Tue', time: '9:30am', name: 'Burn 45', coach: 'Jordan', length: 45, spots: 8 },
  { day: 'Tue', time: '6:15pm', name: 'Lift Lab', coach: 'Priya', length: 50, spots: 3 },
  { day: 'Wed', time: '6:00am', name: 'Burn 45', coach: 'Jordan', length: 45, spots: 6 },
  { day: 'Wed', time: '12:15pm', name: 'Rhythm Ride', coach: 'Alex', length: 45, spots: 11 },
  { day: 'Wed', time: '5:30pm', name: 'Burn 45', coach: 'Jordan', length: 45, spots: 0 },
  { day: 'Wed', time: '7:00pm', name: 'Stretch & Restore', coach: 'Sam', length: 30, spots: 10 },
  { day: 'Thu', time: '6:00am', name: 'Lift Lab', coach: 'Priya', length: 50, spots: 5 },
  { day: 'Thu', time: '5:30pm', name: 'Rhythm Ride', coach: 'Alex', length: 45, spots: 1 },
  { day: 'Fri', time: '6:00am', name: 'Burn 45', coach: 'Jordan', length: 45, spots: 7 },
  { day: 'Fri', time: '5:00pm', name: 'Lift Lab', coach: 'Priya', length: 50, spots: 9 },
  { day: 'Sat', time: '8:00am', name: 'Rhythm Ride', coach: 'Alex', length: 45, spots: 3 },
  { day: 'Sat', time: '9:15am', name: 'Burn 45', coach: 'Jordan', length: 45, spots: 0 },
  { day: 'Sun', time: '9:00am', name: 'Stretch & Restore', coach: 'Sam', length: 30, spots: 14 },
  { day: 'Sun', time: '10:00am', name: 'Lift Lab', coach: 'Priya', length: 50, spots: 6 },
];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const dayTabs = document.querySelector('[data-days]');
const list = document.querySelector('[data-schedule]');
const select = document.querySelector('[data-class-select]');
const today = days[(new Date().getDay() + 6) % 7];

function spotsBadge(spots) {
  if (spots === 0) return '<span class="spots spots-full">Full · waitlist</span>';
  if (spots <= 3) return `<span class="spots spots-low">${spots} spot${spots === 1 ? '' : 's'} left</span>`;
  return `<span class="spots">${spots} spots left</span>`;
}

const label = c => `${c.day} ${c.time} · ${c.name} with ${c.coach}${c.spots === 0 ? ' (waitlist)' : ''}`;

function showDay(day) {
  dayTabs.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', b.dataset.day === day));
  const items = schedule.filter(c => c.day === day);
  list.innerHTML = items.map(c => `
    <li class="slot">
      <time>${c.time}</time>
      <div><h3>${c.name}</h3><p>with ${c.coach} · ${c.length} min</p></div>
      ${spotsBadge(c.spots)}
      <a class="button ${c.spots === 0 ? 'button-ghost' : ''}" href="#book" data-pick="${schedule.indexOf(c)}">${c.spots === 0 ? 'Join waitlist' : 'Book free'}</a>
    </li>`).join('') || '<li class="slot"><p>No classes on this day.</p></li>';
}

if (dayTabs && list) {
  dayTabs.innerHTML = days.map(d => {
    const count = schedule.filter(c => c.day === d).length;
    return `<button type="button" role="tab" data-day="${d}">${d}<small>${count} class${count === 1 ? '' : 'es'}</small></button>`;
  }).join('');
  dayTabs.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (button) showDay(button.dataset.day);
  });
  showDay(today);
}

if (select) {
  select.innerHTML = '<option value="">Choose a class</option>' + schedule.map((c, i) => `<option value="${i}">${label(c)}</option>`).join('');
  list?.addEventListener('click', event => {
    const pick = event.target.closest('[data-pick]');
    if (pick) select.value = pick.dataset.pick;
  });
}

// Up next: the first open classes of today (or the next day with classes)
const next = document.querySelector('[data-next]');
if (next) {
  const start = days.indexOf(today);
  const upcoming = [];
  for (let i = 0; i < 7 && upcoming.length < 3; i++) {
    upcoming.push(...schedule.filter(c => c.day === days[(start + i) % 7]).slice(0, 3 - upcoming.length));
  }
  next.innerHTML = upcoming.map(c => `
    <li><time>${c.time.replace(':00', '')}</time><div><strong>${c.name}</strong><small>${c.day} · ${c.coach}</small></div>${spotsBadge(c.spots)}</li>`).join('');
}

// Booking form (demo only: connect it to your booking system or form service)
const form = document.querySelector('[data-book-form]');
form?.addEventListener('submit', event => {
  event.preventDefault();
  const chosen = schedule[select.value];
  const note = form.querySelector('[data-book-note]');
  note.textContent = chosen
    ? `${chosen.spots === 0 ? 'You\'re on the waitlist for' : 'Your free spot is saved:'} ${chosen.name}, ${chosen.day} at ${chosen.time}. Check your inbox for what to bring.`
    : 'Choose a class first.';
  if (chosen) form.reset();
});

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
