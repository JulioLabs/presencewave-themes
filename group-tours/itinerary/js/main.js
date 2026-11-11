// Mobile navigation
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
});

// Reserve with deposit: change these to your own prices
const pricing = { price: 5890, deposit: 750, singleSupplement: 990 };
const reserve = document.querySelector('[data-reserve]');
const money = n => `$${n.toLocaleString('en-US')}`;

function updateDeposit() {
  const guests = Number(reserve.elements.guests.value);
  const single = reserve.elements.room.value === 'single';
  const total = guests * pricing.price + (single ? guests * pricing.singleSupplement : 0);
  const deposit = guests * pricing.deposit;
  reserve.querySelector('[data-deposit]').textContent = money(deposit);
  reserve.querySelector('[data-balance]').textContent = `Journey total ${money(total)}. Balance of ${money(total - deposit)} due 90 days before departure.`;
}

reserve?.addEventListener('input', updateDeposit);
reserve?.addEventListener('submit', event => {
  event.preventDefault();
  const name = reserve.elements.name.value.trim().split(' ')[0] || 'there';
  const waitlist = reserve.elements.departure.value === 'may';
  reserve.querySelector('.form-success').textContent = waitlist
    ? `Thank you, ${name}. You're on the waitlist; we'll write as soon as a place opens, before taking any deposit.`
    : `Thank you, ${name}. Your places are held. We'll email the secure deposit link within the hour.`;
});
if (reserve) updateDeposit();

const contact = document.querySelector('[data-contact]');
contact?.addEventListener('submit', event => {
  event.preventDefault();
  const name = contact.elements.name.value.trim().split(' ')[0] || 'there';
  contact.querySelector('.form-success').textContent = `Thank you, ${name}. A journey planner will reply today.`;
});

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
