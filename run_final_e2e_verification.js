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

async function runFinalE2EVerification() {
  console.log('========================================================================================');
  console.log('   VYENKATESH ASHRAM & SSBM SOCIAL FOUNDATION - FINAL END-TO-END QA & SECURITY AUDIT');
  console.log('========================================================================================\n');

  let passed = 0;
  let failed = 0;
  const testResults = [];

  function record(condition, testId, description, details = '') {
    if (condition) {
      console.log(`[PASS] [${testId}] ${description}`);
      passed++;
      testResults.push({ id: testId, description, status: 'PASS', details });
    } else {
      console.error(`[FAIL] [${testId}] ${description} - ${details}`);
      failed++;
      testResults.push({ id: testId, description, status: 'FAIL', details });
    }
  }

  try {
    // ==================================================================================
    // PHASE 1: ADMIN CONTROLS & AUTHENTICATION AUDIT
    // ==================================================================================
    console.log('\n--- PHASE 1: Testing Admin Authentication, Protected APIs & RBAC ---');

    // 1.1 Unauthenticated access blocked
    const unauthRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/metrics',
      method: 'GET'
    });
    record(unauthRes.status === 401, 'ADM_SEC_01', 'Unauthenticated request to admin metrics is rejected with HTTP 401');

    // 1.2 Admin login with official credentials
    const adminLoginRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { loginId: 'ashvin', password: '@Ashvin2824' });

    record(
      adminLoginRes.status === 200 && adminLoginRes.data.success && adminLoginRes.data.user.role === 'admin',
      'ADM_AUTH_01',
      'Admin logs in successfully with official credentials (ashvin / @Ashvin2824)'
    );
    const adminToken = adminLoginRes.data.token;

    // 1.3 Admin fetches live system metrics
    const metricsRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/admin/metrics',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    record(
      metricsRes.status === 200 && metricsRes.data.success && metricsRes.data.data.admissions !== undefined,
      'ADM_METRICS_01',
      'Admin fetches live metrics including Seva Members, Volunteers, Projects, Tasks, and Admissions'
    );

    // ==================================================================================
    // PHASE 2: SEVA MEMBER WORKFLOW & MULTI-USER ISOLATION (MEMBER A & MEMBER B)
    // ==================================================================================
    console.log('\n--- PHASE 2: Testing Seva Member Workflow & Multi-User Isolation ---');

    const suffix = Math.floor(1000 + Math.random() * 9000);
    const memberAPhone = `98220${suffix}`;
    const memberAEmail = `ananya.verma.${suffix}@example.com`;
    const memberBPhone = `98221${suffix}`;
    const memberBEmail = `bhavesh.patil.${suffix}@example.com`;

    // 2.1 Register Seva Member A
    const regMemberARes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/register/seva-member',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      fullName: 'Ananya Verma',
      dob: '1995-04-12',
      mobile: memberAPhone,
      email: memberAEmail,
      address: 'Plot 44, Ram Nagar, Nagpur',
      sevaPreferences: ['Elder Care Seva', 'Gaushala Seva']
    });

    record(
      regMemberARes.status === 201 && regMemberARes.data.memberId?.startsWith('SSBM-SM-'),
      'MEM_REG_01',
      `Seva Member A registered with unique Member ID (${regMemberARes.data?.memberId})`
    );
    const memberAId = regMemberARes.data.memberId;

    // 2.2 Pending account cannot log in before approval
    const pendingLoginRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      loginId: memberAId,
      password: 'ANAN1995',
      expectedRole: 'seva_member'
    });
    record(
      pendingLoginRes.status === 403 && pendingLoginRes.data.code === 'PENDING_APPROVAL',
      'MEM_AUTH_01',
      'Pending Seva Member is strictly blocked from dashboard login until approved'
    );

    // 2.3 Register Seva Member B
    const regMemberBRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/register/seva-member',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      fullName: 'Bhavesh Patil',
      dob: '1992-08-20',
      mobile: memberBPhone,
      email: memberBEmail,
      address: 'Near Gandhi Sagar, Mahal, Nagpur',
      sevaPreferences: ['Annadanam & Kitchen Seva']
    });
    record(
      regMemberBRes.status === 201 && regMemberBRes.data.memberId?.startsWith('SSBM-SM-'),
      'MEM_REG_02',
      `Seva Member B registered with unique Member ID (${regMemberBRes.data?.memberId})`
    );
    const memberBId = regMemberBRes.data.memberId;

    // 2.4 Admin approves Member A & Member B
    const approveMemberARes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: `/api/portal/admin/seva-members/${memberAId}/status`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    }, { status: 'approved', adminNotes: 'Verified and approved for Elder Care wing' });
    record(approveMemberARes.status === 200, 'ADM_MEMBER_01', 'Admin approves Seva Member A application');

    const approveMemberBRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: `/api/portal/admin/seva-members/${memberBId}/status`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    }, { status: 'approved', adminNotes: 'Approved for Kitchen Seva' });
    record(approveMemberBRes.status === 200, 'ADM_MEMBER_02', 'Admin approves Seva Member B application');

    // 2.5 Member A & Member B log in with initial formula credentials
    const memberALoginRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { loginId: memberAId, password: 'ANAN1995', expectedRole: 'seva_member' });
    record(memberALoginRes.status === 200 && memberALoginRes.data.token, 'MEM_LOGIN_01', 'Approved Seva Member A logs in with ANAN1995');
    const memberAToken = memberALoginRes.data.token;

    const memberBLoginRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { loginId: memberBId, password: 'BHAV1992', expectedRole: 'seva_member' });
    record(memberBLoginRes.status === 200 && memberBLoginRes.data.token, 'MEM_LOGIN_02', 'Approved Seva Member B logs in with BHAV1992');
    const memberBToken = memberBLoginRes.data.token;

    // 2.6 Admin assigns Task 1 to Member A and Task 2 to Member B
    const task1Res = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/admin/tasks',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    }, {
      title: `Morning Companion Seva for Ward A - ${suffix}`,
      description: 'Assist senior residents with morning reading and companion walks',
      category: 'seva_member',
      assignedToId: memberAId,
      assignedToName: 'Ananya Verma',
      priority: 'high',
      deadline: '2026-11-01',
      instructions: 'Report to Sister Saroj at 7:30 AM'
    });
    record(task1Res.status === 201 && (task1Res.data.task?.id || task1Res.data.data?.id), 'TASK_CREATE_01', 'Admin creates and assigns Task 1 to Seva Member A');
    const task1Id = task1Res.data.task?.id || task1Res.data.data?.id;

    const task2Res = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/admin/tasks',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    }, {
      title: `Annadanam Kitchen Ration Stocking - ${suffix}`,
      description: 'Verify wheat and pulse sacks inventory for ashram dining hall',
      category: 'seva_member',
      assignedToId: memberBId,
      assignedToName: 'Bhavesh Patil',
      priority: 'medium',
      deadline: '2026-11-02',
      instructions: 'Check storage moisture seals'
    });
    record(task2Res.status === 201 && (task2Res.data.task?.id || task2Res.data.data?.id), 'TASK_CREATE_02', 'Admin creates and assigns Task 2 to Seva Member B');
    const task2Id = task2Res.data.task?.id || task2Res.data.data?.id;

    // 2.7 Multi-User Task Isolation Verification
    const memberADash = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/dashboard-data',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${memberAToken}` }
    });
    const memberATasks = memberADash.data.tasks || [];
    const memberASeesTask1 = memberATasks.some(t => t.id === task1Id);
    const memberASeesTask2 = memberATasks.some(t => t.id === task2Id);
    record(
      memberASeesTask1 && !memberASeesTask2,
      'TASK_ISOLATION_01',
      'Seva Member A sees only their assigned Task 1 and CANNOT see Member B\'s Task 2 (Data Isolation Verified)'
    );

    const memberBDash = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/dashboard-data',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${memberBToken}` }
    });
    const memberBTasks = memberBDash.data.tasks || [];
    const memberBSeesTask2 = memberBTasks.some(t => t.id === task2Id);
    const memberBSeesTask1 = memberBTasks.some(t => t.id === task1Id);
    record(
      memberBSeesTask2 && !memberBSeesTask1,
      'TASK_ISOLATION_02',
      'Seva Member B sees only their assigned Task 2 and CANNOT see Member A\'s Task 1 (Data Isolation Verified)'
    );

    // 2.8 Member A updates Task 1 (progress and notes)
    const task1ProgressRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: `/api/portal/tasks/${task1Id}/progress`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${memberAToken}`,
        'Content-Type': 'application/json'
      }
    }, {
      notes: 'Morning walks completed with 8 senior residents. Vital check reports submitted to ashram dispensary.',
      progressPercent: 100,
      status: 'submitted',
      completionEvidence: 'Completed companion log verified by duty nurse.'
    });
    record(task1ProgressRes.status === 200, 'TASK_PROGRESS_01', 'Member A submits completion evidence and marks Task 1 as "submitted"');

    // 2.9 Admin verifies updated status and completes task
    const adminCheckTaskRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/admin/tasks',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const adminTask1 = adminCheckTaskRes.data.data.find(t => t.id === task1Id);
    record(
      adminTask1 && adminTask1.status === 'submitted' && adminTask1.completionEvidence.includes('duty nurse'),
      'ADMIN_TASK_VERIFY_01',
      'Admin dashboard reflects Member A\'s updated status ("submitted") with evidence'
    );

    const adminApproveTaskRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: `/api/portal/admin/tasks/${task1Id}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    }, {
      status: 'completed',
      adminComments: 'Verified and approved with thanks for compassionate seva.'
    });
    record(adminApproveTaskRes.status === 200, 'ADMIN_TASK_APPROVE_01', 'Admin approves and marks Task 1 as "completed"');

    // ==================================================================================
    // PHASE 3: VOLUNTEER WORKFLOW & MULTI-USER ISOLATION (VOLUNTEER A & VOLUNTEER B)
    // ==================================================================================
    console.log('\n--- PHASE 3: Testing Volunteer Workflow & Multi-User Isolation ---');

    const volAPhone = `98222${suffix}`;
    const volAEmail = `vikram.rathi.${suffix}@example.com`;
    const volBPhone = `98223${suffix}`;
    const volBEmail = `neha.deshpande.${suffix}@example.com`;

    // 3.1 Register Volunteer A & Volunteer B
    const regVolARes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/register/volunteer',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      fullName: 'Vikram Rathi',
      dob: '1998-11-05',
      mobile: volAPhone,
      email: volAEmail,
      address: 'Civil Lines, Nagpur',
      skills: ['Medical First Aid', 'Elder Mobility Escort'],
      preferredActivities: ['Health Checkup Camps']
    });
    record(
      regVolARes.status === 201 && regVolARes.data.volunteerId?.startsWith('SSBM-VOL-'),
      'VOL_REG_01',
      `Volunteer A registered with unique ID (${regVolARes.data?.volunteerId})`
    );
    const volAId = regVolARes.data.volunteerId;

    const regVolBRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/register/volunteer',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      fullName: 'Neha Deshpande',
      dob: '1996-03-15',
      mobile: volBPhone,
      email: volBEmail,
      address: 'Dharampeth, Nagpur',
      skills: ['Cultural Programs', 'Library & Reading'],
      preferredActivities: ['Senior Storytelling & Reading']
    });
    record(
      regVolBRes.status === 201 && regVolBRes.data.volunteerId?.startsWith('SSBM-VOL-'),
      'VOL_REG_02',
      `Volunteer B registered with unique ID (${regVolBRes.data?.volunteerId})`
    );
    const volBId = regVolBRes.data.volunteerId;

    // 3.2 Admin approves Volunteer A & Volunteer B
    await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: `/api/portal/admin/volunteers/${volAId}/status`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    }, { status: 'approved', adminNotes: 'Approved for Health Camp Support' });

    await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: `/api/portal/admin/volunteers/${volBId}/status`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    }, { status: 'approved', adminNotes: 'Approved for Ashram Library Support' });

    // 3.3 Volunteers log in with initial formula credentials
    const volALoginRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { loginId: volAId, password: 'VIKR1998', expectedRole: 'volunteer' });
    record(volALoginRes.status === 200 && volALoginRes.data.token, 'VOL_LOGIN_01', 'Approved Volunteer A logs in with VIKR1998');
    const volAToken = volALoginRes.data.token;

    const volBLoginRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { loginId: volBId, password: 'NEHA1996', expectedRole: 'volunteer' });
    record(volBLoginRes.status === 200 && volBLoginRes.data.token, 'VOL_LOGIN_02', 'Approved Volunteer B logs in with NEHA1996');
    const volBToken = volBLoginRes.data.token;

    // 3.4 Admin assigns volunteer tasks
    const volTask1Res = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/admin/tasks',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    }, {
      title: `Free Eye Checkup Camp Escort Duty - ${suffix}`,
      description: 'Assist ophthalmologist team in guiding senior citizens during vision test',
      category: 'volunteer',
      assignedToId: volAId,
      assignedToName: 'Vikram Rathi',
      priority: 'high',
      deadline: '2026-11-05',
      instructions: 'Camp takes place in Hall 2 from 9 AM to 1 PM'
    });
    const volTask1Id = volTask1Res.data.task?.id || volTask1Res.data.data?.id;

    const volTask2Res = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/admin/tasks',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    }, {
      title: `Sunday Bhajan & Sangeet Seva Coordination - ${suffix}`,
      description: 'Coordinate devotional singing evening with residents',
      category: 'volunteer',
      assignedToId: volBId,
      assignedToName: 'Neha Deshpande',
      priority: 'medium',
      deadline: '2026-11-08',
      instructions: 'Mandir hall from 5 PM to 6:30 PM'
    });
    const volTask2Id = volTask2Res.data.task?.id || volTask2Res.data.data?.id;

    // 3.5 Multi-Volunteer Isolation Verification
    const volADash = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/dashboard-data',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${volAToken}` }
    });
    const volATasks = volADash.data.tasks || [];
    const volASeesTask1 = volATasks.some(t => t.id === volTask1Id);
    const volASeesTask2 = volATasks.some(t => t.id === volTask2Id);
    record(
      volASeesTask1 && !volASeesTask2,
      'VOL_ISOLATION_01',
      'Volunteer A sees only their assigned activity and CANNOT see Volunteer B\'s activity (Data Isolation Verified)'
    );

    const volBDash = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/dashboard-data',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${volBToken}` }
    });
    const volBTasks = volBDash.data.tasks || [];
    const volBSeesTask2 = volBTasks.some(t => t.id === volTask2Id);
    const volBSeesTask1 = volBTasks.some(t => t.id === volTask1Id);
    record(
      volBSeesTask2 && !volBSeesTask1,
      'VOL_ISOLATION_02',
      'Volunteer B sees only their assigned activity and CANNOT see Volunteer A\'s activity (Data Isolation Verified)'
    );

    // ==================================================================================
    // PHASE 4: ADMISSION ENQUIRY, APPROVAL & REJECTION (APPLICANT A & APPLICANT B)
    // ==================================================================================
    console.log('\n--- PHASE 4: Testing Admission Enquiry, Approval, Rejection & Applicant Portals ---');

    const admAPhone = `98224${suffix}`;
    const admAEmail = `rahul.sharma.${suffix}@example.com`;
    const admBPhone = `98225${suffix}`;
    const admBEmail = `suresh.deshmukh.${suffix}@example.com`;

    // 4.1 Submit Admission Enquiry for Applicant A (Aarav Sharma)
    const admEnqARes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/enquiries/admission',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      applicantName: 'Aarav Sharma',
      guardianFirstName: 'Rahul',
      guardianPhone: admAPhone,
      applicantEmail: admAEmail,
      dobOrYear: '1985',
      address: 'Quarter 14, Laxmi Nagar, Nagpur',
      admissionCategory: 'Elder Care Sanctuary',
      relationWithResident: 'Son / Daughter',
      residentGender: 'Male',
      mobilityStatus: 'Independent with daily routine',
      medicalNotes: 'Routine blood pressure management with daily medication.',
      additionalMessage: 'Seeking comfortable ashram stay with peaceful daily Satsang.'
    });

    record(
      admEnqARes.status === 201 && admEnqARes.data.registrationId?.startsWith('SSBM-ADM-'),
      'ADM_REG_01',
      `Admission Enquiry A submitted; unique Registration ID generated (${admEnqARes.data.registrationId})`
    );
    const admARegId = admEnqARes.data.registrationId;
    record(admEnqARes.data.status === 'pending_review', 'ADM_INIT_STATUS_01', 'Initial status is strictly Pending Review (not auto-approved)');

    // 4.2 Submit Admission Enquiry for Applicant B (Kavita Deshmukh)
    const admEnqBRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/enquiries/admission',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      applicantName: 'Kavita Deshmukh',
      guardianFirstName: 'Suresh',
      guardianPhone: admBPhone,
      applicantEmail: admBEmail,
      dobOrYear: '1958',
      address: 'Plot 10, Somalwada, Wardha Road, Nagpur',
      admissionCategory: 'Assisted Living & Personal Care',
      relationWithResident: 'Son / Daughter',
      residentGender: 'Female',
      mobilityStatus: 'Wheelchair bound / needs special support',
      medicalNotes: 'Advanced neurological condition requiring continuous ICU-level care.',
      additionalMessage: 'Requires round-the-clock dedicated personal attendant.'
    });

    record(
      admEnqBRes.status === 201 && admEnqBRes.data.registrationId?.startsWith('SSBM-ADM-'),
      'ADM_REG_02',
      `Admission Enquiry B submitted; unique Registration ID generated (${admEnqBRes.data.registrationId})`
    );
    const admBRegId = admEnqBRes.data.registrationId;

    // 4.3 Applicant A logs in with generated formula password (Rahul1985)
    const admALoginRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      loginId: admARegId,
      password: 'Rahul1985',
      expectedRole: 'admission_applicant'
    });

    record(
      admALoginRes.status === 200 && admALoginRes.data.token,
      'ADM_LOGIN_01',
      'Applicant A logs in via Admission Login using Registration ID and initial credential formula (Rahul1985)'
    );
    const admAToken = admALoginRes.data.token;

    // 4.4 Applicant A views Pending Review on Admission Dashboard
    const admADashRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/dashboard-data',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${admAToken}` }
    });
    const admAProfile = admADashRes.data.admissionEnquiry || admADashRes.data.profile;
    record(
      admAProfile && admAProfile.status === 'pending_review' && admAProfile.registrationId === admARegId,
      'ADM_DASH_01',
      'Applicant A views their own enquiry and Pending Review status on Admission Dashboard'
    );

    // 4.5 Admin reviews Applicant A -> Approves enquiry
    const adminApproveAdmARes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: `/api/admin/admissions/${admARegId}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    }, {
      status: 'approved',
      adminNotes: 'Welcome to Vyenkatesh Ashram! Room 108 (Ground Floor, East Wing) reserved. Onboarding on 1st of next month.'
    });
    record(adminApproveAdmARes.status === 200, 'ADM_APPROVE_01', 'Admin approves Admission Enquiry A with onboarding instructions');

    // 4.6 Applicant A verifies Approved status and onboarding instructions on dashboard
    const admADashAfterApprove = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/dashboard-data',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${admAToken}` }
    });
    const admAUpdated = admADashAfterApprove.data.admissionEnquiry || admADashAfterApprove.data.profile;
    record(
      admAUpdated && admAUpdated.status === 'approved' && admAUpdated.adminNotes.includes('Room 108'),
      'ADM_VERIFY_APPROVE_01',
      'Applicant A dashboard immediately reflects Approved status and room allotment instructions'
    );

    // 4.7 Admin rejects Applicant B with mandatory rejection reason and confirmation
    const adminRejectAdmBRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: `/api/admin/admissions/${admBRegId}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    }, {
      status: 'rejected',
      rejectionReason: 'Ashram does not possess 24-hour ventilator / ICU infrastructure required for advanced neurological nursing care.',
      adminNotes: 'Referred to Nagpur District Government Medical College Senior Care Wing.'
    });
    record(adminRejectAdmBRes.status === 200, 'ADM_REJECT_01', 'Admin rejects Admission Enquiry B with mandatory rejection reason');

    // 4.8 Applicant B logs in with formula credential (Suresh1958) and verifies rejection reason
    const admBLoginRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      loginId: admBRegId,
      password: 'Suresh1958',
      expectedRole: 'admission_applicant'
    });
    record(admBLoginRes.status === 200 && admBLoginRes.data.token, 'ADM_LOGIN_02', 'Applicant B logs in with initial formula password (Suresh1958)');
    const admBToken = admBLoginRes.data.token;

    const admBDashRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/dashboard-data',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${admBToken}` }
    });
    const admBProfile = admBDashRes.data.admissionEnquiry || admBDashRes.data.profile;
    record(
      admBProfile && admBProfile.status === 'rejected' && admBProfile.rejectionReason.includes('ventilator / ICU infrastructure'),
      'ADM_VERIFY_REJECT_01',
      'Applicant B dashboard displays Not Approved (rejected) status with the exact official rejection reason'
    );

    // 4.9 Cross-Applicant Isolation Check
    record(
      admAProfile.registrationId !== admBProfile.registrationId &&
      !JSON.stringify(admADashAfterApprove.data).includes('Kavita Deshmukh') &&
      !JSON.stringify(admBDashRes.data).includes('Aarav Sharma'),
      'ADM_ISOLATION_01',
      'Applicant A and Applicant B have separate accounts and CANNOT access each other\'s private admission records'
    );

    // ==================================================================================
    // PHASE 5: CYBERSECURITY, IDOR, SQLi & PERMISSION ENFORCEMENT AUDIT
    // ==================================================================================
    console.log('\n--- PHASE 5: Testing Cybersecurity, RBAC & Direct Object Reference Protection ---');

    // 5.1 Applicant cannot approve their own admission via direct API call
    const selfApproveAttempt = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: `/api/admin/admissions/${admBRegId}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${admBToken}`,
        'Content-Type': 'application/json'
      }
    }, { status: 'approved' });
    record(selfApproveAttempt.status === 403, 'SEC_RBAC_01', 'Applicant cannot self-approve or modify admission decision via direct API (403 Forbidden)');

    // 5.2 Seva Member cannot modify another user\'s task (IDOR protection)
    const idorTaskAttempt = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: `/api/portal/tasks/${task2Id}/progress`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${memberAToken}`,
        'Content-Type': 'application/json'
      }
    }, { notes: 'Malicious attempt to alter Member B task', status: 'completed' });
    record(idorTaskAttempt.status === 403, 'SEC_IDOR_01', 'IDOR Protected: Member A is blocked from modifying Member B\'s task (403 Forbidden)');

    // 5.3 Volunteer cannot access admin members endpoint
    const volunteerAdminAttempt = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/members',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${volAToken}` }
    });
    record(volunteerAdminAttempt.status === 403, 'SEC_RBAC_02', 'Volunteer is blocked from admin members endpoint (403 Forbidden)');

    // 5.4 Injection resilience test
    const sqliAttempt = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      loginId: "' OR '1'='1' --",
      password: "' OR '1'='1' --"
    });
    record(sqliAttempt.status === 401, 'SEC_SQLI_01', 'SQLi/NoSQLi payload rejected with 401 Unauthorized');

    // 5.5 Sensitive password hashes never exposed in API responses
    record(
      !JSON.stringify(admADashAfterApprove.data).includes('passwordHash') &&
      !JSON.stringify(memberADash.data).includes('passwordHash') &&
      !JSON.stringify(volADash.data).includes('passwordHash'),
      'SEC_DATA_EXPOSURE_01',
      'Password hashes are strictly stripped from all dashboard data responses'
    );

    // ==================================================================================
    // PHASE 6: DATA PERSISTENCE & SESSION LIFECYCLE AUDIT
    // ==================================================================================
    console.log('\n--- PHASE 6: Testing Data Persistence Across Re-Login & Logout ---');

    // 6.1 Member A updates password
    const memberAPassChangeRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/change-password',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${memberAToken}`,
        'Content-Type': 'application/json'
      }
    }, {
      currentPassword: 'ANAN1995',
      newPassword: 'AnanyaSecurePass@2026'
    });
    record(memberAPassChangeRes.status === 200, 'AUTH_PASS_CHANGE_01', 'Member A changes password to AnanyaSecurePass@2026');

    // 6.2 Old password fails
    const oldPassRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { loginId: memberAId, password: 'ANAN1995', expectedRole: 'seva_member' });
    record(oldPassRes.status === 401, 'AUTH_OLD_PASS_01', 'Old initial password is no longer valid after password change');

    // 6.3 New password succeeds and verifies mustChangePassword is false
    const newPassRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { loginId: memberAId, password: 'AnanyaSecurePass@2026', expectedRole: 'seva_member' });
    record(
      newPassRes.status === 200 && newPassRes.data.user.mustChangePassword === false,
      'AUTH_NEW_PASS_01',
      'Login with new password succeeds and mustChangePassword is false'
    );

    // 6.4 Data persists on fresh dashboard fetch
    const freshDashRes = await apiCall({
      hostname: 'localhost',
      port: 5000,
      path: '/api/portal/dashboard-data',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${newPassRes.data.token}` }
    });
    record(
      freshDashRes.status === 200 && freshDashRes.data.tasks.some(t => t.id === task1Id && t.status === 'completed'),
      'PERSISTENCE_01',
      'Completed task and member records persist reliably after re-login'
    );

    console.log('\n========================================================================================');
    console.log(`FINAL E2E AUDIT RESULT: ${passed} PASSED | ${failed} FAILED (TOTAL TESTS: ${passed + failed})`);
    console.log('========================================================================================\n');

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('Fatal execution error during E2E verification:', err);
    process.exit(1);
  }
}

runFinalE2EVerification();
