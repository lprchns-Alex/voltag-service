// Highlight the destination of the section currently passing beneath the header.
(() => {
  const links = [...document.querySelectorAll('.header .desktop-nav a')];
  const sections = links.map(link => ({ link, element: document.querySelector(link.getAttribute('href')) }));
  let scheduled = false;
  function update() {
    scheduled = false;
    const threshold = document.querySelector('.header').getBoundingClientRect().height + 60;
    let current = links[0];
    for (const {link, element} of sections.slice(1).sort((a,b) => a.element.offsetTop - b.element.offsetTop)) {
      if (element.getBoundingClientRect().top <= threshold) current = link;
    }
    links.forEach(link => {
      if (link === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }, {passive:true});
  addEventListener('resize', update);
  update();
})();
