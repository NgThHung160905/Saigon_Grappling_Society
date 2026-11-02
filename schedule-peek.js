/* SGS · /register: nút nổi "Xem lịch tập" để vừa xem lịch vừa nhập thông tin.
   Lịch nằm ngay đầu trang; khi người dùng cuộn xuống form (lịch ra khỏi màn hình), nút xuất hiện và mở lịch trong cửa sổ nổi. */
import { getLang } from "./site.js";

const TXT = {
  vi: { btn: "Xem lịch tập", title: "Lịch tập trong tuần", close: "Đóng", show: "Xem lịch tập", hide: "Ẩn lịch tập" },
  en: { btn: "View schedule", title: "Weekly schedule", close: "Close", show: "View weekly schedule", hide: "Hide schedule" }
};
const section = document.querySelector("#lich");
const poster = section && section.querySelector(".tt-poster");
if (poster) {
  const t = () => TXT[getLang()] || TXT.vi;

  const btn = document.createElement("button");
  btn.type = "button"; btn.className = "peek-btn";
  btn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg><span></span>';

  const overlay = document.createElement("div");
  overlay.className = "peek"; overlay.hidden = true;
  overlay.setAttribute("role", "dialog"); overlay.setAttribute("aria-modal", "true");
  overlay.innerHTML = '<div class="peek-panel"><div class="peek-head"><b></b><button type="button" class="peek-x"></button></div><div class="peek-body"></div></div>';
  document.body.append(btn, overlay);

  // nút bật/tắt lịch ở đầu trang (mặc định ẩn)
  const toggle = document.querySelector("#lich-toggle"), lichBody = document.querySelector("#lich-body");
  const syncToggle = () => {
    if (!toggle || !lichBody) return;
    const open = !lichBody.hidden;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.classList.toggle("open", open);
    section.classList.toggle("lich-open", open);
    toggle.querySelector("span").textContent = open ? t().hide : t().show;
  };
  if (toggle && lichBody) toggle.addEventListener("click", () => { lichBody.hidden = !lichBody.hidden; syncToggle(); });

  const label = () => {
    syncToggle();
    btn.querySelector("span").textContent = t().btn;
    overlay.querySelector(".peek-head b").textContent = t().title;
    overlay.querySelector(".peek-x").textContent = t().close;
    overlay.setAttribute("aria-label", t().title);
  };
  const open = () => {
    const body = overlay.querySelector(".peek-body");
    const copy = poster.cloneNode(true);
    copy.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));   // tránh trùng id với lịch gốc
    body.replaceChildren(copy);
    overlay.hidden = false; document.documentElement.classList.add("peek-open");
    overlay.querySelector(".peek-x").focus();
  };
  const close = () => { overlay.hidden = true; overlay.querySelector(".peek-body").replaceChildren(); document.documentElement.classList.remove("peek-open"); btn.focus({ preventScroll: true }); };
  btn.addEventListener("click", open);
  overlay.querySelector(".peek-x").addEventListener("click", close);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !overlay.hidden) close(); });
  window.addEventListener("sgs_language_change", () => { label(); if (!overlay.hidden) open(); });
  label();

  // chỉ hiện nút khi lịch ở đầu trang đã cuộn ra khỏi màn hình
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => btn.classList.toggle("show", !e.isIntersecting), { threshold: 0.05 }).observe(section);
  } else btn.classList.add("show");
}
