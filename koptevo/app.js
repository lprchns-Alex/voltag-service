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
