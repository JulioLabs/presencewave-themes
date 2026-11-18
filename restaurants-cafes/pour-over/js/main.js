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

// Subscription builder: replace with your own coffees and prices.
// price = price for a 250g bag; size multiplies it; frequency gives a discount and deliveries per month.
const subscription = {
  coffee: [
    { label: "Roaster's choice", note: 'A new single origin each time', price: 19 },
    { label: 'House Espresso', note: 'Chocolate and hazelnut', price: 17 },
    { label: 'Decaf', note: 'Mountain water process', price: 19 },
  ],
  size: [
    { label: '250g', note: 'About 16 cups', factor: 1 },
    { label: '500g', note: 'About 33 cups', factor: 1.85 },
    { label: '1kg', note: 'For the office', factor: 3.5 },
  ],
  grind: [
    { label: 'Whole bean' }, { label: 'Espresso' }, { label: 'Filter' }, { label: 'French press' },
  ],
  frequency: [
    { label: 'Week', note: '10% off', discount: 0.1, perMonth: 4.33 },
    { label: '2 weeks', note: '5% off', discount: 0.05, perMonth: 2.17 },
    { label: 'Month', note: 'Full price', discount: 0, perMonth: 1 },
  ],
};
const choice = { coffee: 0, size: 1, grind: 0, frequency: 1 };

const form = document.querySelector('[data-sub-form]');
if (form) {
  Object.entries(subscription).forEach(([group, items]) => {
    form.querySelector(`[data-group="${group}"]`).innerHTML = items.map((item, i) =>
      `<label class="seg-opt"><input type="radio" name="${group}" value="${i}" ${choice[group] === i ? 'checked' : ''}><span>${item.label}${item.note ? `<small>${item.note}</small>` : ''}</span></label>`).join('');
  });
  const main = document.querySelector('[data-sub-main]');
  const price = document.querySelector('[data-sub-price]');
  const month = document.querySelector('[data-sub-month]');
  const update = () => {
    Object.keys(choice).forEach(group => { choice[group] = Number(form.querySelector(`input[name="${group}"]:checked`).value); });
    const coffee = subscription.coffee[choice.coffee];
    const size = subscription.size[choice.size];
    const grind = subscription.grind[choice.grind];
    const frequency = subscription.frequency[choice.frequency];
    const each = coffee.price * size.factor * (1 - frequency.discount);
    main.textContent = `${size.label} of ${coffee.label}, ${grind.label.toLowerCase()}, every ${frequency.label.toLowerCase()}`;
    price.textContent = `$${each.toFixed(2)}`;
    month.textContent = `About $${Math.round(each * frequency.perMonth)} a month, shipped free.`;
  };
  form.addEventListener('change', update);
  update();
}

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
