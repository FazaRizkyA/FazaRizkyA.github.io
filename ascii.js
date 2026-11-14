// =========================================================
// Jejak simbol ASCII yang mengikuti kursor.
// - Di latar: simbol acak yang berkedip lalu memudar.
// - Di atas foto: foto "digambar ulang" sebagai ASCII-art
//   berdasarkan terang-gelap foto (data dari assets/faza-ascii.js).
// =========================================================
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const CELL = 12;                       // ukuran sel grid (px)
  const RADIUS = 2.8;                    // jari-jari sapuan (dalam sel)
  const FADE = 1.5;                      // kecepatan memudar (per detik)
  const BG_CHARS = '+-*/=<>#%&$@{}[]~^:;01'.split('');
  const RAMP = " .'`^,:;-~=+*cox%#&8@";   // gelap -> terang

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:90;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  // data terang-gelap foto
  let luma = null, LW = 0, LH = 0;
  if (window.FAZA_LUMA) {
    LW = FAZA_LUMA.w; LH = FAZA_LUMA.h;
    const bin = atob(FAZA_LUMA.d);
    luma = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) luma[i] = bin.charCodeAt(i);
  }
  const photos = Array.from(document.querySelectorAll('.hero__photo, .process__photo'));

  let W = 0, H = 0, dpr = 1;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = '500 11px "JetBrains Mono", ui-monospace, Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
  }
  resize();
  window.addEventListener('resize', resize);

  const cells = new Map();               // "cx,cy" -> { life, ch }
  const rand = (a) => a[(Math.random() * a.length) | 0];

  function stamp(x, y) {
    const cx0 = Math.floor(x / CELL), cy0 = Math.floor(y / CELL);
    const r = Math.ceil(RADIUS);
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        const d = Math.hypot(dx, dy) / RADIUS;
        if (d > 1 || Math.random() > 0.75 - d * 0.45) continue;
        const key = (cx0 + dx) + ',' + (cy0 + dy);
        const life = 1 - d * 0.45;
        const c = cells.get(key);
        if (c) c.life = Math.max(c.life, life);
        else cells.set(key, { life, ch: rand(BG_CHARS) });
      }
    }
  }

  let last = null;
  window.addEventListener('pointermove', (e) => {
    const x = e.clientX, y = e.clientY;
    if (last) {
      // isi celah saat kursor bergerak cepat
      const dist = Math.hypot(x - last.x, y - last.y);
      const steps = Math.min(30, Math.floor(dist / CELL));
      for (let i = 1; i <= steps; i++) {
        const t = i / (steps + 1);
        stamp(last.x + (x - last.x) * t, last.y + (y - last.y) * t);
      }
    }
    stamp(x, y);
    last = { x, y };
    wake();
  }, { passive: true });
  document.addEventListener('pointerleave', () => { last = null; });

  // terang-gelap foto di titik layar (px, py); -1 jika bukan bagian foto
  function sample(px, py, rects) {
    if (!luma) return -1;
    for (const r of rects) {
      if (px < r.left || px >= r.right || py < r.top || py >= r.bottom) continue;
      const u = ((px - r.left) / r.width * LW) | 0;
      const v = ((py - r.top) / r.height * LH) | 0;
      const val = luma[v * LW + u];
      if (val) return (val - 1) / 254;
    }
    return -1;
  }

  let running = false, prev = 0;
  function wake() { if (!running) { running = true; prev = performance.now(); requestAnimationFrame(frame); } }

  function frame(now) {
    const dt = Math.min(0.05, (now - prev) / 1000);
    prev = now;
    ctx.clearRect(0, 0, W, H);

    const rects = photos.map((p) => p.getBoundingClientRect()).filter((r) => r.bottom > 0 && r.top < H);

    for (const [key, c] of cells) {
      c.life -= dt * FADE;
      if (c.life <= 0) { cells.delete(key); continue; }
      const i = key.indexOf(',');
      const x = (+key.slice(0, i)) * CELL, y = (+key.slice(i + 1)) * CELL;
      const cxm = x + CELL / 2, cym = y + CELL / 2;
      const a = c.life;
      const lum = sample(cxm, cym, rects);

      if (lum >= 0) {
        // di atas foto: tutup sel lalu tulis karakter sesuai terang-gelap
        ctx.fillStyle = 'rgba(6,6,6,' + (a * 0.92).toFixed(3) + ')';
        ctx.fillRect(x, y, CELL, CELL);
        const ch = RAMP[Math.min(RAMP.length - 1, (lum * RAMP.length) | 0)];
        ctx.fillStyle = 'rgba(242,242,238,' + (a * (0.35 + lum * 0.65)).toFixed(3) + ')';
        ctx.fillText(ch, cxm, cym);
      } else {
        if (Math.random() < 0.06) c.ch = rand(BG_CHARS);
        ctx.fillStyle = 'rgba(242,242,238,' + (a * 0.6).toFixed(3) + ')';
        ctx.fillText(c.ch, cxm, cym);
      }
    }

    if (cells.size) requestAnimationFrame(frame);
    else { running = false; ctx.clearRect(0, 0, W, H); }
  }
})();
