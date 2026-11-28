// Mobile navigation
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
});

// Neighborhoods: replace with yours. median is the median sale price, commute the minutes downtown at 8am,
// walk a walkability score out of 100, parks the parks and trails within a mile.
// Describe homes, streets and amenities, never the people who live there (fair housing).
const hoods = [
  { name: 'Old Town', median: 512000, commute: 8, walk: 91, parks: 4, homes: 'Brick rowhouses and lofts', blurb: 'Cafés on every corner, the Saturday market and a ten-minute walk to the office towers.' },
  { name: 'Linden Park', median: 468000, commute: 14, walk: 78, parks: 6, homes: '1920s bungalows', blurb: 'Tree-lined streets around a 40-acre park, with a little main street of shops.' },
  { name: 'Maple Hollow', median: 425000, commute: 19, walk: 54, parks: 5, homes: 'Ranches and two-stories', blurb: 'Bigger yards, quiet cul-de-sacs and a greenway trail that runs to the river.' },
  { name: 'Riverside Heights', median: 389000, commute: 22, walk: 47, parks: 3, homes: 'Newer townhomes', blurb: 'Newer construction with river views and a quick hop onto the parkway.' },
  { name: 'Quail Ridge', median: 589000, commute: 25, walk: 38, parks: 7, homes: 'Large lots, newer homes', blurb: 'Room to spread out, a nature preserve and a golf course at the end of the road.' },
  { name: 'Cedar Bend', median: 352000, commute: 28, walk: 41, parks: 4, homes: 'Starter homes and duplexes', blurb: 'The best value close to town, with a new library and a growing food hall.' },
];

const money = value => '$' + Math.round(value / 1000) + 'k';
const walkLabel = score => score >= 85 ? 'Very walkable' : score >= 65 ? 'Walkable' : score >= 45 ? 'Some errands on foot' : 'Car needed';
const rows = [
  { label: 'Median home price', value: h => money(h.median), better: (a, b) => a.median < b.median },
  { label: 'Commute downtown', value: h => `${h.commute} min`, better: (a, b) => a.commute < b.commute },
  { label: 'Walkability', value: h => `${h.walk} · ${walkLabel(h.walk)}`, better: (a, b) => a.walk > b.walk },
  { label: 'Parks and trails nearby', value: h => `${h.parks}`, better: (a, b) => a.parks > b.parks },
  { label: 'Typical homes', value: h => h.homes },
];

// Neighborhood compare
const compareForm = document.querySelector('[data-compare-form]');
if (compareForm) {
  const selects = compareForm.querySelectorAll('[data-hood-select]');
  selects.forEach((select, index) => {
    select.innerHTML = hoods.map(h => `<option>${h.name}</option>`).join('');
    select.selectedIndex = index;
  });
  const table = document.querySelector('[data-compare]');
  const render = () => {
    const a = hoods.find(h => h.name === selects[0].value);
    const b = hoods.find(h => h.name === selects[1].value);
    const cell = (row, mine, other) => `<td${row.better && mine !== other && row.better(mine, other) ? ' class="win"' : ''}>${row.value(mine)}</td>`;
    table.innerHTML = `<table>
      <thead><tr><th scope="col"><span class="visually-hidden">Measure</span></th><th scope="col">${a.name}</th><th scope="col">${b.name}</th></tr></thead>
      <tbody>${rows.map(row => `<tr><th scope="row">${row.label}</th>${cell(row, a, b)}${cell(row, b, a)}</tr>`).join('')}</tbody>
    </table>
    <a class="text-link" href="contact.html?hoods=${encodeURIComponent(a.name + ', ' + b.name)}">Ask about ${a.name} and ${b.name}</a>`;
  };
  compareForm.addEventListener('change', render);
  render();
}

// Neighborhood cards
const cards = document.querySelector('[data-hood-cards]');
if (cards) {
  cards.innerHTML = hoods.map(h => `
    <article class="hood-card">
      <h3>${h.name}</h3>
      <p>${h.blurb}</p>
      <dl><div><dt>Median</dt><dd>${money(h.median)}</dd></div><div><dt>Downtown</dt><dd>${h.commute} min</dd></div><div><dt>Walk</dt><dd>${h.walk}</dd></div></dl>
      <a class="text-link" href="contact.html?hoods=${encodeURIComponent(h.name)}">Ask about ${h.name}</a>
    </article>`).join('');
}

// Contact: neighborhoods chosen elsewhere arrive as ?hoods=
const contactForm = document.querySelector('[data-contact-form]');
if (contactForm) {
  const chosen = new URLSearchParams(location.search).get('hoods');
  if (chosen) contactForm.querySelector('[data-hoods-field]').value = chosen;
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const done = contactForm.querySelector('[data-contact-done]');
    done.textContent = `Thanks, ${data.get('name').split(' ')[0]}! Your neighborhood shortlist will be in your inbox within a day.`;
    done.hidden = false;
  });
}

// Guide signup (demo; connect it to your newsletter or a PresenceWave mailing list)
document.querySelector('[data-signup-form]')?.addEventListener('submit', event => {
  event.preventDefault();
  event.target.hidden = true;
  document.querySelector('[data-signup-done]').hidden = false;
});

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
