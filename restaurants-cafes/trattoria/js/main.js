// Mobile navigation
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
});

// Reservations: replace with your own seatings. Days are 0 = Sunday. closedDays have no dinner service.
const reservations = {
  closedDays: [1], // Monday
  times: ['5:00', '5:30', '6:00', '6:30', '7:00', '7:30', '8:00', '8:30'],
  sundayTimes: ['4:00', '4:30', '5:00', '5:30', '6:00', '6:30', '7:00'],
  maxParty: 8,
};

const form = document.querySelector('[data-reserve-form]');
if (form) {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const partyOut = form.querySelector('[data-party]');
  const daysEl = form.querySelector('[data-days]');
  const slotsEl = form.querySelector('[data-slots]');
  const summary = document.querySelector('[data-summary]');
  const note = form.querySelector('[data-reserve-note]');
  let party = 2;
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d; });

  // Some slots fill up: a simple, repeatable pattern so the demo looks realistic
  const isFull = (date, index) => (date.getDate() + index * 3 + party) % 5 === 0;

  daysEl.innerHTML = days.map((d, i) => {
    const closed = reservations.closedDays.includes(d.getDay());
    return `<label class="day"><input type="radio" name="day" value="${i}" ${closed ? 'disabled' : ''}><span>${i === 0 ? 'Today' : dayNames[d.getDay()]}<strong>${d.getDate()}</strong></span></label>`;
  }).join('');

  const selectedDay = () => { const input = form.querySelector('input[name="day"]:checked'); return input ? days[Number(input.value)] : null; };
  const selectedTime = () => form.querySelector('input[name="time"]:checked')?.value;

  const updateSummary = () => {
    const day = selectedDay();
    const time = selectedTime();
    const guests = `${party} ${party === 1 ? 'guest' : 'guests'}`;
    summary.textContent = day && time
      ? `${guests}, ${day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at ${time}pm`
      : `${guests}. Choose a day and a time.`;
  };

  const renderSlots = () => {
    const day = selectedDay();
    if (!day) { slotsEl.innerHTML = '<p class="slot-empty">Choose a day to see open times.</p>'; updateSummary(); return; }
    const times = day.getDay() === 0 ? reservations.sundayTimes : reservations.times;
    slotsEl.innerHTML = times.map((t, i) => `<label class="slot"><input type="radio" name="time" value="${t}" ${isFull(day, i) ? 'disabled' : ''}><span>${t}${isFull(day, i) ? ' · full' : ''}</span></label>`).join('');
    updateSummary();
  };

  form.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
    party = Math.min(reservations.maxParty, Math.max(1, party + Number(button.dataset.step)));
    partyOut.textContent = party;
    form.querySelector('[data-step="-1"]').disabled = party === 1;
    form.querySelector('[data-step="1"]').disabled = party === reservations.maxParty;
    renderSlots();
  }));
  daysEl.addEventListener('change', renderSlots);
  slotsEl.addEventListener('change', updateSummary);
  const firstOpen = daysEl.querySelector('input:not(:disabled)');
  if (firstOpen) firstOpen.checked = true;
  renderSlots();

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!selectedDay() || !selectedTime()) { note.textContent = 'Please choose a day and a time.'; return; }
    note.textContent = `Grazie, ${form.name.value.split(' ')[0]}! We'll text ${form.phone.value} to confirm within the hour.`;
  });
}

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
