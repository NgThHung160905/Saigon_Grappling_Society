const SHEET_NAME = "Đăng ký tập thử";
const HEADERS = ["Ngày tháng năm", "Họ và Tên", "Bộ môn", "Khung giờ tập", "Số điện thoại", "Email"];
const NOTIFICATION_EMAIL = "saigongrapplingsociety@gmail.com";

// Chuyen chuoi ngay thanh Date
function parseDate(dStr) {
  if (!dStr) return new Date();
  if (dStr instanceof Date) return dStr;
  const parts = String(dStr).trim().split(/[\/\-]/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    let year = parseInt(parts[2], 10);
    if (year < 100) year += 2000;
    return new Date(year, month, day);
  }
  return new Date();
}

function getTargetSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
}

// Tu dong gom cac dong cung mau: Xanh -> Vang -> Do va in dam toan bo
function sapXepVaToMau() {
  const sh = getTargetSheet();
  sh.clearConditionalFormatRules();

  const lastRow = sh.getLastRow();
  if (lastRow < 2) return;

  const numRows = lastRow - 1;
  const numCols = Math.max(sh.getLastColumn(), 6);
  const range = sh.getRange(2, 1, numRows, numCols);
  const data = range.getValues();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Phan loai vao 3 nhom mau:
  // 1: Xanh la (Hom nay)
  // 2: Vang (Sap toi)
  // 3: Do (Da qua)
  const rowsWithMeta = data.map(row => {
    const dStr = row[0];
    const dateObj = parseDate(dStr);
    dateObj.setHours(0, 0, 0, 0);

    const diffDays = Math.round((dateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    let group = 2;
    let bg = "#FFF3CD"; // Vang
    let text = "#856404";

    if (diffDays === 0) {
      group = 1; // Xanh la (Hom nay)
      bg = "#D4EDDA";
      text = "#155724";
    } else if (diffDays > 0) {
      group = 2; // Vang (Sap toi)
      bg = "#FFF3CD";
      text = "#856404";
    } else {
      group = 3; // Do (Da qua)
      bg = "#F8D7DA";
      text = "#721C24";
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

  // To mau va in dam toan bo ca dong tu cot 1 den 6
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
    sh.setRowHeight(r, 32);
  }

  for (let i = 1; i <= HEADERS.length; i++) sh.autoResizeColumn(i);
}

function myFunction() {
  sapXepVaToMau();
}

function onEdit(e) {
  sapXepVaToMau();
}

function onOpen() {
  sapXepVaToMau();
}

function doGet(e) {
  sapXepVaToMau();
  return ContentService.createTextOutput("Da sap xep va to mau thanh cong!").setMimeType(ContentService.MimeType.TEXT);
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
