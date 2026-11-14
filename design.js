// =========================================================
// Bagian "Desain Figma" dan "Sertifikat"
// Pola sama dengan "Karya terpilih": pratinjau di kiri, tabel di kanan,
// baris yang disorot menyala; klik membuka penampil layar penuh.
// =========================================================
(function () {
  // ---------------- penampil layar penuh ----------------
  const viewer = document.getElementById('viewer');
  const vImg = document.getElementById('vw-img');
  const vTitle = document.getElementById('vw-title');
  const vCount = document.getElementById('vw-count');
  const vOpen = document.getElementById('vw-open');
  const vBody = document.getElementById('vw-body');
  const vPrev = document.getElementById('vw-prev');
  const vNext = document.getElementById('vw-next');
  // list: [{ src, title }], kind: '' | 'mobile' | 'cert'
  let list = [], vKind = '', vi = 0, lastFocus = null;

  function show() {
    const it = list[vi];
    vImg.src = it.src;
    vImg.alt = it.title;
    vTitle.textContent = it.title;
    vCount.textContent = String(vi + 1).padStart(2, '0') + ' / ' + String(list.length).padStart(2, '0');
    vOpen.href = it.src;
    vOpen.textContent = (/\.png$/i.test(it.src) ? 'Buka PNG' : 'Buka gambar') + ' ↗';
    viewer.classList.toggle('is-mobile', (it.kind || vKind) === 'mobile');
    viewer.classList.toggle('is-cert', vKind === 'cert');
    vPrev.hidden = vNext.hidden = list.length < 2;
    vBody.scrollTop = 0;
  }
  function openViewer(items, i, kind) {
    list = items; vi = i; vKind = kind || ''; lastFocus = document.activeElement;
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
  function step(d) { vi = (vi + d + list.length) % list.length; show(); }
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

  // ---------------- komponen pratinjau + tabel ----------------
  // opts: { rows, frame, img, onShow(i), onOpen(i) }
  function showcase(opts) {
    let current = -1;
    function show(i) {
      if (i === current) return;
      current = i;
      opts.rows.forEach((r) => r.classList.toggle('is-active', +r.dataset.i === i));
      opts.frame.classList.add('is-swap');
      setTimeout(() => {
        opts.onShow(i);
        opts.frame.classList.remove('is-swap');
      }, 160);
    }
    opts.rows.forEach((r) => {
      const i = +r.dataset.i;
      r.addEventListener('mouseenter', () => show(i));
      r.addEventListener('focus', () => show(i));
      r.addEventListener('click', () => show(i));
    });
    opts.frame.addEventListener('click', () => opts.onOpen(current));
    current = -1;
    opts.onShow(0);
    current = 0;
    return show;
  }

  // ---------------- DESAIN FIGMA ----------------
  const F = 'assets/figma/';
  const SETS = {
    desktop: {
      label: 'Toko Kriya · Desktop', kind: 'desktop',
      desc: 'Wireframe low-fidelity Toko Kriya Sidoarjo untuk desktop: alur belanja lengkap dari beranda sampai checkout, dibuat sebelum website-nya dikodekan.',
      meta: 'Figma · Wireframe low-fi · Kelompok 1, XI RPL 5'
    },
    mobile: {
      label: 'Toko Kriya · Mobile', kind: 'mobile',
      desc: 'Versi mobile dari wireframe yang sama: tata letak disusun ulang untuk layar sempit, dengan menu ringkas dan kartu produk dua kolom.',
      meta: 'Figma · Wireframe low-fi · Kelompok 1, XI RPL 5'
    },
    karyaframe: {
      label: 'KARYAFRAME Studio', kind: 'desktop',
      desc: 'Sketsa kasar satu halaman penuh KARYAFRAME Studio: hero, layanan, paket harga, portofolio video, toko aset digital, kalkulator SLA, FAQ, dan form brief.',
      meta: 'Figma · Sketsa kasar halaman lengkap'
    }
  };
  const SCREENS = [
    ['desktop', 'kriya-desktop-1-beranda', 'Beranda'],
    ['desktop', 'kriya-desktop-2-katalog', 'Katalog produk'],
    ['desktop', 'kriya-desktop-3-detail-produk', 'Detail produk'],
    ['desktop', 'kriya-desktop-4-keranjang', 'Keranjang belanja'],
    ['desktop', 'kriya-desktop-5-checkout', 'Checkout'],
    ['mobile', 'kriya-mobile-1-home', 'Beranda'],
    ['mobile', 'kriya-mobile-2-catalog', 'Katalog'],
    ['mobile', 'kriya-mobile-3-detail', 'Detail produk'],
    ['mobile', 'kriya-mobile-4-cart', 'Keranjang'],
    ['mobile', 'kriya-mobile-5-checkout', 'Checkout'],
    ['karyaframe', 'karyaframe-sketsa', 'Halaman penuh']
  ];

  const dzTable = document.getElementById('dz-table');
  SCREENS.forEach(([set, , title], i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'trow' + (i === 0 ? ' is-active' : '');
    b.dataset.i = i;
    b.innerHTML = '<span class="trow__name"><span class="mk" aria-hidden="true"></span>' + title + '</span>' +
      '<span>' + SETS[set].label + '</span><span>2026</span>';
    dzTable.appendChild(b);
  });
  document.getElementById('dz-total').textContent = String(SCREENS.length).padStart(2, '0');

  const dzFrame = document.getElementById('dz-frame');
  const dzImg = document.getElementById('dz-img');
  const dzPng = document.getElementById('dz-png');
  const viewerItems = SCREENS.map(([set, file, title]) => ({
    src: F + file + '.png', title: SETS[set].label + ' — ' + title, kind: SETS[set].kind
  }));

  showcase({
    rows: dzTable.querySelectorAll('.trow'),
    frame: dzFrame,
    onShow(i) {
      const [set, file, title] = SCREENS[i];
      const s = SETS[set];
      dzImg.src = F + file + '-thumb.jpg';
      dzImg.alt = s.label + ' — ' + title;
      dzFrame.classList.toggle('is-tall', s.kind === 'mobile');
      document.getElementById('dz-no').textContent = String(i + 1).padStart(2, '0');
      document.getElementById('dz-desc').textContent = s.desc;
      document.getElementById('dz-meta').textContent = s.meta + ' · ' + title;
      dzPng.href = F + file + '.png';
      document.getElementById('dz-open').onclick = () => openViewer(viewerItems, i, '');
    },
    onOpen(i) { openViewer(viewerItems, i, ''); }
  });

  // ---------------- SERTIFIKAT ----------------
  const C = 'assets/sertifikat/';
  const CERTS = [
    {
      file: 'gema', kind: 'Penghargaan',
      title: 'GEMA Foundation — Lomba Game Development Roblox',
      desc: 'Sertifikat penghargaan sebagai peserta Lomba Game Development Roblox bersama Tim Tyulpan, termasuk pelatihan intensif 4 pertemuan (8 JP) setiap Senin, 5–26 Oktober 2026.',
      meta: 'GEMA Foundation · No. 399/GEMA/X/2026 · Oktober 2026',
      note: 'Sertifikat peserta — sertifikat Juara 1 menyusul',
      links: []
    },
    {
      file: 'gamelab', kind: 'Penyelesaian kelas',
      title: 'GAMELAB Indonesia — Game Edukasi Construct',
      desc: 'Sertifikat penyelesaian program peningkatan kompetensi kelas "Game Edukasi Construct" di GAMELAB Indonesia bersama Educa Studio.',
      meta: 'GAMELAB Indonesia × Educa Studio · 11 September 2026 · berlaku hingga 11 September 2029',
      links: [['Verifikasi ↗', 'https://gamelab.id/certificate/GL6587677237']]
    },
    {
      file: 'smk', kind: 'Penilaian proyek',
      title: 'SMK Krian 1 Sidoarjo — Proyek Sumatif Tengah Semester',
      desc: 'Menyelesaikan seluruh rangkaian Asesmen Sumatif Tengah Semester berbasis proyek kolaborasi dengan predikat A (Sangat Baik).',
      meta: 'SMK Krian 1 Sidoarjo · XI RPL 5 · 15 Oktober 2026',
      links: []
    }
  ];
  const ctFrame = document.getElementById('ct-frame');
  const ctImg = document.getElementById('ct-img');
  const ctNote = document.getElementById('ct-note');
  const ctLinks = document.getElementById('ct-links');
  const certItems = CERTS.map((c) => ({ src: C + c.file + '.jpg', title: c.title }));

  showcase({
    rows: document.querySelectorAll('#ct-table .trow'),
    frame: ctFrame,
    onShow(i) {
      const c = CERTS[i];
      ctImg.src = C + c.file + '-thumb.jpg';
      ctImg.alt = c.title;
      document.getElementById('ct-no').textContent = String(i + 1).padStart(2, '0');
      document.getElementById('ct-kind').textContent = c.kind;
      document.getElementById('ct-desc').textContent = c.desc;
      document.getElementById('ct-meta').textContent = c.meta;
      ctNote.hidden = !c.note;
      ctNote.lastElementChild.textContent = c.note || '';
      ctLinks.innerHTML = '';
      const v = document.createElement('button');
      v.type = 'button'; v.className = 'bracket is-main'; v.textContent = 'Lihat sertifikat';
      v.addEventListener('click', () => openViewer(certItems, i, 'cert'));
      ctLinks.appendChild(v);
      c.links.forEach(([label, href]) => {
        const a = document.createElement('a');
        a.className = 'bracket'; a.href = href; a.target = '_blank'; a.rel = 'noopener'; a.textContent = label;
        ctLinks.appendChild(a);
      });
    },
    onOpen(i) { openViewer(certItems, i, 'cert'); }
  });
})();
