/**
 * Google Apps Script for Al-Huda Quran Academy - Google Sheets Integration
 *
 * Instructions / Rahnamaee:
 * 1. Open Google Sheets (https://sheets.google.com) and create a new spreadsheet named "Al-Huda Quran Academy Submissions".
 * 2. In row 1, set the headers (Pehli row mein ye headers likhein):
 *    Col A: Timestamp | Col B: Name | Col C: Email | Col D: Phone | Col E: Course / Category | Col F: Message / Details | Col G: Type / Reference ID
 * 3. Go to Extensions > Apps Script (Extensions mein jakar Apps Script kholein).
 * 4. Paste this complete code into Code.gs (Ye saara code Code.gs mein paste kar dein).
 * 5. Click "Deploy" > "New deployment" (Top right par Deploy par click karke New deployment chunein).
 * 6. Choose type: "Web app" (Gear icon par click karke Web app select karein).
 * 7. Set "Execute as": "Me".
 * 8. Set "Who has access": "Anyone".
 * 9. Click "Deploy", authorize permissions, and copy the Web App URL.
 * 10. Paste the copied URL into your project `.env` file as:
 *     GOOGLE_SHEET_WEBAPP_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    var timestamp = data.timestamp || new Date().toLocaleString();
    var name = data.name || 'N/A';
    var email = data.email || 'N/A';
    var phone = data.phone || 'N/A';
    var course = data.course || data.category || 'General Inquiry';
    var message = data.message || data.notes || data.details || '';
    var type = data.type || data.refId || 'Form Submission';

    // Append row to Google Sheet
    sheet.appendRow([timestamp, name, email, phone, course, message, type]);

    return ContentService
      .createTextOutput(JSON.stringify({
        "status": "success",
        "message": "Data saved to Google Sheet successfully."
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        "status": "error",
        "message": error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      "status": "active",
      "message": "Al-Huda Quran Academy Google Sheets Web App is running active."
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
