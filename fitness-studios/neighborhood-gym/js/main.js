// Mobile navigation
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
});

// Membership builder: edit the prices here
const prices = {
  plans: { basic: ['Basic plan', 35], plus: ['Plus plan', 55], premium: ['Premium plan', 75] },
  adult: 25,
  kid: 10,
  extras: { kidsclub: ["Kids' club", 15], locker: ['Locker', 10], towel: ['Towel service', 8], pt: ['2 PT sessions', 110] },
};
const builder = document.querySelector('[data-builder]');
if (builder) {
  const counts = { adults: 0, kids: 0 };
  const update = () => {
    const plan = builder.querySelector('input[name="plan"]:checked').value;
    const lines = [prices.plans[plan]];
    if (counts.adults) lines.push([`${counts.adults} extra adult${counts.adults === 1 ? '' : 's'}`, counts.adults * prices.adult]);
    if (counts.kids) lines.push([`${counts.kids} kid${counts.kids === 1 ? '' : 's'}`, counts.kids * prices.kid]);
    builder.querySelectorAll('input[name="extra"]:checked').forEach(e => lines.push(prices.extras[e.value]));
    const total = lines.reduce((sum, [, amount]) => sum + amount, 0);
    builder.querySelector('[data-lines]').innerHTML = lines.map(([name, amount]) => `<li><span>${name}</span><span>$${amount}</span></li>`).join('');
    builder.querySelector('[data-total]').textContent = `$${total}`;
    builder.querySelector('[data-count="adults"]').textContent = counts.adults;
    builder.querySelector('[data-count="kids"]').textContent = counts.kids;
    const summary = `${prices.plans[plan][0]}, ${1 + counts.adults} adult${counts.adults ? 's' : ''}${counts.kids ? `, ${counts.kids} kid${counts.kids === 1 ? '' : 's'}` : ''}: $${total}/mo`;
    builder.querySelector('[data-join]').href = `contact.html?membership=${encodeURIComponent(summary)}#tour`;
  };
  builder.addEventListener('change', update);
  builder.addEventListener('click', event => {
    const step = event.target.closest('[data-step]');
    if (!step) return;
    const key = step.dataset.step;
    counts[key] = Math.min(6, Math.max(0, counts[key] + Number(step.dataset.delta)));
    update();
  });
  update();
}

// Class timetable: type is one of cardio, strength, mind, water
const classes = [
  ['Mon', '6:00am', 'Spin', 'cardio'], ['Mon', '9:30am', 'Aqua fit', 'water'], ['Mon', '6:00pm', 'Body pump', 'strength'], ['Mon', '7:15pm', 'Yoga', 'mind'],
  ['Tue', '6:00am', 'Bootcamp', 'strength'], ['Tue', '10:00am', 'Seniors strength', 'strength'], ['Tue', '6:30pm', 'Spin', 'cardio'],
  ['Wed', '6:00am', 'Spin', 'cardio'], ['Wed', '9:30am', 'Aqua fit', 'water'], ['Wed', '6:00pm', 'Zumba', 'cardio'], ['Wed', '7:15pm', 'Pilates', 'mind'],
  ['Thu', '6:00am', 'Bootcamp', 'strength'], ['Thu', '12:15pm', 'Core 30', 'strength'], ['Thu', '6:30pm', 'Spin', 'cardio'],
  ['Fri', '6:00am', 'Spin', 'cardio'], ['Fri', '9:30am', 'Aqua fit', 'water'], ['Fri', '5:30pm', 'Yoga', 'mind'],
  ['Sat', '8:00am', 'Bootcamp', 'strength'], ['Sat', '9:30am', 'Zumba', 'cardio'], ['Sat', '11:00am', 'Family swim', 'water'],
  ['Sun', '9:00am', 'Yoga', 'mind'], ['Sun', '10:30am', 'Spin', 'cardio'], ['Sun', '2:00pm', 'Family swim', 'water'],
];
const table = document.querySelector('[data-class-table]');
const filter = document.querySelector('[data-class-filter]');
function showClasses(type) {
  filter.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.type === type));
  table.innerHTML = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
    const items = classes.filter(c => c[0] === day && (type === 'all' || c[3] === type));
    return `<div class="class-day"><h3>${day}</h3>${items.map(c => `<div class="class-item" data-type="${c[3]}"><strong>${c[2]}</strong>${c[1]}</div>`).join('') || '<p class="class-empty">No classes</p>'}</div>`;
  }).join('');
}
if (table && filter) {
  filter.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (button) showClasses(button.dataset.type);
  });
  showClasses('all');
}

// Tour form: picks up the membership from the builder (demo only: connect it to your CRM or form service)
const tour = document.querySelector('[data-tour-form]');
if (tour) {
  const fromBuilder = new URLSearchParams(location.search).get('membership');
  if (fromBuilder) tour.querySelector('[data-membership-field]').value = fromBuilder;
  tour.addEventListener('submit', event => {
    event.preventDefault();
    tour.querySelector('[data-tour-note]').textContent = `Thanks, ${tour.name.value.split(' ')[0]}! We'll call you today to confirm your tour time.`;
    tour.reset();
  });
}

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
