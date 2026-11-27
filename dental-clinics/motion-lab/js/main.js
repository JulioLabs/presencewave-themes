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

// Programs by area: replace with your own. x and y place the dot on the body map (percent of its size).
const areas = [
  { id: 'neck', label: 'Neck and shoulders', x: 50, y: 22, program: 'Desk Reset', visits: '6 to 8 visits', weeks: 4,
    focus: ['Posture and mobility work you can do at your desk', 'Hands-on care for tight upper back muscles', 'Strength for the muscles that hold your head up'] },
  { id: 'shoulder', label: 'Shoulder', x: 30, y: 25, program: 'Overhead Ready', visits: '8 to 12 visits', weeks: 6,
    focus: ['Range of motion back, step by step', 'Rotator cuff and shoulder blade strength', 'Lifting and throwing technique'] },
  { id: 'back', label: 'Lower back', x: 50, y: 42, program: 'Strong Spine', visits: '6 to 10 visits', weeks: 5,
    focus: ['Movements that calm a sore back', 'Core and hip strength for everyday lifting', 'A plan to stop flare-ups coming back'] },
  { id: 'hip', label: 'Hip', x: 38, y: 50, program: 'Hip Freedom', visits: '6 to 10 visits', weeks: 5,
    focus: ['Hip mobility and glute strength', 'Walking, stairs and getting up with ease', 'Running form check if you run'] },
  { id: 'knee', label: 'Knee', x: 40, y: 70, program: 'Knee Rebuild', visits: '10 to 16 visits', weeks: 8,
    focus: ['Swelling down and straightening back', 'Quad and hip strength, step by step', 'Return-to-sport testing before you play'] },
  { id: 'ankle', label: 'Ankle and foot', x: 60, y: 92, program: 'Steady Feet', visits: '6 to 8 visits', weeks: 4,
    focus: ['Balance and ankle stability', 'Calf and foot strength', 'Footwear and running load advice'] },
];

const buttons = document.querySelector('[data-areas]');
const card = document.querySelector('[data-program]');
const select = document.querySelector('[data-area-select]');
const dots = document.querySelector('[data-dots]');
if (dots) dots.innerHTML = areas.map(area => `<span class="dot" data-dot="${area.id}" style="--x:${area.x};--y:${area.y}"></span>`).join('');

const show = id => {
  const area = areas.find(a => a.id === id);
  if (!area || !card) return;
  card.innerHTML = `
    <p class="program-area">${area.label}</p>
    <h3>${area.program}</h3>
    <div class="program-facts"><span><strong>${area.visits}</strong>typical plan</span><span><strong>${area.weeks} weeks</strong>average to goal</span></div>
    <h4>What we work on</h4>
    <ul>${area.focus.map(item => `<li>${item}</li>`).join('')}</ul>
    <a class="button" href="#evaluation">Start with an evaluation</a>`;
  if (select) select.value = area.label;
  dots?.querySelectorAll('[data-dot]').forEach(dot => dot.classList.toggle('on', dot.dataset.dot === id));
};

if (buttons) {
  buttons.innerHTML = areas.map((area, i) => `<label class="area"><input type="radio" name="area" value="${area.id}"${i === 2 ? ' checked' : ''}><span class="area-label">${area.label}</span></label>`).join('');
  buttons.querySelectorAll('input').forEach(input => input.addEventListener('change', () => show(input.value)));
}
if (select) select.innerHTML = areas.map(area => `<option>${area.label}</option>`).join('') + '<option>Something else</option>';
show(buttons?.querySelector('input:checked')?.value || 'back');

// Evaluation request (demo: shows a confirmation; connect it to your scheduling tool or a PresenceWave form)
document.querySelector('[data-eval-form]')?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.target);
  const done = event.target.querySelector('[data-eval-done]');
  done.textContent = `Thanks, ${data.get('name').split(' ')[0]}! We'll call you this ${data.get('time').toLowerCase()} to book your evaluation.`;
  done.hidden = false;
});

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
