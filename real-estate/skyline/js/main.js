// Mobile navigation
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
});

// Listings: replace with your own. type is 'condo', 'townhome' or 'house'; listed is the date it came on the market.
const listings = [
  { id: 'harbor-ph', name: 'Harbor Tower Penthouse', area: 'Downtown', type: 'condo', price: 3250000, beds: 3, baths: 3.5, sqft: 3100, listed: '2026-11-20', featured: true, note: 'Wraparound terrace' },
  { id: 'river-12', name: '12 River Walk', area: 'Waterfront', type: 'townhome', price: 1895000, beds: 4, baths: 3.5, sqft: 2900, listed: '2026-11-18', featured: true, note: 'Private boat slip' },
  { id: 'ridge-house', name: 'The Ridge House', area: 'Hillside', type: 'house', price: 2750000, beds: 4, baths: 4, sqft: 4200, listed: '2026-11-12', featured: true, note: 'City views, pool' },
  { id: 'mill-loft', name: 'Mill District Loft 5B', area: 'Downtown', type: 'condo', price: 925000, beds: 2, baths: 2, sqft: 1650, listed: '2026-11-22', note: '14-foot ceilings' },
  { id: 'park-1802', name: 'Parkside 1802', area: 'Downtown', type: 'condo', price: 1150000, beds: 2, baths: 2.5, sqft: 1900, listed: '2026-11-05', note: 'Park views' },
  { id: 'quay-3', name: '3 Quay Lane', area: 'Waterfront', type: 'townhome', price: 1425000, beds: 3, baths: 2.5, sqft: 2300, listed: '2026-10-30', note: 'Rooftop deck' },
  { id: 'cedar-glass', name: 'Cedar Glass House', area: 'Hillside', type: 'house', price: 4100000, beds: 5, baths: 5, sqft: 5600, listed: '2026-10-25', note: 'Architect designed' },
  { id: 'ember-studio', name: 'Ember Building 902', area: 'Downtown', type: 'condo', price: 640000, beds: 1, baths: 1, sqft: 980, listed: '2026-11-15', note: 'Doorman building' },
];

const money = value => value >= 1000000
  ? '$' + parseFloat((value / 1000000).toFixed(2)) + 'M'
  : '$' + Math.round(value / 1000) + 'k';

// A simple drawing per type, so the theme needs no photos
const art = {
  condo: '<path d="M110 200V40h60v160zM180 200V80h50v120z" fill="currentColor"/><g fill="var(--night)"><rect x="122" y="56" width="10" height="8"/><rect x="148" y="56" width="10" height="8"/><rect x="122" y="80" width="10" height="8"/><rect x="148" y="104" width="10" height="8"/><rect x="192" y="96" width="10" height="8"/><rect x="210" y="120" width="10" height="8"/></g>',
  townhome: '<path d="M70 200v-90l40-30 40 30v90zM150 200v-90l40-30 40 30v90z" fill="currentColor"/><g fill="var(--night)"><rect x="100" y="160" width="20" height="40"/><rect x="180" y="160" width="20" height="40"/><rect x="92" y="118" width="12" height="14"/><rect x="172" y="118" width="12" height="14"/></g>',
  house: '<path d="M60 200v-70h100v-40h120v110z" fill="currentColor"/><g fill="var(--night)"><rect x="176" y="106" width="88" height="34"/><rect x="80" y="150" width="60" height="26"/></g>',
};
const card = item => `
  <article class="listing">
    <div class="listing-art" aria-hidden="true"><svg viewBox="0 0 320 200">${art[item.type]}<path d="M0 200h320" stroke="currentColor" stroke-width="4"/></svg><span class="tag">${item.area}</span></div>
    <div class="listing-body">
      <p class="price">${money(item.price)}</p>
      <h3>${item.name}</h3>
      <p class="specs">${item.beds} bd · ${item.baths} ba · ${item.sqft.toLocaleString('en-US')} sq ft</p>
      <p class="note">${item.note}</p>
      <a class="text-link" href="contact.html?listing=${item.id}">Book a showing</a>
    </div>
  </article>`;

const featured = document.querySelector('[data-featured]');
if (featured) featured.innerHTML = listings.filter(item => item.featured).map(card).join('');

// Listing search: filters come from the form, and from the home page's quick search in the URL
const filters = document.querySelector('[data-filters]');
if (filters) {
  const params = new URLSearchParams(location.search);
  ['type', 'max', 'beds'].forEach(name => { if (params.has(name)) filters.elements[name].value = params.get(name); });
  const grid = document.querySelector('[data-listings]');
  const count = document.querySelector('[data-count]');
  const empty = document.querySelector('[data-empty]');
  const render = () => {
    const f = Object.fromEntries(new FormData(filters));
    const shown = listings
      .filter(item => (!f.type || item.type === f.type) && (!f.max || item.price <= Number(f.max)) && item.beds >= Number(f.beds))
      .sort((a, b) => f.sort === 'low' ? a.price - b.price : f.sort === 'high' ? b.price - a.price : b.listed.localeCompare(a.listed));
    grid.innerHTML = shown.map(card).join('');
    count.textContent = `${shown.length} ${shown.length === 1 ? 'residence' : 'residences'}`;
    empty.hidden = shown.length > 0;
  };
  filters.addEventListener('change', render);
  render();
}

// Contact: a listing chosen on the listings page arrives as ?listing=<id>; a valuation link as ?topic=valuation
const contactForm = document.querySelector('[data-contact-form]');
if (contactForm) {
  const params = new URLSearchParams(location.search);
  const chosen = listings.find(item => item.id === params.get('listing'));
  if (chosen) {
    contactForm.querySelector('[data-listing-field]').value = chosen.name;
    const box = contactForm.querySelector('[data-chosen]');
    box.innerHTML = `<strong></strong><span></span>`;
    box.querySelector('strong').textContent = chosen.name;
    box.querySelector('span').textContent = `${money(chosen.price)} · ${chosen.beds} bd · ${chosen.area}`;
    box.hidden = false;
  }
  if (params.get('topic')) {
    const radio = contactForm.querySelector(`input[name="topic"][value="${CSS.escape(params.get('topic'))}"]`);
    if (radio) radio.checked = true;
  }
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const done = contactForm.querySelector('[data-contact-done]');
    done.textContent = `Thank you, ${data.get('name').split(' ')[0]}. We'll confirm ${data.get('listing') ? 'your showing of ' + data.get('listing') : 'a time'} within two hours.`;
    done.hidden = false;
  });
}

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
