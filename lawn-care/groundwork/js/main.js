// Mobile navigation
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
});

// Proposal request: replace with your form handler or a form service
document.querySelector('[data-proposal]')?.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const company = form.elements.company.value.trim() || 'your site';
  form.querySelector('.form-success').textContent = `Thanks. An account manager will call within one business day to book a site walk for ${company}.`;
  form.reset();
});

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
