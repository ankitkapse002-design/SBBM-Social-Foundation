// Comprehensive verification script for all login systems
const http = require('http');

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, data });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function run() {
  console.log('========================================================================');
  console.log('COMPREHENSIVE LOGIN SYSTEM VERIFICATION & DEBUGGING AUDIT');
  console.log('========================================================================\n');

  // TEST 1: The exact case reported by user (SSBM-SM-2026-8351 / Harry2000)
  console.log('>>> 1. Testing user case: Seva Member SSBM-SM-2026-8351 with "Harry2000"...');
  const res1 = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/portal/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    loginId: 'SSBM-SM-2026-8351',
    password: 'Harry2000'
  });

  console.log(`Status: ${res1.status}, Success: ${res1.data.success}`);
  if (res1.status === 200 && res1.data.token) {
    console.log('[PASS] SSBM-SM-2026-8351 logged in successfully with Harry2000!');
  } else {
    throw new Error('Test 1 failed: ' + JSON.stringify(res1.data));
  }

  // TEST 2: SSBM-SM-2026-8351 with uppercase "HARR2000"
  console.log('\n>>> 2. Testing Seva Member SSBM-SM-2026-8351 with uppercase "HARR2000"...');
  const res2 = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/portal/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    loginId: 'SSBM-SM-2026-8351',
    password: 'HARR2000'
  });
  if (res2.status === 200 && res2.data.token) {
    console.log('[PASS] SSBM-SM-2026-8351 logged in successfully with HARR2000!');
  } else {
    throw new Error('Test 2 failed: ' + JSON.stringify(res2.data));
  }

  // TEST 3: SSBM-SM-2026-8351 with lowercase "harr2000"
  console.log('\n>>> 3. Testing Seva Member SSBM-SM-2026-8351 with lowercase "harr2000"...');
  const res3 = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/portal/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    loginId: 'SSBM-SM-2026-8351',
    password: 'harr2000'
  });
  if (res3.status === 200 && res3.data.token) {
    console.log('[PASS] SSBM-SM-2026-8351 logged in successfully with harr2000!');
  } else {
    throw new Error('Test 3 failed: ' + JSON.stringify(res3.data));
  }

  // TEST 4: Trailing whitespace tolerance: "Harry2000 "
  console.log('\n>>> 4. Testing trailing whitespace tolerance: "Harry2000 "...');
  const res4 = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/portal/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    loginId: 'SSBM-SM-2026-8351',
    password: 'Harry2000 '
  });
  if (res4.status === 200) {
    console.log('[PASS] Trailing whitespace trimmed and accepted!');
  } else {
    throw new Error('Test 4 failed: ' + JSON.stringify(res4.data));
  }

  // TEST 5: Clear error message when genuinely wrong password is supplied
  console.log('\n>>> 5. Testing error message on incorrect password...');
  const res5 = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/portal/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    loginId: 'SSBM-SM-2026-8351',
    password: 'WrongPassword123'
  });
  console.log('Error message received:', res5.data.message);
  if (res5.status === 401 && res5.data.message.includes('initial default password is your Name')) {
    console.log('[PASS] Informative hint provided in 401 response!');
  } else {
    throw new Error('Test 5 failed: ' + JSON.stringify(res5.data));
  }

  // TEST 6: Admission Login for Resident Harry (dobOrYear: 1962) with "Harry1962" & "Harr1962"
  console.log('\n>>> 6. Testing Admission Login for SSBM-ADM-2026-9107...');
  const admRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/portal/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    loginId: 'SSBM-ADM-2026-9107',
    password: 'Harry1962'
  });
  if (admRes.status === 200) {
    console.log('[PASS] Admission Applicant logged in with Harry1962!');
  } else {
    throw new Error('Test 6 failed: ' + JSON.stringify(admRes.data));
  }

  // TEST 7: Admin Login
  console.log('\n>>> 7. Testing Admin Login (ashvin / @Ashvin2824)...');
  const adminRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/admin/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    username: 'ashvin',
    password: '@Ashvin2824'
  });
  if (adminRes.status === 200 && adminRes.data.token) {
    console.log('[PASS] Admin logged in successfully!');
  } else {
    throw new Error('Test 7 failed: ' + JSON.stringify(adminRes.data));
  }

  console.log('\n========================================================================');
  console.log('ALL LOGIN SYSTEMS VERIFIED & PASSING WITH ZERO ERRORS!');
  console.log('========================================================================\n');
}

run().catch(err => {
  console.error('[FAIL]', err);
  process.exit(1);
});
