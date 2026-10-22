/**
 * Nhận đăng ký tập thử từ landing page SGS và ghi vào Google Sheet.
 * Cách dùng: mở Google Sheet > Extensions > Apps Script > dán file này > Deploy > New deployment
 * > type: Web app > Execute as: Me > Who has access: Anyone > Deploy. Copy URL dán vào CONFIG.endpoint trong index.html.
 */
const SHEET_NAME = "Trial Registrations";
const HEADERS = ["Timestamp", "Program", "Slot", "Name", "Phone", "Email", "Status"];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) {
      sh = ss.insertSheet(SHEET_NAME);
      sh.appendRow(HEADERS);
      sh.setFrozenRows(1);
    }
    // Giữ số điện thoại dạng text để không mất số 0 đầu
    const phoneCol = HEADERS.indexOf("Phone") + 1;
    const row = sh.getLastRow() + 1;
    sh.getRange(row, phoneCol).setNumberFormat("@");
    sh.getRange(row, 1, 1, HEADERS.length).setValues([[
      new Date(), d.program || "", d.slot || "", d.name || "", d.phone || "", d.email || "", "New"
    ]]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
