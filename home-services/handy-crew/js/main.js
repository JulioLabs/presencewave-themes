// Mobile navigation
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
});

// Home page to-do card: ticking jobs updates the count
const todo = document.querySelector('[data-todo]');
const todoCount = document.querySelector('[data-todo-count]');
function countTodo() {
  const boxes = todo.querySelectorAll('input');
  const done = [...boxes].filter(b => b.checked).length;
  todoCount.textContent = done === boxes.length ? 'All done. Time for coffee.' : `${done} of ${boxes.length} done · about ${(boxes.length - done) * 25} minutes left`;
}
if (todo) { todo.addEventListener('change', countTodo); countTodo(); }

// Booking: replace with your own visit lengths, prices and arrival windows
const visits = {
  quick: { name: 'Quick fix (1 hour)', price: 95 },
  half: { name: 'Half day (3 hours)', price: 240 },
  full: { name: 'Full day (7 hours)', price: 440 },
};
const windows = ['8–10am', '10am–12pm', '12–2pm', '2–4pm'];
// Days we're closed (0 = Sunday) and windows that are already booked, as day offset → window indexes
const closedDays = [0];
const booked = { 1: [0, 1], 2: [0], 4: [2, 3] };

const form = document.querySelector('[data-booking-form]');
if (form) {
  const dayRow = form.querySelector('[data-days]');
  const windowRow = form.querySelector('[data-windows]');
  const days = [];
  for (let offset = 1; days.length < 7; offset++) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    if (!closedDays.includes(date.getDay())) days.push({ offset, date });
  }
  dayRow.innerHTML = days.map((d, i) => `<label class="pick"><input type="radio" name="day" value="${d.offset}"${i === 0 ? ' checked' : ''}><span><strong>${d.date.toLocaleDateString('en-US', { weekday: 'short' })}</strong>${d.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></label>`).join('');

  function renderWindows() {
    const offset = Number(form.day.value);
    const full = booked[offset] || [];
    windowRow.innerHTML = windows.map((w, i) => `<label class="pick"><input type="radio" name="window" value="${w}"${full.includes(i) ? ' disabled' : ''}><span><strong>${w}</strong>${full.includes(i) ? 'Booked' : 'Open'}</span></label>`).join('');
    const firstOpen = windowRow.querySelector('input:not(:disabled)');
    if (firstOpen) firstOpen.checked = true;
  }

  function renderSummary() {
    const visit = visits[form.visit.value];
    const day = days.find(d => d.offset === Number(form.day.value));
    document.querySelector('[data-sum-visit]').textContent = visit.name;
    document.querySelector('[data-sum-day]').textContent = day.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    document.querySelector('[data-sum-window]').textContent = form.window?.value || 'Pick a window';
    document.querySelector('[data-sum-price]').textContent = '$' + visit.price;
  }

  const wanted = new URLSearchParams(location.search).get('visit');
  if (wanted && visits[wanted]) form.querySelector(`input[name="visit"][value="${wanted}"]`).checked = true;
  renderWindows();
  renderSummary();
  form.addEventListener('change', event => {
    if (event.target.name === 'day') renderWindows();
    renderSummary();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const name = form.name.value.trim().split(' ')[0];
    document.querySelector('[data-booking-note]').textContent = `Thanks ${name}! You're booked for ${document.querySelector('[data-sum-day]').textContent}, arriving ${form.window.value}. We'll text to confirm.`;
  });
}

// Footer year
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
