(() => {
  const section = document.querySelector('.work-gallery');
  const viewport = section.querySelector('.gallery-viewport');
  const track = section.querySelector('.gallery-track');
  const group = section.querySelector('.gallery-group');
  const pauseButton = section.querySelector('[data-gallery-pause]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clone = group.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  clone.setAttribute('data-gallery-clone', '');
  clone.inert = true;
  clone.querySelectorAll('img').forEach(image => { image.alt = ''; });
  track.append(clone);

  let loopWidth = group.getBoundingClientRect().width;
  let position = viewport.scrollLeft;
  let frame = 0, lastTime = 0, resumeTimer;
  let inView = false, hovered = false, focused = false, interacting = false, paused = false;
  const canRun = () => inView && !hovered && !focused && !interacting && !paused && !reduced.matches && !document.hidden;

  function animate(time) {
    const elapsed = Math.min(time - lastTime, 48);
    lastTime = time;
    position = (position + elapsed * 0.025) % loopWidth;
    viewport.scrollLeft = position;
    frame = requestAnimationFrame(animate);
  }
  function updatePlayback() {
    if (canRun() && !frame) {
      position = viewport.scrollLeft;
      lastTime = performance.now();
      frame = requestAnimationFrame(animate);
    } else if (!canRun() && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  }
  function holdForInteraction() {
    interacting = true;
    clearTimeout(resumeTimer);
    updatePlayback();
  }
  function releaseInteraction() {
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => { interacting = false; updatePlayback(); }, 1400);
  }
  viewport.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') { hovered = true; updatePlayback(); }
  });
  viewport.addEventListener('pointerleave', () => { hovered = false; updatePlayback(); });
  viewport.addEventListener('pointerdown', holdForInteraction, { passive: true });
  addEventListener('pointerup', releaseInteraction, { passive: true });
  addEventListener('pointercancel', releaseInteraction, { passive: true });
  viewport.addEventListener('wheel', event => {
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.shiftKey) {
      holdForInteraction(); releaseInteraction();
    }
  }, { passive: true });
  section.addEventListener('focusin', () => { focused = true; updatePlayback(); });
  section.addEventListener('focusout', event => {
    focused = section.contains(event.relatedTarget); updatePlayback();
  });
  pauseButton.addEventListener('click', () => {
    paused = !paused;
    if (!paused) focused = false; // Explicit play takes precedence over focus pause.
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.setAttribute('aria-label', paused ? 'Продолжить движение фото' : 'Остановить движение фото');
    pauseButton.firstElementChild.textContent = paused ? '▷' : 'Ⅱ';
    updatePlayback();
  });
  function step(direction) {
    holdForInteraction();
    const distance = group.firstElementChild.getBoundingClientRect().width + 12;
    if (!reduced.matches) {
      if (direction < 0 && viewport.scrollLeft < distance) viewport.scrollLeft += loopWidth;
      if (direction > 0 && viewport.scrollLeft >= loopWidth) viewport.scrollLeft -= loopWidth;
    }
    viewport.scrollBy({ left: direction * distance, behavior: reduced.matches ? 'instant' : 'smooth' });
    releaseInteraction();
  }
  section.querySelector('[data-gallery-prev]').addEventListener('click', () => step(-1));
  section.querySelector('[data-gallery-next]').addEventListener('click', () => step(1));
  viewport.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); step(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting; updatePlayback();
  }).observe(viewport);
  new ResizeObserver(() => {
    loopWidth = group.getBoundingClientRect().width;
    position = viewport.scrollLeft % loopWidth;
    if (!reduced.matches) viewport.scrollLeft = position;
  }).observe(group);
  document.addEventListener('visibilitychange', updatePlayback);
  reduced.addEventListener('change', updatePlayback);
})();
