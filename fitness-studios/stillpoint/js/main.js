// Mobile navigation
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
});

// Timetable: replace with your own classes. style is one of flow, reformer, mat, yin
const classes = [
  { day: 'Mon', time: '7:00am', name: 'Slow flow', style: 'flow', level: 'Beginner', teacher: 'Elena' },
  { day: 'Mon', time: '12:00pm', name: 'Reformer basics', style: 'reformer', level: 'Beginner', teacher: 'Theo' },
  { day: 'Mon', time: '6:30pm', name: 'Yin & restore', style: 'yin', level: 'Beginner', teacher: 'Mira' },
  { day: 'Tue', time: '6:30am', name: 'Reformer flow', style: 'reformer', level: 'Intermediate', teacher: 'Theo' },
  { day: 'Tue', time: '9:30am', name: 'Mat pilates', style: 'mat', level: 'Beginner', teacher: 'Theo' },
  { day: 'Tue', time: '7:00pm', name: 'Vinyasa', style: 'flow', level: 'Intermediate', teacher: 'Elena' },
  { day: 'Wed', time: '7:00am', name: 'Slow flow', style: 'flow', level: 'Beginner', teacher: 'Elena' },
  { day: 'Wed', time: '5:30pm', name: 'Reformer basics', style: 'reformer', level: 'Beginner', teacher: 'Theo' },
  { day: 'Wed', time: '7:00pm', name: 'Prenatal yoga', style: 'yin', level: 'Beginner', teacher: 'Mira' },
  { day: 'Thu', time: '6:30am', name: 'Mat pilates', style: 'mat', level: 'Intermediate', teacher: 'Theo' },
  { day: 'Thu', time: '12:00pm', name: 'Reformer flow', style: 'reformer', level: 'Intermediate', teacher: 'Theo' },
  { day: 'Thu', time: '6:30pm', name: 'Vinyasa', style: 'flow', level: 'Intermediate', teacher: 'Elena' },
  { day: 'Fri', time: '7:00am', name: 'Slow flow', style: 'flow', level: 'Beginner', teacher: 'Mira' },
  { day: 'Fri', time: '5:30pm', name: 'Yin & restore', style: 'yin', level: 'Beginner', teacher: 'Mira' },
  { day: 'Sat', time: '8:30am', name: 'Reformer basics', style: 'reformer', level: 'Beginner', teacher: 'Theo' },
  { day: 'Sat', time: '10:00am', name: 'Weekend flow', style: 'flow', level: 'Beginner', teacher: 'Elena' },
  { day: 'Sun', time: '9:00am', name: 'Mat pilates', style: 'mat', level: 'Beginner', teacher: 'Theo' },
  { day: 'Sun', time: '5:00pm', name: 'Yin & restore', style: 'yin', level: 'Beginner', teacher: 'Mira' },
];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const timetable = document.querySelector('[data-timetable]');
const filters = document.querySelector('[data-filters]');

function renderTimetable() {
  const style = filters.style.value;
  const level = filters.level.value;
  const shown = classes.filter(c => (style === 'all' || c.style === style) && (level === 'all' || c.level === level));
  timetable.innerHTML = days.map(day => {
    const items = shown.filter(c => c.day === day);
    return `<div class="day"><h3>${day}</h3>${items.map(c => `
      <div class="session" data-style="${c.style}"><time>${c.time}</time><strong>${c.name}</strong><small>${c.teacher} · ${c.level === 'Beginner' ? 'Beginner friendly' : c.level}</small></div>`).join('') || '<p class="day-empty">No classes</p>'}</div>`;
  }).join('');
  filters.querySelector('[data-count]').textContent = `${shown.length} class${shown.length === 1 ? '' : 'es'} this week`;
}

if (timetable && filters) {
  const fromLink = location.hash.slice(1);
  if ([...filters.style.options].some(o => o.value === fromLink)) filters.style.value = fromLink;
  filters.addEventListener('change', renderTimetable);
  renderTimetable();
}

// Pack or membership planner: cost per month for the classes a week chosen
const planner = document.querySelector('[data-planner]');
if (planner) {
  const slider = planner.querySelector('[data-per-week]');
  const plans = {
    drop: { name: 'Drop in', cost: n => n * 28 },
    pack: { name: '10 class pack', cost: n => n * 22 },
    four: { name: '4 a month', cost: n => 89 + Math.max(0, n - 4) * 28 }, // extra classes at the drop-in price
    unlimited: { name: 'Unlimited membership', cost: () => 169 },
  };
  const update = () => {
    const perWeek = Number(slider.value);
    const perMonth = Math.round(perWeek * 4.33);
    const costs = Object.entries(plans).map(([key, p]) => ({ key, name: p.name, cost: p.cost(perMonth) }));
    const best = costs.reduce((a, b) => (b.cost < a.cost ? b : a));
    planner.querySelector('[data-per-week-label]').textContent = perWeek;
    planner.querySelector('[data-best]').textContent = best.name;
    planner.querySelector('[data-best-detail]').textContent = `About ${perMonth} classes a month for $${Math.round(best.cost)}, or $${(best.cost / perMonth).toFixed(2)} a class.`;
    document.querySelectorAll('[data-plan]').forEach(el => el.classList.toggle('best', el.dataset.plan === best.key));
  };
  slider.addEventListener('input', update);
  update();
}

// Intro offer form (demo only: connect it to your booking system or form service)
const trial = document.querySelector('[data-trial-form]');
trial?.addEventListener('submit', event => {
  event.preventDefault();
  trial.querySelector('[data-trial-note]').textContent = `Thank you, ${trial.name.value}! We'll email you a link to book your first ${trial.style.value.toLowerCase()} class.`;
  trial.reset();
});

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
