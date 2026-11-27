// Mobile navigation
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
});

// Smile estimator: replace with your own treatments. low and high are your typical price range;
// perTooth multiplies by the number of teeth chosen.
const treatments = [
  { id: 'whitening-office', name: 'In-office whitening', note: 'One 90-minute visit', low: 450, high: 650 },
  { id: 'whitening-home', name: 'Take-home whitening trays', note: 'Two weeks at home', low: 250, high: 350 },
  { id: 'aligners-mild', name: 'Clear aligners, mild', note: 'Small gaps or crowding, 6 to 9 months', low: 2800, high: 3800 },
  { id: 'aligners-full', name: 'Clear aligners, full', note: 'Bigger changes, 12 to 18 months', low: 4500, high: 6000 },
  { id: 'veneers', name: 'Porcelain veneers', note: 'Price per tooth', low: 1100, high: 1600, perTooth: true },
  { id: 'bonding', name: 'Cosmetic bonding', note: 'Price per tooth', low: 300, high: 500, perTooth: true },
];
const MONTHS = 24;          // 0% financing term
const CONSULT_CREDIT = 0;   // set an amount if your consult fee is credited to treatment

const money = value => `$${Math.round(value).toLocaleString('en-US')}`;
const form = document.querySelector('[data-estimator]');
const options = document.querySelector('[data-options]');
const teethBox = document.querySelector('[data-teeth]');
const teethCount = document.querySelector('[data-teeth-count]');
const estimate = document.querySelector('[data-estimate]');
let teeth = 4;

const update = () => {
  if (!form || !estimate) return;
  const chosen = [...form.querySelectorAll('input[name=treatment]:checked')].map(input => treatments.find(t => t.id === input.value));
  const needsTeeth = chosen.some(t => t.perTooth);
  teethBox.hidden = !needsTeeth;
  teethCount.textContent = teeth;
  if (!chosen.length) {
    estimate.innerHTML = '<p class="estimate-label">Your estimate</p><p class="estimate-empty">Pick one or more treatments to see a price range.</p>';
    return;
  }
  const low = chosen.reduce((sum, t) => sum + t.low * (t.perTooth ? teeth : 1), 0) - CONSULT_CREDIT;
  const high = chosen.reduce((sum, t) => sum + t.high * (t.perTooth ? teeth : 1), 0) - CONSULT_CREDIT;
  estimate.innerHTML = `
    <p class="estimate-label">Your estimate</p>
    <p class="estimate-range">${money(low)} – ${money(high)}</p>
    <p class="estimate-monthly">or from <strong>${money(low / MONTHS)}/month</strong> for ${MONTHS} months at 0%</p>
    <ul>${chosen.map(t => `<li><span>${t.name}${t.perTooth ? ` × ${teeth}` : ''}</span><span>${money(t.low * (t.perTooth ? teeth : 1))}+</span></li>`).join('')}</ul>
    <a class="button button-wide" href="#book">Book a free consult</a>
    <p class="estimate-note">A typical range, not a quote. Your plan and price are confirmed at your consult.</p>`;
};

if (options) {
  options.innerHTML = treatments.map((t, i) => `<label class="option"><input type="checkbox" name="treatment" value="${t.id}"${i === 0 ? ' checked' : ''}><span><strong>${t.name}</strong><small>${t.note} · ${money(t.low)} – ${money(t.high)}</small></span></label>`).join('');
  form.addEventListener('change', update);
  document.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
    teeth = Math.min(10, Math.max(1, teeth + Number(button.dataset.step)));
    update();
  }));
  update();
}

// Consult request (demo: shows a confirmation; connect it to your scheduling tool or a PresenceWave form)
document.querySelector('[data-consult]')?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.target);
  const done = event.target.querySelector('[data-consult-done]');
  done.textContent = `Thank you, ${data.get('name').split(' ')[0]}. We'll be in touch within one business day to confirm your consult.`;
  done.hidden = false;
});

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
