const http = require('http');

function apiCall(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(body);
        } catch (e) {
          json = { raw: body };
        }
        resolve({ status: res.statusCode, data: json });
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runAdmissionTests() {
  console.log('========================================================================');
  console.log('STARTING ADMISSION ENQUIRY & ADMIN APPROVAL END-TO-END QA TEST SUITE');
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // ----------------------------------------------------
    // TEST 1: Health Check
    // ----------------------------------------------------
    console.log('>>> 1. Verifying API Server Health...');
    const health = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET',
    });
    assert(health.status === 200 && health.data.status === 'healthy', 'Health check returns healthy status');

    // ----------------------------------------------------
    // TEST 2: Missing Required Fields Validation
    // ----------------------------------------------------
    console.log('\n>>> 2. Testing Missing Required Fields Validation...');
    const invalidSub = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/enquiries/admission',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      applicantName: '',
      guardianPhone: '',
    });
    assert(invalidSub.status === 400 && invalidSub.data.success === false, 'Rejects enquiry with missing required fields');

    // ----------------------------------------------------
    // TEST 3: New Admission Enquiry Submission
    // ----------------------------------------------------
    console.log('\n>>> 3. Testing Valid Admission Enquiry Submission...');
    const testGuardianPhone = `98220${Math.floor(10000 + Math.random() * 90000)}`;
    const enqPayload = {
      applicantName: 'Dattatray Keshav Joshi',
      guardianFirstName: 'Rohan',
      guardianPhone: testGuardianPhone,
      applicantEmail: 'rohan.joshi@example.com',
      dobOrYear: '1948',
      address: 'Flat 204, Ramdas Peth, Nagpur',
      admissionCategory: 'Elder Care Sanctuary',
      relationWithResident: 'Son / Daughter',
      residentGender: 'Male',
      mobilityStatus: 'Independent with daily routine',
      medicalNotes: 'Mild hypertension controlled with daily Amlodipine 5mg.',
      additionalMessage: 'Seeking a peaceful spiritual environment with Go-Seva and daily prayer routines.',
    };

    const subRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/enquiries/admission',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, enqPayload);

    assert(subRes.status === 201, 'Enquiry submission returns 201 Created');
    assert(subRes.data.success === true, 'Enquiry response indicates success');
    assert(typeof subRes.data.registrationId === 'string' && subRes.data.registrationId.startsWith('SSBM-ADM-'), `Generated unique Registration ID: ${subRes.data.registrationId}`);
    assert(subRes.data.status === 'pending_review', 'Initial admission status is Pending Review (not auto-approved)');
    assert(subRes.data.guardianFirstName === 'Rohan', 'Guardian first name recorded properly');

    const regId1 = subRes.data.registrationId;

    // ----------------------------------------------------
    // TEST 4: Duplicate Submission Prevention
    // ----------------------------------------------------
    console.log('\n>>> 4. Testing Duplicate Submission Prevention...');
    const dupRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/enquiries/admission',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, enqPayload);

    assert(dupRes.status === 400, 'Duplicate submission blocked with 400 Bad Request');
    assert(dupRes.data.success === false, 'Duplicate response marked failure');
    assert(dupRes.data.message.includes('already registered'), 'Duplicate error message mentions existing registration');

    // ----------------------------------------------------
    // TEST 5: Admin Login & Admission Visibility
    // ----------------------------------------------------
    console.log('\n>>> 5. Testing Admin Authentication & Enquiry Visibility...');
    const adminLogin = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      loginId: 'ashvin',
      password: '@Ashvin2824',
    });

    assert(adminLogin.status === 200 && adminLogin.data.token, 'Admin logs in successfully with official credentials');
    const adminToken = adminLogin.data.token;

    const adminAdmissions = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/admissions',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });

    assert(adminAdmissions.status === 200, 'Admin can fetch all admission enquiries');
    const foundInAdmin = adminAdmissions.data.data.find(a => a.registrationId === regId1);
    assert(foundInAdmin !== undefined, `New enquiry (${regId1}) is immediately visible in Admin Dashboard`);
    assert(foundInAdmin && foundInAdmin.status === 'pending_review', 'Admin sees initial status as pending_review');

    // ----------------------------------------------------
    // TEST 6: Applicant Login with Formula Credentials
    // Formula: GuardianFirstName + BirthYear -> "Rohan" + "1948" = "Rohan1948"
    // ----------------------------------------------------
    console.log('\n>>> 6. Testing Applicant Login with GuardianFirstName + BirthYear Credential...');
    const expectedPassword = 'Rohan1948';
    const applicantLogin = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      loginId: regId1,
      password: expectedPassword,
      expectedRole: 'admission_applicant',
    });

    assert(applicantLogin.status === 200, `Applicant logs in with initial credential formula (${expectedPassword})`);
    assert(applicantLogin.data.user.role === 'admission_applicant', 'User role is correctly set to admission_applicant');
    assert(applicantLogin.data.user.mustChangePassword === true, 'Applicant has mustChangePassword flag set to true');
    const applicantToken = applicantLogin.data.token;

    // ----------------------------------------------------
    // TEST 7: Invalid Credential Rejection
    // ----------------------------------------------------
    console.log('\n>>> 7. Testing Invalid Password Rejection...');
    const badLogin = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      loginId: regId1,
      password: 'WrongPassword999',
    });
    assert(badLogin.status === 401, 'Invalid password correctly rejected with 401 Unauthorized');

    // ----------------------------------------------------
    // TEST 8: Applicant Dashboard Data Access
    // ----------------------------------------------------
    console.log('\n>>> 8. Testing Applicant Dashboard Data Access...');
    const dashData = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/dashboard-data',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${applicantToken}` },
    });

    assert(dashData.status === 200, 'Applicant retrieves dashboard data');
    const appProfile = dashData.data.admissionEnquiry || dashData.data.profile;
    assert(appProfile && appProfile.registrationId === regId1, 'Dashboard returns matching enquiry profile');
    assert(appProfile && appProfile.status === 'pending_review', 'Applicant sees Pending Review status on dashboard');

    // ----------------------------------------------------
    // TEST 9: Authorization & RBAC Security Verification
    // ----------------------------------------------------
    console.log('\n>>> 9. Testing RBAC Security (Applicant cannot call admin endpoints)...');
    const illegalAdminCall = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/admissions',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${applicantToken}` },
    });
    assert(illegalAdminCall.status === 403, 'Applicant blocked from admin admissions list (403 Forbidden)');

    const illegalStatusChange = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: `/api/admin/admissions/${regId1}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${applicantToken}`,
        'Content-Type': 'application/json',
      },
    }, {
      status: 'approved',
    });
    assert(illegalStatusChange.status === 403, 'Applicant cannot approve their own admission (403 Forbidden)');

    // ----------------------------------------------------
    // TEST 10: Admin Requests More Information
    // ----------------------------------------------------
    console.log('\n>>> 10. Testing Admin "Request More Information" Workflow...');
    const reqInfoRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: `/api/admin/admissions/${regId1}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    }, {
      status: 'more_info_required',
      requestedInfoNotes: 'Please provide certified medical fitness certificate and senior Aadhaar card copy.',
      adminNotes: 'Awaiting medical review documents.',
    });

    assert(reqInfoRes.status === 200, 'Admin successfully requests more information');
    assert(reqInfoRes.data.data.status === 'more_info_required', 'Status updated to more_info_required in database');
    assert(reqInfoRes.data.data.statusHistory.length >= 2, 'Status change recorded in statusHistory audit timeline');

    // Applicant dashboard reflects "more_info_required"
    const dashDataAfterReqInfo = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/dashboard-data',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${applicantToken}` },
    });
    const updatedProf1 = dashDataAfterReqInfo.data.admissionEnquiry || dashDataAfterReqInfo.data.profile;
    assert(updatedProf1.status === 'more_info_required', 'Applicant dashboard immediately reflects More Information Required');
    assert(updatedProf1.requestedInfoNotes.includes('certified medical fitness certificate'), 'Applicant sees specific requested documents notes');

    // ----------------------------------------------------
    // TEST 11: Applicant Responds to More Info Request
    // ----------------------------------------------------
    console.log('\n>>> 11. Testing Applicant Response to Information Request...');
    const respondRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/admission/respond-info',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${applicantToken}`,
        'Content-Type': 'application/json',
      },
    }, {
      additionalDetails: 'Dr. Deshmukh certified fitness attached; BP stable. Aadhaar reference 2345-6789-0123 provided.',
    });

    assert(respondRes.status === 200, 'Applicant response submitted successfully');
    assert(respondRes.data.data.status === 'pending_review', 'Enquiry status automatically returns to Pending Review');

    // ----------------------------------------------------
    // TEST 12: Admin Rejection with Mandatory Reason Validation
    // ----------------------------------------------------
    console.log('\n>>> 12. Testing Admin Rejection Validation & History...');
    // Missing reason should fail
    const invalidReject = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: `/api/admin/admissions/${regId1}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    }, {
      status: 'rejected',
      rejectionReason: '',
    });
    assert(invalidReject.status === 400, 'Admin rejection without mandatory reason is blocked (400 Bad Request)');

    // Proper rejection
    const validReject = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: `/api/admin/admissions/${regId1}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    }, {
      status: 'rejected',
      rejectionReason: 'Assisted care ward is currently operating at maximum safe capacity for high-dependency residents.',
      adminNotes: 'Referred to Hingna senior citizen care network.',
    });
    assert(validReject.status === 200, 'Admin enquiry rejection succeeds with valid reason');
    assert(validReject.data.data.status === 'rejected', 'Status updated to rejected in database');

    // Applicant dashboard reflects rejection
    const dashAfterReject = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/dashboard-data',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${applicantToken}` },
    });
    const profAfterReject = dashAfterReject.data.admissionEnquiry || dashAfterReject.data.profile;
    assert(profAfterReject.status === 'rejected', 'Applicant dashboard reflects Not Approved (rejected) status');
    assert(profAfterReject.rejectionReason.includes('maximum safe capacity'), 'Applicant dashboard displays official rejection reason');

    // ----------------------------------------------------
    // TEST 13: Full Approval Lifecycle on Second Applicant
    // ----------------------------------------------------
    console.log('\n>>> 13. Testing Full Approval Lifecycle on Second Applicant...');
    const testGuardianPhone2 = `98220${Math.floor(10000 + Math.random() * 90000)}`;
    const enqPayload2 = {
      applicantName: 'Savitri Narayan Kulkarni',
      guardianFirstName: 'Pramod',
      guardianPhone: testGuardianPhone2,
      applicantEmail: 'pramod.kulkarni@example.com',
      dobOrYear: '1954',
      address: 'Dhantoli, Nagpur',
      admissionCategory: 'Elder Care Sanctuary',
      relationWithResident: 'Son / Daughter',
      residentGender: 'Female',
      mobilityStatus: 'Independent with daily routine',
      medicalNotes: 'No chronic illness, requires sattvic vegetarian diet and morning walk companionship.',
    };

    const subRes2 = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/enquiries/admission',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, enqPayload2);

    assert(subRes2.status === 201, 'Second enquiry created successfully');
    const regId2 = subRes2.data.registrationId;
    const expectedPassword2 = 'Pramod1954';

    // Admin approves enquiry 2
    const approveRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: `/api/admin/admissions/${regId2}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    }, {
      status: 'approved',
      adminNotes: 'Approved for Room 208, West Sanctuary Wing. Please visit ashram office on Monday for onboarding.',
    });

    assert(approveRes.status === 200, 'Admin approves admission enquiry');
    assert(approveRes.data.data.status === 'approved', 'Database status set to approved');

    // Applicant 2 logs in
    const app2Login = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      loginId: regId2,
      password: expectedPassword2,
    });

    assert(app2Login.status === 200, `Second applicant logs in with generated credential (${expectedPassword2})`);
    const app2Token = app2Login.data.token;

    const app2Dash = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/dashboard-data',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${app2Token}` },
    });
    const app2Prof = app2Dash.data.admissionEnquiry || app2Dash.data.profile;
    assert(app2Prof.status === 'approved', 'Applicant 2 dashboard shows Approved status');
    assert(app2Prof.adminNotes.includes('Room 208'), 'Applicant 2 sees room allotment instructions');

    // ----------------------------------------------------
    // TEST 14: Applicant First-Time Password Change
    // ----------------------------------------------------
    console.log('\n>>> 14. Testing Applicant Password Change...');
    const newCustomPass = 'SavitriPeace@2026';
    const changePassRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/change-password',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${app2Token}`,
        'Content-Type': 'application/json',
      },
    }, {
      currentPassword: expectedPassword2,
      newPassword: newCustomPass,
    });

    assert(changePassRes.status === 200, 'Applicant changes password successfully');

    // Verify login with new password
    const newPassLogin = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      loginId: regId2,
      password: newCustomPass,
    });
    assert(newPassLogin.status === 200, 'Applicant can now log in with their new password');
    assert(newPassLogin.data.user.mustChangePassword === false, 'mustChangePassword flag is now false');

    // Old password fails
    const oldPassLogin = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      loginId: regId2,
      password: expectedPassword2,
    });
    assert(oldPassLogin.status === 401, 'Old password is no longer accepted');

    // ----------------------------------------------------
    // TEST 15: Password Reset Functionality
    // ----------------------------------------------------
    console.log('\n>>> 15. Testing Self-Service / Admin Password Reset...');
    const resetRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/reset-password',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      loginId: regId2,
      mobile: testGuardianPhone2,
    });

    console.log('resetRes:', resetRes);
    assert(resetRes.status === 200, 'Password reset request succeeds');

    // Verify initial credential formula works again
    const postResetLogin = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      loginId: regId2,
      password: expectedPassword2,
    });
    console.log('postResetLogin:', postResetLogin);
    assert(postResetLogin.status === 200, 'Applicant can log in again using reset temporary formula password');

    // ----------------------------------------------------
    // TEST 16: Verification of Admin Admissions Filtering & Metrics
    // ----------------------------------------------------
    console.log('\n>>> 16. Testing Admin Search & Filter Endpoints...');
    const filterApproved = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/admissions?status=approved',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });
    assert(filterApproved.status === 200 && filterApproved.data.data.every(a => a.status === 'approved'), 'Status filter "approved" only returns approved records');

    const searchRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: `/api/admin/admissions?search=${encodeURIComponent('Kulkarni')}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });
    assert(searchRes.status === 200 && searchRes.data.data.some(a => a.registrationId === regId2), 'Search query finds enquiry by resident surname');

    console.log('\n========================================================================');
    console.log(`TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
    console.log('========================================================================');

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('Test suite error:', err);
    process.exit(1);
  }
}

runAdmissionTests();
