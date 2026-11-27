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

// Insurance check: replace with the plans you work with.
// status: 'in' (in network), 'file' (out of network, we file the claim for you), 'no' (not accepted)
const plans = [
  { name: 'Delta Dental PPO', status: 'in' },
  { name: 'Delta Dental Premier', status: 'in' },
  { name: 'Cigna Dental PPO', status: 'in' },
  { name: 'MetLife PDP', status: 'in' },
  { name: 'Aetna Dental PPO', status: 'in' },
  { name: 'Guardian Dental', status: 'file' },
  { name: 'United Concordia', status: 'file' },
  { name: 'Humana Dental', status: 'file' },
  { name: 'Ameritas', status: 'file' },
  { name: 'Delta Dental HMO', status: 'no' },
  { name: 'Cigna DHMO', status: 'no' },
];
const PHONE = '(555) 014-2300';
const NO_INSURANCE = 'No insurance? Our new-patient exam, cleaning and X-rays are $99.';

const messages = {
  in: plan => ({ title: `Good news: we're in network with ${plan}.`, text: 'Bring your card to your first visit and we\'ll handle the rest.', tone: 'ok' }),
  file: plan => ({ title: `We're out of network with ${plan}, but we'll file it for you.`, text: 'Most patients still get much of their visit covered. We\'ll check your benefits before treatment.', tone: 'maybe' }),
  no: plan => ({ title: `We can't take ${plan}, unfortunately.`, text: `HMO plans need an in-network office. ${NO_INSURANCE}`, tone: 'no' }),
  unknown: plan => ({ title: `We couldn't find "${plan}".`, text: `Call us at ${PHONE} and we'll check your benefits in a couple of minutes.`, tone: 'maybe' }),
};

const normalize = text => text.toLowerCase().replace(/[^a-z0-9]/g, '');
const planList = document.querySelector('[data-plan-list]');
if (planList) planList.innerHTML = plans.map(plan => `<option value="${plan.name}"></option>`).join('');

const result = document.querySelector('[data-insurance-result]');
document.querySelector('[data-insurance-form]')?.addEventListener('submit', event => {
  event.preventDefault();
  const typed = new FormData(event.target).get('plan').trim();
  if (!typed) {
    result.innerHTML = `<p class="result-hint">${NO_INSURANCE}</p>`;
    return;
  }
  const key = normalize(typed);
  const match = plans.find(plan => normalize(plan.name) === key) || plans.find(plan => normalize(plan.name).includes(key));
  const message = match ? messages[match.status](match.name) : messages.unknown(typed);
  result.innerHTML = `<div class="result result-${message.tone}"><strong></strong><p></p><a class="text-link" href="#request">Request a visit</a></div>`;
  result.querySelector('strong').textContent = message.title;
  result.querySelector('p').textContent = message.text;
});

// New-patient request (demo: shows a confirmation; connect it to your scheduling tool or a PresenceWave form)
document.querySelector('[data-request-form]')?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.target);
  const times = data.getAll('time');
  const done = event.target.querySelector('[data-request-done]');
  done.textContent = `Thanks, ${data.get('name').split(' ')[0]}! We'll call or text within one business day about your ${data.get('visit').toLowerCase()}${times.length ? ` (${times.join(', ').toLowerCase()})` : ''}.`;
  done.hidden = false;
});

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
