/* ==========================================================================
   KARYAFRAME // ANTIGRAVITY EDITION — INTERACTIVE ENGINE
   Zero-G Particle Physics, Cursor Spotlights, NLE LUT Shader, Web Audio SFX,
   Command Palette (Ctrl+K), Cost/SLA Calculator & Accessible Validation
   ========================================================================== */

(function () {
  "use strict";

  const DATA = window.KARYAFRAME_DATA;
  const WHATSAPP_NUMBER = "62895397081621";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Application State
  const state = {
    theme: localStorage.getItem("karyaframe_theme") || "dark",
    portfolioFilter: "all",
    productFilter: "all",
    cart: JSON.parse(localStorage.getItem("karyaframe_cart") || "[]"),
    promoApplied: false,
    nle: {
      playing: !prefersReducedMotion,
      splitPercent: 64,
      frame: 342,
      activeLut: "nusantara",
      layers: {
        v3Hud: true,
        v2Color: true,
        a1Audio: true
      }
    },
    calc: {
      serviceType: "shortform",
      quantity: 4,
      addons: {
        colorLog: true,
        motionGfx: false,
        express: false,
        projectFile: false
      }
    }
  };

  // LUT Color Grading Profiles for Interactive NLE Canvas
  const LUT_PROFILES = {
    nusantara: {
      name: "Nusantara Rec709",
      bgTop: "#091326",
      bgMid: "#1E142B",
      bgBot: "#3D1816",
      keyOrb: "rgba(255, 77, 45, 0.86)",
      rimOrb: "rgba(34, 211, 238, 0.36)",
      grid: "rgba(34, 211, 238, 0.22)",
      box: "#FF4D2D"
    },
    cyber: {
      name: "Cyber Teal & Indigo",
      bgTop: "#041B29",
      bgMid: "#0E1D3D",
      bgBot: "#241142",
      keyOrb: "rgba(34, 211, 238, 0.88)",
      rimOrb: "rgba(129, 140, 248, 0.45)",
      grid: "rgba(103, 232, 249, 0.25)",
      box: "#22D3EE"
    },
    cinema: {
      name: "Golden Hour Kodak",
      bgTop: "#1C140A",
      bgMid: "#33200E",
      bgBot: "#4A2511",
      keyOrb: "rgba(251, 191, 36, 0.88)",
      rimOrb: "rgba(255, 110, 84, 0.38)",
      grid: "rgba(251, 191, 36, 0.20)",
      box: "#FBBF24"
    },
    bleach: {
      name: "Silver Bleach Bypass",
      bgTop: "#0B0D12",
      bgMid: "#1B202B",
      bgBot: "#2A3140",
      keyOrb: "rgba(226, 232, 240, 0.82)",
      rimOrb: "rgba(148, 163, 184, 0.35)",
      grid: "rgba(226, 232, 240, 0.18)",
      box: "#F8FAFC"
    }
  };

  // Calculator Config
  const CALC_CONFIG = {
    shortform: {
      label: "Edit Video Pendek (Reels / TikTok / Shorts)",
      unitName: "Jumlah Video",
      basePrice: 175000,
      maxQty: 24,
      baseDaysPerUnit: 1,
      minDays: 2
    },
    longform: {
      label: "Edit Video YouTube / Podcast (10–20 Menit)",
      unitName: "Jumlah Episode",
      basePrice: 550000,
      maxQty: 12,
      baseDaysPerUnit: 2.5,
      minDays: 3
    },
    commercial: {
      label: "Video Iklan Brand & Motion Produk",
      unitName: "Jumlah Video Iklan",
      basePrice: 950000,
      maxQty: 10,
      baseDaysPerUnit: 3.5,
      minDays: 4
    },
    webdev: {
      label: "Jasa Pembuatan Web / Landing Page Konversi",
      unitName: "Jumlah Halaman Utama / Modul",
      basePrice: 650000,
      maxQty: 10,
      baseDaysPerUnit: 1.5,
      minDays: 5
    }
  };

  const ADDON_PRICES = {
    colorLog: { label: "Color Grading 10-bit Log + Skin Tone Match", price: 150000 },
    motionGfx: { label: "Custom Motion Graphic & Infografik Data", price: 250000 },
    express: { label: "Prioritas Express (Potong Waktu 40%)", price: 300000 },
    projectFile: { label: "Sertakan File Proyek Mentah (.prproj / .fig)", price: 200000 }
  };

  function formatIDR(amount) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(amount);
  }

  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById("appToast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 3200);
  }

  /* ========================================================================
     1. ZERO-GRAVITY PARTICLE FIELD (Antigravity Signature Background)
     ======================================================================== */
  function initAntigravityField() {
    const canvas = document.getElementById("antigravityCanvas");
    if (!canvas || prefersReducedMotion) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = { x: -1000, y: -1000 };
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const count = Math.min(48, Math.floor(width / 32));
    const particles = Array.from({ length: count }, (_, idx) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -0.18 - Math.random() * 0.35, // Antigravity upward drift
      radius: idx % 5 === 0 ? 2.2 : 1.3,
      hue: idx % 3 === 0 ? "#FF4D2D" : idx % 2 === 0 ? "#22D3EE" : "#818CF8"
    }));

    function renderField() {
      ctx.clearRect(0, 0, width, height);
      const isLight = state.theme === "light";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Gentle repulsion from cursor
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 18000 && distSq > 1) {
          const dist = Math.sqrt(distSq);
          const force = (134 - dist) / 134;
          p.x += (dx / dist) * force * 1.4;
          p.y += (dy / dist) * force * 1.4;
        }

        // Wrap around screen edges
        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.hue;
        ctx.globalAlpha = isLight ? 0.35 : 0.55;
        ctx.fill();

        // Draw subtle orbital connection filaments
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const cdx = p.x - q.x;
          const cdy = p.y - q.y;
          const cdist = cdx * cdx + cdy * cdy;
          if (cdist < 14000) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = isLight ? "rgba(11,13,19,0.06)" : "rgba(255,255,255,0.05)";
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(renderField);
    }

    requestAnimationFrame(renderField);
  }

  /* ========================================================================
     2. CURSOR-REACTIVE SPOTLIGHT CARDS & SCROLL REVEAL
     ======================================================================== */
  function bindCursorSpotlights() {
    document.addEventListener("mousemove", (e) => {
      const cards = document.querySelectorAll(".spotlight-card");
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      });
    });
  }

  function initScrollReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* ========================================================================
     3. WEB AUDIO API STUDIO SFX SYNTHESIZER (Zero External MP3 Needed)
     ======================================================================== */
  let audioCtx = null;
  function playStudioSFX(type) {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtx) audioCtx = new AudioContextClass();
      if (audioCtx.state === "suspended") audioCtx.resume();

      const now = audioCtx.currentTime;

      if (type === "whoosh") {
        // Filtered white noise sweep
        const bufferSize = audioCtx.sampleRate * 0.45;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = "bandpass";
        filter.Q.value = 3.2;
        filter.frequency.setValueAtTime(180, now);
        filter.frequency.exponentialRampToValueAtTime(2400, now + 0.22);
        filter.frequency.exponentialRampToValueAtTime(140, now + 0.44);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.38, now + 0.18);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        noise.connect(filter).connect(gain).connect(audioCtx.destination);
        noise.start(now);
        showToast("Memutar Sample SFX: Cinema Whoosh (24-bit WAV)");
      } else if (type === "subdrop") {
        // Deep 808 / Cinema Sub-Bass Drop
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(135, now);
        osc.frequency.exponentialRampToValueAtTime(34, now + 0.65);

        gain.gain.setValueAtTime(0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        osc.connect(gain).connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.7);
        showToast("Memutar Sample SFX: Deep Sub-Drop Impact");
      } else if (type === "uiclick") {
        // Crisp Mechanical Tactile UI Click
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(1600, now);
        osc.frequency.exponentialRampToValueAtTime(280, now + 0.045);

        gain.gain.setValueAtTime(0.32, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain).connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.055);
        showToast("Memutar Sample SFX: Tactile Mechanical Click");
      } else if (type === "riser") {
        // Tension Hook Riser
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.55);

        const filter = audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(300, now);
        filter.frequency.exponentialRampToValueAtTime(3200, now + 0.55);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.24, now + 0.48);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);

        osc.connect(filter).connect(gain).connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
        showToast("Memutar Sample SFX: Hook Tension Riser");
      }
    } catch (_) {
      showToast("Sample audio siap di paket WAV.");
    }
  }

  /* ========================================================================
     4. THEME MANAGEMENT & MOBILE MENU
     ======================================================================== */
  function initTheme() {
    const root = document.documentElement;
    const toggleBtn = document.getElementById("themeToggleBtn");

    function applyTheme(theme) {
      state.theme = theme;
      root.setAttribute("data-theme", theme);
      localStorage.setItem("karyaframe_theme", theme);
      if (toggleBtn) {
        const isLight = theme === "light";
        toggleBtn.setAttribute(
          "aria-label",
          isLight ? "Ganti ke mode gelap Antigravity" : "Ganti ke mode terang editorial"
        );
        toggleBtn.setAttribute("aria-pressed", String(isLight));
      }
    }

    applyTheme(state.theme);

    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        applyTheme(state.theme === "dark" ? "light" : "dark");
        showToast(
          state.theme === "dark"
            ? "Mode Studio Gelap (Antigravity Dark) aktif"
            : "Mode Editorial Terang aktif"
        );
      });
    }
  }

  function initMobileMenu() {
    const btn = document.getElementById("mobileMenuBtn");
    const nav = document.getElementById("mobileNavDrawer");
    if (!btn || !nav) return;

    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open", !expanded);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        btn.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }

  /* ========================================================================
     5. 3D INTERACTIVE NLE WORKSTATION + REAL VIDEO BEFORE/AFTER & LUT ENGINE
     ======================================================================== */
  function initNLEMonitor() {
    const viewport = document.getElementById("nleViewport");
    const videoRaw = document.getElementById("nleVideoRaw");
    const videoGraded = document.getElementById("nleVideoGraded");
    const hudOverlay = document.getElementById("nleHudOverlay");
    const audioSpectrum = document.getElementById("nleAudioSpectrum");
    const hudLutName = document.getElementById("nleHudLutName");
    const afLabel = document.getElementById("nleAfLabel");
    const workstation = document.getElementById("nleWorkstationCard");
    const splitInput = document.getElementById("nleSplitRange");
    const splitValLabel = document.getElementById("nleSplitValue");
    const timecodeEl = document.getElementById("nleTimecode");
    const playBtn = document.getElementById("nlePlayBtn");
    const playLabel = document.getElementById("nlePlayLabel");
    const muteBtn = document.getElementById("nleMuteBtn");
    const muteLabel = document.getElementById("nleMuteLabel");
    const customVideoInput = document.getElementById("nleCustomVideoInput");

    if (!viewport || !videoRaw || !videoGraded) return;

    // 3D Tilt on Workstation Hover
    if (workstation && !prefersReducedMotion) {
      workstation.addEventListener("mousemove", (e) => {
        const rect = workstation.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        workstation.style.setProperty("--tilt-x", `${(-y * 3.8).toFixed(2)}deg`);
        workstation.style.setProperty("--tilt-y", `${(x * 4.5).toFixed(2)}deg`);
      });
      workstation.addEventListener("mouseleave", () => {
        workstation.style.setProperty("--tilt-x", "0deg");
        workstation.style.setProperty("--tilt-y", "0deg");
      });
    }

    // Keep Raw & Graded Video Frames Strictly Synchronized
    function syncVideos() {
      if (Math.abs(videoRaw.currentTime - videoGraded.currentTime) > 0.08) {
        videoRaw.currentTime = videoGraded.currentTime;
      }
    }

    videoGraded.addEventListener("play", () => {
      videoRaw.play().catch(() => {});
      viewport.classList.remove("is-paused");
    });

    videoGraded.addEventListener("pause", () => {
      videoRaw.pause();
      viewport.classList.add("is-paused");
    });

    videoGraded.addEventListener("seeking", syncVideos);
    videoGraded.addEventListener("timeupdate", syncVideos);

    // Format Real Video Time as SMPTE Timecode (00:MM:SS:FF @ 24fps)
    function formatVideoTimecode(seconds) {
      const fps = 24;
      const mins = Math.floor(seconds / 60) % 60;
      const secs = Math.floor(seconds) % 60;
      const frames = Math.floor((seconds % 1) * fps);
      const pad = (n) => String(n).padStart(2, "0");
      return `00:${pad(mins)}:${pad(secs)}:${pad(frames)}`;
    }

    function updateTimecodeLoop() {
      if (!videoGraded.paused && timecodeEl) {
        timecodeEl.textContent = formatVideoTimecode(videoGraded.currentTime || 0);
      }
      requestAnimationFrame(updateTimecodeLoop);
    }
    requestAnimationFrame(updateTimecodeLoop);

    // Apply Split Percentage to Viewport & Slider
    function applySplit(pct) {
      const clamped = Math.max(8, Math.min(92, Math.round(pct)));
      state.nle.splitPercent = clamped;
      viewport.style.setProperty("--split-pct", `${clamped}%`);
      if (splitInput) splitInput.value = String(clamped);
      if (splitValLabel) splitValLabel.textContent = `${clamped}% Master Graded`;
    }

    applySplit(state.nle.splitPercent);

    if (splitInput) {
      splitInput.addEventListener("input", (e) => {
        applySplit(Number(e.target.value));
      });
    }

    // Direct Pointer / Touch Dragging on the Video Viewport
    let isDraggingWipe = false;
    function handleViewportPointer(clientX) {
      const rect = viewport.getBoundingClientRect();
      const relX = (clientX - rect.left) / rect.width;
      const gradedPct = (1 - relX) * 100;
      applySplit(gradedPct);
    }

    viewport.addEventListener("pointerdown", (e) => {
      isDraggingWipe = true;
      viewport.setPointerCapture(e.pointerId);
      handleViewportPointer(e.clientX);
    });

    viewport.addEventListener("pointermove", (e) => {
      if (!isDraggingWipe) return;
      handleViewportPointer(e.clientX);
    });

    viewport.addEventListener("pointerup", () => {
      isDraggingWipe = false;
    });

    // Play / Pause Real Video
    if (playBtn) {
      playBtn.addEventListener("click", () => {
        if (videoGraded.paused) {
          videoGraded.play().catch(() => {});
          videoRaw.play().catch(() => {});
          state.nle.playing = true;
          playBtn.setAttribute("aria-pressed", "true");
          if (playLabel) playLabel.textContent = "Jeda Video";
        } else {
          videoGraded.pause();
          videoRaw.pause();
          state.nle.playing = false;
          playBtn.setAttribute("aria-pressed", "false");
          if (playLabel) playLabel.textContent = "Putar Video";
        }
      });
    }

    // Mute / Unmute Real Video Audio
    if (muteBtn) {
      muteBtn.addEventListener("click", () => {
        videoGraded.muted = !videoGraded.muted;
        const isMuted = videoGraded.muted;
        muteBtn.setAttribute("aria-pressed", String(isMuted));
        if (muteLabel) {
          muteLabel.textContent = isMuted ? "Suara: Mati" : "Suara: Aktif";
        }
        showToast(isMuted ? "Audio video dibisukan" : "Audio asli video diaktifkan");
      });
    }

    // Switch Video Footage Scene (Clip 01 / Clip 02)
    document.querySelectorAll("[data-video-scene]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-video-scene]").forEach((b) => {
          b.setAttribute("aria-pressed", "false");
        });
        btn.setAttribute("aria-pressed", "true");
        const src = btn.getAttribute("data-video-scene");
        videoRaw.src = src;
        videoGraded.src = src;
        videoRaw.play().catch(() => {});
        videoGraded.play().catch(() => {});
        showToast(`Memuat footage: ${btn.textContent.trim()}`);
      });
    });

    // Custom User MP4 Video Upload
    if (customVideoInput) {
      customVideoInput.addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const blobUrl = URL.createObjectURL(file);
        document.querySelectorAll("[data-video-scene]").forEach((b) => {
          b.setAttribute("aria-pressed", "false");
        });
        videoRaw.src = blobUrl;
        videoGraded.src = blobUrl;
        videoRaw.play().catch(() => {});
        videoGraded.play().catch(() => {});
        showToast(`Video Anda "${file.name}" dimuat ke monitor NLE!`);
      });
    }

    // LUT Preset Switcher Pills
    function updateActiveLutVisuals() {
      const lutObj = LUT_PROFILES[state.nle.activeLut] || LUT_PROFILES.nusantara;
      if (!state.nle.layers.v2Color) {
        videoGraded.setAttribute("data-lut", "none");
      } else {
        videoGraded.setAttribute("data-lut", state.nle.activeLut);
      }
      if (hudLutName) hudLutName.textContent = `LUT: ${lutObj.name}`;
      if (afLabel) afLabel.textContent = `AF-C // ${lutObj.name.toUpperCase()}`;
    }

    document.querySelectorAll("[data-lut-preset]").forEach((pill) => {
      pill.addEventListener("click", () => {
        document.querySelectorAll("[data-lut-preset]").forEach((p) => {
          p.setAttribute("aria-pressed", "false");
        });
        pill.setAttribute("aria-pressed", "true");
        state.nle.activeLut = pill.getAttribute("data-lut-preset");
        updateActiveLutVisuals();
        const lutObj = LUT_PROFILES[state.nle.activeLut];
        if (lutObj) showToast(`LUT Aktif: ${lutObj.name}`);
      });
    });

    // Layer Toggle Chips (V3 HUD, V2 LUT Grade, A1 Audio Spectrum)
    document.querySelectorAll("[data-nle-layer]").forEach((chip) => {
      chip.addEventListener("click", () => {
        const key = chip.getAttribute("data-nle-layer");
        state.nle.layers[key] = !state.nle.layers[key];
        chip.setAttribute("aria-pressed", String(state.nle.layers[key]));

        const clipTrack = document.querySelector(`[data-track-clip="${key}"]`);
        if (clipTrack) {
          clipTrack.style.opacity = state.nle.layers[key] ? "0.9" : "0.16";
        }

        if (key === "v3Hud" && hudOverlay) {
          hudOverlay.classList.toggle("is-hidden", !state.nle.layers.v3Hud);
        }
        if (key === "v2Color") {
          updateActiveLutVisuals();
        }
        if (key === "a1Audio" && audioSpectrum) {
          audioSpectrum.classList.toggle("is-hidden", !state.nle.layers.a1Audio);
        }
      });
    });
  }

  /* ========================================================================
     6. RENDER & FILTER PORTFOLIO + TECHNICAL BREAKDOWN MODAL
     ======================================================================== */
  function initPortfolio() {
    const grid = document.getElementById("portfolioGrid");
    const filterButtons = document.querySelectorAll("[data-portfolio-filter]");
    const modalScrim = document.getElementById("videoModalScrim");
    const modalCloseBtn = document.getElementById("closeVideoModalBtn");
    if (!grid) return;

    function renderPortfolio(filter) {
      const items =
        filter === "all"
          ? DATA.portfolio
          : DATA.portfolio.filter((item) => item.category === filter);

      grid.innerHTML = items
        .map(
          (item) => `
        <article class="portfolio-card spotlight-card">
          <div class="portfolio-card__thumb" style="background: ${item.gradient}">
            <div class="portfolio-card__visual">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="nle-tag">${item.categoryLabel}</span>
                <span class="font-mono" style="font-size:0.72rem; opacity:0.88;">${item.duration}</span>
              </div>
              <div style="display:flex; justify-content:center; margin-block:auto;">
                <button type="button" class="portfolio-card__play" data-open-video="${item.id}" aria-label="Lihat detail teknis video ${item.title}">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5.14v14l11-7-11-7z"/>
                  </svg>
                </button>
              </div>
              <div style="font-family:var(--font-mono); font-size:0.72rem; opacity:0.9;">
                ${item.resolution}
              </div>
            </div>
          </div>
          <div class="portfolio-card__body">
            <div class="portfolio-card__meta">
              <span>Klien: ${item.client}</span>
              <span>${item.software.split("+")[0].trim()}</span>
            </div>
            <h3 style="font-size:var(--prim-text-lg); font-weight:700;">${item.title}</h3>
            <div class="portfolio-card__result">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
              <span>${item.metric}</span>
            </div>
            <div style="margin-top:auto; padding-top:var(--space-2);">
              <button type="button" class="btn btn--secondary btn--sm btn--full" data-open-video="${item.id}">
                Bedah Spesifikasi Produksi
              </button>
            </div>
          </div>
        </article>
      `
        )
        .join("");

      grid.querySelectorAll("[data-open-video]").forEach((btn) => {
        btn.addEventListener("click", () => {
          openVideoModal(btn.getAttribute("data-open-video"));
        });
      });
    }

    function openVideoModal(id) {
      const item = DATA.portfolio.find((p) => p.id === id);
      if (!item || !modalScrim) return;

      document.getElementById("modalVideoTitle").textContent = item.title;
      document.getElementById("modalVideoClient").textContent = `${item.client} • ${item.resolution}`;
      document.getElementById("modalVideoMetric").textContent = item.metric;
      document.getElementById("modalVideoSoftware").textContent = item.software;
      document.getElementById("modalVideoBanner").style.background = item.gradient;

      const delivList = document.getElementById("modalVideoDeliverables");
      delivList.innerHTML = item.deliverables
        .map((d) => `<span class="deliverable-tag">${d}</span>`)
        .join("");

      const orderSimilarBtn = document.getElementById("modalOrderSimilarBtn");
      orderSimilarBtn.onclick = () => {
        closeVideoModal();
        prefillBriefForm(
          `Jasa Edit Video (${item.categoryLabel})`,
          `Saya tertarik membuat video dengan referensi gaya "${item.title}" (${item.resolution}).`
        );
      };

      modalScrim.classList.add("is-open");
      modalCloseBtn.focus();
    }

    function closeVideoModal() {
      if (modalScrim) modalScrim.classList.remove("is-open");
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeVideoModal);
    if (modalScrim) {
      modalScrim.addEventListener("click", (e) => {
        if (e.target === modalScrim) closeVideoModal();
      });
    }

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => {
          b.classList.remove("is-active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
        renderPortfolio(btn.getAttribute("data-portfolio-filter"));
      });
    });

    renderPortfolio("all");
  }

  /* ========================================================================
     7. DIGITAL PRODUCTS STORE + INTERACTIVE SFX SAMPLER
     ======================================================================== */
  function initDigitalProducts() {
    const grid = document.getElementById("productsGrid");
    const filterButtons = document.querySelectorAll("[data-product-filter]");
    if (!grid) return;

    function renderProducts(filter) {
      const items =
        filter === "all"
          ? DATA.digitalProducts
          : DATA.digitalProducts.filter((item) => item.category === filter);

      grid.innerHTML = items
        .map((prod) => {
          const isSfxPack = prod.id === "prod-sfx-03";
          return `
        <article class="product-card spotlight-card">
          <div>
            <div class="product-card__preview">
              <div class="product-card__top">
                <span class="product-badge">${prod.categoryLabel}</span>
                <span class="product-format">${prod.format.split("•")[0].trim()}</span>
              </div>
              <div class="product-card__art">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span class="font-mono" style="font-size:0.72rem; color:${prod.accent}; font-weight:700;">
                    KARYAFRAME // DIGITAL LAB
                  </span>
                  <span class="font-mono" style="font-size:0.66rem; color:var(--color-text-muted);">
                    INSTANT ACCESS
                  </span>
                </div>
                ${
                  isSfxPack
                    ? `
                  <div>
                    <span class="font-mono" style="font-size:0.68rem; color:var(--color-text-secondary); display:block;">
                      Uji dengar synthesizer sample SFX:
                    </span>
                    <div class="sfx-sampler-bar">
                      <button type="button" class="sfx-sample-btn" data-play-sfx="whoosh">▶ Whoosh</button>
                      <button type="button" class="sfx-sample-btn" data-play-sfx="subdrop">▶ Sub-Drop</button>
                      <button type="button" class="sfx-sample-btn" data-play-sfx="uiclick">▶ UI Click</button>
                      <button type="button" class="sfx-sample-btn" data-play-sfx="riser">▶ Riser</button>
                    </div>
                  </div>
                `
                    : `
                  <div style="font-family:var(--font-mono); font-size:0.74rem; color:var(--color-text-secondary);">
                    ${prod.format}
                  </div>
                `
                }
              </div>
            </div>
            <div class="product-card__content">
              <h3 class="product-card__title">${prod.title}</h3>
              <p style="font-size:var(--prim-text-sm);">${prod.specLine}</p>
              <ul class="package-card__specs">
                ${prod.includes
                  .map(
                    (inc) => `
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>${inc}</span>
                  </li>
                `
                  )
                  .join("")}
              </ul>
            </div>
          </div>
          <div class="product-card__footer">
            <div>
              <span class="product-price__strike">${formatIDR(prod.originalPrice)}</span>
              <span class="product-price">${formatIDR(prod.price)}</span>
            </div>
            <button type="button" class="btn btn--cyan btn--sm" data-add-cart="${prod.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              <span>Tambah Keranjang</span>
            </button>
          </div>
        </article>
      `;
        })
        .join("");

      grid.querySelectorAll("[data-add-cart]").forEach((btn) => {
        btn.addEventListener("click", () => {
          addToCart(btn.getAttribute("data-add-cart"));
        });
      });

      grid.querySelectorAll("[data-play-sfx]").forEach((btn) => {
        btn.addEventListener("click", () => {
          playStudioSFX(btn.getAttribute("data-play-sfx"));
        });
      });
    }

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => {
          b.classList.remove("is-active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
        renderProducts(btn.getAttribute("data-product-filter"));
      });
    });

    renderProducts("all");
  }

  /* ========================================================================
     8. SHOPPING CART DRAWER & PROMO CODE
     ======================================================================== */
  function saveCart() {
    localStorage.setItem("karyaframe_cart", JSON.stringify(state.cart));
    renderCartUI();
  }

  function addToCart(productId) {
    const prod = DATA.digitalProducts.find((p) => p.id === productId);
    if (!prod) return;

    const existing = state.cart.find((item) => item.id === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      state.cart.push({
        id: prod.id,
        title: prod.title,
        price: prod.price,
        format: prod.format,
        qty: 1
      });
    }
    saveCart();
    playStudioSFX("uiclick");
    showToast(`"${prod.title}" ditambahkan ke keranjang.`);
  }

  function removeFromCart(productId) {
    state.cart = state.cart.filter((item) => item.id !== productId);
    saveCart();
  }

  function renderCartUI() {
    const badge = document.getElementById("cartCountBadge");
    const listEl = document.getElementById("cartItemsContainer");
    const subtotalEl = document.getElementById("cartSubtotalValue");
    const totalEl = document.getElementById("cartTotalValue");

    const totalQty = state.cart.reduce((acc, item) => acc + item.qty, 0);
    if (badge) badge.textContent = String(totalQty);
    if (!listEl) return;

    if (state.cart.length === 0) {
      listEl.innerHTML = `
        <div style="text-align:center; padding-block:var(--space-10); color:var(--color-text-muted);">
          <p style="margin-inline:auto;">Keranjang produk digital Anda masih kosong.</p>
          <p style="font-size:var(--prim-text-xs); margin-top:var(--space-2); margin-inline:auto;">
            Pilih LUTs, MOGRT, SFX, atau Template Notion untuk diunduh instan.
          </p>
        </div>
      `;
    } else {
      listEl.innerHTML = state.cart
        .map(
          (item) => `
        <div class="cart-item">
          <div>
            <div style="font-weight:700; font-size:var(--prim-text-sm);">${item.title}</div>
            <div class="font-mono" style="font-size:0.72rem; color:var(--color-text-muted);">
              ${item.qty}x • ${formatIDR(item.price)}
            </div>
          </div>
          <button type="button" class="icon-btn" data-remove-cart="${item.id}" aria-label="Hapus ${item.title} dari keranjang">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <path d="M3 6h18M8 6V4h8v2m-9 4v8m4-8v8m4-8v8M5 6l1 14h12l1-14"/>
            </svg>
          </button>
        </div>
      `
        )
        .join("");

      listEl.querySelectorAll("[data-remove-cart]").forEach((btn) => {
        btn.addEventListener("click", () => {
          removeFromCart(btn.getAttribute("data-remove-cart"));
        });
      });
    }

    const rawSubtotal = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const discount = state.promoApplied ? Math.round(rawSubtotal * 0.15) : 0;
    const finalTotal = rawSubtotal - discount;

    if (subtotalEl) subtotalEl.textContent = formatIDR(rawSubtotal);
    if (totalEl) {
      totalEl.textContent = state.promoApplied
        ? `${formatIDR(finalTotal)} (Hemat 15%)`
        : formatIDR(finalTotal);
    }
  }

  function initCartDrawer() {
    const openBtn = document.getElementById("openCartBtn");
    const closeBtn = document.getElementById("closeCartBtn");
    const scrim = document.getElementById("cartScrim");
    const drawer = document.getElementById("cartDrawer");
    const promoBtn = document.getElementById("applyPromoBtn");
    const promoInput = document.getElementById("promoCodeInput");
    const checkoutBtn = document.getElementById("cartCheckoutBtn");

    function openCart() {
      if (!drawer || !scrim) return;
      scrim.classList.add("is-open");
      drawer.classList.add("is-open");
      drawer.setAttribute("aria-hidden", "false");
      if (closeBtn) closeBtn.focus();
    }

    function closeCart() {
      if (!drawer || !scrim) return;
      scrim.classList.remove("is-open");
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
    }

    if (openBtn) openBtn.addEventListener("click", openCart);
    if (closeBtn) closeBtn.addEventListener("click", closeCart);
    if (scrim) {
      scrim.addEventListener("click", (e) => {
        if (e.target === scrim) closeCart();
      });
    }

    if (promoBtn && promoInput) {
      promoBtn.addEventListener("click", () => {
        const code = promoInput.value.trim().toUpperCase();
        if (code === "KREATOR15") {
          state.promoApplied = true;
          renderCartUI();
          showToast("Kode KREATOR15 aktif: potongan 15% diterapkan!");
        } else {
          showToast("Kode promo tidak dikenali. Gunakan kode: KREATOR15");
        }
      });
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        if (state.cart.length === 0) {
          showToast("Tambahkan minimal 1 produk digital terlebih dahulu.");
          return;
        }
        const itemsSummary = state.cart
          .map((i) => `- ${i.title} (${i.qty}x ${formatIDR(i.price)})`)
          .join("\n");
        const rawSubtotal = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
        const finalTotal = state.promoApplied ? Math.round(rawSubtotal * 0.85) : rawSubtotal;

        closeCart();
        prefillBriefForm(
          "Pembelian Digital Product",
          `Daftar Produk Digital yang dipesan:\n${itemsSummary}\nTotal Pembayaran: ${formatIDR(finalTotal)}`
        );
      });
    }

    renderCartUI();
  }

  /* ========================================================================
     9. DIGITAL SERVICES BENTO & COST CALCULATOR
     ======================================================================== */
  function initDigitalServices() {
    const container = document.getElementById("digitalServicesGrid");
    if (!container) return;

    container.innerHTML = DATA.digitalServices
      .map(
        (srv) => `
      <article class="service-bento spotlight-card">
        <div style="display:flex; flex-direction:column; gap:var(--space-4);">
          <div class="service-bento__header">
            <span class="eyebrow eyebrow--amber">${srv.code} • ${srv.timeline}</span>
          </div>
          <h3 style="font-size:var(--prim-text-2xl); font-weight:700;">${srv.title}</h3>
          <p style="font-size:var(--prim-text-sm);">${srv.description}</p>
          <div class="service-bento__deliverables">
            ${srv.deliverables.map((d) => `<span class="deliverable-tag">${d}</span>`).join("")}
          </div>
        </div>
        <div class="service-bento__bottom">
          <div>
            <span style="font-size:var(--prim-text-xs); color:var(--color-text-muted); display:block;">Investasi Layanan</span>
            <span class="font-heading" style="font-size:var(--prim-text-xl); font-weight:700; color:var(--color-text-primary);">
              ${srv.startingPrice}
            </span>
          </div>
          <button type="button" class="btn btn--outline btn--sm" data-consult-service="${srv.title}">
            Konsultasi &amp; Pesan
          </button>
        </div>
      </article>
    `
      )
      .join("");

    container.querySelectorAll("[data-consult-service]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const title = btn.getAttribute("data-consult-service");
        prefillBriefForm(
          `Jasa Berbasis Digital — ${title}`,
          `Halo tim KARYAFRAME, saya ingin mendiskusikan kebutuhan untuk layanan "${title}". Berikut gambaran singkat target dan tenggat waktu kami:`
        );
      });
    });
  }

  function initCalculator() {
    const typeBtns = document.querySelectorAll("[data-calc-service]");
    const qtyRange = document.getElementById("calcQtyRange");
    const qtyValue = document.getElementById("calcQtyValue");
    const qtyUnitLabel = document.getElementById("calcUnitLabel");
    const addonCheckboxes = document.querySelectorAll("[data-calc-addon]");
    const totalEl = document.getElementById("calcTotalDisplay");
    const slaEl = document.getElementById("calcSlaDisplay");
    const breakdownEl = document.getElementById("calcBreakdownList");
    const applyToBriefBtn = document.getElementById("applyCalcToBriefBtn");

    if (!qtyRange || !totalEl) return;

    function updateCalculation() {
      const cfg = CALC_CONFIG[state.calc.serviceType];
      qtyRange.max = String(cfg.maxQty);
      if (state.calc.quantity > cfg.maxQty) {
        state.calc.quantity = cfg.maxQty;
        qtyRange.value = String(cfg.maxQty);
      }

      if (qtyUnitLabel) qtyUnitLabel.textContent = cfg.unitName;
      if (qtyValue) qtyValue.textContent = `${state.calc.quantity} Unit`;

      const baseSubtotal = cfg.basePrice * state.calc.quantity;
      const hasBulkDiscount = state.calc.quantity >= 8;
      const bulkDiscountAmount = hasBulkDiscount ? Math.round(baseSubtotal * 0.1) : 0;

      let addonsTotal = 0;
      const activeAddonRows = [];

      Object.keys(state.calc.addons).forEach((key) => {
        if (state.calc.addons[key] && ADDON_PRICES[key]) {
          const price = ADDON_PRICES[key].price;
          addonsTotal += price;
          activeAddonRows.push(`
            <div class="calc-breakdown__row">
              <span>+ ${ADDON_PRICES[key].label}</span>
              <span class="font-mono">${formatIDR(price)}</span>
            </div>
          `);
        }
      });

      const grandTotal = baseSubtotal - bulkDiscountAmount + addonsTotal;

      let estDays = Math.max(
        cfg.minDays,
        Math.ceil(state.calc.quantity * cfg.baseDaysPerUnit)
      );
      if (state.calc.addons.express) {
        estDays = Math.max(1, Math.ceil(estDays * 0.6));
      }

      totalEl.textContent = formatIDR(grandTotal);
      if (slaEl) {
        slaEl.textContent = `Estimasi Selesai: ${estDays}–${estDays + 1} Hari Kerja`;
      }

      if (breakdownEl) {
        breakdownEl.innerHTML = `
          <div class="calc-breakdown__row">
            <span>${cfg.label} (${state.calc.quantity}x)</span>
            <span class="font-mono">${formatIDR(baseSubtotal)}</span>
          </div>
          ${
            hasBulkDiscount
              ? `<div class="calc-breakdown__row" style="color:var(--color-success);">
                  <span>Diskon Volume (≥8 Unit - 10%)</span>
                  <span class="font-mono">-${formatIDR(bulkDiscountAmount)}</span>
                 </div>`
              : ""
          }
          ${activeAddonRows.join("")}
        `;
      }

      return { cfg, grandTotal, estDays };
    }

    typeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        typeBtns.forEach((b) => b.setAttribute("aria-checked", "false"));
        btn.setAttribute("aria-checked", "true");
        state.calc.serviceType = btn.getAttribute("data-calc-service");
        updateCalculation();
      });
    });

    qtyRange.addEventListener("input", (e) => {
      state.calc.quantity = Number(e.target.value);
      updateCalculation();
    });

    addonCheckboxes.forEach((cb) => {
      cb.addEventListener("change", () => {
        const key = cb.getAttribute("data-calc-addon");
        state.calc.addons[key] = cb.checked;
        updateCalculation();
      });
    });

    if (applyToBriefBtn) {
      applyToBriefBtn.addEventListener("click", () => {
        const { cfg, grandTotal, estDays } = updateCalculation();
        const selectedAddons = Object.keys(state.calc.addons)
          .filter((k) => state.calc.addons[k])
          .map((k) => ADDON_PRICES[k].label)
          .join(", ");

        prefillBriefForm(
          cfg.label,
          `Hasil Kalkulator Estimasi:\n- Layanan: ${cfg.label}\n- Volume: ${state.calc.quantity} Unit\n- Tambahan: ${selectedAddons || "Standar"}\n- Estimasi Biaya: ${formatIDR(grandTotal)}\n- Target SLA: ${estDays}–${estDays + 1} Hari Kerja`
        );
      });
    }

    updateCalculation();
  }

  /* ========================================================================
     10. COMMAND PALETTE (CTRL+K / CMD+K) — ANTIGRAVITY QUICK LAUNCHER
     ======================================================================== */
  function initCommandPalette() {
    const openBtn = document.getElementById("openCmdPaletteBtn");
    const scrim = document.getElementById("cmdPaletteScrim");
    const input = document.getElementById("cmdSearchInput");
    const resultsEl = document.getElementById("cmdResultsList");
    if (!scrim || !input || !resultsEl) return;

    const commands = [
      {
        title: "Hitung Biaya Edit Video & Web (Kalkulator SLA)",
        tag: "NAVIGASI",
        action: () => {
          location.hash = "#kalkulator";
        }
      },
      {
        title: "Jelajahi Toko Digital Product (LUTs, MOGRT, SFX, Notion)",
        tag: "TOKO DIGITAL",
        action: () => {
          location.hash = "#produk-digital";
        }
      },
      {
        title: "Uji Dengar Sample SFX: Cinema Whoosh",
        tag: "AUDIO SYNTH",
        action: () => {
          playStudioSFX("whoosh");
        }
      },
      {
        title: "Ganti LUT Monitor Hero → Cyber Teal & Indigo",
        tag: "NLE SHADER",
        action: () => {
          const lutBtn = document.querySelector('[data-lut="cyber"]');
          if (lutBtn) lutBtn.click();
          location.hash = "#main-content";
          showToast("LUT Monitor diganti ke Cyber Teal & Indigo");
        }
      },
      {
        title: "Chat WhatsApp Admin Langsung (0895-3970-81621)",
        tag: "WHATSAPP ADMIN",
        action: () => {
          const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Halo Admin KARYAFRAME Studio, saya ingin berkonsultasi mengenai layanan edit video / digital product.")}`;
          window.open(waUrl, "_blank", "noopener,noreferrer");
        }
      },
      {
        title: "Tambahkan Bundel Lengkap Editor Pro ke Keranjang",
        tag: "KERANJANG",
        action: () => {
          addToCart("prod-bundle-06");
        }
      },
      {
        title: "Ganti Tema Tampilan (Dark Antigravity / Light Editorial)",
        tag: "TEMA",
        action: () => {
          const btn = document.getElementById("themeToggleBtn");
          if (btn) btn.click();
        }
      },
      {
        title: "Kirim Brief Proyek Baru / Hubungi Produser",
        tag: "ORDER",
        action: () => {
          location.hash = "#brief-section";
        }
      }
    ];

    function renderCommands(query) {
      const q = query.trim().toLowerCase();
      const filtered = commands.filter(
        (c) => c.title.toLowerCase().includes(q) || c.tag.toLowerCase().includes(q)
      );

      if (filtered.length === 0) {
        resultsEl.innerHTML = `<div style="padding:var(--space-4); color:var(--color-text-muted); font-size:var(--prim-text-sm);">Tidak ada perintah yang cocok dengan "${query}".</div>`;
        return;
      }

      resultsEl.innerHTML = filtered
        .map(
          (c, i) => `
        <button type="button" class="cmd-item" data-cmd-idx="${i}">
          <span style="font-weight:600; font-size:var(--prim-text-sm);">${c.title}</span>
          <span class="kbd-shortcut">${c.tag}</span>
        </button>
      `
        )
        .join("");

      resultsEl.querySelectorAll("[data-cmd-idx]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const item = filtered[Number(btn.getAttribute("data-cmd-idx"))];
          closeCmd();
          if (item) item.action();
        });
      });
    }

    function openCmd() {
      scrim.classList.add("is-open");
      input.value = "";
      renderCommands("");
      setTimeout(() => input.focus(), 40);
    }

    function closeCmd() {
      scrim.classList.remove("is-open");
    }

    if (openBtn) openBtn.addEventListener("click", openCmd);
    scrim.addEventListener("click", (e) => {
      if (e.target === scrim) closeCmd();
    });
    input.addEventListener("input", (e) => renderCommands(e.target.value));

    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (scrim.classList.contains("is-open")) {
          closeCmd();
        } else {
          openCmd();
        }
      }
    });
  }

  /* ========================================================================
     11. FAQ ACCORDION & BRIEF FORM VALIDATION
     ======================================================================== */
  function initFAQ() {
    const container = document.getElementById("faqAccordion");
    if (!container) return;

    container.innerHTML = DATA.faqs
      .map(
        (faq, idx) => `
      <div class="faq-item">
        <h3>
          <button
            type="button"
            class="faq-trigger"
            id="faq-btn-${idx}"
            aria-expanded="${idx === 0 ? "true" : "false"}"
            aria-controls="faq-panel-${idx}"
          >
            <span>${faq.q}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </h3>
        <div
          id="faq-panel-${idx}"
          class="faq-panel"
          role="region"
          aria-labelledby="faq-btn-${idx}"
          ${idx === 0 ? "" : "hidden"}
        >
          ${faq.a}
        </div>
      </div>
    `
      )
      .join("");

    container.querySelectorAll(".faq-trigger").forEach((btn) => {
      btn.addEventListener("click", () => {
        const expanded = btn.getAttribute("aria-expanded") === "true";
        const panel = document.getElementById(btn.getAttribute("aria-controls"));
        btn.setAttribute("aria-expanded", String(!expanded));
        if (panel) panel.hidden = expanded;
      });
    });
  }

  function prefillBriefForm(serviceCategory, detailsText) {
    const section = document.getElementById("brief-section");
    const selectEl = document.getElementById("briefCategory");
    const messageEl = document.getElementById("briefDetails");

    if (selectEl) {
      let matched = false;
      Array.from(selectEl.options).forEach((opt) => {
        if (serviceCategory.toLowerCase().includes(opt.value.toLowerCase()) && opt.value !== "") {
          selectEl.value = opt.value;
          matched = true;
        }
      });
      if (!matched) selectEl.value = "Jasa Edit Video";
    }

    if (messageEl) messageEl.value = detailsText;

    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        const nameInput = document.getElementById("briefName");
        if (nameInput) nameInput.focus();
      }, 450);
    }
    showToast("Rincian pesanan telah dimasukkan ke formulir brief.");
  }

  function initBriefForm() {
    const form = document.getElementById("projectBriefForm");
    const errorSummary = document.getElementById("formErrorSummary");
    const errorList = document.getElementById("formErrorList");
    if (!form) return;

    const fields = [
      {
        id: "briefName",
        errorId: "err-briefName",
        label: "Nama Lengkap / Brand",
        validate: (v) => v.trim().length >= 2,
        msg: "Masukkan nama lengkap atau nama brand Anda (minimal 2 karakter)."
      },
      {
        id: "briefContact",
        errorId: "err-briefContact",
        label: "Nomor WhatsApp atau Email",
        validate: (v) => v.trim().length >= 6,
        msg: "Masukkan nomor WhatsApp aktif atau alamat email yang valid."
      },
      {
        id: "briefCategory",
        errorId: "err-briefCategory",
        label: "Kategori Layanan / Produk",
        validate: (v) => v.trim() !== "",
        msg: "Pilih salah satu kategori layanan atau produk digital."
      },
      {
        id: "briefDetails",
        errorId: "err-briefDetails",
        label: "Detail Proyek / Tautan Rekaman Mentah",
        validate: (v) => v.trim().length >= 10,
        msg: "Tuliskan minimal 10 karakter mengenai kebutuhan proyek atau daftar produk Anda."
      }
    ];

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const errors = [];

      fields.forEach((f) => {
        const input = document.getElementById(f.id);
        const errSpan = document.getElementById(f.errorId);
        const isValid = input && f.validate(input.value);

        if (!isValid) {
          input.setAttribute("aria-invalid", "true");
          if (errSpan) errSpan.textContent = f.msg;
          errors.push({ id: f.id, label: f.label, msg: f.msg });
        } else {
          input.setAttribute("aria-invalid", "false");
          if (errSpan) errSpan.textContent = "";
        }
      });

      if (errors.length > 0) {
        if (errorSummary && errorList) {
          errorList.innerHTML = errors
            .map(
              (err) =>
                `<li><a href="#${err.id}" style="text-decoration:underline; font-weight:600;">${err.label}:</a> ${err.msg}</li>`
            )
            .join("");
          errorSummary.hidden = false;
          errorSummary.focus();
        }
        return;
      }

      if (errorSummary) errorSummary.hidden = true;

      const nameVal = document.getElementById("briefName").value.trim();
      const contactVal = document.getElementById("briefContact").value.trim();
      const catVal = document.getElementById("briefCategory").value.trim();
      const linkVal = document.getElementById("briefDriveLink").value.trim();
      const detailVal = document.getElementById("briefDetails").value.trim();

      const waText = [
        `*BRIEF PROYEK BARU — KARYAFRAME STUDIO*`,
        `------------------------------------`,
        `*Nama / Brand:* ${nameVal}`,
        `*Kontak:* ${contactVal}`,
        `*Kategori:* ${catVal}`,
        linkVal ? `*Tautan Rekaman / Referensi:* ${linkVal}` : null,
        ``,
        `*Rincian Kebutuhan:*`,
        detailVal
      ]
        .filter(Boolean)
        .join("\n");

      showToast("Brief tervalidasi! Membuka ringkasan pengiriman WhatsApp...");
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
    });
  }

  function initGlobalKeyboard() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        ["videoModalScrim", "cartScrim", "cmdPaletteScrim"].forEach((id) => {
          const el = document.getElementById(id);
          if (el && el.classList.contains("is-open")) el.classList.remove("is-open");
        });
        const cartDrawer = document.getElementById("cartDrawer");
        if (cartDrawer && cartDrawer.classList.contains("is-open")) {
          cartDrawer.classList.remove("is-open");
        }
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initMobileMenu();
    initAntigravityField();
    bindCursorSpotlights();
    initScrollReveal();
    initNLEMonitor();
    initPortfolio();
    initDigitalProducts();
    initCartDrawer();
    initDigitalServices();
    initCalculator();
    initCommandPalette();
    initFAQ();
    initBriefForm();
    initGlobalKeyboard();
  });
})();
