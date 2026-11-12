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

// Monthly or annual prices: each .plan-price has data-monthly and data-annual (the yearly total)
const notes = {
  monthly: 'Monthly memberships, no long-term contract. Cancel with 30 days\' notice.',
  annual: 'Paid once a year: 12 months for the price of 10. Freeze up to 4 weeks a year.',
};
function showBilling(period) {
  document.querySelectorAll('[data-billing]').forEach(b => b.setAttribute('aria-pressed', b.dataset.billing === period));
  document.querySelectorAll('.plan-price').forEach(el => {
    const amount = Number(el.dataset[period]);
    el.textContent = period === 'annual'
      ? `$${amount.toLocaleString('en-US')}/yr · $${Math.round(amount / 12)}/mo`
      : `$${amount}/mo`;
  });
  const note = document.querySelector('[data-billing-note]');
  if (note) note.textContent = notes[period];
}
document.querySelectorAll('[data-billing]').forEach(b => b.addEventListener('click', () => showBilling(b.dataset.billing)));
showBilling('monthly');

// Free pass form (demo only: connect it to your CRM or form service)
const form = document.querySelector('[data-pass-form]');
form?.addEventListener('submit', event => {
  event.preventDefault();
  form.querySelector('[data-pass-note]').textContent = `You're in, ${form.name.value.split(' ')[0]}. A coach will text you within one working day.`;
  form.reset();
});

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
