const menu = document.querySelector('#mobile-menu');
const toggle = document.querySelector('.menu-toggle');

function setMenu(open) {
  menu.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
}

toggle.addEventListener('click', () => setMenu(menu.hidden));
menu.addEventListener('click', (event) => {
  if (!event.target.closest('a')) return;
  setMenu(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || menu.hidden) return;
  setMenu(false);
  toggle.focus();
});
matchMedia('(min-width: 901px)').addEventListener('change', () => setMenu(false));

const priceTabs = [...document.querySelectorAll('.price-tab')];
const pricePanels = priceTabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));

function selectPriceTab(selectedIndex) {
  priceTabs.forEach((tab, index) => {
    const selected = index === selectedIndex;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    pricePanels[index].hidden = !selected;
  });
}

priceTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectPriceTab(index));
  tab.addEventListener('keydown', (event) => {
    const target = {
      ArrowLeft: (index + priceTabs.length - 1) % priceTabs.length,
      ArrowRight: (index + 1) % priceTabs.length,
      Home: 0,
      End: priceTabs.length - 1,
    }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    selectPriceTab(target);
    priceTabs[target].focus();
  });
});

const dialog = document.querySelector('.photo-dialog');
const fullPhoto = dialog.querySelector('img');

for (const link of document.querySelectorAll('[data-photo]')) {
  link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    fullPhoto.src = link.href;
    fullPhoto.alt = link.querySelector('img').alt;
    dialog.showModal();
  });
}

dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
