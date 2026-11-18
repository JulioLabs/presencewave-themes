// Mobile navigation
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
});

// Private event estimator: replace with your own menus and prices (per guest unless flat)
const eventOptions = {
  tiers: [
    { name: 'Four courses', note: 'A shorter seasonal menu', price: 85 },
    { name: 'Tasting menu', note: 'Our eight courses', price: 125 },
    { name: "Chef's table", note: 'Ten courses, cooked in front of you', price: 165 },
  ],
  drinks: [
    { name: 'By the glass', note: 'Charged on the night', price: 0 },
    { name: 'Wine pairing', note: 'Six pours', price: 85 },
    { name: 'Zero-proof pairing', note: 'House ferments and teas', price: 55 },
  ],
  extras: [
    { name: 'Welcome sparkling and canapés', price: 18, perGuest: true },
    { name: 'Printed menus with your names', price: 120, perGuest: false },
    { name: 'Celebration cake', price: 9, perGuest: true },
  ],
  serviceRate: 0.2,
  depositRate: 0.3,
};

const estimator = document.querySelector('[data-estimator]');
if (estimator) {
  const money = v => `$${Math.round(v).toLocaleString('en-US')}`;
  const tile = (group, item, i, checked) => `<label class="tier"><input type="radio" name="${group}" value="${i}" ${checked ? 'checked' : ''}><span><strong>${item.name}</strong><em>${item.price ? `${money(item.price)} a guest` : 'Pay as you go'}</em><small>${item.note}</small></span></label>`;
  estimator.querySelector('[data-tiers]').innerHTML = eventOptions.tiers.map((t, i) => tile('tier', t, i, i === 1)).join('');
  estimator.querySelector('[data-drinks]').innerHTML = eventOptions.drinks.map((d, i) => tile('drinks', d, i, i === 1)).join('');
  estimator.querySelector('[data-extras]').innerHTML = eventOptions.extras.map((e, i) => `<label class="extra"><input type="checkbox" name="extras" value="${i}" ${i === 0 ? 'checked' : ''}><span>${e.name}<em>${money(e.price)}${e.perGuest ? ' a guest' : ''}</em></span></label>`).join('');

  const guestsInput = estimator.querySelector('[data-guests]');
  const guestsOut = estimator.querySelector('[data-guests-out]');
  const total = document.querySelector('[data-est-total]');
  const lines = document.querySelector('[data-est-lines]');
  const deposit = document.querySelector('[data-est-deposit]');
  const update = () => {
    const guests = Number(guestsInput.value);
    guestsOut.textContent = guests;
    const tier = eventOptions.tiers[estimator.querySelector('input[name="tier"]:checked').value];
    const drinks = eventOptions.drinks[estimator.querySelector('input[name="drinks"]:checked').value];
    const extras = [...estimator.querySelectorAll('input[name="extras"]:checked')].map(i => eventOptions.extras[i.value]);
    const rows = [[`${tier.name} × ${guests}`, tier.price * guests]];
    if (drinks.price) rows.push([`${drinks.name} × ${guests}`, drinks.price * guests]);
    extras.forEach(e => rows.push([e.name, e.perGuest ? e.price * guests : e.price]));
    const subtotal = rows.reduce((sum, [, v]) => sum + v, 0);
    rows.push([`Service (${eventOptions.serviceRate * 100}%)`, subtotal * eventOptions.serviceRate]);
    const sum = subtotal * (1 + eventOptions.serviceRate);
    lines.innerHTML = rows.map(([n, v]) => `<li><span>${n}</span><span>${money(v)}</span></li>`).join('');
    total.textContent = money(sum);
    deposit.textContent = `A ${eventOptions.depositRate * 100}% deposit of ${money(sum * eventOptions.depositRate)} holds your date.`;
  };
  estimator.addEventListener('input', update);
  update();
}

const reserve = document.querySelector('[data-reserve]');
reserve?.addEventListener('submit', event => {
  event.preventDefault();
  reserve.querySelector('[data-reserve-note]').textContent = `Thank you, ${reserve.name.value.split(' ')[0]}. We'll email ${reserve.email.value} within a day to confirm and take the deposit.`;
});

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
