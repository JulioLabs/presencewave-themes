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

// Service area check: replace the list with the ZIP code prefixes you serve
const servedPrefixes = ['100', '101', '102', '103', '104'];
document.querySelector('[data-area-check]')?.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const zip = form.elements.zip.value.trim();
  const covered = servedPrefixes.some(prefix => zip.startsWith(prefix));
  form.querySelector('.area-result').textContent = covered
    ? `Good news: we mow in ${zip} every week. Get your price below.`
    : `We're not in ${zip} yet, but leave your details below and we'll let you know.`;
});

// Quote builder: prices per visit for a 1,000 sq ft lawn, and visits per month
const rates = { mowing: 8, feeding: 6, aeration: 3, cleanup: 4 };
const visits = { weekly: 4.3, biweekly: 2.2, monthly: 1 };
const quote = document.querySelector('[data-quote]');

function updateEstimate() {
  const size = Number(quote.elements.size.value);
  quote.elements.sizeLabel.value = `${size.toLocaleString('en-US')} sq ft`;
  const services = [...quote.querySelectorAll('[name="service"]:checked')].map(input => input.value);
  const frequency = quote.elements.frequency.value;
  const perThousand = services.reduce((sum, service) => sum + rates[service], 0);
  const mowingVisits = services.includes('mowing') ? visits[frequency] : 1;
  const monthly = Math.max(35, perThousand * (size / 1000) * mowingVisits / 1.2);
  const low = Math.round(monthly * 0.95);
  const high = Math.round(monthly * 1.05);
  quote.querySelector('[data-estimate]').textContent = services.length ? `$${low} – $${high}` : 'Pick a service';
}

quote?.addEventListener('input', updateEstimate);
quote?.addEventListener('submit', event => {
  event.preventDefault();
  const name = quote.elements.name.value.trim().split(' ')[0] || 'there';
  quote.querySelector('.form-success').textContent = `Thanks, ${name}. We'll confirm your first cut by email today.`;
});
if (quote) updateEstimate();

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
