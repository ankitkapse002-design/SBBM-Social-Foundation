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
  console.log('COMPREHENSIVE LOGIN SYSTEM VERIFICATION & AUDIT');
  console.log('========================================================================\n');

  // TEST 1: The exact case reported by user (SSBM-SM-2026-8351 with Harry2000)
  console.log('>>> 1. Testing user account: Seva Member SSBM-SM-2026-8351 with "Harry2000"...');
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

  // TEST 2: Register a fresh Seva Member to test initial formula variants (mustChangePassword: true)
  const rand = Math.floor(1000 + Math.random() * 9000);
  console.log(`\n>>> 2. Registering new Seva Member "Gopal Sharma" (DOB: 1994) to test initial formula variants...`);
  const regRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/portal/register/seva-member',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    fullName: 'Gopal Sharma',
    dob: '1994-06-15',
    mobile: `982200${rand}`,
    email: `gopal.${rand}@example.com`,
    address: 'Mahuli, Nagpur',
    sevaPreferences: ['Elder Care Seva']
  });

  const newMemberId = regRes.data.memberId;
  console.log(`Registered Member ID: ${newMemberId}`);

  // Approve member via admin so portal login is unlocked
  const adminLogin = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/admin/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    username: 'ashvin',
    password: '@Ashvin2824'
  });
  const adminToken = adminLogin.data.token;

  await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: `/api/portal/admin/seva-members/${newMemberId}/status`,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` }
  }, { status: 'approved' });
  console.log(`Approved new member ${newMemberId}`);

  // Test 2a: Login with TitleCase full name: "Gopal1994"
  console.log('Testing login with TitleCase full name "Gopal1994"...');
  const res2a = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/portal/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    loginId: newMemberId,
    password: 'Gopal1994'
  });
  if (res2a.status === 200) {
    console.log('[PASS] Full name TitleCase "Gopal1994" accepted successfully!');
  } else {
    throw new Error('Test 2a failed: ' + JSON.stringify(res2a.data));
  }

  // Test 2b: Login with exact 4-letter uppercase: "GOPA1994"
  console.log('Testing login with exact 4-letter uppercase "GOPA1994"...');
  const res2b = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/portal/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    loginId: newMemberId,
    password: 'GOPA1994'
  });
  if (res2b.status === 200) {
    console.log('[PASS] Uppercase 4-letter "GOPA1994" accepted successfully!');
  } else {
    throw new Error('Test 2b failed: ' + JSON.stringify(res2b.data));
  }

  // Test 2c: Login with lowercase: "gopa1994"
  console.log('Testing login with lowercase "gopa1994"...');
  const res2c = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/portal/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    loginId: newMemberId,
    password: 'gopa1994'
  });
  if (res2c.status === 200) {
    console.log('[PASS] Lowercase "gopa1994" accepted successfully!');
  } else {
    throw new Error('Test 2c failed: ' + JSON.stringify(res2c.data));
  }

  // Test 2d: Trailing whitespace tolerance: "Gopal1994 "
  console.log('Testing trailing whitespace tolerance: "Gopal1994 "...');
  const res2d = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/portal/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    loginId: newMemberId,
    password: 'Gopal1994 '
  });
  if (res2d.status === 200) {
    console.log('[PASS] Trailing whitespace trimmed and accepted!');
  } else {
    throw new Error('Test 2d failed: ' + JSON.stringify(res2d.data));
  }

  // TEST 3: Clear error message when genuinely wrong password is supplied
  console.log('\n>>> 3. Testing error message on incorrect password...');
  const res3 = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/portal/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    loginId: newMemberId,
    password: 'WrongPassword123'
  });
  console.log('Error message received:', res3.data.message);
  if (res3.status === 401 && res3.data.message.includes('initial default password is your Name')) {
    console.log('[PASS] Informative hint provided in 401 response!');
  } else {
    throw new Error('Test 3 failed: ' + JSON.stringify(res3.data));
  }

  // TEST 4: Admission Login for Resident Harry (dobOrYear: 1962) with "Harry1962"
  console.log('\n>>> 4. Testing Admission Login for SSBM-ADM-2026-9107...');
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
    throw new Error('Test 4 failed: ' + JSON.stringify(admRes.data));
  }

  // TEST 5: Admin Login
  console.log('\n>>> 5. Testing Admin Login (ashvin / @Ashvin2824)...');
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
    throw new Error('Test 5 failed: ' + JSON.stringify(adminRes.data));
  }

  console.log('\n========================================================================');
  console.log('ALL LOGIN SYSTEMS VERIFIED & PASSING WITH ZERO ERRORS!');
  console.log('========================================================================\n');
}

run().catch(err => {
  console.error('[FAIL]', err);
  process.exit(1);
});
