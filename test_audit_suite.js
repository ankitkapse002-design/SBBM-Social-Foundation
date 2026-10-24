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

async function runAuditTests() {
  console.log('====================================================');
  console.log('STARTING FULL PROJECT AUDIT & QA INTEGRATION TESTS');
  console.log('====================================================\n');

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
    // TEST 1: Admin Authentication & Protected Route Check
    // ----------------------------------------------------
    console.log('>>> 1. Testing Admin Authentication & RBAC...');
    const unauthRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/admin/metrics',
      method: 'GET'
    });
    assert(unauthRes.status === 401, 'Unauthorized request to admin metrics returns HTTP 401');

    const adminLoginRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { loginId: 'ashvin', password: '@Ashvin2824' });

    assert(adminLoginRes.status === 200 && adminLoginRes.data.success, 'Admin login with username "ashvin" succeeds');
    const adminToken = adminLoginRes.data.token;

    const metricsRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/admin/metrics',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(metricsRes.status === 200 && metricsRes.data.success, 'Admin successfully fetches live metrics from database');
    console.log('   Metrics count sample:', JSON.stringify(metricsRes.data.data.tasks));

    // ----------------------------------------------------
    // TEST 2: Seva Member Registration, Duplication & Status Gate
    // ----------------------------------------------------
    console.log('\n>>> 2. Testing Seva Member Registration & Access Control...');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const testSevaMobile = `98220${randomSuffix}`;
    const testSevaEmail = `ananya.verma.${randomSuffix}@example.com`;

    const regRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/register/seva-member',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      fullName: 'Ananya Verma',
      dob: '1995-04-12',
      mobile: testSevaMobile,
      email: testSevaEmail,
      address: 'Plot 44, Ram Nagar, Nagpur',
      sevaPreferences: ['Elder Care Seva', 'Gaushala Seva']
    });

    assert(regRes.status === 201 && regRes.data.success, 'Seva member registration succeeds');
    const sevaMemberId = regRes.data.memberId;
    assert(sevaMemberId.startsWith('SSBM-SM-'), `Unique Seva Member ID format verified: ${sevaMemberId}`);

    // Duplicate test
    const dupRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/register/seva-member',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      fullName: 'Ananya Duplicate',
      dob: '1995-04-12',
      mobile: testSevaMobile,
      email: testSevaEmail,
      address: 'Plot 44, Nagpur'
    });
    assert(dupRes.status === 400, 'Duplicate registration attempt is rejected with HTTP 400');

    // Attempt login before approval (Must be restricted)
    const pendingLogin = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { loginId: sevaMemberId, password: 'ANAN1995', expectedRole: 'seva_member' });
    assert(pendingLogin.status === 403 && pendingLogin.data.code === 'PENDING_APPROVAL', 'Pending account is strictly blocked from dashboard login (HTTP 403)');

    // Admin approves Seva member
    const approveRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: `/api/portal/admin/seva-members/${sevaMemberId}/status`,
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' }
    }, { status: 'approved', adminNotes: 'Verified documents and identity' });
    assert(approveRes.status === 200 && approveRes.data.success, 'Admin approves Seva Member application');

    // Seva Member logs in with initial password
    const approvedLogin = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { loginId: sevaMemberId, password: 'ANAN1995', expectedRole: 'seva_member' });
    assert(approvedLogin.status === 200 && approvedLogin.data.success, 'Approved Seva Member logs in successfully with initial credential (ANAN1995)');
    assert(approvedLogin.data.user.mustChangePassword === true, 'Member is flagged with mustChangePassword: true');
    const memberToken = approvedLogin.data.token;
    const memberUserId = approvedLogin.data.user.id;

    // Seva Member changes password (testing password rotation)
    const samePassRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/change-password',
      method: 'POST',
      headers: { 'Authorization': `Bearer ${memberToken}`, 'Content-Type': 'application/json' }
    }, { currentPassword: 'ANAN1995', newPassword: 'ANAN1995' });
    assert(samePassRes.status === 400, 'Disallows changing password to identical current password');

    const changePassRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/change-password',
      method: 'POST',
      headers: { 'Authorization': `Bearer ${memberToken}`, 'Content-Type': 'application/json' }
    }, { currentPassword: 'ANAN1995', newPassword: '@AnanyaSecure2026!' });
    assert(changePassRes.status === 200 && changePassRes.data.success, 'Password changed successfully to new confidential password');

    // Verify login with new password
    const newPassLogin = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { loginId: sevaMemberId, password: '@AnanyaSecure2026!' });
    assert(newPassLogin.status === 200 && newPassLogin.data.user.mustChangePassword === false, 'Login with new rotated password succeeds (mustChangePassword: false)');

    // ----------------------------------------------------
    // TEST 3: Cross-Role Task Assignment & Evidence Lifecycle
    // ----------------------------------------------------
    console.log('\n>>> 3. Testing Cross-Role Workflow (Admin Task Creation -> Member Progress Update -> Admin Review)...');
    
    // Admin creates and assigns task to Ananya
    const createTaskRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/admin/tasks',
      method: 'POST',
      headers: { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' }
    }, {
      title: 'Senior Citizen Dining Care & Wellness Support',
      description: 'Assist ashram dining staff with midday nutritious meal service and conduct wellness check-in.',
      category: 'seva_member',
      assignedToId: sevaMemberId,
      assignedToName: 'Ananya Verma',
      priority: 'high',
      deadline: '2026-10-30',
      instructions: 'Wear seva aprons and sanitize hands before entering dining hall.'
    });
    assert(createTaskRes.status === 201 && createTaskRes.data.success, 'Admin creates and assigns task to Seva Member');
    const createdTask = createTaskRes.data.task || createTaskRes.data.data;
    const taskId = createdTask.id;

    // Seva Member fetches dashboard data and sees assigned task
    const memberDashboardRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/dashboard-data',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${memberToken}` }
    });
    assert(memberDashboardRes.status === 200 && memberDashboardRes.data.success, 'Member fetches dashboard data');
    const myTasks = memberDashboardRes.data.tasks;
    const assignedTaskInDashboard = myTasks.find(t => t.id === taskId);
    assert(assignedTaskInDashboard !== undefined, 'Assigned task appears in Seva Member account');
    assert(assignedTaskInDashboard.status === 'not_started', 'Initial task status is "not_started"');

    // Seva Member submits progress update and evidence
    const submitProgressRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: `/api/portal/tasks/${taskId}/progress`,
      method: 'POST',
      headers: { 'Authorization': `Bearer ${memberToken}`, 'Content-Type': 'application/json' }
    }, {
      progressPercent: 100,
      status: 'submitted',
      notes: 'Completed meal serving for 45 residents and assisted elder medical intake.',
      completionEvidence: 'https://ssbmfoundation.org/evidence/dining-care-batch1.jpg'
    });
    assert(submitProgressRes.status === 200 && submitProgressRes.data.success, 'Member submits completion evidence and marks status as "submitted"');

    // Admin fetches tasks and sees updated task with status 'submitted'
    const adminTasksRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/admin/tasks',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const taskInAdmin = adminTasksRes.data.data.find(t => t.id === taskId);
    assert(taskInAdmin && taskInAdmin.status === 'submitted', 'Admin sees updated task status "submitted" with evidence notes');

    // Admin reviews and approves task
    const reviewTaskRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: `/api/portal/admin/tasks/${taskId}`,
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' }
    }, {
      status: 'completed',
      adminComments: 'Outstanding service and timely care verified by supervisor.'
    });
    assert(reviewTaskRes.status === 200 && reviewTaskRes.data.success, 'Admin approves and completes task');

    // Member checks dashboard again, confirms task is 'completed'
    const finalMemberCheck = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/dashboard-data',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${memberToken}` }
    });
    const completedTask = finalMemberCheck.data.tasks.find(t => t.id === taskId);
    assert(completedTask && completedTask.status === 'completed', 'Completed task status synchronized back to Seva Member dashboard');

    // ----------------------------------------------------
    // TEST 4: Volunteer Workflow
    // ----------------------------------------------------
    console.log('\n>>> 4. Testing Volunteer Workflow...');
    const volSuffix = Math.floor(1000 + Math.random() * 9000);
    const volRegRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/register/volunteer',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      fullName: 'Rohan Joshi',
      dob: '1998-08-25',
      mobile: `97654${volSuffix}`,
      email: `rohan.joshi.${volSuffix}@example.com`,
      address: 'Dharampeth, Nagpur',
      skills: ['First Aid', 'Patient Care'],
      preferredActivities: ['Health Camps', 'Elder Care'],
      availability: 'Weekends'
    });
    assert(volRegRes.status === 201 && volRegRes.data.success, 'Volunteer registration succeeds');
    const volId = volRegRes.data.volunteerId;
    assert(volId.startsWith('SSBM-VOL-'), `Unique Volunteer ID format verified: ${volId}`);

    // Admin approves Volunteer
    await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: `/api/portal/admin/volunteers/${volId}/status`,
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' }
    }, { status: 'approved' });

    // Volunteer logs in
    const volLoginRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { loginId: volId, password: 'ROHA1998', expectedRole: 'volunteer' });
    assert(volLoginRes.status === 200 && volLoginRes.data.success, 'Approved Volunteer logs in with ROHA1998');

    // ----------------------------------------------------
    // TEST 5: Society Membership & Project Allocation
    // ----------------------------------------------------
    console.log('\n>>> 5. Testing Society Membership Application & Project Allocation...');
    const memSuffix = Math.floor(1000 + Math.random() * 9000);
    const memRegRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/register/membership',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      fullName: 'Rajesh Gupta',
      dob: '1980-02-15',
      mobile: `98901${memSuffix}`,
      email: `dr.rajesh.${memSuffix}@example.com`,
      address: 'Wardha Road, Nagpur',
      qualification: 'MBBS, MD (Geriatrics)',
      skills: ['Medical Consulting', 'Healthcare Operations'],
      areasOfInterest: ['Health Infrastructure', 'Elder Wellness Programs'],
      availability: 'Sundays'
    });
    assert(memRegRes.status === 201 && memRegRes.data.success, 'Society Membership application succeeds');
    const membershipId = memRegRes.data.membershipId;
    assert(membershipId.startsWith('SSBM-MEM-'), `Unique Membership ID format verified: ${membershipId}`);

    // Admin approves Membership
    await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: `/api/portal/admin/society-members/${membershipId}/status`,
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' }
    }, { status: 'approved' });

    // Admin creates project and allocates Dr. Rajesh Gupta
    const createProjectRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/admin/projects',
      method: 'POST',
      headers: { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' }
    }, {
      title: 'Senior Health & Preventive Clinic 2026',
      description: 'Weekly clinical health screenings and routine geriatric medical checkups.',
      leadMemberId: membershipId,
      leadMemberName: 'Dr. Rajesh Gupta',
      priority: 'high',
      deadline: '2026-12-31',
      objectives: ['Screen 100 seniors monthly', 'Establish regular vitals tracking']
    });
    assert(createProjectRes.status === 201 && createProjectRes.data.success, 'Admin creates project and assigns Society Member as lead');

    // Dr. Rajesh Gupta logs in and checks project
    const memLoginRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { loginId: membershipId, password: 'RAJE1980', expectedRole: 'member' });
    assert(memLoginRes.status === 200 && memLoginRes.data.success, 'Society Member logs in successfully');

    const memDashRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/dashboard-data',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${memLoginRes.data.token}` }
    });
    assert(memDashRes.data.projects.some(p => p.leadMemberId === membershipId), 'Assigned project appears in Society Member dashboard');

    // ----------------------------------------------------
    // TEST 6: Password Reset & Admin Password Recovery
    // ----------------------------------------------------
    console.log('\n>>> 6. Testing Password Reset Mechanisms...');
    
    // Self-service reset
    const resetRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/reset-password',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { loginId: sevaMemberId, mobile: testSevaMobile });
    assert(resetRes.status === 200 && resetRes.data.success, `Self-service password reset request succeeds (status: ${resetRes.status}, msg: ${resetRes.data?.message})`);

    // Admin reset
    const adminResetRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: `/api/portal/admin/users/${volId}/reset-password`,
      method: 'POST',
      headers: { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' }
    });
    assert(adminResetRes.status === 200 && adminResetRes.data.success, 'Admin password reset for user succeeds with audit log');

    // ----------------------------------------------------
    // TEST 7: Security & IDOR Protections
    // ----------------------------------------------------
    console.log('\n>>> 7. Testing Cybersecurity & IDOR Protections...');
    
    // Non-admin attempting admin endpoint
    const badAdminCall = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/admin/metrics',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${memberToken}` }
    });
    assert(badAdminCall.status === 403, 'Non-admin token rejected from /admin endpoint with HTTP 403');

    // Volunteer attempting to update Seva Member task (IDOR prevention)
    const idorTaskCall = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: `/api/portal/tasks/${taskId}/progress`,
      method: 'POST',
      headers: { 'Authorization': `Bearer ${volLoginRes.data.token}`, 'Content-Type': 'application/json' }
    }, { notes: 'Malicious modification attempt' });
    assert(idorTaskCall.status === 403, 'Unauthorized task update prevented with HTTP 403 (IDOR protected)');

    console.log('\n====================================================');
    console.log(`AUDIT SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Fatal error during test run:', err);
    process.exit(1);
  }
}

runAuditTests();
