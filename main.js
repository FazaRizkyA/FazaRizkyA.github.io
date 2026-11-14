// ---------- data proyek (dipakai panel pratinjau di bagian Karya) ----------
const PROJECTS = [
  {
    img: 'assets/ruang-latih.jpg', alt: 'Pratinjau aplikasi Ruang Latih',
    desc: 'Aplikasi desktop Windows untuk belajar AI engineering: baca lesson, tulis kode di sebelahnya, jalankan, lalu lihat hasilnya sebagai grafik. 56 lesson, berjalan offline tanpa perlu memasang apa pun. Materi dari repositori open source (MIT).',
    stack: 'C# · WPF · .NET 9 · Python · Node.js · Rust · Julia',
    links: [
      ['Unduh untuk Windows', 'https://github.com/FazaRizkyA/ruang-latih/releases/latest'],
      ['Kode di GitHub', 'https://github.com/FazaRizkyA/ruang-latih']
    ]
  },
  {
    img: 'assets/fresh-clean.jpg', alt: 'Pratinjau website Fresh & Clean Laundry',
    desc: 'Website laundry rumahan di Desa Wonokalang. Pelanggan menghitung biaya sendiri lalu memesan lewat WhatsApp; setiap pesanan tercatat dengan kode unik di halaman admin pemilik.',
    stack: 'React 19 · TypeScript · Tailwind 4 · Hono · SQLite · Vitest',
    links: [
      ['Buka website', 'projects/fresh-clean/index.html'],
      ['Desain v1', 'projects/fresh-clean-v1/index.html'],
      ['Desain v2', 'projects/fresh-clean-v2/index.html']
    ]
  },
  {
    img: 'assets/karyaframe.jpg', alt: 'Pratinjau KARYAFRAME Studio',
    desc: 'Landing page studio jasa edit video, toko produk digital, dan jasa web. Ada pratinjau before/after color grading, kalkulator biaya & SLA, mode gelap/terang, dan brand guideline sendiri.',
    stack: 'HTML · CSS · JavaScript · Design tokens',
    links: [['Buka website', 'projects/karyaframe/index.html']]
  },
  {
    img: 'assets/toko-kriya.jpg', alt: 'Pratinjau Toko Kriya Sidoarjo',
    desc: 'Toko online kerajinan khas Sidoarjo — kulit Tanggulangin, batik Jetis, anyaman bambu, gerabah. Lima halaman terhubung: beranda, katalog, detail produk, keranjang, dan checkout dengan QRIS.',
    stack: 'HTML · CSS · JavaScript · Tugas Pemrograman Web',
    links: [['Buka toko', 'projects/toko-kriya/index.html']]
  },
  {
    img: null, alt: '',
    desc: 'Game horor untuk Roblox, dikerjakan tim tiga orang dan kini di tahap pembuatan 3D. Peran saya: lobi, lokasi peta, cutscene, dan konseptor. AI membantu menyempurnakan kode, mencari error, dan sebagian model 3D.',
    stack: 'Roblox Studio · Luau · Tim 3 orang',
    links: [],
    note: 'Belum dirilis — link menyusul saat game terbit di Roblox.'
  }
];

(function work() {
  const rows = document.querySelectorAll('.work .trow');
  const img = document.getElementById('wp-img');
  const wip = document.getElementById('wp-wip');
  const frame = img.closest('.work__preview');
  const no = document.getElementById('wp-no');
  const desc = document.getElementById('wp-desc');
  const stack = document.getElementById('wp-stack');
  const links = document.getElementById('wp-links');
  let current = -1;

  function show(i) {
    if (i === current) return;
    current = i;
    const p = PROJECTS[i];
    rows.forEach((r) => r.classList.toggle('is-active', +r.dataset.i === i));
    no.textContent = String(i + 1).padStart(2, '0');
    desc.textContent = p.desc;
    stack.textContent = p.stack;
    links.innerHTML = '';
    (p.links || []).forEach(([label, href], k) => {
      const a = document.createElement('a');
      a.className = 'bracket' + (k === 0 ? ' is-main' : '');
      a.href = href;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = label + ' ↗';
      links.appendChild(a);
    });
    if (p.note) {
      const s = document.createElement('span');
      s.className = 'tiny work__note';
      s.textContent = p.note;
      links.appendChild(s);
    }
    if (!p.img) { img.hidden = true; wip.hidden = false; return; }
    wip.hidden = true; img.hidden = false;
    frame.classList.add('is-swap');
    setTimeout(() => {
      img.src = p.img; img.alt = p.alt;
      frame.classList.remove('is-swap');
    }, 180);
  }

  rows.forEach((r) => {
    const i = +r.dataset.i;
    r.addEventListener('mouseenter', () => show(i));
    r.addEventListener('focus', () => show(i));
    r.addEventListener('click', () => show(i));
  });
  // muat awal gambar lain supaya pergantian mulus
  PROJECTS.forEach((p) => { if (p.img) { const im = new Image(); im.src = p.img; } });
  show(0);
})();

// ---------- pita berjalan ----------
document.querySelectorAll('.tape__track').forEach((t) => {
  const parts = t.dataset.text.split('|');
  let html = '';
  for (let k = 0; k < 8; k++) {
    parts.forEach((p) => { html += `<span><i class="mk"></i>${p}</span>`; });
  }
  t.innerHTML = html + html; // digandakan agar loop -50% mulus
});

// ---------- kartu proses: ketuk untuk warna (perangkat sentuh) ----------
document.querySelectorAll('.card').forEach((c) => {
  c.addEventListener('click', () => c.classList.toggle('is-on'));
  c.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.classList.toggle('is-on'); }
  });
});

// ---------- jam WIB ----------
(function clock() {
  const el = document.getElementById('clock');
  const fmt = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' });
  const tick = () => { el.textContent = fmt.format(new Date()).replace('.', ':'); };
  tick(); setInterval(tick, 15000);
})();
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- wordmark footer selebar layar ----------
function fitWordmark() {
  const wrap = document.querySelector('.wordmark');
  const span = document.getElementById('wordmark');
  wrap.style.fontSize = '100px';
  const w = wrap.clientWidth;
  const s = span.getBoundingClientRect().width;
  wrap.style.fontSize = (100 * w / s) + 'px';
}
fitWordmark();
window.addEventListener('resize', fitWordmark);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitWordmark);

// ---------- muncul saat scroll ----------
(function reveal() {
  const sel = '.statement, .intro__imgs, .intro__bottom, .work__left, .table, .cards, .process__head, .awards__left, .contact__left, .contact__right';
  const items = document.querySelectorAll(sel);
  if (!('IntersectionObserver' in window)) return;
  items.forEach((el) => el.classList.add('rv'));
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
  items.forEach((el) => io.observe(el));
})();
