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

// Service area: replace with your own neighborhoods and ZIP codes. eta = typical arrival in minutes
const serviceArea = [
  { name: 'Downtown', zips: ['43215', '43216'], eta: 35 },
  { name: 'German Village', zips: ['43206'], eta: 40 },
  { name: 'Clintonville', zips: ['43202', '43214'], eta: 45 },
  { name: 'Bexley', zips: ['43209'], eta: 45 },
  { name: 'Upper Arlington', zips: ['43220', '43221'], eta: 50 },
  { name: 'Worthington', zips: ['43085'], eta: 55 },
  { name: 'Westerville', zips: ['43081', '43082'], eta: 60 },
  { name: 'Grove City', zips: ['43123'], eta: 60 },
];

const areaList = document.querySelector('[data-area-list]');
if (areaList) {
  areaList.innerHTML = serviceArea.map(a => `<li>${a.name}<span>~${a.eta} min</span></li>`).join('');
}

const zipForm = document.querySelector('[data-zip-form]');
const zipResult = document.querySelector('[data-zip-result]');
zipForm?.addEventListener('submit', event => {
  event.preventDefault();
  const zip = zipForm.zip.value.trim();
  zipResult.classList.remove('is-yes', 'is-no');
  if (!/^\d{5}$/.test(zip)) {
    zipResult.innerHTML = '<p>Please enter a 5-digit ZIP code.</p>';
    return;
  }
  const area = serviceArea.find(a => a.zips.includes(zip));
  if (area) {
    zipResult.classList.add('is-yes');
    zipResult.innerHTML = `<strong>Yes, we serve ${area.name}.</strong><p>A technician can usually be there in about ${area.eta} minutes for emergencies, or pick a two-hour window.</p><a class="text-link" href="#request">Request service</a>`;
    const requestZip = document.querySelector('[data-request-form] [name="zip"]');
    if (requestZip) requestZip.value = zip;
  } else {
    zipResult.classList.add('is-no');
    zipResult.innerHTML = `<strong>${zip} is just outside our area.</strong><p>Call us anyway: for bigger jobs we often travel further.</p><a class="text-link" href="tel:+15550142200">Call (555) 014-2200</a>`;
  }
});

// Request form: issues per trade. Replace with the jobs you take.
const issues = {
  'Plumbing': ['Leak or burst pipe', 'Clogged drain', 'No hot water', 'Running or clogged toilet', 'Sewer backup', 'Something else'],
  'Heating & cooling': ['No heat', 'No cooling', 'Strange noise or smell', 'Thermostat problem', 'Seasonal tune-up', 'Something else'],
  'Electrical': ['Power out in part of the house', 'Breaker keeps tripping', 'Sparking or hot outlet', 'New outlet or light', 'EV charger', 'Something else'],
};

const requestForm = document.querySelector('[data-request-form]');
const issueSelect = document.querySelector('[data-issue-select]');
const note = document.querySelector('[data-request-note]');

function fillIssues(trade) {
  issueSelect.innerHTML = issues[trade].map(i => `<option>${i}</option>`).join('');
}

function pickTrade(trade) {
  const input = requestForm?.querySelector(`input[name="trade"][value="${trade}"]`);
  if (input) {
    input.checked = true;
    fillIssues(trade);
  }
}

if (requestForm) {
  fillIssues(requestForm.trade.value);
  requestForm.querySelectorAll('input[name="trade"]').forEach(input => input.addEventListener('change', () => fillIssues(input.value)));
  requestForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(requestForm);
    const name = (data.get('name') || '').toString().split(' ')[0];
    if (data.get('urgency') === 'emergency') {
      note.classList.add('is-urgent');
      note.textContent = `Thanks ${name}. For an emergency, please also call (555) 014-2200 now so we can send the nearest technician.`;
    } else {
      note.classList.remove('is-urgent');
      note.textContent = `Thanks ${name}! We'll call you within 15 minutes to confirm your ${data.get('trade').toLowerCase()} visit.`;
    }
    requestForm.reset();
    fillIssues(requestForm.trade.value);
  });
}

document.querySelectorAll('[data-trade-link]').forEach(link => link.addEventListener('click', () => pickTrade(link.dataset.tradeLink)));

// Footer year
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
