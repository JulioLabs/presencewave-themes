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
  ['08:00', '16:00'], // Sunday
  ['07:00', '15:00'], // Monday
  ['07:00', '15:00'],
  ['07:00', '15:00'],
  ['07:00', '21:00'], // Thursday: supper club
  ['07:00', '15:00'],
  ['08:00', '16:00'], // Saturday
];
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const toMinutes = time => { const [h, m] = time.split(':').map(Number); return h * 60 + m; };
const pretty = time => {
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'pm' : 'am';
  const hour = h % 12 || 12;
  return m ? `${hour}:${String(m).padStart(2, '0')}${suffix}` : `${hour}${suffix}`;
};

const now = new Date();
const today = now.getDay();
const table = document.querySelector('[data-hours-table] tbody');
if (table) {
  table.innerHTML = hours.map((h, i) => `<tr class="${i === today ? 'is-today' : ''}"><td>${dayNames[i]}${i === today ? ' (today)' : ''}</td><td>${h ? `${pretty(h[0])}–${pretty(h[1])}` : 'Closed'}</td></tr>`).join('');
}

const badge = document.querySelector('[data-open-badge]');
const badgeText = document.querySelector('[data-open-text]');
if (badge && badgeText) {
  const minutes = now.getHours() * 60 + now.getMinutes();
  const todays = hours[today];
  if (todays && minutes >= toMinutes(todays[0]) && minutes < toMinutes(todays[1])) {
    badge.classList.add('is-open');
    badgeText.textContent = `Open now · until ${pretty(todays[1])}`;
  } else {
    badge.classList.add('is-closed');
    let next = todays && minutes < toMinutes(todays[0]) ? 0 : 1;
    while (!hours[(today + next) % 7] && next < 7) next += 1;
    const day = (today + next) % 7;
    badgeText.textContent = `Closed now · opens ${next === 0 ? 'today' : next === 1 ? 'tomorrow' : dayNames[day]} at ${pretty(hours[day][0])}`;
  }
}

// Menu: replace with your own dishes. tags: v vegetarian, vg vegan, gf gluten-free
const menu = {
  breakfast: [
    { name: 'Buttermilk pancakes', price: 13, tags: ['v'], description: 'Three tall ones, whipped honey butter, maple syrup and berries.' },
    { name: 'The Daybreak plate', price: 15, tags: ['gf'], description: 'Two eggs your way, bacon or sausage, crispy potatoes and greens.' },
    { name: 'Green shakshuka', price: 14, tags: ['v', 'gf'], description: 'Eggs baked in herbs, spinach and feta, with grilled sourdough (GF bread on request).' },
    { name: 'Tofu breakfast hash', price: 14, tags: ['vg', 'gf'], description: 'Turmeric tofu, sweet potato, peppers and salsa verde.' },
    { name: 'Biscuits and gravy', price: 12, tags: [], description: 'Flaky biscuits, black pepper sausage gravy, a soft egg on top.' },
    { name: 'Overnight oats', price: 9, tags: ['vg'], description: 'Oat milk, chia, seasonal fruit compote and toasted seeds.' },
  ],
  lunch: [
    { name: 'Farm bowl', price: 15, tags: ['vg', 'gf'], description: 'Roasted squash, brown rice, greens, pickled onion and tahini.' },
    { name: 'Fried chicken sandwich', price: 16, tags: [], description: 'Buttermilk chicken, slaw and hot honey on a brioche bun.' },
    { name: 'Tomato soup and grilled cheese', price: 13, tags: ['v'], description: 'Our cheddar melt on sourdough, with a cup of roasted tomato soup.' },
    { name: 'Market salad', price: 14, tags: ['v', 'gf'], description: 'Whatever the farm sent this week, goat cheese and a sherry vinaigrette.' },
    { name: 'Black bean burger', price: 15, tags: ['vg'], description: 'House patty, avocado, pickles and chipotle mayo, with fries.' },
  ],
  drinks: [
    { name: 'Drip coffee', price: 3.5, tags: ['vg', 'gf'], description: 'Our house roast. Free refills when you stay.' },
    { name: 'Oat milk latte', price: 5.5, tags: ['vg', 'gf'], description: 'Double shot, steamed oat milk. Add honey lavender for $0.75.' },
    { name: 'Chai', price: 5, tags: ['v', 'gf'], description: 'Spiced in-house, with whole milk or any plant milk.' },
    { name: 'Fresh orange juice', price: 6, tags: ['vg', 'gf'], description: 'Squeezed to order.' },
    { name: 'Mimosa', price: 9, tags: ['vg', 'gf'], description: 'Weekends from 10am. Sparkling wine and fresh orange.' },
  ],
};
const tagLabels = { v: 'V', vg: 'VG', gf: 'GF' };
// A vegan dish is also vegetarian
const matches = (item, diet) => diet === 'all' || item.tags.includes(diet) || (diet === 'v' && item.tags.includes('vg'));

const list = document.querySelector('[data-menu-list]');
let section = 'breakfast';
let diet = 'all';
const money = value => `$${Number.isInteger(value) ? value : value.toFixed(2)}`;
const renderMenu = () => {
  if (!list) return;
  const items = menu[section].filter(item => matches(item, diet));
  list.innerHTML = items.length
    ? items.map(item => `<li class="menu-item"><h3>${item.name}${item.tags.length ? `<span class="tags">${item.tags.map(t => `<span>${tagLabels[t]}</span>`).join('')}</span>` : ''}</h3><span class="price">${money(item.price)}</span><p>${item.description}</p></li>`).join('')
    : '<li class="menu-empty">Nothing in this section matches that filter yet. Ask us: the kitchen can often adapt a dish.</li>';
};

document.querySelectorAll('[data-menu-tabs] button').forEach(button => button.addEventListener('click', () => {
  section = button.dataset.section;
  document.querySelectorAll('[data-menu-tabs] button').forEach(b => b.setAttribute('aria-selected', String(b === button)));
  renderMenu();
}));
document.querySelectorAll('[data-diet-filters] input').forEach(input => input.addEventListener('change', () => {
  diet = input.value;
  renderMenu();
}));
renderMenu();

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
