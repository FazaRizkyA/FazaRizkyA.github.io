/**
 * TOKO KRIYA SIDOARJO - PRODUCT STORE & REAL-TIME SYNCHRONIZER
 * Engine sinkronisasi data produk antara Web Admin dan Web Public
 * Menggunakan LocalStorage dan BroadcastChannel untuk sinkronisasi otomatis multi-tab/multi-window
 */

const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    name: "Tas Kulit Nabati Tanggulangin",
    category: "kulit",
    categoryLabel: "Sentra Tanggulangin",
    price: 685000,
    stock: 12,
    image: "assets/images/tas-kulit.jpg",
    gallery: [
      "assets/images/tas-kulit.jpg",
      "assets/images/kategori-kulit.jpg",
      "assets/images/hero-showcase.jpg"
    ],
    description: "Tas selempang dan jinjing kulit sapi nabati asli Tanggulangin, diproses dengan pewarnaan alami yang ramah lingkungan dan awet bertahun-tahun.",
    detailedDescription: [
      "Tas jinjing dan selempang kulit eksklusif ini diproduksi langsung oleh para pengrajin kulit senior di sentra kerajinan Tanggulangin, Sidoarjo. Menggunakan bahan 100% kulit sapi samak nabati (vegetable-tanned leather) pilihan yang diolah secara ramah lingkungan tanpa bahan kimia berbahaya, sehingga semakin lama digunakan warnanya akan semakin matang dan berkilau alami (patina effect).",
      "Dibuat dengan jahitan tangan (hand-stitched) presisi menggunakan benang wax tebal yang terkenal tahan puluhan tahun. Dilengkapi kompartemen utama luas berlapis kain suede lembut, saku ritsleting dalam untuk barang berharga, tali selempang yang dapat disesuaikan panjangnya, serta aksesoris gesper kuningan antik tahan karat."
    ],
    specs: {
      bahan: "100% Kulit Sapi Samak Nabati Asli Tanggulangin",
      dimensi: "Panjang 28 cm × Lebar 9 cm × Tinggi 20 cm",
      warna: "Tan Natural (Cokelat Karamel Alami)",
      sentra: "Sentra Industri Kulit Tanggulangin, Sidoarjo",
      perawatan: "Bersihkan dengan kain mikrofiber lembap dan oleskan leather balm secara berkala."
    }
  },
  {
    id: "prod-2",
    name: "Batik Tulis Motif Beras Wutah",
    category: "batik",
    categoryLabel: "Kampung Batik Jetis",
    price: 520000,
    stock: 8,
    image: "assets/images/batik-jetis.jpg",
    gallery: [
      "assets/images/batik-jetis.jpg",
      "assets/images/kategori-batik.jpg",
      "assets/images/selendang-batik.jpg"
    ],
    description: "Kain batik tulis otentik Kampung Batik Jetis Sidoarjo, motif klasik Beras Wutah sarat makna kemakmuran dan filosofi lokal.",
    detailedDescription: [
      "Kain batik tulis otentik mahakarya perajin Kampung Batik Jetis Sidoarjo, salah satu sentra batik tertua di Jawa Timur yang telah melestarikan warisan canting sejak tahun 1675. Membawa motif klasik legendaris 'Beras Wutah' (beras tumpah) yang sarat makna kemakmuran, kelimpahan rezeki, dan rasa syukur masyarakat agraris delta Brantas.",
      "Dikerjakan 100% secara manual menggunakan canting tembaga dan lilin malam panas di atas lembaran kain katun primissima kualitas tertinggi. Melalui proses pencelupan warna bertahap dengan pigmen alami sogan dan indigo yang tahan cuci, menghasilkan aroma khas lilin batik tulis dan sentuhan kain yang adem, jatuh sempurna, serta sangat berwibawa saat dikenakan untuk busana resmi maupun busana adat."
    ],
    specs: {
      bahan: "100% Katun Primissima Super (Halus & Adem)",
      dimensi: "Panjang 220 cm × Lebar 115 cm (Standar Kain Panjang)",
      teknik: "Batik Tulis Canting Tembaga 100% Manual Hand-Drawn",
      sentra: "Kampung Batik Jetis, Lemahputro, Sidoarjo",
      perawatan: "Cuci dengan sabun lerak atau sampo, jemur di tempat teduh tanpa paparan sinar matahari langsung."
    }
  },
  {
    id: "prod-3",
    name: "Lampu Meja Anyaman Bambu",
    category: "bambu",
    categoryLabel: "Pengrajin Candi",
    price: 310000,
    stock: 15,
    image: "assets/images/lampu-bambu.jpg",
    gallery: [
      "assets/images/lampu-bambu.jpg",
      "assets/images/kategori-anyaman.jpg",
      "assets/images/nampan-rotan.jpg"
    ],
    description: "Lampu hias meja berbahan serat bambu pilihan pengrajin Candi, memberikan pendaran cahaya hangat dan estetis pada ruangan.",
    detailedDescription: [
      "Lampu meja dekoratif bernuansa etnik tropis hasil anyaman tangan presisi para pengrajin bambu di Candi, Sidoarjo. Memadukan estetika kriya tradisional dengan gaya interior modern kontemporer (Japandi & Scandinavian). Dibuat dari bilah bambu apus tua pilihan yang telah melalui proses perendaman dan pengasapan alami agar kokoh serta bebas rayap.",
      "Anyaman silang berongga presisi dirancang khusus untuk membiaskan pendaran cahaya temaram yang hangat (warm white) serta menciptakan siluet bayangan artistik yang menenangkan ke dinding ruangan. Dilengkapi rangka penyangga besi kokoh dengan finishing anti-karat, kabel bersaklar praktis sepanjang 1.5 meter, dan fitting bohlam standar E27."
    ],
    specs: {
      bahan: "Serat Bambu Apus Pilihan & Rangka Besi Anti-Karat",
      dimensi: "Diameter 18 cm × Tinggi 32 cm",
      kelistrikan: "Fitting E27 Standar Indonesia, Kabel 1.5 Meter + Saklar On/Off",
      sentra: "Komunitas Pengrajin Bambu Candi, Sidoarjo",
      perawatan: "Bersihkan debu secara berkala dengan kuas halus atau lap kering."
    }
  },
  {
    id: "prod-4",
    name: "Guci Terracotta Ukir Tribal",
    category: "keramik",
    categoryLabel: "Sentra Gerabah Tarik",
    price: 275000,
    stock: 10,
    image: "assets/images/guci-keramik.jpg",
    gallery: [
      "assets/images/guci-keramik.jpg",
      "assets/images/kategori-keramik.jpg",
      "assets/images/guci-keramik.jpg"
    ],
    description: "Guci tanah liat bakar khas sentra gerabah Tarik Sidoarjo dengan ornamen ukiran tribal etnik yang artistik.",
    detailedDescription: [
      "Guci hias terracotta otentik karya perajin gerabah Desa Kedungbocok, Tarik, Sidoarjo — kawasan yang tersohor dengan tradisi tembikar tanah liat turun-temurun sejak era kejayaan Majapahit. Dibuat menggunakan teknik roda putar tangan (throwing technique) dari lempung merah lokal yang kaya mineral, lalu dibakar dengan sekam padi pada suhu terukur untuk menghasilkan warna terakota alami yang kokoh dan berkarakter.",
      "Badan guci dipercantik pahatan ukir motif tribal etnik yang ditorehkan langsung secara manual saat tanah liat dalam kondisi setengah basah (leather-hard). Menghasilkan tekstur relief timbul yang artistik dan bernilai estetika tinggi, sangat memikat sebagai elemen dekorasi sudut ruangan, meja konsol, maupun vas bunga kering bernuansa rustic."
    ],
    specs: {
      bahan: "Tanah Liat Merah Alami (Natural Terracotta Clay)",
      dimensi: "Diameter Badan 22 cm × Tinggi 38 cm",
      finishing: "Natural Matte Bakaran Sekam Tradisional dengan seal anti-lumut",
      sentra: "Sentra Gerabah Desa Kedungbocok, Tarik, Sidoarjo",
      perawatan: "Cukup bersihkan dengan kemoceng atau lap kain lembap, hindarkan dari benturan keras."
    }
  },
  {
    id: "prod-5",
    name: "Sandal Selop Kulit Ukir Tradisi",
    category: "kulit",
    categoryLabel: "Sentra Tanggulangin",
    price: 245000,
    stock: 25,
    image: "assets/images/sandal-kulit.jpg",
    gallery: [
      "assets/images/sandal-kulit.jpg",
      "assets/images/kategori-kulit.jpg",
      "assets/images/tas-kulit.jpg"
    ],
    description: "Sandal selop pria/wanita dari kulit sapi asli Tanggulangin dengan jahitan tangan kuat dan sol ergonomis nyaman dipakai harian.",
    detailedDescription: [
      "Sandal selop model tradisional modern yang memadukan kenyamanan alas kaki harian dengan kemewahan material kulit sapi asli Tanggulangin, Sidoarjo. Bagian upper terbuat dari kulit sapi tipe pull-up premium yang lentur, tidak kaku, dan menyesuaikan bentuk kaki saat melangkah. Permukaannya dihiasi ukiran emboss motif sulur khas tradisi Jawa Timur yang elegan dan berkelas.",
      "Dirancang cermat untuk kenyamanan melangkah seharian: bantalan insole menggunakan busa latex empuk berlapis kulit yang sejuk dan menyerap keringat, dipadukan dengan outsole Thermo Plastic Rubber (TPR) fleksibel anti-slip yang berdaya cengkeram kuat dan aman dipakai di berbagai jenis lantai."
    ],
    specs: {
      bahan: "Kulit Sapi Asli Pull-Up Tanggulangin & Insole Latex Empuk",
      outsole: "Karet TPR Fleksibel Anti-Slip",
      ukuran: "Tersedia Ukuran 39, 40, 41, 42, 43, 44 (Standar Indonesia)",
      sentra: "Sentra Industri Kulit Tanggulangin, Sidoarjo",
      perawatan: "Bersihkan debu dengan lap lembap, angin-anginkan, dan oleskan lotion kulit secara berkala."
    }
  },
  {
    id: "prod-6",
    name: "Nampan Saji Rotan List Kayu",
    category: "bambu",
    categoryLabel: "Pengrajin Candi",
    price: 185000,
    stock: 18,
    image: "assets/images/nampan-rotan.jpg",
    gallery: [
      "assets/images/nampan-rotan.jpg",
      "assets/images/kategori-anyaman.jpg",
      "assets/images/lampu-bambu.jpg"
    ],
    description: "Nampan saji dekoratif anyaman rotan alam berbingkai kayu jati belanda yang kokoh dan ramah lingkungan.",
    detailedDescription: [
      "Nampan saji serbaguna hasil kolaborasi seni anyam rotan dan pertukangan kayu khas perajin Candi, Sidoarjo. Menggabungkan keelokan anyaman rotan pitrit alami bermotif rapat yang lentur namun kuat dengan bingkai kayu jati belanda solid bertekstur urat kayu menawan yang kokoh dan berbobot ringan.",
      "Sangat fungsional untuk menyajikan minuman teh, kopi, hidangan jamuan tamu, maupun sebagai nampan dekoratif (tray organizer) untuk menata vas mini dan lilin aromaterapi di ruang tamu. Dilengkapi pegangan samping ergonomis yang nyaman digenggam serta dilapisi cat bening ramah lingkungan (food-grade clear coat) yang tahan cipratan air dan mudah dibersihkan."
    ],
    specs: {
      bahan: "Anyaman Rotan Alam Pilihan & Kayu Jati Belanda Terpilih",
      dimensi: "Panjang 35 cm × Lebar 25 cm × Kedalaman 5 cm",
      finishing: "Water-Based Clear Coat (Food Grade & Ramah Lingkungan)",
      sentra: "Kelompok Pengrajin Rotan & Anyaman Candi, Sidoarjo",
      perawatan: "Segera lap bersih dengan kain kering jika terkena tumpahan cairan, simpan di tempat kering berventilasi baik."
    }
  }
];

const CATEGORY_NAMES = {
  kulit: "Produk Kulit Khas Tanggulangin",
  batik: "Batik Tulis Jetis",
  bambu: "Anyaman Bambu",
  keramik: "Gerabah & Keramik"
};

const STORAGE_KEY = 'kriya_sidoarjo_products_db';
let broadcastChannel = null;

try {
  if (typeof BroadcastChannel !== 'undefined') {
    broadcastChannel = new BroadcastChannel('kriya_store_sync_channel');
  }
} catch (e) {
  console.log('BroadcastChannel tidak aktif:', e);
}

const ProductStore = {
  getCategoryName(key) {
    return CATEGORY_NAMES[key] || (key ? key.charAt(0).toUpperCase() + key.slice(1) : '');
  },

  formatRupiah(amount) {
    const num = Number(amount) || 0;
    return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  },

  getAll() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data !== null) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge dengan DEFAULT_PRODUCTS agar atribut galeri foto, deskripsi lengkap, dan spesifikasi selalu terisi
          const merged = parsed.map(item => {
            const def = DEFAULT_PRODUCTS.find(d => String(d.id) === String(item.id));
            if (def) {
              return {
                ...def,
                ...item,
                image: item.image || def.image,
                gallery: (Array.isArray(item.gallery) && item.gallery.length > 0) ? item.gallery : def.gallery,
                detailedDescription: (Array.isArray(item.detailedDescription) && item.detailedDescription.length > 0) ? item.detailedDescription : def.detailedDescription,
                specs: item.specs || def.specs
              };
            }
            // Untuk produk baru di luar default
            const mainImg = item.image || 'assets/images/tas-kulit.jpg';
            return {
              ...item,
              gallery: (Array.isArray(item.gallery) && item.gallery.length > 0) ? item.gallery : [mainImg, mainImg, mainImg],
              detailedDescription: (Array.isArray(item.detailedDescription) && item.detailedDescription.length > 0) ? item.detailedDescription : [item.description || 'Kerajinan tangan otentik berkualitas dari Sidoarjo.'],
              specs: item.specs || {
                bahan: 'Bahan kriya pilihan berkualitas',
                sentra: item.categoryLabel || this.getCategoryName(item.category),
                perawatan: 'Simpan di tempat bersih dan kering.'
              }
            };
          });
          return merged;
        }
      }
    } catch (e) {
      console.warn('Gagal membaca LocalStorage, memuat produk default:', e);
    }
    // Jika belum tersimpan di LocalStorage, inisialisasi dengan data default
    this.saveAll(DEFAULT_PRODUCTS, false);
    return [...DEFAULT_PRODUCTS];
  },

  getById(id) {
    const products = this.getAll();
    return products.find(p => String(p.id) === String(id)) || null;
  },

  saveAll(products, notify = true) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      if (notify) {
        this.notifyChange(products);
      }
    } catch (e) {
      console.error('Gagal menyimpan ke LocalStorage:', e);
    }
  },

  add(productData) {
    const products = this.getAll();
    const newId = 'prod-' + Date.now();
    const mainImg = productData.image || 'assets/images/tas-kulit.jpg';
    const newProduct = {
      id: newId,
      name: productData.name.trim(),
      category: productData.category || 'kulit',
      categoryLabel: productData.categoryLabel || this.getCategoryName(productData.category),
      price: parseInt(productData.price, 10) || 0,
      stock: parseInt(productData.stock, 10) || 0,
      image: mainImg,
      gallery: (Array.isArray(productData.gallery) && productData.gallery.length > 0)
        ? productData.gallery
        : [mainImg, mainImg, mainImg],
      description: productData.description || 'Deskripsi produk kerajinan tangan lokal Sidoarjo.',
      detailedDescription: Array.isArray(productData.detailedDescription)
        ? productData.detailedDescription
        : [productData.description || 'Deskripsi produk kerajinan tangan lokal Sidoarjo.'],
      specs: productData.specs || {
        bahan: 'Bahan kriya lokal berkualitas',
        sentra: productData.categoryLabel || this.getCategoryName(productData.category),
        perawatan: 'Simpan di tempat bersih dan kering.'
      }
    };
    products.unshift(newProduct);
    this.saveAll(products);
    return newProduct;
  },

  remove(id) {
    let products = this.getAll();
    const prevLength = products.length;
    products = products.filter(p => String(p.id) !== String(id));
    if (products.length !== prevLength) {
      this.saveAll(products);
      return true;
    }
    return false;
  },

  update(id, updatedData) {
    const products = this.getAll();
    const index = products.findIndex(p => String(p.id) === String(id));
    if (index !== -1) {
      const current = products[index];
      const updatedImg = updatedData.image !== undefined ? updatedData.image : current.image;
      products[index] = {
        ...current,
        ...updatedData,
        price: parseInt(updatedData.price !== undefined ? updatedData.price : current.price, 10),
        stock: parseInt(updatedData.stock !== undefined ? updatedData.stock : current.stock, 10),
        categoryLabel: this.getCategoryName(updatedData.category || current.category),
        gallery: updatedData.gallery || (current.gallery && current.gallery.length ? current.gallery : [updatedImg, updatedImg, updatedImg])
      };
      this.saveAll(products);
      return products[index];
    }
    return null;
  },

  reset() {
    this.saveAll(DEFAULT_PRODUCTS);
    return [...DEFAULT_PRODUCTS];
  },

  notifyChange(products) {
    try {
      if (broadcastChannel) {
        broadcastChannel.postMessage({ type: 'PRODUCTS_UPDATED', data: products, timestamp: Date.now() });
      }
    } catch (e) {
      console.warn('Gagal broadcast pesan:', e);
    }
    window.dispatchEvent(new CustomEvent('kriya:products-updated', { detail: { products } }));
  },

  listen(callback) {
    window.addEventListener('kriya:products-updated', (e) => {
      callback(e.detail.products);
    });

    if (broadcastChannel) {
      broadcastChannel.onmessage = (event) => {
        if (event.data && event.data.type === 'PRODUCTS_UPDATED') {
          callback(event.data.data);
        }
      };
    }

    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const fresh = JSON.parse(e.newValue);
          callback(fresh);
        } catch (err) {}
      }
    });
  },

  async syncWithServer() {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const apiData = await res.json();
        if (Array.isArray(apiData)) {
          this.saveAll(apiData, false);
          return apiData;
        }
      }
    } catch (_) {}
    return this.getAll();
  }
};

if (typeof window !== 'undefined') {
  window.ProductStore = ProductStore;
  window.DEFAULT_PRODUCTS = DEFAULT_PRODUCTS;
}
