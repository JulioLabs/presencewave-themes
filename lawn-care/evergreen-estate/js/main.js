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

// Before / after reveal
const reveal = document.querySelector('[data-reveal]');
reveal?.querySelector('.reveal-range').addEventListener('input', event => {
  const value = event.target.value;
  reveal.querySelector('.after').style.clipPath = `inset(0 0 0 ${value}%)`;
  reveal.querySelector('.reveal-divider').style.left = `${value}%`;
});

// Consultation request: replace with your form handler or a form service
document.querySelector('[data-consult]')?.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = form.elements.name.value.trim().split(' ')[0] || 'there';
  form.querySelector('.form-success').textContent = `Thank you, ${name}. Our office will be in touch within one working day to arrange your visit.`;
  form.reset();
});

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
