const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');

menuToggle?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

document.querySelector('[data-quote-form]')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const firstName = form.elements.firstName.value.trim() || 'there';
  form.querySelector('.form-success').textContent = `Thanks, ${firstName}! Your quote request is on its way.`;
  form.reset();
});
