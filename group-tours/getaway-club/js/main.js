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

// Departures: replace with your own trips. seats = seats still available (0 = sold out, waitlist)
const departures = [
  { month: 'Apr', dates: 'Apr 9–17', trip: 'Lisbon to Porto', details: '8 days · activity level 2', price: 2690, seats: 6 },
  { month: 'Apr', dates: 'Apr 23–29', trip: 'Canyon Country', details: '7 days · activity level 2', price: 2190, seats: 0 },
  { month: 'May', dates: 'May 14–22', trip: 'Amalfi Coast & Capri', details: '9 days · activity level 2', price: 3290, seats: 3 },
  { month: 'May', dates: 'May 20–29', trip: 'Rainforest & Pacific', details: '10 days · activity level 3', price: 2890, seats: 9 },
  { month: 'Jun', dates: 'Jun 4–12', trip: 'Amalfi Coast & Capri', details: '9 days · activity level 2', price: 3390, seats: 11 },
  { month: 'Jun', dates: 'Jun 18–25', trip: 'Lisbon to Porto', details: '8 days · activity level 2', price: 2790, seats: 2 },
  { month: 'Sep', dates: 'Sep 10–16', trip: 'Canyon Country', details: '7 days · activity level 2', price: 2190, seats: 12 },
  { month: 'Oct', dates: 'Oct 2–10', trip: 'Amalfi Coast & Capri', details: '9 days · activity level 2', price: 3190, seats: 8 },
];
const months = [...new Set(departures.map(d => d.month))];
const monthTabs = document.querySelector('[data-months]');
const list = document.querySelector('[data-departures]');
const select = document.querySelector('[data-departure-select]');

function seatsBadge(seats) {
  if (seats === 0) return '<span class="seats seats-out">Sold out</span>';
  if (seats <= 3) return `<span class="seats seats-low">${seats} seat${seats === 1 ? '' : 's'} left</span>`;
  return `<span class="seats">${seats} seats left</span>`;
}

function label(d) {
  return `${d.trip}, ${d.dates}${d.seats === 0 ? ' (waitlist)' : ''}`;
}

function showMonth(month) {
  monthTabs.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', b.dataset.month === month));
  const items = departures.filter(d => d.month === month);
  list.innerHTML = items.map(d => `
    <li class="departure">
      <span class="departure-date">${d.dates}</span>
      <div><h3>${d.trip}</h3><p>${d.details} · from $${d.price.toLocaleString('en-US')}</p></div>
      ${seatsBadge(d.seats)}
      <a class="button ${d.seats === 0 ? 'button-ghost' : ''}" href="#reserve" data-pick="${departures.indexOf(d)}">${d.seats === 0 ? 'Join waitlist' : 'Save my spot'}</a>
    </li>`).join('') || '<li class="empty-month">No departures this month yet.</li>';
}

if (monthTabs && list) {
  monthTabs.innerHTML = months.map(m => `<button type="button" role="tab" data-month="${m}">${m}</button>`).join('');
  monthTabs.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (button) showMonth(button.dataset.month);
  });
  showMonth(months[0]);
}

if (select) {
  select.innerHTML = departures.map((d, i) => `<option value="${i}">${label(d)}</option>`).join('');
}

// Choosing a departure in the calendar preselects it in the form
list?.addEventListener('click', event => {
  const pick = event.target.closest('[data-pick]');
  if (pick && select) select.value = pick.dataset.pick;
});

const reserve = document.querySelector('[data-reserve]');
reserve?.addEventListener('submit', event => {
  event.preventDefault();
  const d = departures[Number(reserve.elements.departure.value)];
  const name = reserve.elements.name.value.trim().split(' ')[0] || 'there';
  reserve.querySelector('.form-success').textContent = d.seats === 0
    ? `Thanks, ${name}. You're on the waitlist for ${d.trip} (${d.dates}). We'll email you the moment a seat opens.`
    : `Thanks, ${name}. Your seat on ${d.trip} (${d.dates}) is held for 48 hours. Check your email for the next step.`;
});

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
