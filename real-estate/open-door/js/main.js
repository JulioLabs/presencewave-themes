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

// This weekend's open houses: replace with yours. day is 'sat' or 'sun'; times are 24-hour, local time.
// The dates always fall on the coming weekend, so the demo never looks out of date.
const openHouses = [
  { id: 'maple-214', address: '214 Maple Hollow Lane', area: 'Maple Hollow', price: 425000, beds: 3, baths: 2, sqft: 1860, day: 'sat', start: '11:00', end: '13:00', color: 'tomato' },
  { id: 'quail-87', address: '87 Quail Ridge Court', area: 'Quail Ridge', price: 589000, beds: 4, baths: 3, sqft: 2640, day: 'sat', start: '14:00', end: '16:00', color: 'cobalt' },
  { id: 'linden-9', address: '9 Linden Street', area: 'Linden Park', price: 339900, beds: 2, baths: 2, sqft: 1240, day: 'sun', start: '12:00', end: '14:00', color: 'lemon' },
  { id: 'birch-31', address: '31 Birch Bend Drive', area: 'Cedar Bend', price: 472000, beds: 4, baths: 2.5, sqft: 2210, day: 'sun', start: '14:00', end: '16:00', color: 'tomato' },
];
const OFFICE = 'Open Door Realty';

const today = new Date();
// On a Sunday, "this weekend" started yesterday
const saturday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (today.getDay() === 0 ? -1 : 6 - today.getDay()));
const dateOf = day => new Date(saturday.getFullYear(), saturday.getMonth(), saturday.getDate() + (day === 'sun' ? 1 : 0));
const dayLabel = date => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
const timeLabel = hhmm => {
  const [h, m] = hhmm.split(':').map(Number);
  return `${(h % 12) || 12}${m ? ':' + String(m).padStart(2, '0') : ''}${h < 12 ? 'am' : 'pm'}`;
};
const money = value => '$' + value.toLocaleString('en-US');

const title = document.querySelector('[data-weekend-title]');
if (title) title.textContent = `Open houses, ${dayLabel(dateOf('sat'))} – ${dayLabel(dateOf('sun'))}`;

const list = document.querySelector('[data-open-houses]');
if (list) {
  list.innerHTML = openHouses.map(house => `
    <article class="open-card open-${house.color}">
      <div class="when"><span>${dayLabel(dateOf(house.day))}</span><strong>${timeLabel(house.start)} – ${timeLabel(house.end)}</strong></div>
      <div class="what">
        <p class="price">${money(house.price)}</p>
        <h3>${house.address}</h3>
        <p class="specs">${house.area} · ${house.beds} bd · ${house.baths} ba · ${house.sqft.toLocaleString('en-US')} sq ft</p>
      </div>
      <div class="actions">
        <a class="button button-small" href="#rsvp" data-rsvp="${house.id}">RSVP</a>
        <button class="button button-small button-outline" type="button" data-calendar="${house.id}">Add to calendar</button>
      </div>
    </article>`).join('');
}

// RSVP: the open house picked in the list is selected in the form
const select = document.querySelector('[data-house-select]');
if (select) select.innerHTML = openHouses.map(house => `<option value="${house.id}">${dayLabel(dateOf(house.day))}, ${timeLabel(house.start)}: ${house.address}</option>`).join('');
document.querySelectorAll('[data-rsvp]').forEach(link => link.addEventListener('click', () => { select.value = link.dataset.rsvp; }));

// Add to calendar: downloads an .ics file that every calendar app opens
const pad = n => String(n).padStart(2, '0');
const icsTime = (date, hhmm) => `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${hhmm.replace(':', '')}00`;
document.querySelectorAll('[data-calendar]').forEach(button => button.addEventListener('click', () => {
  const house = openHouses.find(item => item.id === button.dataset.calendar);
  const date = dateOf(house.day);
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Open Door//Open houses//EN', 'BEGIN:VEVENT',
    `UID:${house.id}-${icsTime(date, house.start)}@open-door`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
    `DTSTART:${icsTime(date, house.start)}`, `DTEND:${icsTime(date, house.end)}`,
    `SUMMARY:Open house: ${house.address}`, `LOCATION:${house.address}`,
    `DESCRIPTION:${money(house.price)} · ${house.beds} bd · ${house.baths} ba. Hosted by ${OFFICE}.`,
    'BEGIN:VALARM', 'TRIGGER:-PT1H', 'ACTION:DISPLAY', 'DESCRIPTION:Open house in an hour', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  link.download = `open-house-${house.id}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  button.textContent = 'Added ✓';
}));

// RSVP form (demo: shows a confirmation; connect it to your CRM or a PresenceWave form)
document.querySelector('[data-rsvp-form]')?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.target);
  const house = openHouses.find(item => item.id === data.get('house'));
  const done = event.target.querySelector('[data-rsvp-done]');
  done.textContent = `You're on the list, ${data.get('name').split(' ')[0]}! See you at ${house.address}, ${dayLabel(dateOf(house.day))} at ${timeLabel(house.start)}.`;
  done.hidden = false;
});

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
