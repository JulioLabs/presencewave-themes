const menuButton = document.querySelector('.menu-button');
const menu = document.querySelector('.nav');

menuButton?.addEventListener('click', () => {
  const opened = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', opened);
  menuButton.setAttribute('aria-label', opened ? 'Close menu' : 'Open menu');
});

menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menu.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

document.querySelector('[data-consult-form]')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = form.elements.name.value.trim().split(' ')[0] || 'there';
  form.querySelector('.success').textContent = `Thank you, ${name}. We’ll be in touch soon.`;
  form.reset();
});
