// =========================================================
// Cincin 3D sampul album yang berputar melingkar.
// - berputar terus; berhenti pelan saat kursor di atasnya
// - bisa diseret (mouse / sentuh) untuk memutar manual
// - sampul paling depan berwarna, yang di belakang monokrom & redup
// =========================================================
(function () {
  const stage = document.getElementById('mu-stage');
  const ring = document.getElementById('mu-ring');
  if (!stage || !ring) return;
  const items = Array.from(ring.querySelectorAll('.music__item'));
  const n = items.length;
  const step = 360 / n;
  const elNo = document.getElementById('mu-no');
  const elTrack = document.getElementById('mu-track');
  const elArtist = document.getElementById('mu-artist');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let angle = 0;          // derajat putaran cincin
  let speed = reduce ? 0 : 14;   // derajat per detik
  let target = speed;
  let front = -1;
  let dragging = false, dragX = 0, dragged = 0;

  function radius() {
    return parseFloat(getComputedStyle(stage).getPropertyValue('--card')) * 1.45 || 240;
  }

  function layout() {
    const r = radius();
    ring.style.transform = 'translateZ(' + (-r) + 'px) rotateX(-8deg) rotateY(' + (-angle) + 'deg)';
    let best = 0, bestF = -2;
    items.forEach((it, i) => {
      const a = i * step;
      it.style.transform = 'rotateY(' + a + 'deg) translateZ(' + r + 'px)';
      const rel = ((a - angle) % 360 + 540) % 360 - 180;   // -180..180, 0 = depan
      const f = Math.max(0, Math.cos(rel * Math.PI / 180));
      it.style.setProperty('--f', f.toFixed(3));
      it.style.zIndex = Math.round(f * 100);
      if (f > bestF) { bestF = f; best = i; }
    });
    if (best !== front) {
      front = best;
      const it = items[best];
      elNo.textContent = String(best + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0');
      elTrack.textContent = it.dataset.track;
      elArtist.textContent = it.dataset.artist;
    }
  }

  let prev = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - prev) / 1000);
    prev = now;
    if (!dragging) {
      speed += (target - speed) * Math.min(1, dt * 3);   // percepatan halus
      angle += speed * dt;
    }
    layout();
    requestAnimationFrame(frame);
  }

  if (!reduce) {
    stage.addEventListener('mouseenter', () => { target = 0; });
    stage.addEventListener('mouseleave', () => { target = 14; });
  }

  // seret untuk memutar
  stage.addEventListener('pointerdown', (e) => {
    dragging = true; dragX = e.clientX; dragged = 0;
    stage.setPointerCapture(e.pointerId);
    stage.style.cursor = 'grabbing';
  });
  stage.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragX;
    dragX = e.clientX;
    dragged += Math.abs(dx);
    angle -= dx * 0.35;
  });
  const end = () => { dragging = false; stage.style.cursor = ''; };
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);
  // jangan buka link kalau pengguna sedang menyeret
  items.forEach((it) => it.addEventListener('click', (e) => { if (dragged > 6) e.preventDefault(); }));
  // keyboard: fokus ke sampul membawanya ke depan
  items.forEach((it, i) => it.addEventListener('focus', () => { angle = i * step; target = 0; }));

  layout();
  requestAnimationFrame(frame);
})();
