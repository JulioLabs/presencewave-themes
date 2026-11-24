// Mobile navigation
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
});

// Color consultation estimate: replace the prices with your own
const basePrice = { refresh: 150, balayage: 260, darker: 170, big: 320 };
const lengthFactor = { short: 0.85, medium: 1, long: 1.2, xlong: 1.4 };
const densityFactor = { fine: 0.9, medium: 1, thick: 1.15 };
// Extra work for the hair's history, as [extra price, extra visits]
const history = {
  natural: { refresh: [0, 0], balayage: [0, 0], darker: [0, 0], big: [0, 1] },
  colored: { refresh: [0, 0], balayage: [40, 0], darker: [0, 0], big: [80, 1] },
  boxdye: { refresh: [40, 0], balayage: [140, 1], darker: [20, 0], big: [200, 2] },
  lightened: { refresh: [0, 0], balayage: [20, 0], darker: [60, 0], big: [60, 1] },
};
const advice = {
  natural: 'Natural hair takes color beautifully. Expect the most predictable result.',
  colored: 'We\'ll work with your existing color and plan the grow-out from here.',
  boxdye: 'Box dye builds up and lifts unevenly, so we always strand test first. Allow extra time.',
  lightened: 'Your hair has been lightened before, so we\'ll use a bond builder throughout.',
};

const form = document.querySelector('[data-consult-form]');
if (form) {
  const rangeEl = document.querySelector('[data-range]');
  const visitsEl = document.querySelector('[data-visits]');
  const adviceEl = document.querySelector('[data-advice]');
  const round = value => Math.round(value / 10) * 10;
  const update = () => {
    const data = new FormData(form);
    const current = data.get('current');
    const goal = data.get('goal');
    const [extra, extraVisits] = history[current][goal];
    const middle = basePrice[goal] * lengthFactor[data.get('length')] * densityFactor[data.get('density')] + extra;
    const visits = 1 + extraVisits;
    rangeEl.textContent = `$${round(middle * 0.9)} – $${round(middle * 1.15)}`;
    visitsEl.textContent = visits === 1 ? 'Usually one visit' : `Usually ${visits} visits, 4–6 weeks apart`;
    adviceEl.textContent = advice[current];
  };
  form.addEventListener('change', update);
  update();

  // Request (demo: shows a confirmation; connect it to your booking tool or a PresenceWave form)
  const request = document.querySelector('[data-request]');
  request?.addEventListener('submit', event => {
    event.preventDefault();
    document.querySelector('[data-request-result]').textContent = `Thank you, ${new FormData(request).get('name')}. We'll email you two consultation times within a day.`;
    request.reset();
  });
}

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
