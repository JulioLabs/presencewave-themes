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

// Mortgage payment calculator. PMI (mortgage insurance) applies below 20% down, at PMI_RATE of the loan a year.
const PMI_RATE = 0.006;
const money = value => '$' + Math.round(value).toLocaleString('en-US');
const form = document.querySelector('[data-calc-form]');
const parts = [
  { key: 'pi', label: 'Principal and interest', color: 'var(--navy)' },
  { key: 'tax', label: 'Property tax', color: 'var(--amber)' },
  { key: 'insurance', label: 'Home insurance', color: 'var(--sky-dark)' },
  { key: 'pmi', label: 'Mortgage insurance', color: 'var(--coral)' },
  { key: 'hoa', label: 'HOA', color: 'var(--muted)' },
];
const clamp = (value, min, max) => Math.min(Math.max(Number(value) || 0, min), max);

function calculate() {
  const f = Object.fromEntries(new FormData(form));
  const price = clamp(f.price, 50000, 5000000);
  const downPct = clamp(f.down, 0, 100) / 100;
  const loan = price * (1 - downPct);
  const months = Number(f.term) * 12;
  const r = clamp(f.rate, 0, 30) / 100 / 12;
  const pi = r ? loan * r / (1 - Math.pow(1 + r, -months)) : loan / months;
  const monthly = {
    pi,
    tax: price * clamp(f.tax, 0, 10) / 100 / 12,
    insurance: clamp(f.insurance, 0, 100000) / 12,
    pmi: downPct < 0.2 ? loan * PMI_RATE / 12 : 0,
    hoa: clamp(f.hoa, 0, 10000),
  };
  const total = Object.values(monthly).reduce((a, b) => a + b, 0);

  form.querySelector('[data-out="price"]').textContent = money(price);
  form.querySelector('[data-out="down"]').textContent = `${Math.round(downPct * 100)}% · ${money(price * downPct)}`;
  document.querySelector('[data-total]').textContent = money(total);
  const shown = parts.filter(part => monthly[part.key] > 0.5);
  document.querySelector('[data-bar]').innerHTML = shown.map(part => `<span style="flex:${monthly[part.key]};background:${part.color}"></span>`).join('');
  document.querySelector('[data-breakdown]').innerHTML = shown.map(part => `<li><span class="swatch" style="background:${part.color}"></span>${part.label}<strong>${money(monthly[part.key])}</strong></li>`).join('');
  document.querySelector('[data-facts]').innerHTML = `
    <div><dt>Loan amount</dt><dd>${money(loan)}</dd></div>
    <div><dt>Cash for the down payment</dt><dd>${money(price * downPct)}</dd></div>
    <div><dt>Closing costs, roughly</dt><dd>${money(price * 0.02)} – ${money(price * 0.04)}</dd></div>`;
  return price;
}

if (form) {
  form.addEventListener('input', calculate);
  calculate();
  // The price the visitor settled on goes into the consultation form
  document.querySelector('[data-consult-link]')?.addEventListener('click', () => {
    const field = document.querySelector('[data-budget-field]');
    if (field) field.value = `Around ${money(calculate())}`;
  });
}

// Consultation request (demo: shows a confirmation; connect it to your calendar or a PresenceWave form)
document.querySelector('[data-consult-form]')?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.target);
  const done = event.target.querySelector('[data-consult-done]');
  done.textContent = `Thanks, ${data.get('name').split(' ')[0]}! I'll email you times for a call this week, so we can plan a purchase ${data.get('when')}.`;
  done.hidden = false;
});

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
