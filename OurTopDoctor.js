/*
  Slider logic (vanilla JS):
  - responsive visible cards depend on CSS grid auto columns
  - we slide by card width (computed)
  - supports prev/next, dot navigation, autoplay, drag/swipe
*/
(function(){
  const track = document.getElementById('top-doctor-track');
  const viewport = document.getElementById('top-doctor-viewport');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const dotsEl = document.getElementById('top-doctor-dots');

  let cards = Array.from(track.children);
  let currentIndex = 0; // index of left-most visible card
  let isDragging = false, startX=0, scrollX=0;
  let autoplayInterval = null;
  const AUTOPLAY_MS = 3500;
  const TRANSITION_MS = 450;

  // create dots based on number of "pages"
  function computeVisibleCount() {
    // measure how many grid columns fit into viewport
    const cardStyle = getComputedStyle(track);
    const colWidth = track.querySelector('.top-doctor-card').getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 16);
    const visible = Math.floor(viewport.getBoundingClientRect().width / colWidth) || 1;
    return visible;
  }

  function numberOfPages() {
    const visible = computeVisibleCount();
    return Math.max(1, cards.length - visible + 1);
  }

  function buildDots() {
    dotsEl.innerHTML = '';
    const pages = numberOfPages();
    for (let i=0;i<pages;i++){
      const dot = document.createElement('button');
      dot.className = 'top-doctor-dot';
      dot.setAttribute('aria-label','Go to slide '+(i+1));
      dot.addEventListener('click', ()=> { goTo(i); resetAutoplay(); });
      dotsEl.appendChild(dot);
    }
    updateDots();
  }

  function updateDots() {
    const dots = Array.from(dotsEl.children);
    const pages = numberOfPages();
    const currentPageIndex = Math.min(currentIndex, pages - 1);
    dots.forEach((d, i) => d.classList.toggle('active', i === currentPageIndex));
  }

  function getCardWidth() {
    // width of single grid column (card)
    const card = track.querySelector('.top-doctor-card');
    if (!card) return 0;
    const rect = card.getBoundingClientRect();
    const gap = parseFloat(getComputedStyle(track).gap || 16);
    return rect.width + gap;
  }

  function goTo(index, animate=true) {
    const pages = numberOfPages();
    index = Math.max(0, Math.min(index, pages - 1));
    currentIndex = index;
    const moveX = getCardWidth() * index;
    if (!animate) track.style.transition = 'none';
    else track.style.transition = `transform ${TRANSITION_MS}ms cubic-bezier(.2,.9,.2,1)`;
    track.style.transform = `translateX(-${moveX}px)`;
    updateDots();
  }

  function prev() { goTo(currentIndex - 1); resetAutoplay(); }
  function next() { goTo(currentIndex + 1); resetAutoplay(); }

  // drag / swipe handlers
  function onPointerDown(e) {
    isDragging = true;
    viewport.classList.add('dragging');
    startX = (e.touches ? e.touches[0].clientX : e.clientX);
    scrollX = parseFloat(track.style.transform.replace(/[^0-9\-.,]/g,'') || 0);
    track.style.transition = 'none';
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX);
    const dx = x - startX;
    // move track visually (in px)
    track.style.transform = `translateX(${scrollX + dx}px)`;
  }

  function onPointerUp() {
    if (!isDragging) return;
    isDragging = false;
    viewport.classList.remove('dragging');

    // determine how much moved relative to card width
    const transform = track.style.transform;
    const moved = Math.abs(parseFloat(transform.replace(/[^0-9\-.,]/g,'') || 0));
    const cardW = getCardWidth();
    // compute nearest index
    const index = Math.round(moved / cardW);
    goTo(index);
    resetAutoplay();
  }

  // autoplay
  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(() => {
      const pages = numberOfPages();
      if (currentIndex >= pages - 1) goTo(0);
      else goTo(currentIndex + 1);
    }, AUTOPLAY_MS);
  }
  function stopAutoplay() { if (autoplayInterval) { clearInterval(autoplayInterval); autoplayInterval = null; } }
  function resetAutoplay() { stopAutoplay(); startAutoplay(); }

  // handle resize: recompute dots and keep current page in range
  let resizeTimer = null;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(()=>{
      // clamp current index if pages reduced
      const pages = numberOfPages();
      if (currentIndex > pages - 1) currentIndex = pages - 1;
      buildDots();
      goTo(currentIndex, false);
    }, 120);
  }

  // init
  function init() {
    buildDots();
    goTo(0, false);
    // add listeners
    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    // pointer events for desktop and touch
    viewport.addEventListener('mousedown', onPointerDown);
    viewport.addEventListener('touchstart', onPointerDown, {passive:true});
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, {passive:true});
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);
    window.addEventListener('touchcancel', onPointerUp);

    // pause autoplay on hover/focus for accessibility
    viewport.addEventListener('mouseenter', stopAutoplay);
    viewport.addEventListener('mouseleave', startAutoplay);
    viewport.addEventListener('focusin', stopAutoplay);
    viewport.addEventListener('focusout', startAutoplay);

    window.addEventListener('resize', onResize);

    startAutoplay();
  }

  // kick off
  init();

  /* Expose a simple API for debugging if needed */
  window.__slider = { goTo, next, prev, getIndex: () => currentIndex };
})();