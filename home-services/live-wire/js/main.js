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

// Project estimator: replace with your own projects and typical prices (installed, before rebates)
const projects = [
  { id: 'ev', name: 'Level 2 EV charger', note: 'Garage or driveway, up to 50 ft from the panel', min: 900, max: 1800, days: 0.5 },
  { id: 'panel', name: 'Panel upgrade to 200 amps', note: 'New panel, breakers and grounding', min: 2400, max: 4200, days: 1 },
  { id: 'lights', name: 'Recessed lighting', note: 'Six LED lights on a dimmer', min: 750, max: 1350, days: 0.5 },
  { id: 'generator', name: 'Whole-home generator', note: '22 kW standby with a transfer switch', min: 9500, max: 14500, days: 2 },
  { id: 'circuit', name: 'New dedicated circuit', note: 'For a heat pump, hot tub or induction range', min: 450, max: 950, days: 0.5 },
  { id: 'gfci', name: 'GFCI and USB outlet refresh', note: 'Kitchen, baths and outdoors, up to 10 outlets', min: 380, max: 700, days: 0.5 },
];

const optionList = document.querySelector('[data-options]');
const money = n => '$' + n.toLocaleString('en-US');

function render() {
  const picked = projects.filter(p => optionList.querySelector(`input[value="${p.id}"]`).checked);
  const min = picked.reduce((sum, p) => sum + p.min, 0);
  const max = picked.reduce((sum, p) => sum + p.max, 0);
  const days = picked.reduce((sum, p) => sum + p.days, 0);
  document.querySelector('[data-range]').textContent = picked.length ? `${money(min)}–${money(max)}` : '$0';
  document.querySelector('[data-detail]').textContent = picked.length
    ? `About ${days <= 0.5 ? 'half a day' : days === 1 ? '1 day' : Math.ceil(days) + ' days'} of work. Permit and inspection included.`
    : 'Pick at least one project.';
  document.querySelector('[data-picked]').innerHTML = picked.map(p => `<li>${p.name}<span>${money(p.min)}–${money(p.max)}</span></li>`).join('');
  document.querySelector('[data-meter]').style.width = Math.min(100, (max / 20000) * 100) + '%';
  document.querySelector('[data-estimate-submit]').disabled = picked.length === 0;
}

if (optionList) {
  optionList.innerHTML = projects.map(p => `
    <label class="option">
      <input type="checkbox" name="project" value="${p.id}">
      <span class="box" aria-hidden="true"></span>
      <span><strong>${p.name}</strong><small>${p.note}</small></span>
      <span class="price">${money(p.min)}–${money(p.max)}</span>
    </label>`).join('');
  optionList.addEventListener('change', render);
  optionList.querySelector('input[value="ev"]').checked = true;
  render();
}

const estimateForm = document.querySelector('[data-estimate-form]');
estimateForm?.addEventListener('submit', event => {
  event.preventDefault();
  document.querySelector('[data-estimate-note]').textContent = `Thanks! We'll email a written estimate to ${estimateForm.email.value} and call to book your free visit.`;
  estimateForm.reset();
});

// Footer year
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
