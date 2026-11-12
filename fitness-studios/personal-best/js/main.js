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

// Goal finder: edit the programs and how answers map to them
const programs = {
  strength: { name: 'Strong Foundations', weeks: 12, focus: ['Learn the big lifts safely', 'Add weight every week', 'Mobility for the joints that need it'] },
  weight: { name: 'Lean & Strong', weeks: 12, focus: ['Strength training to keep muscle', 'Simple nutrition habits, no meal plans', 'Weekly steps and sleep targets'] },
  pain: { name: 'Move Well Again', weeks: 8, focus: ['Assessment of how you move', 'Gentle strength for back, hips and knees', 'A daily 10-minute routine'] },
  event: { name: 'Race Ready', weeks: 16, focus: ['Strength work that prevents injury', 'Plan built around your event date', 'Taper and recovery guidance'] },
};
const levels = { new: 'Starts with technique and builds slowly.', some: 'Starts where you are and builds steadily.', lots: 'Progresses quickly with heavier blocks.' };
// In-person sessions a week by days available; the other days follow a written plan
const sessions = { 2: 1, 3: 2, 4: 2 };

const finder = document.querySelector('[data-finder]');
const result = document.querySelector('[data-result]');
const programField = document.querySelector('[data-program-field]');

function recommend() {
  const goal = finder.goal.value;
  const experience = finder.experience.value;
  const days = Number(finder.days.value);
  const program = programs[goal];
  const perWeek = sessions[days];
  const online = experience === 'lots' && days === 4;
  const price = online ? 149 : perWeek === 1 ? 320 : 560;
  const plan = online ? 'Online coaching with a 4-day program' : `${perWeek} session${perWeek === 1 ? '' : 's'} a week with me, plus ${days - perWeek}${days === 4 ? '+' : ''} day${days - perWeek === 1 ? '' : 's'} on your own plan`;
  result.innerHTML = `
    <small>Your program</small>
    <h3>${program.name}</h3>
    <p>${program.weeks} weeks · ${plan}. ${levels[experience]}</p>
    <ul>${program.focus.map(f => `<li>${f}</li>`).join('')}</ul>
    <p class="result-price">$${price}<span>/month</span></p>
    <a class="button" href="#consult" data-use-program>Talk to me about this plan</a>`;
  result.dataset.program = `${program.name} (${plan})`;
}

if (finder && result) {
  finder.addEventListener('change', recommend);
  result.addEventListener('click', event => {
    if (event.target.closest('[data-use-program]') && programField) programField.value = result.dataset.program;
  });
  recommend();
}

// Consult form (demo only: connect it to your calendar or form service)
const consult = document.querySelector('[data-consult-form]');
consult?.addEventListener('submit', event => {
  event.preventDefault();
  consult.querySelector('[data-consult-note]').textContent = `Thanks, ${consult.name.value.split(' ')[0]}! I'll email you within a day to set up our call.`;
  consult.reset();
});

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
