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

// First-visit guide: replace with your own visit steps for each age group
const ages = [
  {
    id: 'baby', label: 'Under 3', note: 'First tooth to age 2',
    title: 'A lap visit',
    minutes: 20,
    steps: ['Your child sits on your lap, facing you', 'We count teeth and check the gums', 'A quick fluoride paint (it tastes like strawberries)', 'Tips on brushing, bottles and teething'],
    bring: ['A favorite toy or blanket', 'Your insurance card'],
    tip: 'Book a morning visit, before nap time.',
  },
  {
    id: 'preschool', label: '3 to 5', note: 'Preschool',
    title: 'A tooth tour',
    minutes: 30,
    steps: ['A ride up and down in the big chair', 'Counting teeth with Mr. Mirror', 'A tickly polish and fluoride', 'Picking a prize from the treasure box'],
    bring: ['Their favorite stuffed animal (it gets a checkup too)', 'Your insurance card'],
    tip: 'Read a picture book about the dentist the night before.',
  },
  {
    id: 'school', label: '6 to 9', note: 'Early school years',
    title: 'Checkup and cleaning',
    minutes: 45,
    steps: ['Tooth pictures (X-rays) if they are due', 'A full cleaning and polish', 'Sealants on new back teeth if they need them', 'A spacing check for braces at age 7'],
    bring: ['Headphones if they like music', 'Your insurance card'],
    tip: 'Let them hold a mirror to watch, if they are curious.',
  },
  {
    id: 'tween', label: '10 to 13', note: 'Tweens and teens',
    title: 'Grown-up checkup',
    minutes: 50,
    steps: ['X-rays and a full cleaning', 'A check of adult teeth coming in', 'Mouthguard fitting for sports', 'An orthodontic review if they need one'],
    bring: ['Any retainer or mouthguard they use', 'Your insurance card'],
    tip: 'Let them answer our questions themselves; you can add to it.',
  },
];

const picker = document.querySelector('[data-ages]');
const guide = document.querySelector('[data-guide]');
const list = items => `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;

const show = id => {
  const age = ages.find(a => a.id === id);
  if (!age || !guide) return;
  guide.innerHTML = `
    <div class="guide-head"><h3>${age.title}</h3><span class="badge">About ${age.minutes} minutes</span></div>
    <div class="guide-cols">
      <div><h4>What happens</h4>${list(age.steps)}</div>
      <div><h4>What to bring</h4>${list(age.bring)}<h4>Parent tip</h4><p>${age.tip}</p></div>
    </div>
    <a class="button" href="#book">Book a ${age.title.toLowerCase()}</a>`;
};

if (picker) {
  picker.innerHTML = ages.map((age, i) => `<label class="age"><input type="radio" name="age" value="${age.id}"${i === 1 ? ' checked' : ''}><span><strong>${age.label}</strong><small>${age.note}</small></span></label>`).join('');
  picker.querySelectorAll('input').forEach(input => input.addEventListener('change', () => show(input.value)));
  show(picker.querySelector('input:checked').value);
}

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
