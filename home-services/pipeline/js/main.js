// Mobile navigation
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
});

// Price guide: replace with your own jobs and prices
const jobs = [
  { id: 'drain', name: 'Clogged drain', min: 149, max: 249, time: 'About 1 hour', includes: ['Clearing with a cable machine', 'Flow test afterwards', '30-day no-clog guarantee'] },
  { id: 'heater', name: 'Water heater repair', min: 189, max: 389, time: '1 to 2 hours', includes: ['Thermostat, element or valve', 'Flush and safety check', '1-year parts and labor guarantee'] },
  { id: 'heater-new', name: 'New water heater', min: 1450, max: 2200, time: 'Half a day', includes: ['40 or 50 gallon tank, installed', 'Haul-away of the old one', 'Permit and code updates'] },
  { id: 'leak', name: 'Leak repair', min: 129, max: 329, time: '1 to 2 hours', includes: ['Finding the leak', 'Replacing the pipe or fitting', 'Dry-out advice'] },
  { id: 'toilet', name: 'Toilet repair', min: 119, max: 229, time: 'About 1 hour', includes: ['Fill valve, flapper or seal', 'Leak test', 'Old parts taken away'] },
  { id: 'faucet', name: 'Faucet replacement', min: 179, max: 299, time: 'About 1 hour', includes: ['Install of your faucet or ours', 'New supply lines', 'Leak test'] },
  { id: 'disposal', name: 'Garbage disposal', min: 249, max: 449, time: 'About 1 hour', includes: ['1/2 or 3/4 hp disposal, installed', 'Old unit removed', '3-year warranty'] },
  { id: 'sewer', name: 'Sewer camera inspection', min: 199, max: 299, time: 'About 1 hour', includes: ['Camera run through the main line', 'Video you can keep', 'A written plan if repairs are needed'] },
];

const money = n => '$' + n.toLocaleString('en-US');
const jobList = document.querySelector('[data-job-list]');

function showJob(id) {
  const job = jobs.find(j => j.id === id) || jobs[0];
  jobList.querySelectorAll('.job').forEach(b => b.setAttribute('aria-checked', b.dataset.id === job.id));
  document.querySelector('[data-range]').textContent = `${money(job.min)}–${money(job.max)}`;
  document.querySelector('[data-time]').textContent = job.time;
  document.querySelector('[data-includes]').innerHTML = job.includes.map(i => `<li>${i}</li>`).join('');
  document.querySelector('[data-book-job]').href = `contact.html?job=${job.id}#book`;
}

if (jobList) {
  jobList.innerHTML = jobs.map(j => `<button class="job" type="button" role="radio" aria-checked="false" data-id="${j.id}"><span class="job-dot"></span><span>${j.name}<small>from ${money(j.min)}</small></span></button>`).join('');
  jobList.addEventListener('click', event => {
    const button = event.target.closest('.job');
    if (button) showJob(button.dataset.id);
  });
  let remembered = null;
  try { remembered = sessionStorage.getItem('pipeline-job'); } catch (e) { /* private mode */ }
  showJob(remembered || 'drain');
}

// Service tiles on the home page remember the job for the price guide
document.querySelectorAll('[data-job]').forEach(tile => tile.addEventListener('click', () => {
  try { sessionStorage.setItem('pipeline-job', tile.dataset.job); } catch (e) { /* private mode */ }
}));

// Booking form
const bookForm = document.querySelector('[data-book-form]');
if (bookForm) {
  const select = bookForm.querySelector('[data-job-select]');
  select.innerHTML = jobs.map(j => `<option value="${j.id}">${j.name} (${money(j.min)}–${money(j.max)})</option>`).join('') + '<option value="other">Something else</option>';
  const wanted = new URLSearchParams(location.search).get('job');
  if (wanted) select.value = wanted;
  bookForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = bookForm.name.value.trim().split(' ')[0];
    const time = bookForm.time.value;
    document.querySelector('[data-book-note]').textContent = `Thanks ${name}! We'll text you to confirm a ${time} visit.`;
    bookForm.reset();
  });
}

// Footer year
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
