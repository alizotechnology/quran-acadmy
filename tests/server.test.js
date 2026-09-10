const assert = require('assert');
const http = require('http');
const app = require('../server');

let server;
const PORT = 5001;
const BASE_URL = `http://localhost:${PORT}`;

function makeRequest(path, method = 'GET', payload = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const postData = payload ? JSON.stringify(payload) : null;

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {})
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting Backend Server Tests ---');

  server = app.listen(PORT, async () => {
    try {
      // Test 1: GET /api/courses
      console.log('Running Test 1: GET /api/courses');
      const coursesRes = await makeRequest('/api/courses');
      assert.strictEqual(coursesRes.status, 200, 'GET /api/courses should return status 200');
      assert.strictEqual(coursesRes.body.success, true, 'Response success should be true');
      assert(Array.isArray(coursesRes.body.data), 'Data should be an array');
      assert.strictEqual(coursesRes.body.data.length, 4, 'Should contain 4 courses');
      console.log('✓ GET /api/courses PASSED');

      // Test 2: POST /api/contact valid
      console.log('Running Test 2: POST /api/contact (valid submission)');
      const contactRes = await makeRequest('/api/contact', 'POST', {
        name: 'Ahmad Khan',
        email: 'ahmad@example.com',
        phone: '+1234567890',
        course: 'Quran Recitation with Tajweed',
        message: 'Looking for evening classes.'
      });
      assert.strictEqual(contactRes.status, 200, 'POST /api/contact should return status 200');
      assert.strictEqual(contactRes.body.success, true, 'Response success should be true');
      assert.strictEqual(contactRes.body.data.name, 'Ahmad Khan', 'Returned data name should match');
      console.log('✓ POST /api/contact (valid) PASSED');

      // Test 3: POST /api/contact missing required fields
      console.log('Running Test 3: POST /api/contact (validation failure)');
      const contactInvalid = await makeRequest('/api/contact', 'POST', {
        name: 'Ahmad Khan'
      });
      assert.strictEqual(contactInvalid.status, 400, 'Missing fields should return status 400');
      assert.strictEqual(contactInvalid.body.success, false, 'Response success should be false');
      console.log('✓ POST /api/contact (invalid) PASSED');

      // Test 4: POST /api/trial valid
      console.log('Running Test 4: POST /api/trial (valid trial booking)');
      const trialRes = await makeRequest('/api/trial', 'POST', {
        name: 'Zaid Malik',
        email: 'zaid@example.com',
        phone: '+447123456789',
        course: 'Noorani Qaida',
        timezone: 'GMT'
      });
      assert.strictEqual(trialRes.status, 200, 'POST /api/trial should return status 200');
      assert.strictEqual(trialRes.body.success, true, 'Response success should be true');
      assert.strictEqual(trialRes.body.data.name, 'Zaid Malik', 'Returned data name should match');
      console.log('✓ POST /api/trial PASSED');

      // Test 5: POST /api/enroll valid
      console.log('Running Test 5: POST /api/enroll (valid enrollment)');
      const enrollRes = await makeRequest('/api/enroll', 'POST', {
        name: 'Fatima Ali',
        email: 'fatima@example.com',
        phone: '+987654321',
        courseId: 'noorani-qaida'
      });
      assert.strictEqual(enrollRes.status, 200, 'POST /api/enroll should return status 200');
      assert.strictEqual(enrollRes.body.success, true, 'Response success should be true');
      assert.strictEqual(enrollRes.body.data.course, 'Noorani Qaida & Basic Quran', 'Mapped course title should match');
      console.log('✓ POST /api/enroll PASSED');

      // Test 6: POST /api/safeguard valid
      console.log('Running Test 6: POST /api/safeguard (valid report)');
      const safeguardRes = await makeRequest('/api/safeguard', 'POST', {
        name: 'Sister Maryam',
        email: 'maryam@example.com',
        phone: '+1234567890',
        category: 'dbs',
        details: 'Requesting tutor DBS check verification.'
      });
      assert.strictEqual(safeguardRes.status, 200, 'POST /api/safeguard should return status 200');
      assert.strictEqual(safeguardRes.body.success, true, 'Response success should be true');
      assert(safeguardRes.body.refId.startsWith('ALH-'), 'Should return a valid reference ID starting with ALH-');
      console.log('✓ POST /api/safeguard PASSED');

      // Test 7: GET static pages (e.g. /about.html, /courses.html)
      console.log('Running Test 7: Static pages serving');
      const aboutRes = await makeRequest('/about.html');
      assert.strictEqual(aboutRes.status, 200, '/about.html should return status 200');
      console.log('✓ GET /about.html PASSED');

      console.log('\n🎉 ALL BACKEND TESTS PASSED SUCCESSFULLY!');
      server.close(() => process.exit(0));

    } catch (err) {
      console.error('\n❌ TEST FAILED:', err);
      if (server) server.close();
      process.exit(1);
    }
  });
}

runTests();
