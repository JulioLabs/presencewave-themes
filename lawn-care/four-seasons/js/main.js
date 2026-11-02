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

// Season tabs, with arrow-key navigation
const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(tab) {
  tabs.forEach(other => {
    const selected = other === tab;
    other.setAttribute('aria-selected', selected);
    other.tabIndex = selected ? 0 : -1;
    document.getElementById(other.getAttribute('aria-controls')).hidden = !selected;
  });
  tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') selectTab(tabs[(index + 1) % tabs.length]);
    if (event.key === 'ArrowLeft') selectTab(tabs[(index - 1 + tabs.length) % tabs.length]);
  });
});

// Monthly / yearly prices
document.querySelectorAll('[name="billing"]').forEach(input => input.addEventListener('change', () => {
  const yearly = input.value === 'yearly' && input.checked;
  document.querySelectorAll('[data-monthly]').forEach(price => {
    price.textContent = '$' + Number(yearly ? price.dataset.yearly : price.dataset.monthly).toLocaleString('en-US');
  });
  document.querySelectorAll('[data-period]').forEach(period => { period.textContent = yearly ? '/ year' : '/ month'; });
}));

// Choosing a plan fills in the form below
const startForm = document.querySelector('[data-start]');
document.querySelectorAll('[data-plan]').forEach(link => link.addEventListener('click', () => {
  startForm.elements.plan.value = link.dataset.plan;
}));

// Start form: replace with your form handler or a form service
startForm?.addEventListener('submit', event => {
  event.preventDefault();
  const name = startForm.elements.name.value.trim().split(' ')[0] || 'there';
  startForm.querySelector('.form-success').textContent = `Thanks, ${name}! We'll text your exact price within one working day.`;
  startForm.reset();
});

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
