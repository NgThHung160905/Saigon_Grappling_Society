/* ==========================================================================
   SGS · CINEMATIC LAYER
   Chỉ thêm hiệu ứng hiển thị (reveal, parallax, particles, micro-interactions).
   Không đổi nội dung chữ, ảnh hay logic form/carousel/timetable có sẵn.
   ========================================================================== */
(() => {
  "use strict";
  const doc = document.documentElement;
  const body = document.body;
  const reduceMQ = matchMedia("(prefers-reduced-motion: reduce)");
  const fineMQ = matchMedia("(hover: hover) and (pointer: fine)");
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // Nếu tải trang giữa chừng (reload) thì bỏ đoạn mở màn letterbox
  if (scrollY > 120) doc.classList.add("no-intro");

  const header = document.querySelector(".top");
  const hero = document.querySelector(".hero");

  /* ---------- Thanh tiến độ cuộn ---------- */
  const bar = document.createElement("div");
  bar.className = "progress";
  bar.setAttribute("aria-hidden", "true");
  body.appendChild(bar);

  /* ---------- Hero video: chỉ phát khi đang nhìn thấy (tiết kiệm CPU/GPU) ---------- */
  let heroVisible = true;
  if (hero) {
    const vid = hero.querySelector(".hero-video");
    const playVid = () => { if (vid && !reduceMQ.matches && !document.hidden && heroVisible) { const p = vid.play(); p && p.catch(() => {}); } };
    const pauseVid = () => { if (vid) vid.pause(); };
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => {
        heroVisible = e.isIntersecting;
        heroVisible ? playVid() : pauseVid();
      }, { threshold: 0 }).observe(hero);
    }
    document.addEventListener("visibilitychange", () => (document.hidden ? pauseVid() : playVid()));
    if (reduceMQ.matches) pauseVid(); else playVid();
  }

  /* ---------- Scroll reveal (fade / slide / reveal / stagger) ---------- */
  if ("IntersectionObserver" in window) {
    const groups = [
      ["h2.t", "rv rv-title"],
      [".sec-head p", "rv"],
      [".what > div", "rv"],
      [".frames .slot", "rv rv-scale"],
      [".pillar", "rv"],
      [".who-top .age", "rv"],
      [".role", "rv rv-scale"],
      [".quote", "rv rv-scale"],
      [".arrows", "rv"],
      [".coach", "rv"],
      [".bento .slot", "rv rv-scale"],
      [".legend", "rv"],
      [".tt-grid", "rv"],
      [".tt-day", "rv"],
      [".tt-note", "rv"],
      [".m-title", "rv"],
      [".matrix", "rv"],
      [".mcard", "rv"],
      [".m-foot", "rv"],
      [".reg-grid > form", "rv"],
      [".where", "rv"],
      [".tile", "rv rv-scale"],
      ["footer .wrap", "rv"]
    ];
    const targets = [];
    groups.forEach(([sel, cls]) => $$(sel).forEach((el) => {
      if (el.classList.contains("rv")) return;
      cls.split(" ").forEach((c) => el.classList.add(c));
      targets.push(el);
    }));

    const io = new IntersectionObserver((entries) => {
      const batch = entries.filter((e) => e.isIntersecting)
        .sort((a, b) => (a.target.compareDocumentPosition(b.target) & 4 ? -1 : 1));
      batch.forEach((e, i) => {
        const el = e.target;
        const delay = Math.min(i, 8) * 90;
        el.style.setProperty("--d", delay);
        el.classList.add("in-view");
        io.unobserve(el);
        // Dọn class sau khi mọi animation (kể cả ảnh bên trong) chạy xong
        setTimeout(() => {
          el.classList.remove("rv", "rv-scale", "rv-title", "in-view");
          el.style.removeProperty("--d");
        }, 2600 + delay);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    targets.forEach((el) => io.observe(el));
  }

  /* ---------- Dải họa tiết video: chỉ phát khi nhìn thấy ---------- */
  const band = document.querySelector(".band");
  let bandOn = false;
  if (band) {
    const bandVid = band.querySelector(".band-video");
    const playBand = () => { if (bandVid && !reduceMQ.matches && !document.hidden && bandOn) { const p = bandVid.play(); p && p.catch(() => {}); } };
    const pauseBand = () => { if (bandVid) bandVid.pause(); };
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => {
        bandOn = e.isIntersecting;
        bandOn ? playBand() : pauseBand();
      }, { rootMargin: "100px" }).observe(band);
    }
    document.addEventListener("visibilitychange", () => (document.hidden ? pauseBand() : playBand()));
    if (reduceMQ.matches) pauseBand();
  }

  let ticking = false, maxScroll = 0, lastScrolled = null, lastP = -1;
  const measure = () => { maxScroll = doc.scrollHeight - window.innerHeight; };
  const update = () => {
    ticking = false;
    const y = window.scrollY, vh = window.innerHeight;
    const p = maxScroll > 0 ? Math.round(clamp(y / maxScroll, 0, 1) * 1000) / 1000 : 0;
    if (p !== lastP) { lastP = p; bar.style.setProperty("--p", p); }
    const sc = y > 40;
    if (header && sc !== lastScrolled) { lastScrolled = sc; header.classList.toggle("scrolled", sc); }
    if (reduceMQ.matches) return;

    if (band && bandOn) {
      const r = band.getBoundingClientRect();
      band.style.setProperty("--par", clamp(-(r.top + r.height / 2 - vh / 2) * 0.12, -50, 50).toFixed(0));
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", () => { measure(); onScroll(); }, { passive: true });
  addEventListener("load", measure);
  if ("ResizeObserver" in window) new ResizeObserver(measure).observe(doc);
  measure();
  update();

  /* ---------- Micro-interactions: nút từ tính ---------- */
  if (fineMQ.matches) {
    document.addEventListener("pointermove", (e) => {
      if (reduceMQ.matches) return;
      const b = e.target.closest && e.target.closest(".btn");
      if (b) {
        const r = b.getBoundingClientRect();
        b.style.setProperty("--bx", ((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1) + "px");
        b.style.setProperty("--by", ((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1) + "px");
      }
    }, { passive: true });
    document.addEventListener("pointerout", (e) => {
      const b = e.target.closest && e.target.closest(".btn");
      if (b && !b.contains(e.relatedTarget)) { b.style.setProperty("--bx", "0px"); b.style.setProperty("--by", "0px"); }
    });
  }

})();

    /* Interactive 3D tilt for Saigon Community Banner */
    const saigonBanner = document.querySelector(".saigon-banner");
    if (saigonBanner && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      saigonBanner.addEventListener("mousemove", e => {
        const rect = saigonBanner.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        saigonBanner.style.setProperty("--tilt-x", (y * -7).toFixed(2) + "deg");
        saigonBanner.style.setProperty("--tilt-y", (x * 7).toFixed(2) + "deg");
      });
      saigonBanner.addEventListener("mouseleave", () => {
        saigonBanner.style.setProperty("--tilt-x", "0deg");
        saigonBanner.style.setProperty("--tilt-y", "0deg");
      });
    }
