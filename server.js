const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data for courses
const courses = [
  {
    id: 'noorani-qaida',
    title: 'Noorani Qaida & Basic Quran',
    level: 'Beginner',
    description: 'Learn Arabic alphabets, correct pronunciation, and basic reading rules for kids and adult beginners.',
    duration: '3 Months'
  },
  {
    id: 'quran-tajweed',
    title: 'Quran Recitation with Tajweed',
    level: 'All Levels',
    description: 'Master Tajweed rules to recite the Quran with accuracy, beautiful melody, and proper rhythm.',
    duration: '6 Months'
  },
  {
    id: 'quran-hifz',
    title: 'Quran Memorization (Hifz)',
    level: 'Intermediate',
    description: 'Systematic Quran memorization program with daily revision techniques guided by experienced Hafiz tutors.',
    duration: '12 - 24 Months'
  },
  {
    id: 'islamic-studies',
    title: 'Islamic Studies & Quranic Arabic',
    level: 'Advanced',
    description: 'Understand Quranic grammar, Tafseer, Hadith, Fiqh, and daily Dua\'as to enrich your spiritual life.',
    duration: '6 Months'
  }
];

// Helper function to forward POST data to Google Sheets Web App URL
function forwardToGoogleSheet(data) {
  return new Promise((resolve, reject) => {
    const sheetUrl = process.env.GOOGLE_SHEET_WEBAPP_URL;

    if (!sheetUrl || sheetUrl.includes('YOUR_SCRIPT_ID')) {
      console.log('Google Sheet URL not configured or using default placeholder.');
      return resolve({ success: true, simulated: true });
    }

    try {
      const parsedUrl = new URL(sheetUrl);
      const postData = JSON.stringify(data);

      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const requester = parsedUrl.protocol === 'https:' ? https : http;

      const req = requester.request(options, (res) => {
        // Handle Google Apps Script 302/301 redirects if needed
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const redirectUrl = new URL(res.headers.location, sheetUrl);
          const redirectOptions = {
            hostname: redirectUrl.hostname,
            port: redirectUrl.port || (redirectUrl.protocol === 'https:' ? 443 : 80),
            path: redirectUrl.pathname + redirectUrl.search,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(postData)
            }
          };
          const redirectReq = (redirectUrl.protocol === 'https:' ? https : http).request(redirectOptions, (redRes) => {
            let body = '';
            redRes.on('data', chunk => body += chunk);
            redRes.on('end', () => resolve({ success: true, response: body }));
          });
          redirectReq.on('error', (err) => resolve({ success: false, error: err.message }));
          redirectReq.write(postData);
          redirectReq.end();
          return;
        }

        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({ success: true, response: body }));
      });

      req.on('error', (err) => resolve({ success: false, error: err.message }));
      req.write(postData);
      req.end();
    } catch (err) {
      resolve({ success: false, error: err.message });
    }
  });
}

// API Endpoints

// GET /api/courses - List available courses
app.get('/api/courses', (req, res) => {
  res.status(200).json({
    success: true,
    data: courses
  });
});

// POST /api/contact - Handle Contact Form & forward to Google Sheets
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, course, message } = req.body;

  if (!name || !email || !phone || !course) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, phone, and course selection are required.'
    });
  }

  const submission = {
    timestamp: new Date().toISOString(),
    name,
    email,
    phone,
    course,
    message: message || ''
  };

  // Forward submission to Google Sheets
  const sheetResult = await forwardToGoogleSheet(submission);

  res.status(200).json({
    success: true,
    message: 'Thank you! Your registration request has been submitted successfully.',
    data: submission,
    googleSheetSync: sheetResult
  });
});

// POST /api/enroll - Handle Course Enrollment
app.post('/api/enroll', async (req, res) => {
  const { name, email, phone, courseId } = req.body;

  if (!name || !email || !courseId) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and course ID are required.'
    });
  }

  const foundCourse = courses.find(c => c.id === courseId || c.title === courseId);
  const courseTitle = foundCourse ? foundCourse.title : courseId;

  const enrollmentData = {
    timestamp: new Date().toISOString(),
    name,
    email,
    phone: phone || '',
    course: courseTitle,
    type: 'Direct Enrollment'
  };

  const sheetResult = await forwardToGoogleSheet(enrollmentData);

  res.status(200).json({
    success: true,
    message: `Enrollment for ${courseTitle} recorded successfully!`,
    data: enrollmentData,
    googleSheetSync: sheetResult
  });
});

// Fallback route for SPA / index page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Quran Academy Backend Server running on port ${PORT}`);
  });
}

module.exports = app;
