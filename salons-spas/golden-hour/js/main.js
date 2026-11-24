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

// Services: replace with your own. price and minutes per stylist level: [New Talent, Senior, Master]
const services = [
  { group: 'Cuts', items: [
    { name: 'Women\'s cut and style', price: [55, 75, 95], minutes: [60, 60, 60] },
    { name: 'Men\'s cut', price: [35, 45, 55], minutes: [30, 30, 30] },
    { name: 'Skin fade', price: [40, 50, 60], minutes: [45, 45, 40] },
    { name: 'Blowout', price: [40, 50, 60], minutes: [45, 45, 45] },
  ] },
  { group: 'Color', items: [
    { name: 'Root touch-up', price: [70, 90, 110], minutes: [90, 75, 75] },
    { name: 'Partial balayage', price: [150, 190, 240], minutes: [150, 135, 120] },
    { name: 'Full highlights', price: [170, 210, 260], minutes: [180, 165, 150] },
    { name: 'Gloss and tone', price: [45, 55, 65], minutes: [30, 30, 30] },
  ] },
  { group: 'Treatments', items: [
    { name: 'Bond repair treatment', price: [35, 35, 35], minutes: [20, 20, 20] },
    { name: 'Scalp ritual and massage', price: [40, 40, 40], minutes: [30, 30, 30] },
  ] },
  { group: 'Occasions', items: [
    { name: 'Updo or event styling', price: [80, 95, 120], minutes: [60, 60, 60] },
    { name: 'Bridal trial', price: [110, 130, 160], minutes: [90, 90, 90] },
  ] },
];
const levels = ['newtalent', 'senior', 'master'];

const duration = minutes => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return [h ? `${h} hr` : '', m ? `${m} min` : ''].filter(Boolean).join(' ');
};

const container = document.querySelector('[data-services]');
const render = level => {
  if (!container) return;
  const i = levels.indexOf(level);
  container.innerHTML = services.map(group => `
    <div class="service-group"><h3>${group.group}</h3><ul>
      ${group.items.map(item => `<li class="service-item"><strong>${item.name}</strong><span class="price">$${item.price[i]}</span><small>${level === 'master' ? 'With a Master stylist' : level === 'senior' ? 'With a Senior stylist' : 'With a New Talent stylist'}</small><small class="time">${duration(item.minutes[i])}</small></li>`).join('')}
    </ul></div>`).join('');
};

document.querySelectorAll('[data-levels] input').forEach(input => input.addEventListener('change', () => render(input.value)));
render(document.querySelector('[data-levels] input:checked')?.value || 'senior');

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
