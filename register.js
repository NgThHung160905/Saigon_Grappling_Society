/* ==========================================================================
   SGS · ĐĂNG KÝ HỌC VIÊN (native, không iframe)
   Gắn vào <section id="hoc-vien"> trong index.html. Dữ liệu gói/lịch/waiver lấy từ Apps Script
   (Code.gs là nguồn duy nhất: sửa giá ở đó, website tự cập nhật). Ngôn ngữ theo nút VIE/ENG của site.
   ========================================================================== */
const API = "https://script.google.com/macros/s/AKfycbyDb69jENGucvXbYpx5dvvxi8XaxHGZmVLU9kXMyLSC-9YbW7yW2XwilvePtzWTDukD/exec"; // <- URL Web app của Code.gs (đuôi /exec)

const mount = document.querySelector("#hoc-vien .rg-box");
if (mount) init();

function init() {
  const DAYN = { vi: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"], en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] };
  const T = {
    vi: {
      title: "Đăng ký<br><em>học viên</em>", sub: "Chọn gói tập, lớp học và thanh toán. Mất vài phút để có Customer ID.",
      c1: "Thông tin", fName: "Họ tên", fPhone: "Số điện thoại", fDob: "Ngày tháng năm sinh", dDay: "Ngày", dMonth: "Tháng", dYear: "Năm", eDob: "Chọn ngày tháng năm sinh hợp lệ", c2: "Gói đăng ký",
      planNote: "Bảng giá hiệu lực từ tháng 11/2026. Gói 3 và 6 tháng áp dụng cho gói tập theo khung giờ.",
      g_monthly: "Đăng ký theo tháng", g_allaccess: "All-access", g_dropin: "Drop-in", g_package: "Đăng ký gói",
      cPass1: "Chọn ngày tập", cPass2: "Chọn ngày và lớp tập", pickClass: "Chọn lớp",
      passNote1: "Pass có giá trị trong đúng ngày bạn chọn, tập tất cả các lớp trong ngày. Ngày không có lớp bị mờ; chọn được trong 60 ngày tới.",
      passNote2: "Pass chỉ dùng cho đúng lớp và ngày bạn chọn. Ngày không có lớp bị mờ; chọn được trong 60 ngày tới.",
      pickedDay: "Ngày đã chọn", noDay: "Chưa chọn ngày", ePassDate: "Chọn ngày tập", ePassSlot: "Chọn một lớp", sumDay: "Ngày tập", sumAllDay: "Tất cả các lớp trong ngày",
      c3: "Chọn lớp", days: "Ngày tập", pickSlot: "Chọn 1 lớp theo khung giờ",
      openMat: (l, t, d) => `${l} · ${t} · ${d} (miễn phí cho mọi học viên)`,
      c4: "Bạn biết SGS thông qua đâu?", srcOther: "Nhập nguồn khác", go: "Đăng ký", sending: "Đang gửi...",
      eName: "Nhập họ tên", ePhone: "Số điện thoại chưa đúng", eEmail: "Email chưa đúng", ePlan: "Chọn gói đăng ký",
      ePattern: "Chọn ngày tập", eSlot: "Chọn một lớp", eSource: "Vui lòng chọn một mục", eSourceOther: "Nhập nguồn khác",
      eWaiver: "Cần đồng ý để đăng ký", eForm: "Thông tin chưa hợp lệ, vui lòng kiểm tra lại.", eConn: "Lỗi kết nối, thử lại.",
      dupPhone: "Số điện thoại này đã đăng ký.", dupEmail: "Email này đã đăng ký.", dupHelp: "Cần hỗ trợ? Hãy hỏi coach.",
      loading: "Đang tải...", loadFail: "Không tải được dữ liệu đăng ký.", retry: "Thử lại",
      doneTitle: "Đăng ký thành công", cidLabel: "Customer ID", payTitle: "Thanh toán",
      payScan: "Quét mã bằng app ngân hàng để chuyển khoản.", openQr: "Mở mã QR", amount: "Số tiền", transferNote: "Nội dung chuyển khoản",
      copy: "Sao chép", copied: "Đã chép ✓", adminConfirm: "Admin sẽ xác nhận khi nhận được tiền.", nextTitle: "Bước tiếp theo",
      step1: "Chuyển khoản theo mã QR và ghi đúng nội dung.", step2: "Đến lớp, báo tên cho coach để được check-in.",
      daysWord: (p) => "Thứ " + p.label
    },
    en: {
      title: "Student<br><em>registration</em>", sub: "Pick a plan, your class and pay. Takes a few minutes to get your Customer ID.",
      c1: "Your details", fName: "Full name", fPhone: "Phone number", fDob: "Date of birth", dDay: "Day", dMonth: "Month", dYear: "Year", eDob: "Choose a valid date of birth", c2: "Plan",
      planNote: "Prices effective Nov 2026. 3- and 6-month packages apply to time-slot plans.",
      g_monthly: "Monthly", g_allaccess: "All-access", g_dropin: "Drop-in", g_package: "Packages",
      cPass1: "Choose your day", cPass2: "Choose your day and class", pickClass: "Choose a class",
      passNote1: "The pass is valid on the day you choose, for every class that day. Days without classes are greyed out; you can book up to 60 days ahead.",
      passNote2: "The pass is valid for the class and day you choose only. Days without classes are greyed out; you can book up to 60 days ahead.",
      pickedDay: "Selected day", noDay: "No day selected", ePassDate: "Choose a day", ePassSlot: "Pick one class", sumDay: "Class day", sumAllDay: "Every class that day",
      c3: "Choose your class", days: "Training days", pickSlot: "Pick one time slot",
      openMat: (l, t, d) => `${l} · ${t} · ${d} (free for all members)`,
      c4: "How did you hear about SGS?", srcOther: "Please specify", go: "Register", sending: "Sending...",
      eName: "Enter your full name", ePhone: "Invalid phone number", eEmail: "Invalid email", ePlan: "Choose a plan",
      ePattern: "Choose your training days", eSlot: "Pick one class", eSource: "Please choose one", eSourceOther: "Please specify",
      eWaiver: "You must agree to register", eForm: "Please check your details.", eConn: "Connection error, please try again.",
      dupPhone: "This phone number is already registered.", dupEmail: "This email is already registered.", dupHelp: "Need help? Ask your coach.",
      loading: "Loading...", loadFail: "Could not load the registration data.", retry: "Try again",
      doneTitle: "You're registered", cidLabel: "Customer ID", payTitle: "Payment",
      payScan: "Scan with your banking app to transfer.", openQr: "Open QR code", amount: "Amount", transferNote: "Transfer note",
      copy: "Copy", copied: "Copied ✓", adminConfirm: "Our admin will confirm once the payment is received.", nextTitle: "Next steps",
      step1: "Transfer using the QR code and include the note above.", step2: "At class, tell your coach your name to be checked in.",
      daysWord: (p) => p.label + " (" + p.en + ")"
    }
  };
  const MON = { vi: ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"], en: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] };
  const SLOT = {
    Morning: { vi: "Sáng · Mọi trình độ", en: "Morning · For all levels" },
    Noon: { vi: "Trưa · Mọi trình độ", en: "Noon · For all levels" },
    "Open Mat": { vi: "Free Open Mat (tập tự do)", en: "Free Open Mat" },
    Fundamental: { vi: "Fundamental (căn bản)", en: "Fundamental" },
    Competition: { vi: "Lớp Competition (thi đấu)", en: "Competition class" }
  };

  let lang = "vi";
  try { const s = localStorage.getItem("sgs_lang"); if (s === "en" || s === "vi") lang = s; } catch (e) { /* storage bị chặn */ }
  let cfg = null, plan = null, pattern = null, slotName = "", source = null, busy = false, done = null;
  let passDate = "", passSlot = "", calM = null;   // pass drop-in: ngày đã chọn (yyyy-MM-dd), lớp đã chọn, tháng đang xem trong lịch
  const errs = {};
  let dup = null, formErr = "";
  const $ = (s) => mount.querySelector(s);
  const t = (k) => T[lang][k];
  const money = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ";
  const fold = (x) => String(x || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
  const slotLabel = (s) => (SLOT[s.name] || { vi: s.label, en: s.label })[lang];
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

  /* ---------- gọi Apps Script ---------- */
  function jsonp(params) {
    return new Promise((resolve, reject) => {
      const cb = "sgsCb" + Date.now() + Math.floor(Math.random() * 1e6);
      const s = document.createElement("script");
      const clean = () => { delete window[cb]; s.remove(); clearTimeout(timer); };
      const timer = setTimeout(() => { clean(); reject(new Error("timeout")); }, 15000);
      window[cb] = (r) => { clean(); resolve(r); };
      s.onerror = () => { clean(); reject(new Error("network")); };
      s.src = API + "?" + new URLSearchParams({ ...params, callback: cb });
      document.head.appendChild(s);
    });
  }
  async function send(payload) {
    try {
      const r = await fetch(API, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ fn: "register", data: payload }) });
      return await r.json();
    } catch (e) {
      // trình duyệt chặn đọc phản hồi POST -> gửi lại qua JSONP (server tự chặn trùng nên không tạo 2 học viên)
      return jsonp({ api: "register", data: JSON.stringify(payload) });
    }
  }

  /* ---------- khung HTML (dựng 1 lần) ---------- */
  function build() {
    mount.innerHTML = `
      <div class="rg-head"><h2 class="t t-lg" id="rgTitle"></h2><p id="rgSub"></p></div>
      <div id="rgLoad" class="rg-load"></div>
      <div id="rgForm" class="hidden">
        <div id="rgDup" class="rg-dup hidden"></div>
        <div class="rg-card">
          <h3><i>1</i><span data-t="c1"></span></h3>
          <label class="rg-f" for="rgName" data-t="fName"></label><input id="rgName" type="text" autocomplete="name">
          <div class="rg-err" id="e_name"></div>
          <label class="rg-f" for="rgPhone" data-t="fPhone"></label><input id="rgPhone" type="tel" inputmode="tel" autocomplete="tel" placeholder="09xx xxx xxx">
          <div class="rg-err" id="e_phone"></div>
          <label class="rg-f" for="rgEmail">Email</label><input id="rgEmail" type="email" inputmode="email" autocomplete="email">
          <div class="rg-err" id="e_email"></div>
          <label class="rg-f" data-t="fDob"></label>
          <div class="rg-dob"><select id="rgDd"></select><select id="rgDm"></select><select id="rgDy"></select></div>
          <div class="rg-err" id="e_dob"></div>
        </div>
        <div class="rg-card">
          <h3><i>2</i><span data-t="c2"></span></h3>
          <div id="rgPlans"></div><div class="rg-err" id="e_plan"></div>
          <div class="rg-note" data-t="planNote"></div>
        </div>
        <div class="rg-card hidden" id="rgSlotBox">
          <h3><i>3</i><span data-t="c3"></span></h3>
          <label class="rg-f" data-t="days"></label>
          <div class="rg-seg" id="rgPat"></div><div class="rg-err" id="e_pattern"></div>
          <div id="rgSlotWrap" class="hidden"><label class="rg-f" style="margin-top:18px" data-t="pickSlot"></label><div id="rgSlots"></div></div>
          <div class="rg-err" id="e_slots"></div>
          <div class="rg-note" id="rgOpenMat"></div>
        </div>
        <div class="rg-card hidden" id="rgPassBox">
          <h3><i>3</i><span id="rgPassTitle"></span></h3>
          <div class="rg-note" id="rgPassNote" style="margin:-6px 0 10px"></div>
          <div class="rg-cal" id="rgCal"></div>
          <div class="rg-picked" id="rgPicked"></div>
          <div class="rg-err" id="e_passDate"></div>
          <div id="rgPassSlotWrap" class="hidden"><label class="rg-f" style="margin-top:18px" data-t="pickClass"></label><div id="rgPassSlots"></div></div>
          <div class="rg-err" id="e_passSlot"></div>
        </div>
        <div class="rg-card">
          <h3><i id="rgNSrc">3</i><span data-t="c4"></span></h3>
          <div id="rgSrc"></div><input id="rgSrcOther" class="hidden" type="text" maxlength="100" style="margin-top:4px">
          <div class="rg-err" id="e_source"></div>
        </div>
        <div class="rg-card">
          <h3><i id="rgNWav">4</i><span id="rgWvTitle"></span></h3>
          <div class="rg-waiver" id="rgWaiver"></div>
          <label class="rg-check"><input id="rgAgree" type="checkbox"><span id="rgWvAgree"></span></label>
          <div class="rg-err" id="e_waiver"></div>
        </div>
        <div class="rg-err" id="e_form" style="margin-bottom:10px"></div>
        <button class="btn rg-submit" id="rgGo" type="button"></button>
      </div>
      <div id="rgDone" class="hidden">
        <div class="rg-card rg-center">
          <div class="rg-tick">&#10003;</div>
          <div class="rg-done-title" data-t="doneTitle"></div>
          <div class="rg-lbl" data-t="cidLabel"></div><div class="rg-cid" id="rgCid"></div>
          <div id="rgHello" style="font-size:1.1rem;font-weight:600"></div><div class="rg-sum" id="rgSum"></div>
        </div>
        <div class="rg-card rg-center">
          <h3 style="justify-content:center"><span data-t="payTitle"></span></h3>
          <div class="rg-note" style="margin:-6px 0 8px" data-t="payScan"></div>
          <img id="rgQr" class="rg-qr" alt="QR">
          <a id="rgQrLink" class="hidden" target="_blank" rel="noopener" data-t="openQr"></a>
          <div class="rg-kv"><div><div class="rg-k" data-t="amount"></div><div class="rg-v" id="rgAmt"></div></div><button type="button" id="rgCpAmt" data-t="copy"></button></div>
          <div class="rg-kv"><div><div class="rg-k" data-t="transferNote"></div><div class="rg-v" id="rgNote"></div></div><button type="button" id="rgCpNote" data-t="copy"></button></div>
          <div class="rg-note" data-t="adminConfirm"></div>
        </div>
        <div class="rg-card"><h3><span data-t="nextTitle"></span></h3><ol class="rg-steps" id="rgSteps"></ol></div>
      </div>`;
    $("#rgGo").onclick = submit;
    $("#rgCpAmt").onclick = function () { copy(String(done.plan.price), this); };
    $("#rgCpNote").onclick = function () { copy(done.id + " " + fold(done.name).toUpperCase(), this); };
  }

  /* ---------- dựng các lựa chọn ---------- */
  function radioRow(group, value, title, price, lines, selected, onPick) {
    const row = el("label", "rg-opt" + (selected ? " on" : ""));
    const rb = el("input"); rb.type = "radio"; rb.name = group; rb.value = value; rb.checked = !!selected;
    const body = el("div", "rg-body"), top = el("div", "rg-top");
    top.appendChild(el("div", "rg-t", title)); if (price) top.appendChild(el("div", "rg-p", price));
    body.appendChild(top);
    (lines || []).forEach((l) => body.appendChild(el("div", "rg-m" + (l.perk ? " perk" : ""), l.text)));
    row.append(rb, el("span", "rg-dot"), body);
    rb.addEventListener("change", () => {
      row.parentNode.querySelectorAll(".rg-opt").forEach((r) => r.classList.toggle("on", r === row));
      onPick();
    });
    return row;
  }
  function renderPlans() {
    const box = $("#rgPlans"); box.innerHTML = ""; let last = "";
    cfg.plans.forEach((p) => {
      if (p.group !== last) { box.appendChild(el("div", "rg-grp", t("g_" + p.group))); last = p.group; }
      box.appendChild(radioRow("rgplan", p.code, lang === "vi" ? p.vi : p.en, money(p.price),
        [{ text: lang === "vi" ? p.perk : p.perkEn, perk: true }], plan && plan.code === p.code, () => {
          plan = p; $("#rgSlotBox").classList.toggle("hidden", !p.slots);
          $("#rgPassBox").classList.toggle("hidden", p.group !== "dropin");
          if (p.group === "dropin") { passSlot = ""; if (passDate && !dayOk(passDate)) passDate = ""; renderPass(); }
          numberCards(); setErr("plan", ""); setErr("slots", ""); setErr("pattern", ""); setErr("passDate", ""); setErr("passSlot", "");
        }));
    });
  }
  const dayText = (idx) => idx.map((d) => DAYN[lang][d]).join(" / ");
  function renderPatterns() {
    const seg = $("#rgPat"); seg.innerHTML = "";
    cfg.patterns.forEach((pt) => {
      const b = el("button"); b.type = "button"; if (pattern && pattern.code === pt.code) b.className = "on";
      b.append(el("b", "", lang === "vi" ? pt.vi : pt.label), el("span", "", lang === "vi" ? pt.days.map((d) => DAYN.vi[d]).join(" · ") : pt.en));
      b.onclick = () => { pattern = pt; slotName = ""; renderPatterns(); renderSlots(); setErr("pattern", ""); setErr("slots", ""); };
      seg.appendChild(b);
    });
  }
  function renderSlots() {
    const box = $("#rgSlots"); box.innerHTML = "";
    if (!pattern) { $("#rgSlotWrap").classList.add("hidden"); return; }
    $("#rgSlotWrap").classList.remove("hidden");
    cfg.schedule.filter((s) => !s.free && pattern.days.some((d) => s.days[d])).forEach((s) => {
      const by = {}, order = [];
      pattern.days.forEach((d) => { const c = s.days[d]; if (!c) return; if (!by[c]) { by[c] = []; order.push(c); } by[c].push(d); });
      box.appendChild(radioRow("rgslot", s.name, slotLabel(s) + " · " + s.start + "–" + s.end, "",
        order.map((c) => ({ text: c + ": " + dayText(by[c]) })), slotName === s.name, () => { slotName = s.name; setErr("slots", ""); }));
    });
  }
  function renderOpenMat() {
    const f = cfg.schedule.find((s) => s.free);
    const days = f ? f.days.map((c, d) => (c ? DAYN[lang][d] : null)).filter(Boolean).join(", ") : "";
    $("#rgOpenMat").textContent = f ? T[lang].openMat(slotLabel(f), f.start + "–" + f.end, days) : "";
  }
  function renderSources() {
    const box = $("#rgSrc"); box.innerHTML = "";
    cfg.sources.forEach((s) => box.appendChild(radioRow("rgsrc", s.code, lang === "vi" ? s.vi : s.en, "", [], source && source.code === s.code, () => {
      source = s; $("#rgSrcOther").classList.toggle("hidden", !s.text); if (s.text) $("#rgSrcOther").focus(); setErr("source", "");
    })));
    $("#rgSrcOther").classList.toggle("hidden", !(source && source.text));
  }
  function numberCards() { const n = plan && (plan.slots || plan.group === "dropin") ? 4 : 3; $("#rgNSrc").textContent = n; $("#rgNWav").textContent = n + 1; }

  /* ---------- pass drop-in: lịch mini chọn ngày + chọn lớp của ngày đó ---------- */
  const isoOf = (y, m, d) => y + "-" + String(m).padStart(2, "0") + "-" + String(d).padStart(2, "0");
  const dowIso = (iso) => { const [y, m, d] = iso.split("-").map(Number); return (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7; };
  const addDaysIso = (iso, n) => { const [y, m, d] = iso.split("-").map(Number); const x = new Date(Date.UTC(y, m - 1, d + n)); return isoOf(x.getUTCFullYear(), x.getUTCMonth() + 1, x.getUTCDate()); };
  const hmMin = (x) => { const [h, m] = x.split(":").map(Number); return h * 60 + m; };
  // lớp mà pass dùng được vào ngày đó (1 lớp: không tính Open Mat miễn phí; hôm nay: bỏ lớp đã kết thúc)
  function passClasses(iso) {
    const dow = dowIso(iso), one = plan && plan.code === "ONECLASS";
    return cfg.schedule.filter((s) => !!s.days[dow] && !(one && s.free) && !(iso === cfg.today && hmMin(s.end) <= cfg.nowMin));
  }
  const dayOk = (iso) => iso >= cfg.today && iso <= addDaysIso(cfg.today, cfg.passMax) && passClasses(iso).length > 0;
  const fmtDay = (iso) => { const [y, m, d] = iso.split("-"); return DAYN[lang][dowIso(iso)] + " " + d + "/" + m + "/" + y; };
  function renderPass() {
    if (!cfg || !plan || plan.group !== "dropin") return;
    const one = plan.code === "ONECLASS";
    $("#rgPassTitle").textContent = t(one ? "cPass2" : "cPass1");
    $("#rgPassNote").textContent = t(one ? "passNote2" : "passNote1");
    if (!calM) { const p = (passDate || cfg.today).split("-"); calM = { y: +p[0], m: +p[1] }; }
    const box = $("#rgCal"); box.innerHTML = "";
    const tp = cfg.today.split("-").map(Number), mp = addDaysIso(cfg.today, cfg.passMax).split("-").map(Number);
    const first = tp[0] * 12 + tp[1], last = mp[0] * 12 + mp[1], cur = calM.y * 12 + calM.m;
    const head = el("div", "rg-ch");
    const prev = el("button", "", "‹"), next = el("button", "", "›");
    prev.type = next.type = "button"; prev.disabled = cur <= first; next.disabled = cur >= last;
    prev.onclick = () => { calM = calM.m === 1 ? { y: calM.y - 1, m: 12 } : { y: calM.y, m: calM.m - 1 }; renderPass(); };
    next.onclick = () => { calM = calM.m === 12 ? { y: calM.y + 1, m: 1 } : { y: calM.y, m: calM.m + 1 }; renderPass(); };
    head.append(prev, el("b", "", MON[lang][calM.m - 1] + " " + calM.y), next); box.appendChild(head);
    const g = el("div", "rg-g");
    DAYN[lang].forEach((n) => g.appendChild(el("div", "rg-wd", n)));
    const lead = dowIso(isoOf(calM.y, calM.m, 1)), dim = new Date(Date.UTC(calM.y, calM.m, 0)).getUTCDate();
    for (let i = 0; i < lead; i++) g.appendChild(el("div", "rg-blank"));
    for (let d = 1; d <= dim; d++) {
      const iso = isoOf(calM.y, calM.m, d), ok = dayOk(iso);
      const b = el("button", "rg-d" + (ok ? "" : " off") + (iso === cfg.today ? " today" : "") + (iso === passDate ? " on" : ""), String(d));
      b.type = "button";
      if (ok) b.onclick = () => {
        passDate = iso;
        if (passSlot && !passClasses(iso).some((s) => s.name === passSlot)) passSlot = "";
        setErr("passDate", ""); renderPass();
      }; else b.disabled = true;
      g.appendChild(b);
    }
    box.appendChild(g);
    $("#rgPicked").textContent = passDate ? t("pickedDay") + ": " + fmtDay(passDate) : t("noDay");
    const wrap = $("#rgPassSlotWrap"), list = $("#rgPassSlots"); list.innerHTML = "";
    wrap.classList.toggle("hidden", !(one && passDate));
    if (one && passDate) {
      const dow = dowIso(passDate);
      passClasses(passDate).forEach((s) => list.appendChild(radioRow("rgpslot", s.name, slotLabel(s) + " · " + s.start + "–" + s.end, "",
        [{ text: s.days[dow] }], passSlot === s.name, () => { passSlot = s.name; setErr("passSlot", ""); })));
    }
  }

  /* ---------- ngày sinh (3 ô chọn, giữ giá trị khi đổi ngôn ngữ) ---------- */
  function renderDob() {
    const keep = { d: $("#rgDd").value, m: $("#rgDm").value, y: $("#rgDy").value };
    const fill = (sel, ph, items, val) => {
      sel.innerHTML = ""; const o = el("option", "", ph); o.value = ""; sel.appendChild(o);
      items.forEach(([v, label]) => { const e = el("option", "", label); e.value = v; sel.appendChild(e); });
      sel.value = val;
    };
    const pad = (n) => String(n).padStart(2, "0"), now = new Date().getFullYear();
    fill($("#rgDd"), t("dDay"), Array.from({ length: 31 }, (_, i) => [pad(i + 1), String(i + 1)]), keep.d);
    fill($("#rgDm"), t("dMonth"), MON[lang].map((n, i) => [pad(i + 1), n]), keep.m);
    fill($("#rgDy"), t("dYear"), Array.from({ length: 96 }, (_, i) => [String(now - 3 - i), String(now - 3 - i)]), keep.y);
  }
  function dobValue() {
    const d = $("#rgDd").value, m = $("#rgDm").value, y = $("#rgDy").value;
    if (!d || !m || !y) return "";
    const dt = new Date(+y, +m - 1, +d);
    return dt.getFullYear() === +y && dt.getMonth() === +m - 1 && dt.getDate() === +d && dt <= new Date() ? `${y}-${m}-${d}` : "";
  }

  /* ---------- lỗi ---------- */
  function setErr(f, key) {
    if (key) errs[f] = key; else delete errs[f];
    const box = $("#e_" + f); if (box) box.textContent = key ? t(key) : "";
    const inp = { name: "#rgName", phone: "#rgPhone", email: "#rgEmail", source: "#rgSrcOther" }[f];
    if (f === "dob") ["#rgDd", "#rgDm", "#rgDy"].forEach((i) => $(i).classList.toggle("bad", !!key));
    if (inp) $(inp).classList.toggle("bad", !!key && !(f === "source" && $(inp).classList.contains("hidden")));
  }
  function clearErrs() {
    ["name", "phone", "email", "dob", "plan", "pattern", "slots", "passDate", "passSlot", "source", "waiver"].forEach((f) => setErr(f, ""));
    formErr = ""; $("#e_form").textContent = ""; dup = null; $("#rgDup").classList.add("hidden");
  }
  function renderDup() {
    const box = $("#rgDup");
    if (!dup) { box.classList.add("hidden"); return; }
    box.innerHTML = "";
    if (dup.phone) box.appendChild(el("p", "", t("dupPhone")));
    if (dup.email) box.appendChild(el("p", "", t("dupEmail")));
    box.appendChild(el("p", "", t("dupHelp"))); box.classList.remove("hidden");
  }

  /* ---------- chữ tĩnh + đổi ngôn ngữ ---------- */
  function applyStatic() {
    $("#rgTitle").innerHTML = t("title"); $("#rgSub").textContent = t("sub");
    mount.querySelectorAll("[data-t]").forEach((n) => { n.textContent = t(n.getAttribute("data-t")); });
    if (cfg) {
      const w = cfg.waiver[lang] || cfg.waiver.vi;
      $("#rgWvTitle").textContent = w.title; $("#rgWaiver").textContent = w.text; $("#rgWvAgree").textContent = w.agree;
    }
    $("#rgSrcOther").placeholder = t("srcOther");
    if (!busy) $("#rgGo").textContent = t("go");
  }
  function render() {
    applyStatic();
    if (!cfg) return;
    renderDob(); renderPlans(); renderPatterns(); renderSlots(); renderOpenMat(); renderSources(); renderPass(); numberCards();
    Object.keys(errs).forEach((f) => { $("#e_" + f).textContent = t(errs[f]); });
    $("#e_form").textContent = formErr ? t(formErr) : ""; renderDup();
    if (done) fillDone();
  }
  window.addEventListener("sgs_language_change", (e) => { if (e.detail && T[e.detail.lang]) { lang = e.detail.lang; render(); } });

  /* ---------- kiểm tra dữ liệu ---------- */
  function validate() {
    clearErrs(); let ok = true;
    const name = $("#rgName").value.trim(), phone = $("#rgPhone").value.replace(/\D/g, ""), email = $("#rgEmail").value.trim();
    if (!name) { setErr("name", "eName"); ok = false; }
    if (phone.length < 8 || phone.length > 15) { setErr("phone", "ePhone"); ok = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr("email", "eEmail"); ok = false; }
    if (!dobValue()) { setErr("dob", "eDob"); ok = false; }
    if (!plan) { setErr("plan", "ePlan"); ok = false; }
    else if (plan.slots) {
      if (!pattern) { setErr("pattern", "ePattern"); ok = false; }
      else if (!slotName) { setErr("slots", "eSlot"); ok = false; }
    }
    if (plan && plan.group === "dropin") {
      if (!passDate || !dayOk(passDate)) { setErr("passDate", "ePassDate"); ok = false; }
      else if (plan.code === "ONECLASS" && !passSlot) { setErr("passSlot", "ePassSlot"); ok = false; }
    }
    if (!source) { setErr("source", "eSource"); ok = false; }
    else if (source.text && !$("#rgSrcOther").value.trim()) { setErr("source", "eSourceOther"); ok = false; }
    if (!$("#rgAgree").checked) { setErr("waiver", "eWaiver"); ok = false; }
    if (!ok) { const first = mount.querySelector(".rg-err:not(:empty)"); first && first.scrollIntoView({ behavior: "smooth", block: "center" }); }
    return ok;
  }

  /* ---------- màn hình hoàn tất ---------- */
  function copy(text, btn) {
    const ok = () => { btn.textContent = t("copied"); setTimeout(() => { btn.textContent = t("copy"); }, 1500); };
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(ok, () => {}); return; }
    const ta = document.createElement("textarea"); ta.value = text; ta.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); ok(); } catch (e) { /* bỏ qua */ } ta.remove();
  }
  let qrShown = false;
  function showQr() {
    if (qrShown) return; qrShown = true;
    const id = cfg.qrId, img = $("#rgQr"), link = $("#rgQrLink");
    if (!id) { img.classList.add("hidden"); return; }
    link.href = "https://drive.google.com/file/d/" + id + "/view";
    const urls = ["https://drive.google.com/thumbnail?id=" + id + "&sz=w1000", "https://lh3.googleusercontent.com/d/" + id + "=w1000"];
    let i = 0;
    img.onerror = () => { i++; if (i < urls.length) img.src = urls[i]; else { img.classList.add("hidden"); link.classList.remove("hidden"); } };
    img.src = urls[0];
  }
  function fillDone() {
    const d = done;
    $("#rgCid").textContent = d.id; $("#rgHello").textContent = d.name;
    const lines = [(lang === "vi" ? d.plan.vi : d.plan.en) + " · " + money(d.plan.price)];
    if (d.plan.slots && d.pattern) {
      const s = cfg.schedule.find((x) => x.name === d.slot);
      lines.push(T[lang].daysWord(d.pattern) + " · " + (s ? slotLabel(s) + " " + s.start + "–" + s.end : d.slot));
    }
    if (d.plan.group === "dropin" && d.passDate) {
      lines.push(t("sumDay") + ": " + fmtDay(d.passDate));
      const ps = cfg.schedule.find((x) => x.name === d.passSlot);
      lines.push(ps ? slotLabel(ps) + " " + ps.start + "–" + ps.end : t("sumAllDay"));
    }
    $("#rgSum").textContent = lines.join("\n");
    $("#rgAmt").textContent = money(d.plan.price);
    $("#rgNote").textContent = d.id + " " + fold(d.name).toUpperCase();
    const ol = $("#rgSteps"); ol.innerHTML = "";
    [t("step1"), t("step2")].forEach((x) => ol.appendChild(el("li", "", x)));
  }

  /* ---------- gửi đăng ký ---------- */
  async function submit() {
    if (busy || !validate()) return;
    busy = true; $("#rgGo").disabled = true; $("#rgGo").textContent = t("sending");
    const payload = {
      name: $("#rgName").value, phone: $("#rgPhone").value, email: $("#rgEmail").value, dob: dobValue(), pin: "",
      plan: plan.code, pattern: plan.slots && pattern ? pattern.code : "", slot: plan.slots ? slotName : "",
      passDate: plan.group === "dropin" ? passDate : "", passSlot: plan.code === "ONECLASS" ? passSlot : "",
      source: source.code, sourceOther: source.text ? $("#rgSrcOther").value : "", waiver: $("#rgAgree").checked
    };
    let r;
    try { r = await send(payload); } catch (e) { r = null; }
    busy = false; $("#rgGo").disabled = false; $("#rgGo").textContent = t("go");
    if (!r) { formErr = "eConn"; $("#e_form").textContent = t("eConn"); return; }
    if (r.ok) {
      done = { id: r.id, name: r.name, plan, pattern, slot: slotName, passDate, passSlot };
      fillDone(); showQr();
      $("#rgForm").classList.add("hidden"); $("#rgDone").classList.remove("hidden"); mount.querySelector(".rg-head").classList.add("hidden");
      mount.closest("section").scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (r.error === "duplicate") {
      dup = { phone: !!r.phone, email: !!r.email }; renderDup(); $("#rgDup").scrollIntoView({ behavior: "smooth", block: "center" });
    } else { formErr = "eForm"; $("#e_form").textContent = t("eForm"); }
  }

  /* ---------- tải dữ liệu ---------- */
  async function load() {
    const box = $("#rgLoad"); box.className = "rg-load"; box.textContent = t("loading");
    try {
      const c = await jsonp({ api: "config" });
      if (!c || !c.ok) throw new Error("bad");
      cfg = c; box.classList.add("hidden"); $("#rgForm").classList.remove("hidden"); render();
    } catch (e) {
      box.textContent = t("loadFail"); const b = el("button", "btn sm", t("retry")); b.type = "button"; b.onclick = load; box.appendChild(document.createElement("br")); box.appendChild(b);
    }
  }
  /* ---------- chuyển chế độ: tập thử / học viên ---------- */
  const reg = mount.closest("section");
  function setMode(mode, scroll) {
    reg.dataset.mode = mode;
    document.querySelectorAll(".reg-tab").forEach((b) => { const on = b.dataset.regTab === mode; b.classList.toggle("on", on); b.setAttribute("aria-selected", String(on)); });
    if (scroll) reg.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  document.querySelectorAll(".reg-tab").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.regTab)));
  document.querySelectorAll("a[data-reg-tab]").forEach((a) => a.addEventListener("click", () => setMode(a.dataset.regTab)));   // nút "Đăng ký học viên" ở bảng giá
  if (/^#(member|hoc-vien|dang-ky-hoc-vien)$/.test(location.hash)) setMode("member");
  window.addEventListener("hashchange", () => { if (/^#(member|hoc-vien|dang-ky-hoc-vien)$/.test(location.hash)) setMode("member", true); });
  setMode(reg.dataset.mode || "trial");

  build(); applyStatic();
  // chỉ tải khi khách cuộn gần tới khu vực này (đỡ gọi Apps Script cho người chỉ xem trang)
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((en) => { if (en[0].isIntersecting) { io.disconnect(); load(); } }, { rootMargin: "600px" });
    io.observe(mount);
  } else load();
  $("#rgLoad").textContent = t("loading");
}