const SHEET_NAME = "Đăng ký tập thử";
const HEADERS = ["Ngày tháng năm", "Họ và Tên", "Bộ môn", "Khung giờ tập", "Số điện thoại", "Email"];
const NOTIFICATION_EMAIL = "saigongrapplingsociety@gmail.com";

// Chuyen chuoi ngay thanh Date an toan
function parseDate(dStr) {
  if (!dStr) return new Date();
  if (Object.prototype.toString.call(dStr) === "[object Date]" && !isNaN(dStr.getTime())) {
    return new Date(dStr.getTime());
  }
  const parts = String(dStr).trim().split(/[\/\-]/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    let year = parseInt(parts[2], 10);
    if (year < 100) year += 2000;
    const dt = new Date(year, month, day);
    if (!isNaN(dt.getTime())) return dt;
  }
  return new Date();
}

function getTargetSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
}

// BỘ LỌC CHẶN VÀ LOẠI BỎ TOÀN BỘ DỮ LIỆU TEST / PENTEST / BOT TỰ ĐỘNG
function isTestSubmission(d) {
  if (!d) return false;
  const combined = (String(d.name || "") + " " + String(d.email || "") + " " + String(d.slot || "") + " " + String(d.phone || "")).toLowerCase();
  
  if (
    combined.includes("pentest") ||
    combined.includes("example.invalid") ||
    combined.includes("sgs-pentest") ||
    (combined.includes("test") && (combined.includes("sgs") || combined.includes("dummy")))
  ) {
    return true;
  }
  
  const cleanPhone = String(d.phone || "").replace(/\D/g, "");
  if (/^0{6,}$/.test(cleanPhone) || /^1{6,}$/.test(cleanPhone) || cleanPhone === "1234567890" || cleanPhone === "0123456789") {
    return true;
  }
  return false;
}

// Tự động quét và dọn sạch các dòng dữ liệu test cũ đang còn sót trong Sheet
function xoaDuLieuTestCu(sh) {
  try {
    const lastRow = sh.getLastRow();
    if (lastRow < 2) return;
    const values = sh.getRange(2, 1, lastRow - 1, 6).getValues();
    for (let i = values.length - 1; i >= 0; i--) {
      const row = values[i];
      const text = (String(row[1] || "") + " " + String(row[3] || "") + " " + String(row[4] || "") + " " + String(row[5] || "")).toLowerCase();
      if (
        text.includes("pentest") ||
        text.includes("example.invalid") ||
        text.includes("0000000000") ||
        (text.includes("test") && text.includes("sgs"))
      ) {
        sh.deleteRow(i + 2);
      }
    }
  } catch (err) {
    Logger.log("Lỗi dọn dữ liệu test: " + err);
  }
}

// Menu tien ich xuat hien ngay tren thanh cong cu Google Sheet khi mo file
function onOpen() {
  try {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu("🥋 SGS")
      .addItem("Tô màu & Sắp xếp ngay", "sapXepVaToMau")
      .addItem("Xóa dữ liệu test/pentest", "xoaDuLieuTestMenu")
      .addToUi();
  } catch (e) {}
}

function xoaDuLieuTestMenu() {
  const sh = getTargetSheet();
  xoaDuLieuTestCu(sh);
  sapXepVaToMau();
  SpreadsheetApp.getUi().alert("Đã xóa sạch các dòng dữ liệu test/pentest!");
}

// Tu dong gom cac dong cung mau: Xanh -> Vang -> Do va in dam toan bo o tu cot A den F
function sapXepVaToMau() {
  const sh = getTargetSheet();

  // Xóa sạch các dữ liệu test nếu có
  xoaDuLieuTestCu(sh);

  // XOA BO CAC QUY TAC DINH DANG CO DIEU KIEN CU VA MAU XEN KE DANG CHAN MAU NEN CUA O
  try {
    sh.clearConditionalFormatRules();
    const bandings = sh.getBandings();
    bandings.forEach(b => b.remove());
  } catch (e) {}

  const lastRow = sh.getLastRow();
  if (lastRow < 2) return;

  const numRows = lastRow - 1;
  const numCols = 6;
  const range = sh.getRange(2, 1, numRows, numCols);
  const data = range.getValues();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const rowsWithMeta = data.map(row => {
    const dStr = row[0];
    const dateObj = parseDate(dStr);
    dateObj.setHours(0, 0, 0, 0);

    const diffDays = Math.round((dateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    let group = 2;
    let bg = "#FFE599";
    let text = "#5F4500";

    if (diffDays === 0) {
      group = 1;
      bg = "#B6D7A8";
      text = "#1B4D2B";
    } else if (diffDays > 0) {
      group = 2;
      bg = "#FFE599";
      text = "#5F4500";
    } else {
      group = 3;
      bg = "#F4CCCC";
      text = "#781E1E";
    }

    return { row, dateObj, group, diffDays, bg, text };
  });

  // Sap xep gom dong cung mau: Xanh -> Vang -> Do
  rowsWithMeta.sort((a, b) => {
    if (a.group !== b.group) return a.group - b.group;
    if (a.group === 2) return a.dateObj.getTime() - b.dateObj.getTime();
    if (a.group === 3) return b.dateObj.getTime() - a.dateObj.getTime();
    return 0;
  });

  const sortedData = rowsWithMeta.map(item => item.row);
  range.setValues(sortedData);

  // To mau nen toan bo o va in dam ca dong tu cot A den F
  for (let i = 0; i < rowsWithMeta.length; i++) {
    const r = i + 2;
    const item = rowsWithMeta[i];
    sh.getRange(r, 1, 1, numCols)
      .setBackground(item.bg)
      .setFontColor(item.text)
      .setFontWeight("bold")
      .setVerticalAlignment("middle");

    sh.getRange(r, 1).setNumberFormat("dd/MM/yyyy").setHorizontalAlignment("center");
    sh.getRange(r, 3).setHorizontalAlignment("center");
    sh.getRange(r, 5).setNumberFormat("@").setHorizontalAlignment("center");
    sh.setRowHeight(r, 34);
  }

  for (let i = 1; i <= HEADERS.length; i++) sh.autoResizeColumn(i);
}

function myFunction() {
  sapXepVaToMau();
}

function onEdit(e) {
  sapXepVaToMau();
}

function doGet(e) {
  sapXepVaToMau();
  return ContentService.createTextOutput("Da to mau, xoa test va sap xep thanh cong!").setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    let d = {};
    if (e && e.postData && e.postData.contents) {
      try { d = JSON.parse(e.postData.contents); } catch (err) { d = e.parameter || {}; }
    } else if (e && e.parameter) {
      d = e.parameter;
    }

    // NẾU LÀ DỮ LIỆU TEST / PENTEST: CHẶN HOÀN TOÀN (KHÔNG LƯU VÀ KHÔNG GỬI MAIL)
    if (isTestSubmission(d)) {
      Logger.log("Chặn dữ liệu test/pentest: " + JSON.stringify(d));
      return ContentService.createTextOutput(JSON.stringify({ ok: true, ignored: true, note: "Test data ignored" })).setMimeType(ContentService.MimeType.JSON);
    }

    const sh = getTargetSheet();

    const dateObj = parseDate(d.date);
    const dateText = d.date ? String(d.date).trim() : Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy");
    const name = d.name || "";
    const program = d.program || "";
    const slot = d.slot || "";
    const phone = d.phone ? "'" + String(d.phone).trim() : "";
    const email = d.email || "";

    const row = sh.getLastRow() + 1;

    sh.getRange(row, 1).setValue(dateObj).setNumberFormat("dd/MM/yyyy");
    sh.getRange(row, 2, 1, 5).setValues([[name, program, slot, phone, email]]);

    sapXepVaToMau();

    try {
      MailApp.sendEmail(
        NOTIFICATION_EMAIL,
        "[SGS] Đăng ký tập thử mới: " + name + " (" + program + ")",
        "Xin chào SGS!\n\nCó một khách hàng mới vừa đăng ký buổi tập thử:\n\n- Họ và Tên: " + name + "\n- Số điện thoại: " + (d.phone || "") + "\n- Email: " + email + "\n- Bộ môn: " + program + "\n- Ngày hẹn tập: " + dateText + "\n- Khung giờ: " + slot + "\n\nKiểm tra Google Sheet để cập nhật trạng thái liên hệ!"
      );
    } catch (mErr) {
      Logger.log("Lỗi gửi mail: " + mErr);
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
