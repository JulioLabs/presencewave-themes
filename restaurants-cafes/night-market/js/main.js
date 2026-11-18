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

// Weekly stops: replace with your own. Sunday first; null = day off.
const stops = [
  { place: 'Riverside Brewing', area: 'Taproom lot', time: '1–7pm' },
  null,
  { place: 'Tech Park', area: 'Building C plaza', time: '11am–2pm' },
  { place: 'Elm Street Night Market', area: 'Corner of Elm & 4th', time: '5–10pm' },
  { place: 'Hilltop Hospital', area: 'Staff lot, east side', time: '11am–2pm' },
  { place: 'Downtown Late Night', area: 'Outside the Palace Theater', time: '8pm–1am' },
  { place: 'Farmers Market', area: 'Union Square, north end', time: '9am–2pm' },
];
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const today = new Date().getDay();
const order = Array.from({ length: 7 }, (_, i) => (today + i) % 7); // start the list with today

const schedule = document.querySelector('[data-schedule]');
if (schedule) {
  schedule.innerHTML = order.map((d, i) => {
    const s = stops[d];
    const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : days[d];
    return s
      ? `<li class="stop ${i === 0 ? 'is-today' : ''}"><span class="stop-day">${label}</span><strong>${s.place}</strong><span>${s.area} · ${s.time}</span>${i === 0 ? '<span class="stop-badge">We\'re here today</span>' : ''}</li>`
      : `<li class="stop is-off ${i === 0 ? 'is-today' : ''}"><span class="stop-day">${label}</span><strong>Day off</strong><span>Prepping the kimchi</span></li>`;
  }).join('');
}
const pill = document.querySelector('[data-today-pill]');
if (pill) {
  const s = stops[today];
  pill.textContent = s ? `Today: ${s.place}, ${s.time}` : 'Day off today. Back tomorrow!';
}

// Bowl builder: replace with your own options and prices
const options = {
  base: { type: 'radio', items: [['Crispy rice', 4], ['Steamed rice', 3], ['Greens', 3], ['Glass noodles', 4]] },
  protein: { type: 'radio', items: [['Spicy pork', 6], ['Bulgogi beef', 7], ['Gochujang chicken', 6], ['Crispy tofu', 5], ['No protein', 0]] },
  toppings: { type: 'checkbox', included: 3, extra: 1, items: [['Kimchi', 0], ['Pickled onion', 0], ['Corn', 0], ['Avocado', 0], ['Cucumber', 0], ['Fried egg', 0], ['Jalapeño', 0], ['Scallions', 0], ['Sesame', 0]] },
  sauce: { type: 'radio', items: [['Gochu mayo', 0], ['Salsa roja', 0], ['Yuzu ponzu', 0], ['Extra hot', 0.5]] },
};
const defaults = { base: 'Crispy rice', protein: 'Spicy pork', toppings: ['Kimchi', 'Pickled onion', 'Corn'], sauce: 'Gochu mayo' };
const money = v => `$${v.toFixed(2)}`;

const builder = document.querySelector('[data-builder]');
if (builder) {
  Object.entries(options).forEach(([group, cfg]) => {
    builder.querySelector(`[data-group="${group}"]`).innerHTML = cfg.items.map(([name, price]) => {
      const checked = cfg.type === 'radio' ? defaults[group] === name : defaults[group].includes(name);
      return `<label class="opt"><input type="${cfg.type}" name="${group}" value="${name}" ${checked ? 'checked' : ''}><span>${name}${price ? `<em>+${money(price)}</em>` : ''}</span></label>`;
    }).join('');
  });
  const receipt = document.querySelector('[data-receipt]');
  const totalEl = document.querySelector('[data-total]');
  const update = () => {
    const lines = [];
    let total = 0;
    ['base', 'protein', 'sauce'].forEach(group => {
      const value = builder.querySelector(`input[name="${group}"]:checked`)?.value;
      const price = options[group].items.find(([n]) => n === value)?.[1] || 0;
      if (value) { lines.push([value, price]); total += price; }
    });
    const toppings = [...builder.querySelectorAll('input[name="toppings"]:checked')].map(i => i.value);
    const extra = Math.max(0, toppings.length - options.toppings.included) * options.toppings.extra;
    if (toppings.length) lines.push([`Toppings: ${toppings.join(', ')}`, extra]);
    total += extra;
    receipt.innerHTML = lines.map(([n, p]) => `<li><span>${n}</span><span>${p ? money(p) : '—'}</span></li>`).join('');
    totalEl.textContent = money(total);
  };
  builder.addEventListener('change', update);
  update();
}

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
