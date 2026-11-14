// =========================================================
// Bagian "Desain Figma": galeri per set + penampil layar penuh
// =========================================================
(function () {
  const F = 'assets/figma/';
  const SETS = [
    {
      kind: 'desktop',
      desc: 'Wireframe low-fidelity Toko Kriya Sidoarjo untuk layar desktop: alur belanja lengkap dari beranda, katalog, detail produk, keranjang, sampai checkout. Dibuat sebelum website-nya dikodekan.',
      meta: 'Figma · Wireframe low-fi · Kelompok 1, XI RPL 5',
      items: [
        ['kriya-desktop-1-beranda', 'Screen 1 — Beranda'],
        ['kriya-desktop-2-katalog', 'Screen 2 — Katalog produk'],
        ['kriya-desktop-3-detail-produk', 'Screen 3 — Detail produk'],
        ['kriya-desktop-4-keranjang', 'Screen 4 — Keranjang belanja'],
        ['kriya-desktop-5-checkout', 'Screen 5 — Checkout']
      ]
    },
    {
      kind: 'mobile',
      desc: 'Versi mobile dari wireframe yang sama: tata letak disusun ulang untuk layar sempit, dengan menu ringkas dan kartu produk dua kolom.',
      meta: 'Figma · Wireframe low-fi · Kelompok 1, XI RPL 5',
      items: [
        ['kriya-mobile-1-home', 'Mobile 1 — Beranda'],
        ['kriya-mobile-2-catalog', 'Mobile 2 — Katalog'],
        ['kriya-mobile-3-detail', 'Mobile 3 — Detail'],
        ['kriya-mobile-4-cart', 'Mobile 4 — Keranjang'],
        ['kriya-mobile-5-checkout', 'Mobile 5 — Checkout']
      ]
    },
    {
      kind: 'single',
      desc: 'Sketsa kasar satu halaman penuh KARYAFRAME Studio: hero, layanan, paket harga, portofolio video, toko aset digital, kalkulator SLA, FAQ, dan form brief — kerangka sebelum desain akhir.',
      meta: 'Figma · Sketsa kasar halaman lengkap',
      items: [['karyaframe-sketsa', 'KARYAFRAME — Halaman penuh']]
    }
  ];

  const rows = document.querySelectorAll('.design__sets .trow');
  const gallery = document.getElementById('ds-gallery');
  const desc = document.getElementById('ds-desc');
  const meta = document.getElementById('ds-meta');
  let current = -1;

  function render(si) {
    if (si === current) return;
    current = si;
    const set = SETS[si];
    rows.forEach((r) => {
      const on = +r.dataset.set === si;
      r.classList.toggle('is-active', on);
      r.setAttribute('aria-selected', on);
    });
    desc.textContent = set.desc;
    meta.textContent = set.meta + ' · ' + set.items.length + (set.items.length > 1 ? ' layar' : ' halaman');

    gallery.classList.add('is-swap');
    setTimeout(() => {
      gallery.className = 'gallery' + (set.kind === 'mobile' ? ' is-mobile' : set.kind === 'single' ? ' is-single' : '');
      gallery.innerHTML = '';
      set.items.forEach(([file, title], i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'shot';
        b.setAttribute('aria-label', 'Lihat ' + title);
        b.innerHTML =
          '<span class="shot__img"><img src="' + F + file + '-thumb.jpg" alt="' + title + '" loading="lazy"></span>' +
          '<figcaption class="tiny"><b>' + String(i + 1).padStart(2, '0') + '</b>' + title + '</figcaption>';
        b.addEventListener('click', () => openViewer(si, i));
        gallery.appendChild(b);
      });
      requestAnimationFrame(() => gallery.classList.remove('is-swap'));
    }, current === si && gallery.children.length ? 200 : 0);
  }

  rows.forEach((r) => r.addEventListener('click', () => render(+r.dataset.set)));
  render(0);

  // ---------- penampil ----------
  const viewer = document.getElementById('viewer');
  const vImg = document.getElementById('vw-img');
  const vTitle = document.getElementById('vw-title');
  const vCount = document.getElementById('vw-count');
  const vOpen = document.getElementById('vw-open');
  const vBody = document.getElementById('vw-body');
  const vPrev = document.getElementById('vw-prev');
  const vNext = document.getElementById('vw-next');
  let vs = 0, vi = 0, lastFocus = null;

  function show() {
    const set = SETS[vs];
    const [file, title] = set.items[vi];
    vImg.src = F + file + '.png';
    vImg.alt = title;
    vTitle.textContent = title;
    vCount.textContent = String(vi + 1).padStart(2, '0') + ' / ' + String(set.items.length).padStart(2, '0');
    vOpen.href = F + file + '.png';
    viewer.classList.toggle('is-mobile', set.kind === 'mobile');
    const many = set.items.length > 1;
    vPrev.hidden = vNext.hidden = !many;
    vBody.scrollTop = 0;
  }
  function openViewer(si, i) {
    vs = si; vi = i; lastFocus = document.activeElement;
    show();
    viewer.hidden = false;
    document.body.classList.add('is-locked');
    document.getElementById('vw-close').focus();
  }
  function closeViewer() {
    viewer.hidden = true;
    document.body.classList.remove('is-locked');
    if (lastFocus) lastFocus.focus();
  }
  function step(d) {
    const n = SETS[vs].items.length;
    vi = (vi + d + n) % n;
    show();
  }
  document.getElementById('vw-close').addEventListener('click', closeViewer);
  vPrev.addEventListener('click', () => step(-1));
  vNext.addEventListener('click', () => step(1));
  viewer.addEventListener('click', (e) => { if (e.target === viewer || e.target === vBody) closeViewer(); });
  document.addEventListener('keydown', (e) => {
    if (viewer.hidden) return;
    if (e.key === 'Escape') closeViewer();
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
  });
})();
