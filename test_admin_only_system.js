const http = require('http');

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({ status: res.statusCode, headers: res.headers, data: json });
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('================================================================================');
  console.log('   SBBM SOCIAL FOUNDATION - ADMIN-ONLY VERIFICATION & AUDIT SUITE');
  console.log('================================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} - ${details}`);
      failed++;
    }
  }

  // 1. Verify Member Registration Endpoints are Removed
  console.log('--- 1. Testing Removal of Member Registration Endpoints ---');
  const regEndpoints = [
    { method: 'POST', path: '/api/auth/register' },
    { method: 'POST', path: '/api/portal/register/seva-member' },
    { method: 'POST', path: '/api/portal/register/membership' },
    { method: 'POST', path: '/api/portal/register/volunteer' },
    { method: 'POST', path: '/api/portal/register/unified' },
  ];

  for (const ep of regEndpoints) {
    const res = await request({
      hostname: 'localhost',
      port: 5000,
      path: ep.path,
      method: ep.method,
      headers: { 'Content-Type': 'application/json' },
    }, { fullName: 'Test User', mobile: '9890000000', email: 'test@example.com', password: 'Password@123' });
    
    assert(res.status === 404, `Endpoint ${ep.path} is removed`, `Status was ${res.status}`);
  }

  // 2. Verify Member Login & Password Reset Endpoints are Removed
  console.log('\n--- 2. Testing Removal of Member Login & Self-Service Reset ---');
  const loginEndpoints = [
    { method: 'POST', path: '/api/auth/login' },
    { method: 'POST', path: '/api/portal/login' },
    { method: 'POST', path: '/api/portal/reset-password' },
    { method: 'GET', path: '/api/portal/dashboard-data' },
    { method: 'GET', path: '/api/member/profile' },
  ];

  for (const ep of loginEndpoints) {
    const res = await request({
      hostname: 'localhost',
      port: 5000,
      path: ep.path,
      method: ep.method,
      headers: { 'Content-Type': 'application/json' },
    }, ep.method === 'POST' ? { loginId: 'test', password: 'password' } : null);

    assert(res.status === 404, `Member Auth Endpoint ${ep.path} is removed`, `Status was ${res.status}`);
  }

  // 3. Verify Admin Authentication Mechanism is Intact
  console.log('\n--- 3. Testing Admin Login & Credentials ---');
  const adminLoginRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/admin/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, { username: 'ashvin', password: '@Ashvin2824' });

  assert(adminLoginRes.status === 200 && adminLoginRes.data && adminLoginRes.data.success === true, 'Admin login succeeds with official credentials', JSON.stringify(adminLoginRes.data));
  const adminToken = adminLoginRes.data ? adminLoginRes.data.token : null;
  assert(Boolean(adminToken), 'Admin receives secure JWT bearer token');

  // Test invalid admin credentials
  const badAdminRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/admin/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, { username: 'ashvin', password: 'WrongPassword123' });

  assert(badAdminRes.status === 401, 'Unauthorized admin login attempt correctly rejected with HTTP 401');

  // 4. Verify Admin Profile Verification
  console.log('\n--- 4. Testing Admin Profile Verification ---');
  const meRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
    },
  });

  assert(meRes.status === 200 && meRes.data && meRes.data.user && meRes.data.user.role === 'admin', 'Admin profile verified via /api/auth/me');

  // 5. Verify Unauthenticated Protection on Admin Endpoints
  console.log('\n--- 5. Testing Admin Endpoint Security & RBAC ---');
  const protectedEndpoints = [
    '/api/admin/metrics',
    '/api/admin/admissions',
    '/api/admin/donations',
    '/api/portal/admin/metrics',
    '/api/portal/admin/all-users',
    '/api/portal/admin/tasks',
    '/api/portal/admin/projects',
  ];

  for (const p of protectedEndpoints) {
    const unauthRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: p,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    assert(unauthRes.status === 401, `Unauthenticated request to ${p} is strictly rejected (HTTP 401)`);
  }

  // 6. Verify Admin Panel Workflows & Real Database Operations
  console.log('\n--- 6. Testing Admin Panel Features & Data Retrieval ---');
  const adminMetricsRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/metrics',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
    },
  });
  assert(adminMetricsRes.status === 200 && adminMetricsRes.data && adminMetricsRes.data.data, 'Admin retrieves core system metrics');

  const portalMetricsRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/portal/admin/metrics',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
    },
  });
  assert(portalMetricsRes.status === 200 && portalMetricsRes.data && portalMetricsRes.data.data, 'Admin retrieves portal live metrics');

  const allUsersRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/portal/admin/all-users',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
    },
  });
  assert(allUsersRes.status === 200 && Array.isArray(allUsersRes.data.data), 'Admin retrieves unified users directory');

  const adminAdmissionsRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/admissions',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
    },
  });
  assert(adminAdmissionsRes.status === 200 && Array.isArray(adminAdmissionsRes.data.data), 'Admin retrieves admission records');

  const adminTasksRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/portal/admin/tasks',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
    },
  });
  assert(adminTasksRes.status === 200 && Array.isArray(adminTasksRes.data.data), 'Admin retrieves task management list');

  const adminProjectsRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/portal/admin/projects',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
    },
  });
  assert(adminProjectsRes.status === 200 && Array.isArray(adminProjectsRes.data.data), 'Admin retrieves project list');

  // 7. Verify Public Enquiries (Without Generating User Accounts)
  console.log('\n--- 7. Testing Public Enquiries & Forms ---');
  const uniqueSuffix = Date.now().toString().slice(-4);
  const testAdmissionPayload = {
    applicantName: `Dattatray Rao ${uniqueSuffix}`,
    guardianFirstName: 'Suresh',
    guardianPhone: `+91 98221 4${uniqueSuffix}`,
    applicantEmail: `dattatray_${uniqueSuffix}@example.com`,
    dobOrYear: '1948',
    address: 'Nagpur, Maharashtra',
    admissionCategory: 'Elder Care Sanctuary',
    residentGender: 'Male',
    relationWithResident: 'Son',
    mobilityStatus: 'Needs mild assistance',
    medicalNotes: 'Hypertension under management',
    additionalMessage: 'Enquiring for residential care at Vyenkatesh Ashram',
  };

  const admEnqRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/enquiries/admission',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, testAdmissionPayload);

  assert(
    admEnqRes.status === 201 && admEnqRes.data && admEnqRes.data.success === true,
    'Public admission enquiry submitted successfully',
    JSON.stringify(admEnqRes.data)
  );
  assert(Boolean(admEnqRes.data.registrationId), `Registration Reference ID generated: ${admEnqRes.data.registrationId}`);
  assert(!admEnqRes.data.token, 'No authentication token is returned to public applicant');

  // Verify the new enquiry is immediately visible in the Admin Panel
  const refreshedAdmissions = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/admissions',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
    },
  });
  const foundInAdmin = (refreshedAdmissions.data.data || []).find(e => e.registrationId === admEnqRes.data.registrationId);
  assert(Boolean(foundInAdmin), 'Submitted enquiry is immediately visible and manageable in Admin Panel');

  // 8. Public Volunteer & Membership Enquiries
  const volRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/enquiries/volunteer',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, {
    fullName: 'Ananya Deshmukh',
    phone: '+91 98811 22334',
    email: 'ananya@example.com',
    availability: 'Weekends (Saturday & Sunday)',
    areasOfInterest: ['Healthcare & Medical Assistance'],
    message: 'Medical student willing to assist in weekend health camps',
  });
  assert(volRes.status === 201 && volRes.data.success === true, 'Public volunteer enquiry submitted successfully');

  // 9. Verify Public Content Endpoints
  console.log('\n--- 8. Testing Public Directory & Content Endpoints ---');
  const servicesRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/public/services',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  assert(servicesRes.status === 200 && Array.isArray(servicesRes.data.data) && servicesRes.data.data.length >= 8, 'All 8 Core Pillar services are active');

  console.log('\n================================================================================');
  console.log(`AUDIT RESULTS: ${passed} PASSED | ${failed} FAILED (TOTAL TESTS: ${passed + failed})`);
  console.log('================================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
