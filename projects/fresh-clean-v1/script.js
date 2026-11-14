/* =========================================================
   Fresh & Clean Laundry — script
   ---------------------------------------------------------
   UBAH DATA USAHA DI SINI (nomor WA, alamat, tarif)
   ========================================================= */
const CONFIG = {
  namaUsaha: "Fresh & Clean Laundry",
  // Format internasional tanpa "+" / spasi / tanda hubung. Contoh: 6281234567890
  nomorWA: "62895397081621",
  alamat: "Desa Wonokalang, Kec. Wonoayu, Kab. Sidoarjo, Jawa Timur",
  wilayahAntarJemput: "Desa Wonokalang",
  layanan: {
    kering:  { nama: "Cuci Kering",  harga: 5000 },
    setrika: { nama: "Cuci Setrika", harga: 7000 },
  },
};

/* ---------- Helpers ---------- */
const $  = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const rupiah = (n) => "Rp" + Math.round(n).toLocaleString("id-ID");
const formatKg = (n) => n.toLocaleString("id-ID", { maximumFractionDigits: 1 }) + " kg";
const waLink = (pesan) => `https://wa.me/${CONFIG.nomorWA}?text=${encodeURIComponent(pesan)}`;
const formatPhone = (num) => {
  // 6281234567890 -> +62 812-3456-7890
  const local = num.replace(/^62/, "");
  return "+62 " + local.replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3");
};

function toast(msg) {
  let t = $(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    t.setAttribute("role", "status");
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("is-show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("is-show"), 2800);
}

/* ---------- Isi data usaha ---------- */
$("#waDisplay").textContent = formatPhone(CONFIG.nomorWA);
$("#addrDisplay").textContent = CONFIG.alamat;
$("#year").textContent = new Date().getFullYear();

/* ---------- Semua tombol WhatsApp (pesan otomatis) ---------- */
$$("[data-wa]").forEach((el) => {
  el.href = waLink(el.dataset.wa);
  el.target = "_blank";
  el.rel = "noopener";
});

/* ---------- Navbar ---------- */
const nav = $("#nav");
const toggle = $("#navToggle");
const menu = $("#menu");

const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const closeMenu = () => {
  menu.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Buka menu");
};
toggle.addEventListener("click", () => {
  const open = menu.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
});
$$("a", menu).forEach((a) => a.addEventListener("click", closeMenu));
document.addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());

// Tandai menu aktif sesuai section yang terlihat
const navLinks = $$('.nav__menu a[href^="#"]:not(.btn)');
const sections = navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id));
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => spy.observe(s));

/* ---------- Kalkulator biaya ---------- */
const form = $("#calcForm");
const berat = $("#berat");
const alamatWrap = $("#alamatWrap");

function getState() {
  const key = form.layanan.value;
  const kg = Math.max(0, parseFloat(String(berat.value).replace(",", ".")) || 0);
  const wilayah = form.wilayah.value;
  const lay = CONFIG.layanan[key];
  return { key, lay, kg, wilayah, total: kg * lay.harga };
}

function render() {
  const s = getState();
  $("#sumLayanan").textContent = s.lay.nama;
  $("#sumBerat").textContent = formatKg(s.kg);
  $("#sumTarif").textContent = rupiah(s.lay.harga) + "/kg";
  $("#sumTotal").textContent = rupiah(s.total);

  const kirim = $("#sumKirim");
  const dalam = s.wilayah === "dalam";
  kirim.textContent = dalam ? "Antar-jemput gratis" : "Antar & ambil sendiri";
  kirim.classList.toggle("is-free", dalam);
  alamatWrap.classList.toggle("is-hidden", !dalam);
}

form.addEventListener("input", render);
form.addEventListener("change", render);

$$(".stepper__btn").forEach((btn) =>
  btn.addEventListener("click", () => {
    const step = parseFloat(btn.dataset.step);
    const cur = parseFloat(berat.value) || 0;
    const next = Math.min(100, Math.max(1, Math.round((cur + step) * 2) / 2));
    berat.value = next;
    render();
  })
);

berat.addEventListener("blur", () => {
  const v = parseFloat(berat.value);
  if (!v || v < 1) berat.value = 1;
  if (v > 100) berat.value = 100;
  render();
});

// Tombol "Hitung Biaya" di kartu harga memilih paket otomatis
$$("[data-pick]").forEach((btn) =>
  btn.addEventListener("click", () => {
    const radio = form.querySelector(`input[name="layanan"][value="${btn.dataset.pick}"]`);
    if (radio) { radio.checked = true; render(); }
  })
);

// Kirim pesanan ke WhatsApp
$("#sendOrder").addEventListener("click", () => {
  const s = getState();
  const nama = $("#nama").value.trim();
  const alamat = $("#alamat").value.trim();
  const dalam = s.wilayah === "dalam";

  $$(".field").forEach((f) => f.classList.remove("has-error"));
  if (s.kg < 1) {
    berat.closest(".field").classList.add("has-error");
    berat.focus();
    return toast("Masukkan perkiraan berat minimal 1 kg.");
  }
  if (!nama) {
    $("#nama").closest(".field").classList.add("has-error");
    $("#nama").focus();
    return toast("Mohon isi nama Anda terlebih dahulu.");
  }
  if (dalam && !alamat) {
    alamatWrap.classList.add("has-error");
    $("#alamat").focus();
    return toast("Mohon isi alamat penjemputan.");
  }

  const lines = [
    `Halo ${CONFIG.namaUsaha}, saya ingin memesan laundry.`,
    "",
    `Nama: ${nama}`,
    `Layanan: ${s.lay.nama} (${rupiah(s.lay.harga)}/kg)`,
    `Perkiraan berat: ${formatKg(s.kg)}`,
    `Perkiraan biaya: ${rupiah(s.total)}`,
    dalam
      ? `Pengiriman: Antar-jemput (${CONFIG.wilayahAntarJemput})`
      : "Pengiriman: Antar & ambil sendiri (luar desa)",
  ];
  if (dalam) lines.push(`Alamat jemput: ${alamat}`);
  lines.push("", dalam ? "Mohon info jadwal penjemputannya. Terima kasih." : "Kapan saya bisa mengantar cucian? Terima kasih.");

  window.open(waLink(lines.join("\n")), "_blank", "noopener");
});

render();

/* ---------- Animasi muncul saat scroll ---------- */
const revealTargets = $$(".section__head, .price-card, .calc__form, .calc__summary, .delivery__card, .step, .cta__inner, .feature");
revealTargets.forEach((el) => el.classList.add("reveal"));
const io = new IntersectionObserver(
  (entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
  }),
  { threshold: 0.12 }
);
revealTargets.forEach((el) => io.observe(el));
