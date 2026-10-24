// Targeted verification script for the new Admission default password format
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

async function runTest() {
  console.log('========================================================================');
  console.log('TESTING NEW ADMISSION DEFAULT PASSWORD FORMAT');
  console.log('Requirement: First four letters of Senior Resident name + Birth Year');
  console.log('Example: Resident "Rahul Sharma", Birth Year 1985 -> "Rahu1985"');
  console.log('========================================================================\n');

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  
  // 1. Submit admission enquiry
  const payload = {
    applicantName: 'Rahul Sharma',
    guardianFirstName: 'Amitabh',
    guardianPhone: `9822${randomSuffix}44`,
    applicantEmail: `rahul.sharma.${randomSuffix}@example.com`,
    dobOrYear: '1985',
    address: 'Dharampeth, Nagpur, Maharashtra',
    admissionCategory: 'Elder Care Sanctuary',
    residentGender: 'Male',
    relationWithResident: 'Son',
    mobilityStatus: 'Assisted walker',
    medicalNotes: 'Mild hypertension',
    additionalMessage: 'Targeted verification test for Rahu1985 format.'
  };

  console.log('>>> 1. Submitting admission enquiry for Senior Resident: "Rahul Sharma", Guardian: "Amitabh", DOB: "1985"...');
  const enqRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/enquiries/admission',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, payload);

  console.log(`Enquiry Response Status: ${enqRes.status}`);
  console.log(`Registration ID: ${enqRes.data.registrationId}`);
  console.log(`initialPasswordFormat returned: ${enqRes.data.initialPasswordFormat}`);

  if (enqRes.status !== 201 || !enqRes.data.registrationId) {
    throw new Error('Failed to submit admission enquiry: ' + JSON.stringify(enqRes.data));
  }

  const regId = enqRes.data.registrationId;

  // 2. Verify that old guardian-based password (Amit1985 or Amitabh1985) is rejected
  console.log('\n>>> 2. Testing that guardian-based password "Amit1985" or "Amitabh1985" is REJECTED...');
  const guardianLoginRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/portal/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    loginId: regId,
    password: 'Amit1985'
  });
  console.log(`Guardian-based password login status: ${guardianLoginRes.status} (Expected: 401)`);
  if (guardianLoginRes.status === 401) {
    console.log('[PASS] Guardian-based password is successfully rejected!');
  } else {
    throw new Error('Guardian-based password was unexpectedly accepted: ' + JSON.stringify(guardianLoginRes.data));
  }

  // 3. Verify that NEW default password format "Rahu1985" SUCCEEDS
  console.log('\n>>> 3. Testing that NEW default password "Rahu1985" (First 4 letters of Rahul + 1985) SUCCEEDS...');
  const correctLoginRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/portal/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    loginId: regId,
    password: 'Rahu1985'
  });
  console.log(`Resident-based password login status: ${correctLoginRes.status} (Expected: 200)`);
  if (correctLoginRes.status === 200 && correctLoginRes.data.token) {
    console.log('[PASS] Resident-based password "Rahu1985" authenticated successfully!');
    console.log(`Authenticated User: ${correctLoginRes.data.user.fullName}`);
    console.log(`User Role: ${correctLoginRes.data.user.role}`);
    console.log(`Must Change Password: ${correctLoginRes.data.user.mustChangePassword}`);
  } else {
    throw new Error('Resident-based password failed: ' + JSON.stringify(correctLoginRes.data));
  }

  // 4. Test self-service password reset restoring new formula
  console.log('\n>>> 4. Testing Password Reset restores resident-based formula...');
  const resetRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/portal/reset-password',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    loginId: regId,
    mobile: payload.guardianPhone
  });
  console.log(`Reset status: ${resetRes.status}`);
  console.log(`Reset message: ${resetRes.data.message}`);

  const postResetLogin = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/portal/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    loginId: regId,
    password: 'Rahu1985'
  });
  if (postResetLogin.status === 200) {
    console.log('[PASS] Login succeeds after reset using "Rahu1985"!');
  } else {
    throw new Error('Login failed after reset: ' + JSON.stringify(postResetLogin.data));
  }

  // 5. Test another record with 3-letter resident name: "Uma Devi", birth year 1952 -> "UmaX1952"
  console.log('\n>>> 5. Testing edge-case: Resident "Uma Devi" (3 letters, padded with X) + 1952 -> "UmaX1952"...');
  const umaSuffix = Math.floor(1000 + Math.random() * 9000);
  const umaRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/enquiries/admission',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    applicantName: 'Uma Devi',
    guardianFirstName: 'Ramesh',
    guardianPhone: `9823${umaSuffix}11`,
    applicantEmail: `uma.${umaSuffix}@example.com`,
    dobOrYear: '1952',
    address: 'Sitabuldi, Nagpur',
    admissionCategory: 'Elder Care Sanctuary',
    residentGender: 'Female',
    relationWithResident: 'Daughter',
    mobilityStatus: 'Independent',
    medicalNotes: 'None',
    additionalMessage: 'Edge case padding test'
  });

  const umaRegId = umaRes.data.registrationId;
  const umaLoginRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/portal/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    loginId: umaRegId,
    password: 'UmaX1952'
  });

  if (umaLoginRes.status === 200) {
    console.log('[PASS] Padded resident password "UmaX1952" authenticated successfully!');
  } else {
    throw new Error('UmaX1952 login failed: ' + JSON.stringify(umaLoginRes.data));
  }

  console.log('\n========================================================================');
  console.log('ALL NEW ADMISSION PASSWORD FORMAT VERIFICATIONS PASSED SUCCESSFULLY!');
  console.log('========================================================================\n');
}

runTest().catch(err => {
  console.error('[FAIL]', err);
  process.exit(1);
});
