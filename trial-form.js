/* SGS · Form đăng ký tập thử (chỉ nạp ở trang /register) */
import { $, I18N, CONFIG, TYPES, esc, vnd, getLang } from "./site.js";

    /* ---- Form Registration & Date Picker ---- */
    const form = $("#form"), slotSel = $("#slot"), ticket = $("#ticket");
    const dateInput = $("#date"), dateBtn = $("#date-btn");
    const calPopover = $("#cal-popover"), calDays = $("#cal-days"), calTitle = $("#cal-title");
    const calPrev = $("#cal-prev"), calNext = $("#cal-next"), calInfoText = $("#cal-info-text");
    const dateQuickWrap = $("#date-quick-wrap");

    let calDate = new Date();
    calDate.setDate(1);

    function getSelectedProgram() {
      return (form && form.program && form.program.value) || "BJJ";
    }

    function formatDateDDMMYY(d) {
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = String(d.getFullYear()).slice(-2);
      return `${day}/${month}/${year}`;
    }

    function parseDateDDMMYY(str) {
      const m = /^(\d{2})\/(\d{2})\/(\d{2})$/.exec((str || "").trim());
      if (!m) return null;
      const d = parseInt(m[1], 10), mo = parseInt(m[2], 10) - 1, yr = 2000 + parseInt(m[3], 10);
      const dt = new Date(yr, mo, d);
      return isNaN(dt.getTime()) ? null : dt;
    }

    function isDateAvailableForProgram(dateObj, program) {
      const todayZero = new Date();
      todayZero.setHours(0, 0, 0, 0);
      const checkDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
      if (checkDate < todayZero) return false;
      const dow = checkDate.getDay();
      if (dow === 0) return false; // Sunday off
      if (program === "Striking") {
        return dow === 2 || dow === 4 || dow === 6; // Tue, Thu, Sat
      }
      return true; // BJJ Mon-Sat
    }

    function renderCalendar() {
      if (!calPopover || calPopover.hidden) return;
      const t = I18N[getLang()];
      const program = getSelectedProgram();
      const currentYear = calDate.getFullYear();
      const currentMonth = calDate.getMonth();

      if (getLang() === "vi") {
        calTitle.textContent = `${t.calendar.months[currentMonth]}, ${currentYear}`;
      } else {
        calTitle.textContent = `${t.calendar.months[currentMonth]} ${currentYear}`;
      }

      if (program === "Striking") {
        calInfoText.textContent = t.calendar.infoStriking;
      } else {
        calInfoText.textContent = t.calendar.infoBJJ;
      }

      // Render calendar weekdays
      const calWeekdays = calPopover.querySelector(".cal-weekdays");
      if (calWeekdays) {
        calWeekdays.innerHTML = t.calendar.weekdays.map(w => `<span>${w}</span>`).join("");
      }

      const firstDay = new Date(currentYear, currentMonth, 1).getDay();
      const offset = (firstDay === 0 ? 6 : firstDay - 1);
      const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

      const todayZero = new Date();
      todayZero.setHours(0, 0, 0, 0);
      const parsedSelected = parseDateDDMMYY(dateInput.value);

      calDays.innerHTML = "";

      for (let i = 0; i < offset; i++) {
        const span = document.createElement("span");
        span.className = "cal-day empty";
        calDays.appendChild(span);
      }

      for (let d = 1; d <= totalDays; d++) {
        const cellDate = new Date(currentYear, currentMonth, d);
        const dow = cellDate.getDay();
        const isPast = cellDate < todayZero;
        const isToday = cellDate.getTime() === todayZero.getTime();
        const isSelected = parsedSelected && (
          cellDate.getDate() === parsedSelected.getDate() &&
          cellDate.getMonth() === parsedSelected.getMonth() &&
          cellDate.getFullYear() === parsedSelected.getFullYear()
        );
        const isAvailable = isDateAvailableForProgram(cellDate, program);

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "cal-day";
        btn.textContent = d;

        if (isToday) btn.classList.add("is-today");

        if (!isAvailable) {
          btn.classList.add("disabled");
          btn.disabled = true;
          if (dow === 0) {
            btn.title = t.calendar.tooltipSunday;
          } else if (program === "Striking") {
            btn.title = t.calendar.tooltipStrikingOff;
          } else if (isPast) {
            btn.title = t.calendar.tooltipPast;
          }
        } else {
          btn.classList.add("available");
          if (program === "Striking") {
            btn.classList.add("striking");
            btn.title = t.calendar.tooltipStrikingClass;
          } else {
            btn.title = t.calendar.tooltipBJJClass;
          }
          if (isSelected) btn.classList.add("selected");

          btn.addEventListener("click", () => {
            dateInput.value = formatDateDDMMYY(cellDate);
            $("[data-err=date]").textContent = "";
            calPopover.hidden = true;
            fillSlots();
            updateQuickChips();
          });
        }

        calDays.appendChild(btn);
      }
    }

    function updateQuickChips() {
      if (!dateQuickWrap) return;
      dateQuickWrap.innerHTML = "";
      const t = I18N[getLang()];
      const program = getSelectedProgram();
      if (program === "Striking") {
        form.classList.add("is-striking-mode");
      } else {
        form.classList.remove("is-striking-mode");
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const suggestions = [];
      const d = new Date(today);
      for (let i = 0; i < 14 && suggestions.length < 3; i++) {
        if (isDateAvailableForProgram(d, program)) {
          suggestions.push(new Date(d));
        }
        d.setDate(d.getDate() + 1);
      }

      if (suggestions.length === 0) return;

      const label = document.createElement("span");
      label.className = "date-quick-label";
      label.textContent = t.calendar.quickLabel;
      dateQuickWrap.appendChild(label);

      suggestions.forEach(dt => {
        const val = formatDateDDMMYY(dt);
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "date-chip" + (dateInput.value === val ? " is-active" : "");
        const dStr = String(dt.getDate()).padStart(2, "0");
        const mStr = String(dt.getMonth() + 1).padStart(2, "0");
        chip.textContent = `${t.calendar.quickDays[dt.getDay()]} · ${dStr}/${mStr}`;

        chip.addEventListener("click", () => {
          dateInput.value = val;
          $("[data-err=date]").textContent = "";
          fillSlots();
          updateQuickChips();
          if (calPopover) calPopover.hidden = true;
        });

        dateQuickWrap.appendChild(chip);
      });
    }

    if (dateBtn && calPopover) {
      dateBtn.addEventListener("click", e => {
        e.stopPropagation();
        calPopover.hidden = !calPopover.hidden;
        if (!calPopover.hidden) {
          const activeDate = parseDateDDMMYY(dateInput.value) || new Date();
          calDate = new Date(activeDate.getFullYear(), activeDate.getMonth(), 1);
          renderCalendar();
        }
      });
    }

    if (dateInput && calPopover) {
      dateInput.addEventListener("click", () => {
        if (calPopover.hidden) {
          const activeDate = parseDateDDMMYY(dateInput.value) || new Date();
          calDate = new Date(activeDate.getFullYear(), activeDate.getMonth(), 1);
          calPopover.hidden = false;
          renderCalendar();
        }
      });

      dateInput.addEventListener("input", () => {
        let v = dateInput.value.replace(/\D/g, "").slice(0, 6);
        if (v.length >= 4) {
          v = v.slice(0, 2) + "/" + v.slice(2, 4) + "/" + v.slice(4);
        } else if (v.length >= 2) {
          v = v.slice(0, 2) + "/" + v.slice(2);
        }
        dateInput.value = v;

        if (v.length === 8) {
          const err = rules.date(v);
          $("[data-err=date]").textContent = err;
        } else {
          $("[data-err=date]").textContent = "";
        }
        fillSlots();
        updateQuickChips();
        if (!calPopover.hidden) renderCalendar();
      });
    }

    if (calPrev) {
      calPrev.addEventListener("click", e => {
        e.stopPropagation();
        calDate.setMonth(calDate.getMonth() - 1);
        renderCalendar();
      });
    }

    if (calNext) {
      calNext.addEventListener("click", e => {
        e.stopPropagation();
        calDate.setMonth(calDate.getMonth() + 1);
        renderCalendar();
      });
    }

    document.addEventListener("click", e => {
      if (!calPopover || calPopover.hidden) return;
      const wrap = $("#date-wrap");
      if (wrap && !wrap.contains(e.target)) {
        calPopover.hidden = true;
      }
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && calPopover && !calPopover.hidden) {
        calPopover.hidden = true;
      }
    });

    function fillSlots() {
      const t = I18N[getLang()];
      const kind = form.program.value === "BJJ" ? "b" : "s";
      const prevSlot = slotSel.value;
      slotSel.innerHTML = `<option value="">${t.calendar.slotDefault}</option>`;
      const seen = new Set();

      let targetDayIdx = -1;
      let isSunday = false;
      let isValidDay = false;
      const dateVal = (dateInput && dateInput.value || "").trim();
      const m = /^(\d{2})\/(\d{2})\/(\d{2})$/.exec(dateVal);
      if (m) {
        const d = parseInt(m[1], 10), mo = parseInt(m[2], 10) - 1, yr = 2000 + parseInt(m[3], 10);
        const dt = new Date(yr, mo, d);
        if (!isNaN(dt.getTime())) {
          const day = dt.getDay();
          if (day >= 1 && day <= 6) {
            targetDayIdx = day - 1;
            isValidDay = true;
          } else if (day === 0) {
            isSunday = true;
          }
        }
      }

      if (isSunday) {
        slotSel.innerHTML = `<option value="" disabled selected>${t.calendar.slotSunday}</option>`;
        return;
      }

      if (kind === "s" && isValidDay && targetDayIdx !== 1 && targetDayIdx !== 3 && targetDayIdx !== 5) {
        slotSel.innerHTML = `<option value="" disabled selected>${t.calendar.slotStrikingOff}</option>`;
        return;
      }

      CONFIG.timetable.forEach(r => r.cells.forEach((c, di) => {
        if (targetDayIdx !== -1 && di !== targetDayIdx) return;
        const T = c && TYPES[c];
        if (!T || T.kind !== kind || T.trial === false) return;
        const txt = `${r.time}` + (kind === "b" ? ` · ${T.label}` + (r.note ? ` (${r.note})` : "") : "");
        if (seen.has(txt)) return;
        seen.add(txt);
        const o = document.createElement("option");
        o.value = txt;
        o.textContent = txt;
        slotSel.appendChild(o);
      }));

      if (kind === "s" && slotSel.options.length === 2) {
        slotSel.selectedIndex = 1;
        $("[data-err=slot]").textContent = "";
      } else if (prevSlot && [...slotSel.options].some(o => o.value === prevSlot)) {
        slotSel.value = prevSlot;
      }
    }

    function onProgramChange() {
      const prog = getSelectedProgram();
      const curDate = parseDateDDMMYY(dateInput.value);
      if (!curDate || !isDateAvailableForProgram(curDate, prog)) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const nextDt = new Date(today);
        for (let i = 0; i < 14; i++) {
          if (isDateAvailableForProgram(nextDt, prog)) {
            dateInput.value = formatDateDDMMYY(nextDt);
            $("[data-err=date]").textContent = "";
            break;
          }
          nextDt.setDate(nextDt.getDate() + 1);
        }
      }

      const activeDate = parseDateDDMMYY(dateInput.value) || new Date();
      calDate = new Date(activeDate.getFullYear(), activeDate.getMonth(), 1);

      fillSlots();
      updateQuickChips();
      if (!calPopover.hidden) renderCalendar();
    }

    form.querySelectorAll("input[name=program]").forEach(r => r.addEventListener("change", onProgramChange));

    const rules = {
      date: v => {
        const t = I18N[getLang()];
        const val = (v || "").trim();
        if (!val) return t.rules.dateRequired;
        const m = /^(\d{2})\/(\d{2})\/(\d{2})$/.exec(val);
        if (!m) return t.rules.dateFormat;
        const day = parseInt(m[1], 10), month = parseInt(m[2], 10), yr = 2000 + parseInt(m[3], 10);
        if (month < 1 || month > 12) return t.rules.monthInvalid;
        const daysInMonth = new Date(yr, month, 0).getDate();
        if (day < 1 || day > daysInMonth) return t.rules.dayInvalid(month);
        const dt = new Date(yr, month - 1, day);
        const todayZero = new Date();
        todayZero.setHours(0, 0, 0, 0);
        if (dt < todayZero) return t.rules.datePast;
        const dow = dt.getDay();
        if (dow === 0) return t.rules.dateSunday;
        const prog = getSelectedProgram();
        if (prog === "Striking" && dow !== 2 && dow !== 4 && dow !== 6) {
          return t.rules.strikingDays;
        }
        return "";
      },
      slot: v => v ? "" : I18N[getLang()].rules.slot,
      name: v => v.trim().length >= 2 ? "" : I18N[getLang()].rules.name,
      phone: v => /^(\+?84|0)\d{9}$/.test(v.replace(/[\s.\-]/g, "")) ? "" : I18N[getLang()].rules.phone,
      email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : I18N[getLang()].rules.email
    };

    // Initialize initial language & renders
    updateQuickChips();
    fillSlots();
    onProgramChange();
    window.addEventListener("sgs_language_change", () => {
      updateQuickChips();
      fillSlots();
      if (calPopover && !calPopover.hidden) renderCalendar();
    });

    $("#tk-again").onclick = () => {
      form.reset();
      onProgramChange();
      show("");
      ticket.hidden = true;
      form.hidden = false;
      form.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    function show(msg, kind) {
      const s = $("#status");
      s.hidden = !msg;
      s.className = "status " + kind;
      s.textContent = msg;
    }

    form.addEventListener("submit", async e => {
      e.preventDefault(); show("");
      let ok = true;
      for (const k in rules) {
        const m = rules[k](form[k].value);
        $(`[data-err=${k}]`).textContent = m;
        if (m) ok = false;
      }
      if (!ok) {
        const f = form.querySelector(".err:not(:empty)");
        f && f.previousElementSibling.focus();
        return;
      }
      if (form.website.value) return;

      const data = {
        program: form.program.value,
        date: form.date.value.trim(),
        slot: form.slot.value,
        name: form.name.value.trim(),
        phone: form.phone.value.replace(/[\s.\-]/g, ""),
        email: form.email.value.trim(),
        submittedAt: new Date().toISOString()
      };

      const btn = $("#submit");
      const t = I18N[getLang()];
      btn.disabled = true;
      btn.textContent = t.rules.submitSending;

      // Chặn hoàn toàn các thông tin test / pentest không gửi lên Google Sheet
      const testCheck = (data.name + " " + data.email + " " + data.slot + " " + data.phone).toLowerCase();
      const isTest = testCheck.includes("pentest") || testCheck.includes("example.invalid") || /^0+$/.test(data.phone) || (testCheck.includes("test") && testCheck.includes("sgs"));

      try {
        if (CONFIG.endpoint && !isTest) {
          await fetch(CONFIG.endpoint, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(data)
          });
        } else {
          console.log("Test mode:", data);
        }
        $("#tk-name").textContent = data.name;
        $("#tk-phone").textContent = data.phone;
        $("#tk-date").textContent = data.date;
        $("#tk-class").textContent = data.program + " · " + data.slot;
        $("#tk-dev").hidden = !!CONFIG.endpoint;
        form.hidden = true;
        ticket.hidden = false;
        ticket.scrollIntoView({ behavior: "smooth", block: "center" });
        ticket.focus({ preventScroll: true });
      } catch (err) {
        show(t.rules.submitError, "bad");
      } finally {
        btn.disabled = false;
        btn.textContent = t.rules.submitDefault;
      }
    });
