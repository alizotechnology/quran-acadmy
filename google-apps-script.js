/**
 * Google Apps Script for Quran Academy Contact Form & Google Sheets Link
 *
 * Instructions:
 * 1. Open Google Sheets (https://sheets.google.com) and create a new spreadsheet named "Quran Academy Registrations".
 * 2. In row 1, set the headers:
 *    Col A: Timestamp | Col B: Name | Col C: Email | Col D: Phone | Col E: Course | Col F: Message
 * 3. Go to Extensions > Apps Script.
 * 4. Paste this code into Code.gs.
 * 5. Click "Deploy" > "New deployment".
 * 6. Choose type: "Web app".
 * 7. Set "Execute as": "Me".
 * 8. Set "Who has access": "Anyone".
 * 9. Click "Deploy", authorize permissions, and copy the Web App URL.
 * 10. Paste the URL into your backend `.env` file as `GOOGLE_SHEET_WEBAPP_URL`.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    var timestamp = data.timestamp || new Date().toLocaleString();
    var name = data.name || '';
    var email = data.email || '';
    var phone = data.phone || '';
    var course = data.course || '';
    var message = data.message || '';

    // Append row to Google Sheet
    sheet.appendRow([timestamp, name, email, phone, course, message]);

    return ContentService
      .createTextOutput(JSON.stringify({ "status": "success", "message": "Data saved to Google Sheet successfully." }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ "status": "active", "message": "Quran Academy Google Sheets Web App is running." }))
    .setMimeType(ContentService.MimeType.JSON);
}
