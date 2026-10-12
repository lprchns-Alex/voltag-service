// Lenis 1.3.17 is vendored locally; scrolling still works if it cannot load.
(() => {
  const root = document.documentElement;
  const header = document.querySelector('.header');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  let scroller;
  let headerOffset = 128;

  function measureHeader() {
    headerOffset = Math.ceil(header.getBoundingClientRect().height) + 16;
    root.style.setProperty('--header-offset', `${headerOffset}px`);
    if (scroller) scroller.options.anchors.offset = -headerOffset;
  }
  new ResizeObserver(measureHeader).observe(header);
  measureHeader();

  function configureScroll() {
    scroller?.destroy();
    scroller = null;
    if (reducedMotion.matches || typeof Lenis === 'undefined') return;
    scroller = new Lenis({
      autoRaf: true,
      lerp: 0.085,
      wheelMultiplier: 0.9,
      syncTouch: false,
      anchors: { offset: -headerOffset },
      prevent: node => node.matches('select, textarea, [data-native-scroll]')
    });
  }
  configureScroll();
  reducedMotion.addEventListener('change', configureScroll);

  window.scrollToSection = target => {
    if (scroller) {
      scroller.scrollTo(target, { offset: -headerOffset });
    } else {
      target.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    }
  };

  function updateHeader() {
    header.classList.toggle('is-scrolled', scrollY > 8);
  }
  addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // Frame-rate-independent following, with no idle animation loop.
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');
  document.body.append(dot);
  let x = 0, y = 0, targetX = 0, targetY = 0;
  let frame = 0, lastTime = 0, visible = false;
  const enabled = () => finePointer.matches && !reducedMotion.matches;
  const paint = () => {
    dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
  };
  function follow(time) {
    const elapsed = Math.min(time - lastTime, 64);
    lastTime = time;
    const blend = 1 - Math.exp(-elapsed / 115);
    x += (targetX - x) * blend;
    y += (targetY - y) * blend;
    paint();
    if (Math.hypot(targetX - x, targetY - y) > 0.1) {
      frame = requestAnimationFrame(follow);
    } else {
      x = targetX; y = targetY;
      paint();
      frame = 0;
    }
  }
  function hideDot() {
    visible = false;
    dot.classList.remove('is-visible', 'is-hover');
    cancelAnimationFrame(frame);
    frame = 0;
  }
  document.addEventListener('pointermove', event => {
    if (!enabled() || event.pointerType !== 'mouse') { hideDot(); return; }
    targetX = event.clientX; targetY = event.clientY;
    if (!visible) {
      x = targetX; y = targetY;
      paint();
      visible = true;
      dot.classList.add('is-visible');
    }
    dot.classList.toggle('is-hover', !!event.target.closest('a, button, summary, input, select, textarea'));
    if (!frame) {
      lastTime = performance.now();
      frame = requestAnimationFrame(follow);
    }
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', hideDot);
  document.addEventListener('pointerover', event => {
    if (event.target instanceof HTMLIFrameElement) hideDot();
  }, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) hideDot(); });
  document.addEventListener('keydown', hideDot);
  addEventListener('blur', hideDot);
  finePointer.addEventListener('change', hideDot);
  reducedMotion.addEventListener('change', hideDot);
})();
