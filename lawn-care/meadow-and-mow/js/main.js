// Mobile navigation
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
});

// Service area check: list the ZIP codes you serve, and the town name to show for each
const serviceArea = { '10101': 'Maplewood', '10102': 'Brookfield', '10103': 'Cedar Hill', '10104': 'Willow Park', '10105': 'Oak Ridge' };
document.querySelector('[data-zip]')?.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const zip = form.elements.zip.value.trim();
  const result = form.querySelector('.zip-result');
  const town = serviceArea[zip];
  result.className = 'zip-result ' + (town ? 'yes' : 'no');
  result.textContent = town
    ? `Yay! We mow in ${town} every week. Your first cut is half price.`
    : `We're not in ${zip} yet. Call us and we'll see what we can do!`;
});

// Contact form: replace with your form handler or a form service
document.querySelector('[data-contact]')?.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = form.elements.name.value.trim().split(' ')[0] || 'there';
  form.querySelector('.form-success').textContent = `Thanks, ${name}! We'll text you a quote within a few hours.`;
  form.reset();
});

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
