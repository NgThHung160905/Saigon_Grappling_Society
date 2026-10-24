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

// Menu tien ich xuat hien ngay tren thanh cong cu Google Sheet khi mo file
function onOpen() {
  try {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu("🥋 SGS")
      .addItem("Tô màu & Sắp xếp ngay", "sapXepVaToMau")
      .addToUi();
  } catch (e) {}
}

// Tu dong gom cac dong cung mau: Xanh -> Vang -> Do va in dam tu cot A den F
function sapXepVaToMau() {
  const sh = getTargetSheet();
  const lastRow = sh.getLastRow();
  if (lastRow < 2) return;

  const numRows = lastRow - 1;
  const numCols = 6; // Chi to mau va xu ly tu cot A den F (6 cot)
  const range = sh.getRange(2, 1, numRows, numCols);
  const data = range.getValues();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Phan loai vao 3 nhom mau:
  // 1: Xanh la (Toi ngay / Hom nay)
  // 2: Vang (Sap toi ngay)
  // 3: Do (Qua ngay)
  const rowsWithMeta = data.map(row => {
    const dStr = row[0];
    const dateObj = parseDate(dStr);
    dateObj.setHours(0, 0, 0, 0);

    const diffDays = Math.round((dateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    let group = 2;
    let bg = "#FFF2CC"; // Vang (Sap toi)
    let text = "#7F6000";

    if (diffDays === 0) {
      group = 1; // Xanh la (Tới ngày / Hôm nay)
      bg = "#D9EAD3";
      text = "#274E13";
    } else if (diffDays > 0) {
      group = 2; // Vang (Sắp tới ngày)
      bg = "#FFF2CC";
      text = "#7F6000";
    } else {
      group = 3; // Do (Đã qua ngày)
      bg = "#F4CCCC";
      text = "#783F04";
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

  const bgs = [];
  const texts = [];
  const weights = [];

  for (let i = 0; i < rowsWithMeta.length; i++) {
    const item = rowsWithMeta[i];
    bgs.push(new Array(numCols).fill(item.bg));
    texts.push(new Array(numCols).fill(item.text));
    weights.push(new Array(numCols).fill("bold"));
  }

  // To mau va in dam hang loat tu cot A den F
  range.setBackgrounds(bgs)
    .setFontColors(texts)
    .setFontWeights(weights)
    .setVerticalAlignment("middle");

  // Dinh dang can giua cac cot can thiet
  for (let i = 0; i < rowsWithMeta.length; i++) {
    const r = i + 2;
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
  return ContentService.createTextOutput("Da to mau va sap xep thanh cong!").setMimeType(ContentService.MimeType.TEXT);
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
