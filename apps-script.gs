const SHEET_NAME = "Đăng ký tập thử";
const HEADERS = ["Ngày tháng năm", "Họ và Tên", "Bộ môn", "Khung giờ tập", "Số điện thoại", "Email"];

// Hàm tiện ích lấy hoặc khởi tạo sheet (sử dụng ngay trang tính đầu tiên nếu đang trống)
function getTargetSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    const firstSheet = ss.getSheets()[0];
    if (firstSheet && (firstSheet.getName() === "Trang tính 1" || firstSheet.getName() === "Sheet1" || firstSheet.getLastRow() === 0)) {
      sh = firstSheet;
      sh.setName(SHEET_NAME);
    } else {
      sh = ss.insertSheet(SHEET_NAME);
    }
  }

  // Nếu chưa có hàng tiêu đề thì tạo
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length)
      .setBackground("#111111")
      .setFontColor("#FFFFFF")
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle");
    sh.setRowHeight(1, 40);
    for (let i = 1; i <= HEADERS.length; i++) sh.autoResizeColumn(i);
  }
  return sh;
}

// Bấm nút "Chạy" (Run) hàm này trong Apps Script để thấy tiêu đề hiện ra ngay trong Sheet!
function taoBangTieuDe() {
  const sh = getTargetSheet();
  SpreadsheetApp.getActiveSpreadsheet().toast("Đã tạo bảng tiêu đề thành công!", "SGS", 5);
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

    const regDate = d.date ? String(d.date).trim() : Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy");
    const name = d.name || "";
    const program = d.program || "";
    const slot = d.slot || "";
    const phone = d.phone ? "'" + String(d.phone).trim() : "";
    const email = d.email || "";

    const row = sh.getLastRow() + 1;
    sh.getRange(row, 5).setNumberFormat("@");
    sh.getRange(row, 1, 1, HEADERS.length).setValues([[regDate, name, program, slot, phone, email]]);
    sh.getRange(row, 1, 1, HEADERS.length).setVerticalAlignment("middle");
    sh.getRange(row, 1).setHorizontalAlignment("center");
    sh.getRange(row, 3).setHorizontalAlignment("center");
    sh.getRange(row, 5).setHorizontalAlignment("center");
    sh.setRowHeight(row, 32);

    for (let i = 1; i <= HEADERS.length; i++) sh.autoResizeColumn(i);

    // Gửi email thông báo về Gmail của bạn
    try {
      const recipient = Session.getActiveUser().getEmail() || SpreadsheetApp.getActiveSpreadsheet().getOwner().getEmail();
      if (recipient) {
        MailApp.sendEmail(
          recipient,
          "🔥 [SGS] Đăng ký tập thử mới: " + name + " (" + program + ")",
          "Thông tin đăng ký mới:\n\n• Ngày hẹn: " + regDate + "\n• Họ và Tên: " + name + "\n• Bộ môn: " + program + "\n• Khung giờ: " + slot + "\n• SĐT: " + (d.phone || "") + "\n• Email: " + email
        );
      }
    } catch (mErr) {}

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Saigon Grappling Society OK").setMimeType(ContentService.MimeType.TEXT);
}
