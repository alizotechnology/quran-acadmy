# Quran Academy - Complete Web Application & Google Sheets Backend

Full-stack web application for Quran Academy, complete with modern responsive frontend UI, Express backend REST API, and automatic Google Sheets integration for contact form submissions.

## Features

- **Responsive Frontend:** Beautiful Quran Academy landing page with interactive course section, about us, features, trial registration modal/form, and RTL calligraphy support.
- **Node.js Express Backend:** RESTful API endpoints (`/api/contact`, `/api/courses`, `/api/enroll`) with request validation and JSON handling.
- **Google Sheets Integration:** Automatic forwarding of contact form entries and course enrollments directly to a Google Sheet spreadsheet via Google Apps Script.
- **Automated Tests:** Comprehensive unit and integration test suite (`npm test`).

---

## Setup & Running the Application

### 1. Installation
Install project dependencies:
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```
Set your desired port and Google Sheets WebApp URL in `.env`:
```env
PORT=5000
GOOGLE_SHEET_WEBAPP_URL=https://script.google.com/macros/s/YOUR_SCRIPT_DEPLOYMENT_ID/exec
```

### 3. Start Server
Run backend server:
```bash
npm start
```
Access the application in your browser at `http://localhost:5000`.

---

## Google Sheets Integration Setup Guide

1. Open [Google Sheets](https://sheets.google.com) and create a new blank spreadsheet (e.g. named **Quran Academy Submissions**).
2. In the first row of your sheet, add the following column headers:
   - **Column A:** `Timestamp`
   - **Column B:** `Name`
   - **Column C:** `Email`
   - **Column D:** `Phone`
   - **Column E:** `Course`
   - **Column F:** `Message`
3. Click on **Extensions** in the top menu and select **Apps Script**.
4. Delete any existing code in `Code.gs` and copy-paste the entire contents of `google-apps-script.js` from this repository.
5. Click **Deploy** > **New deployment**.
6. Click the gear icon next to "Select type" and choose **Web app**.
7. Fill in the deployment details:
   - **Description:** `Quran Academy Form Deployment`
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
8. Click **Deploy**, authorize permissions when prompted, and copy the generated **Web App URL**.
9. Paste this URL into your `.env` file as `GOOGLE_SHEET_WEBAPP_URL`.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/courses` | Retrieves the list of available Quran courses |
| `POST` | `/api/contact` | Submits contact/trial form & syncs to Google Sheets |
| `POST` | `/api/enroll`  | Submits direct course enrollment request |

---

## Testing

To run the automated backend test suite:
```bash
npm test
```
