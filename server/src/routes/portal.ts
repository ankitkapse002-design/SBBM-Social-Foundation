import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import {
  db, User, SevaMemberProfile, SocietyMemberProfile, VolunteerProfile,
  ProjectItem, PortalTask, PortalNotification, SevaRecordItem,
  AdmissionEnquiry, AdmissionStatus,
  generatePortalId, generateInitialPassword, generateAdmissionPassword, ApplicationStatus, AccountStatus, TaskStatus,
  getInitialPasswordCandidates
} from '../db';
import { authMiddleware, adminOnly, generateToken, rateLimit, AuthRequest } from '../middleware/auth';

export const portalRouter = Router();

// =========================================================================
// 1. REGISTRATION ENDPOINTS
// =========================================================================

/**
 * 1.1 Seva Member Registration
 */
portalRouter.post('/register/seva-member', rateLimit(60000, 10), (req: Request, res: Response) => {
  try {
    const {
      fullName, dob, mobile, email, address,
      sevaPreferences, emergencyContact, bloodGroup, notes, profilePhotoUrl
    } = req.body;

    if (!fullName || !dob || !mobile || !address) {
      res.status(400).json({
        success: false,
        message: 'Full name, date of birth, mobile number, and address are required.',
      });
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    const cleanEmail = (email || '').trim().toLowerCase();
    const users = db.get('users');
    const sevaMembers = db.get('seva_members');

    // Duplicate verification
    const existingUser = users.find(u => {
      const uMobile = u.mobile.replace(/\D/g, '');
      const uEmail = u.email.toLowerCase();
      return (cleanMobile && uMobile === cleanMobile) || (cleanEmail && uEmail === cleanEmail);
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'An application or account with this mobile number or email already exists.',
      });
      return;
    }

    const now = new Date().toISOString();
    const memberId = generatePortalId('SM');
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const initialPlainPassword = generateInitialPassword(fullName, dob);
    const passwordHash = bcrypt.hashSync(initialPlainPassword, 10);

    const newUser: User = {
      id: userId,
      email: cleanEmail || `${memberId.toLowerCase()}@ssbmfoundation.org`,
      username: memberId,
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      passwordHash,
      role: 'seva_member',
      portalId: memberId,
      accountStatus: 'pending',
      isVerified: true,
      mustChangePassword: true,
      createdAt: now,
      updatedAt: now,
    };

    const newProfile: SevaMemberProfile = {
      id: `sm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      memberId,
      fullName: fullName.trim(),
      dob: dob.trim(),
      mobile: mobile.trim(),
      email: cleanEmail,
      address: address.trim(),
      profilePhotoUrl: profilePhotoUrl?.trim(),
      sevaPreferences: Array.isArray(sevaPreferences) ? sevaPreferences : ['General Seva'],
      emergencyContact: (emergencyContact || mobile).trim(),
      bloodGroup: bloodGroup?.trim(),
      notes: notes?.trim(),
      applicationStatus: 'pending_approval',
      joinedAt: now,
    };

    users.push(newUser);
    sevaMembers.push(newProfile);

    // Initial system notification for the user
    db.get('portal_notifications').push({
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: memberId,
      title: 'Seva Member Application Submitted',
      message: `Your Seva Member application (${memberId}) was submitted successfully and is awaiting administrative approval.`,
      type: 'info',
      isRead: false,
      createdAt: now,
    });

    db.save();
    db.logAudit('public', fullName, 'SEVA_MEMBER_REGISTER', 'SevaMemberProfile', `New Seva Member registered with ID ${memberId}`, req.ip);

    res.status(201).json({
      success: true,
      memberId,
      fullName: newProfile.fullName,
      status: newProfile.applicationStatus,
      message: `Seva Member application submitted successfully! Your generated Member ID is ${memberId}. Your application is currently pending administrative review.`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Seva member registration failed: ' + err.message });
  }
});

/**
 * 1.2 Society Membership Application / Registration
 */
portalRouter.post('/register/membership', rateLimit(60000, 10), (req: Request, res: Response) => {
  try {
    const {
      fullName, dob, mobile, email, address,
      qualifications, skills, areasOfInterest, availability, occupation, membershipTier
    } = req.body;

    if (!fullName || !dob || !mobile || !email || !address) {
      res.status(400).json({
        success: false,
        message: 'Full name, date of birth, mobile number, email, and address are required.',
      });
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    const cleanEmail = email.trim().toLowerCase();
    const users = db.get('users');
    const societyMembers = db.get('society_members');

    const existingUser = users.find(u => {
      const uMobile = u.mobile.replace(/\D/g, '');
      const uEmail = u.email.toLowerCase();
      return (cleanMobile && uMobile === cleanMobile) || (cleanEmail && uEmail === cleanEmail);
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'An application or account with this mobile number or email already exists.',
      });
      return;
    }

    const now = new Date().toISOString();
    const membershipId = generatePortalId('MEM');
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const initialPlainPassword = generateInitialPassword(fullName, dob);
    const passwordHash = bcrypt.hashSync(initialPlainPassword, 10);

    const newUser: User = {
      id: userId,
      email: cleanEmail,
      username: membershipId,
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      passwordHash,
      role: 'member',
      portalId: membershipId,
      accountStatus: 'pending',
      isVerified: true,
      mustChangePassword: true,
      createdAt: now,
      updatedAt: now,
    };

    const newProfile: SocietyMemberProfile = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      membershipId,
      fullName: fullName.trim(),
      dob: dob.trim(),
      mobile: mobile.trim(),
      email: cleanEmail,
      address: address.trim(),
      qualifications: qualifications?.trim() || 'General',
      skills: Array.isArray(skills) ? skills : (skills ? [skills] : []),
      areasOfInterest: Array.isArray(areasOfInterest) ? areasOfInterest : (areasOfInterest ? [areasOfInterest] : ['Community Welfare']),
      availability: availability?.trim() || 'Flexible',
      occupation: occupation?.trim(),
      membershipTier: membershipTier || 'Active Member',
      applicationStatus: 'pending_approval',
      joinedAt: now,
    };

    users.push(newUser);
    societyMembers.push(newProfile);

    db.get('portal_notifications').push({
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: membershipId,
      title: 'Membership Application Submitted',
      message: `Your Foundation Membership application (${membershipId}) is under review by the Executive Board.`,
      type: 'info',
      isRead: false,
      createdAt: now,
    });

    db.save();
    db.logAudit('public', fullName, 'MEMBERSHIP_REGISTER', 'SocietyMemberProfile', `New Membership application with ID ${membershipId}`, req.ip);

    res.status(201).json({
      success: true,
      membershipId,
      fullName: newProfile.fullName,
      status: newProfile.applicationStatus,
      message: `Membership application submitted successfully! Your generated Membership ID is ${membershipId}. Your application is awaiting administrative review.`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Membership application failed: ' + err.message });
  }
});

/**
 * 1.3 Volunteer Registration
 */
portalRouter.post('/register/volunteer', rateLimit(60000, 10), (req: Request, res: Response) => {
  try {
    const {
      fullName, dob, mobile, email, address,
      skills, preferredActivities, availability, experience
    } = req.body;

    if (!fullName || !dob || !mobile || !address) {
      res.status(400).json({
        success: false,
        message: 'Full name, date of birth, mobile number, and address are required.',
      });
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    const cleanEmail = (email || '').trim().toLowerCase();
    const users = db.get('users');
    const volunteers = db.get('volunteers');

    const existingUser = users.find(u => {
      const uMobile = u.mobile.replace(/\D/g, '');
      const uEmail = u.email.toLowerCase();
      return (cleanMobile && uMobile === cleanMobile) || (cleanEmail && uEmail === cleanEmail);
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'An application or account with this mobile number or email already exists.',
      });
      return;
    }

    const now = new Date().toISOString();
    const volunteerId = generatePortalId('VOL');
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const initialPlainPassword = generateInitialPassword(fullName, dob);
    const passwordHash = bcrypt.hashSync(initialPlainPassword, 10);

    const newUser: User = {
      id: userId,
      email: cleanEmail || `${volunteerId.toLowerCase()}@ssbmfoundation.org`,
      username: volunteerId,
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      passwordHash,
      role: 'volunteer',
      portalId: volunteerId,
      accountStatus: 'pending',
      isVerified: true,
      mustChangePassword: true,
      createdAt: now,
      updatedAt: now,
    };

    const newProfile: VolunteerProfile = {
      id: `vol_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      volunteerId,
      fullName: fullName.trim(),
      dob: dob.trim(),
      mobile: mobile.trim(),
      email: cleanEmail,
      address: address.trim(),
      skills: Array.isArray(skills) ? skills : (skills ? [skills] : []),
      preferredActivities: Array.isArray(preferredActivities) ? preferredActivities : ['Elder Care Seva'],
      availability: availability?.trim() || 'Weekends',
      experience: experience?.trim(),
      applicationStatus: 'pending_approval',
      joinedAt: now,
    };

    users.push(newUser);
    volunteers.push(newProfile);

    db.get('portal_notifications').push({
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: volunteerId,
      title: 'Volunteer Application Received',
      message: `Your Volunteer registration (${volunteerId}) was received. Our ashram seva coordinator will review your profile shortly.`,
      type: 'info',
      isRead: false,
      createdAt: now,
    });

    db.save();
    db.logAudit('public', fullName, 'VOLUNTEER_REGISTER', 'VolunteerProfile', `New Volunteer registration with ID ${volunteerId}`, req.ip);

    res.status(201).json({
      success: true,
      volunteerId,
      fullName: newProfile.fullName,
      status: newProfile.applicationStatus,
      message: `Volunteer registration submitted successfully! Your generated Volunteer ID is ${volunteerId}. You will be able to access your dashboard upon approval.`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Volunteer registration failed: ' + err.message });
  }
});

// =========================================================================
// 2. UNIFIED PORTAL AUTHENTICATION (LOGIN & FIRST PASSWORD CHANGE)
// =========================================================================

/**
 * 2.1 Unified Portal Login (supports Member ID / Volunteer ID / Email / Mobile)
 */
portalRouter.post('/login', rateLimit(60000, 15), (req: Request, res: Response) => {
  try {
    const { loginId, password, expectedRole } = req.body;

    if (!loginId || !password) {
      res.status(400).json({
        success: false,
        message: 'Member ID / Email and password are required.',
      });
      return;
    }

    const cleanInput = loginId.trim();
    const cleanLower = cleanInput.toLowerCase();
    const cleanDigits = cleanInput.replace(/\D/g, '');

    const users = db.get('users');
    const user = users.find(u => {
      const matchPortalId = u.portalId && u.portalId.toLowerCase() === cleanLower;
      const matchUsername = u.username.toLowerCase() === cleanLower;
      const matchEmail = u.email.toLowerCase() === cleanLower;
      const matchMobile = cleanDigits && u.mobile.replace(/\D/g, '') === cleanDigits;
      return matchPortalId || matchUsername || matchEmail || matchMobile;
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your Member/Volunteer ID and password.',
      });
      return;
    }

    // Role check if expectedRole specified
    if (expectedRole && user.role !== expectedRole && user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: `This account belongs to the ${user.role.replace('_', ' ')} portal. Please use the appropriate portal login.`,
      });
      return;
    }

    const cleanPassword = (password || '').trim();
    let isMatch = bcrypt.compareSync(password, user.passwordHash) || bcrypt.compareSync(cleanPassword, user.passwordHash);

    // If direct compare fails, check if user is on initial temporary credentials (mustChangePassword === true)
    // and entered a natural case or full-name variant of their initial password
    if (!isMatch && user.mustChangePassword) {
      const candidates = getInitialPasswordCandidates(user);
      const cleanInputPwd = cleanPassword.toLowerCase();
      if (candidates.some(c => c.toLowerCase() === cleanInputPwd)) {
        isMatch = true;
      }
    }

    if (!isMatch) {
      db.logAudit('anonymous', cleanInput, 'PORTAL_LOGIN_FAIL', 'Security', `Failed login attempt for ID: ${cleanInput}`, req.ip);
      const initialHint = user.mustChangePassword
        ? ' If this is your first time signing in, your initial default password is your Name + Birth Year (e.g. HARR2000 or Harry2000).'
        : '';
      res.status(401).json({
        success: false,
        message: `Invalid password. Please try again.${initialHint}`,
      });
      return;
    }

    // Check account status & application status based on role
    let appStatus: ApplicationStatus = 'approved';
    let rejectionReason = '';

    if (user.role === 'seva_member') {
      const profile = db.get('seva_members').find(sm => sm.userId === user.id || sm.memberId === user.portalId);
      if (profile) {
        appStatus = profile.applicationStatus;
        rejectionReason = profile.rejectionReason || '';
      }
    } else if (user.role === 'member') {
      const profile = db.get('society_members').find(m => m.userId === user.id || m.membershipId === user.portalId);
      if (profile) {
        appStatus = profile.applicationStatus;
        rejectionReason = profile.rejectionReason || '';
      }
    } else if (user.role === 'volunteer') {
      const profile = db.get('volunteers').find(v => v.userId === user.id || v.volunteerId === user.portalId);
      if (profile) {
        appStatus = profile.applicationStatus;
        rejectionReason = profile.rejectionReason || '';
      }
    }

    // Application Status Enforcement (Admission applicants can log in to view their status & remarks)
    if (user.role !== 'admin' && user.role !== 'admission_applicant') {
      if (appStatus === 'pending_approval' || appStatus === 'under_review') {
        res.status(403).json({
          success: false,
          code: 'PENDING_APPROVAL',
          message: `Your application (${user.portalId || user.username}) is currently ${appStatus.replace('_', ' ').toUpperCase()}. Access will be granted once reviewed and approved by the administration.`,
        });
        return;
      }

      if (appStatus === 'rejected') {
        res.status(403).json({
          success: false,
          code: 'REJECTED',
          message: `Your application was not approved. ${rejectionReason ? `Reason: ${rejectionReason}` : 'Please contact the ashram office for details.'}`,
        });
        return;
      }

      if (user.accountStatus === 'suspended' || user.accountStatus === 'deactivated') {
        res.status(403).json({
          success: false,
          code: 'ACCOUNT_SUSPENDED',
          message: 'Your portal account is currently suspended. Please contact the administrative office.',
        });
        return;
      }
    } else if (user.role === 'admission_applicant') {
      if (user.accountStatus === 'suspended' || user.accountStatus === 'deactivated') {
        res.status(403).json({
          success: false,
          code: 'ACCOUNT_SUSPENDED',
          message: 'Your admission portal account is currently suspended. Please contact the ashram office.',
        });
        return;
      }
    }

    const token = generateToken(user);
    db.logAudit(user.id, user.fullName, 'PORTAL_LOGIN_SUCCESS', 'Security', `Logged into ${user.role} portal with ID ${user.portalId || user.username}`, req.ip);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        mobile: user.mobile,
        role: user.role,
        portalId: user.portalId || user.username,
        mustChangePassword: user.mustChangePassword,
        accountStatus: user.accountStatus || 'active',
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Login failed: ' + err.message });
  }
});

/**
 * 2.2 Secure Self-Service Password Reset Request
 */
portalRouter.post('/reset-password', rateLimit(60000, 30), (req: Request, res: Response) => {
  try {
    const { loginId, mobile } = req.body;
    if (!loginId || !mobile) {
      res.status(400).json({ success: false, message: 'Portal ID / Email and registered mobile number are required.' });
      return;
    }

    const cleanInput = loginId.trim().toLowerCase();
    const cleanDigits = mobile.replace(/\D/g, '');

    const users = db.get('users');
    const user = users.find(u => {
      const matchPortalId = u.portalId && u.portalId.toLowerCase() === cleanInput;
      const matchUsername = u.username.toLowerCase() === cleanInput;
      const matchEmail = u.email.toLowerCase() === cleanInput;
      const matchMobile = cleanDigits && u.mobile.replace(/\D/g, '') === cleanDigits;
      return (matchPortalId || matchUsername || matchEmail) && matchMobile;
    });

    if (!user) {
      res.status(400).json({ success: false, message: 'Account details could not be verified. Please ensure the Member ID and registered mobile number are correct.' });
      return;
    }

    let tempPassword = '';
    if (user.role === 'admission_applicant') {
      const enq = db.get('admission_enquiries').find(e =>
        e.registrationId === user.portalId ||
        e.id === user.portalId ||
        e.applicantName.toLowerCase() === user.fullName.toLowerCase()
      );
      const residentName = enq?.applicantName || user.fullName.replace(/\s*\(Guardian:.*\)$/i, '') || 'Resident';
      const year = enq?.dobOrYear || '1985';
      tempPassword = generateAdmissionPassword(residentName, year);
    } else {
      let dob = '2000-01-01';
      if (user.role === 'seva_member') {
        const prof = db.get('seva_members').find(p => p.userId === user.id || p.memberId === user.portalId);
        if (prof) dob = prof.dob;
      } else if (user.role === 'member') {
        const prof = db.get('society_members').find(p => p.userId === user.id || p.membershipId === user.portalId);
        if (prof) dob = prof.dob;
      } else if (user.role === 'volunteer') {
        const prof = db.get('volunteers').find(p => p.userId === user.id || p.volunteerId === user.portalId);
        if (prof) dob = prof.dob;
      }
      tempPassword = generateInitialPassword(user.fullName, dob);
    }

    user.passwordHash = bcrypt.hashSync(tempPassword, 10);
    user.mustChangePassword = true;
    user.updatedAt = new Date().toISOString();
    db.save();

    db.logAudit(user.id, user.fullName, 'PORTAL_PASSWORD_RESET', 'Security', `Password reset performed for ${user.portalId || user.username}`, req.ip);

    res.json({
      success: true,
      message: `Password has been reset to your default temporary credential format (${tempPassword.substring(0, 4)}••••). You will be required to change it immediately upon login.`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Password reset failed: ' + err.message });
  }
});

// =========================================================================
// 3. MEMBER PORTAL DATA & PROGRESS SUBMISSION
// =========================================================================

/**
 * 3.1 Get Dashboard Data for the Logged-in User
 */
portalRouter.get('/dashboard-data', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const portalId = user.portalId || user.username;

    const allTasks = db.get('portal_tasks');
    const myTasks = allTasks.filter(t => t.assignedToId === user.id || t.assignedToId === portalId);

    const allNotifs = db.get('portal_notifications');
    const myNotifs = allNotifs.filter(n => n.userId === user.id || n.userId === portalId);

    let profileData: any = null;
    let projectsData: ProjectItem[] = [];
    let sevaRecordsData: SevaRecordItem[] = [];

    let admissionEnquiryData: any = null;

    if (user.role === 'seva_member') {
      profileData = db.get('seva_members').find(sm => sm.userId === user.id || sm.memberId === portalId);
      sevaRecordsData = db.get('seva_records').filter(r => r.userId === user.id || r.memberId === portalId);
    } else if (user.role === 'member') {
      profileData = db.get('society_members').find(m => m.userId === user.id || m.membershipId === portalId);
      const allProjects = db.get('projects');
      projectsData = allProjects.filter(p =>
        p.leadMemberId === user.id ||
        p.leadMemberId === portalId ||
        p.teamMemberIds.includes(user.id) ||
        p.teamMemberIds.includes(portalId)
      );
    } else if (user.role === 'volunteer') {
      profileData = db.get('volunteers').find(v => v.userId === user.id || v.volunteerId === portalId);
      sevaRecordsData = db.get('seva_records').filter(r => r.userId === user.id || r.memberId === portalId);
    } else if (user.role === 'admission_applicant') {
      const cleanMob = (user.mobile || '').replace(/\D/g, '');
      admissionEnquiryData = db.get('admission_enquiries').find(e =>
        e.registrationId === portalId ||
        e.id === portalId ||
        e.registrationId === user.portalId ||
        (cleanMob && (e.guardianPhone || '').replace(/\D/g, '') === cleanMob)
      );
      profileData = admissionEnquiryData;
    }

    res.json({
      success: true,
      role: user.role,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        portalId,
        mustChangePassword: user.mustChangePassword,
        accountStatus: user.accountStatus,
      },
      profile: profileData,
      admissionEnquiry: admissionEnquiryData,
      tasks: myTasks,
      projects: projectsData,
      sevaRecords: sevaRecordsData,
      notifications: myNotifs,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to load dashboard data: ' + err.message });
  }
});

/**
 * 3.2 Submit Progress / Evidence for an Assigned Task
 */
portalRouter.post('/tasks/:taskId/progress', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const { notes, progressPercent, status, completionEvidence } = req.body;
    const user = req.user!;
    const portalId = user.portalId || user.username;

    const tasks = db.get('portal_tasks');
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    // Verify ownership
    if (task.assignedToId !== user.id && task.assignedToId !== portalId && user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'You are not authorized to update this task.' });
      return;
    }

    const now = new Date().toISOString();

    if (notes) {
      task.progressUpdates.push({
        id: `prog_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        date: now,
        notes: notes.trim(),
        progressPercent: Number(progressPercent) || 0,
      });
    }

    if (status) {
      task.status = status as TaskStatus;
    }

    if (completionEvidence !== undefined) {
      task.completionEvidence = completionEvidence.trim();
    }

    task.updatedAt = now;
    db.save();

    db.logAudit(user.id, user.fullName, 'TASK_PROGRESS_SUBMIT', 'PortalTask', `Updated progress for task "${task.title}" (status: ${task.status})`, req.ip);

    res.json({
      success: true,
      message: 'Task progress updated successfully',
      task,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update task: ' + err.message });
  }
});

/**
 * 3.3 Mark Notification as Read
 */
portalRouter.put('/notifications/:id/read', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user!;
    const portalId = user.portalId || user.username;
    const notifs = db.get('portal_notifications');
    const notif = notifs.find(n => n.id === id);
    if (!notif) {
      res.status(404).json({ success: false, message: 'Notification not found' });
      return;
    }

    // Verify ownership to prevent IDOR
    if (notif.userId !== user.id && notif.userId !== portalId && user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Unauthorized to modify this notification' });
      return;
    }

    notif.isRead = true;
    db.save();
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update notification' });
  }
});

// =========================================================================
// 4. ADMIN PORTAL MANAGEMENT (FULL LIFECYCLE & WORKFLOWS)
// =========================================================================

portalRouter.use('/admin', authMiddleware);
portalRouter.use('/admin', adminOnly);

/**
 * 4.1 Admin Portal Metrics (Real Live Data)
 */
portalRouter.get('/admin/metrics', (req: AuthRequest, res: Response) => {
  try {
    const sevaMembers = db.get('seva_members');
    const societyMembers = db.get('society_members');
    const volunteers = db.get('volunteers');
    const projects = db.get('projects');
    const tasks = db.get('portal_tasks');

    const now = new Date();

    const admissions = db.get('admission_enquiries');

    const metrics = {
      admissions: {
        total: admissions.length,
        pending: admissions.filter(a => a.status === 'pending_review').length,
        approved: admissions.filter(a => a.status === 'approved').length,
        rejected: admissions.filter(a => a.status === 'rejected').length,
        moreInfo: admissions.filter(a => a.status === 'more_info_required').length,
      },
      sevaMembers: {
        total: sevaMembers.length,
        pending: sevaMembers.filter(s => s.applicationStatus === 'pending_approval' || s.applicationStatus === 'under_review').length,
        approved: sevaMembers.filter(s => s.applicationStatus === 'approved').length,
        rejected: sevaMembers.filter(s => s.applicationStatus === 'rejected').length,
      },
      societyMembers: {
        total: societyMembers.length,
        pending: societyMembers.filter(s => s.applicationStatus === 'pending_approval' || s.applicationStatus === 'under_review').length,
        approved: societyMembers.filter(s => s.applicationStatus === 'approved').length,
        rejected: societyMembers.filter(s => s.applicationStatus === 'rejected').length,
      },
      volunteers: {
        total: volunteers.length,
        pending: volunteers.filter(v => v.applicationStatus === 'pending_approval' || v.applicationStatus === 'under_review').length,
        approved: volunteers.filter(v => v.applicationStatus === 'approved').length,
        rejected: volunteers.filter(v => v.applicationStatus === 'rejected').length,
      },
      projects: {
        total: projects.length,
        active: projects.filter(p => p.status === 'active').length,
        completed: projects.filter(p => p.status === 'completed').length,
        onHold: projects.filter(p => p.status === 'on_hold' || p.status === 'planning').length,
      },
      tasks: {
        total: tasks.length,
        active: tasks.filter(t => t.status === 'in_progress' || t.status === 'not_started').length,
        submitted: tasks.filter(t => t.status === 'submitted').length,
        completed: tasks.filter(t => t.status === 'completed').length,
        overdue: tasks.filter(t => t.status !== 'completed' && t.status !== 'cancelled' && new Date(t.deadline) < now).length,
      },
    };

    res.json({ success: true, data: metrics });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin portal metrics: ' + err.message });
  }
});

/**
 * 4.2 Seva Members List & Review
 */
portalRouter.get('/admin/seva-members', (req: AuthRequest, res: Response) => {
  const list = db.get('seva_members');
  res.json({ success: true, data: list });
});

portalRouter.put('/admin/seva-members/:id/status', (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason, adminNotes, accountStatus } = req.body;
    const admin = req.user!;

    const list = db.get('seva_members');
    const member = list.find(m => m.id === id || m.memberId === id);

    if (!member) {
      res.status(404).json({ success: false, message: 'Seva member record not found' });
      return;
    }

    if (status) member.applicationStatus = status as ApplicationStatus;
    if (rejectionReason !== undefined) member.rejectionReason = rejectionReason;
    if (adminNotes !== undefined) member.adminNotes = adminNotes;
    member.reviewedAt = new Date().toISOString();
    member.reviewedBy = admin.fullName;

    // Sync User Account Status
    const users = db.get('users');
    const user = users.find(u => u.id === member.userId || u.portalId === member.memberId);
    if (user) {
      if (status === 'approved') {
        user.accountStatus = 'active';
      } else if (status === 'rejected') {
        user.accountStatus = 'deactivated';
      }
      if (accountStatus) {
        user.accountStatus = accountStatus as AccountStatus;
      }
      user.updatedAt = new Date().toISOString();
    }

    // Add notification for the user
    db.get('portal_notifications').push({
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: member.memberId,
      title: `Application Status: ${member.applicationStatus.replace('_', ' ').toUpperCase()}`,
      message: member.applicationStatus === 'approved'
        ? `Congratulations! Your Seva Member application (${member.memberId}) has been approved. You can now access your dashboard.`
        : `Your application status was updated to: ${member.applicationStatus}. ${member.rejectionReason || ''}`,
      type: member.applicationStatus === 'approved' ? 'success' : 'warning',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    db.save();
    db.logAudit(admin.id, admin.fullName, 'SEVA_MEMBER_STATUS_UPDATE', 'SevaMemberProfile', `Updated ${member.fullName} (${member.memberId}) status to ${member.applicationStatus}`, req.ip);

    res.json({ success: true, message: 'Seva member status updated successfully', data: member });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update seva member: ' + err.message });
  }
});

/**
 * 4.3 Society Members List & Review
 */
portalRouter.get('/admin/society-members', (req: AuthRequest, res: Response) => {
  const list = db.get('society_members');
  res.json({ success: true, data: list });
});

portalRouter.put('/admin/society-members/:id/status', (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason, adminNotes, accountStatus } = req.body;
    const admin = req.user!;

    const list = db.get('society_members');
    const member = list.find(m => m.id === id || m.membershipId === id);

    if (!member) {
      res.status(404).json({ success: false, message: 'Membership record not found' });
      return;
    }

    if (status) member.applicationStatus = status as ApplicationStatus;
    if (rejectionReason !== undefined) member.rejectionReason = rejectionReason;
    if (adminNotes !== undefined) member.adminNotes = adminNotes;
    member.reviewedAt = new Date().toISOString();
    member.reviewedBy = admin.fullName;

    const users = db.get('users');
    const user = users.find(u => u.id === member.userId || u.portalId === member.membershipId);
    if (user) {
      if (status === 'approved') {
        user.accountStatus = 'active';
      } else if (status === 'rejected') {
        user.accountStatus = 'deactivated';
      }
      if (accountStatus) {
        user.accountStatus = accountStatus as AccountStatus;
      }
      user.updatedAt = new Date().toISOString();
    }

    db.get('portal_notifications').push({
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: member.membershipId,
      title: `Membership Status: ${member.applicationStatus.replace('_', ' ').toUpperCase()}`,
      message: member.applicationStatus === 'approved'
        ? `Welcome! Your Foundation Membership (${member.membershipId}) has been approved by the board.`
        : `Your application status was updated to: ${member.applicationStatus}. ${member.rejectionReason || ''}`,
      type: member.applicationStatus === 'approved' ? 'success' : 'warning',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    db.save();
    db.logAudit(admin.id, admin.fullName, 'MEMBERSHIP_STATUS_UPDATE', 'SocietyMemberProfile', `Updated ${member.fullName} (${member.membershipId}) status to ${member.applicationStatus}`, req.ip);

    res.json({ success: true, message: 'Membership status updated successfully', data: member });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update membership: ' + err.message });
  }
});

/**
 * 4.4 Volunteers List & Review
 */
portalRouter.get('/admin/volunteers', (req: AuthRequest, res: Response) => {
  const list = db.get('volunteers');
  res.json({ success: true, data: list });
});

portalRouter.put('/admin/volunteers/:id/status', (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason, adminNotes, accountStatus } = req.body;
    const admin = req.user!;

    const list = db.get('volunteers');
    const volunteer = list.find(v => v.id === id || v.volunteerId === id);

    if (!volunteer) {
      res.status(404).json({ success: false, message: 'Volunteer record not found' });
      return;
    }

    if (status) volunteer.applicationStatus = status as ApplicationStatus;
    if (rejectionReason !== undefined) volunteer.rejectionReason = rejectionReason;
    if (adminNotes !== undefined) volunteer.adminNotes = adminNotes;
    volunteer.reviewedAt = new Date().toISOString();
    volunteer.reviewedBy = admin.fullName;

    const users = db.get('users');
    const user = users.find(u => u.id === volunteer.userId || u.portalId === volunteer.volunteerId);
    if (user) {
      if (status === 'approved') {
        user.accountStatus = 'active';
      } else if (status === 'rejected') {
        user.accountStatus = 'deactivated';
      }
      if (accountStatus) {
        user.accountStatus = accountStatus as AccountStatus;
      }
      user.updatedAt = new Date().toISOString();
    }

    db.get('portal_notifications').push({
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: volunteer.volunteerId,
      title: `Volunteer Status: ${volunteer.applicationStatus.replace('_', ' ').toUpperCase()}`,
      message: volunteer.applicationStatus === 'approved'
        ? `Namaste! Your Volunteer registration (${volunteer.volunteerId}) is approved. You can now view your assigned seva activities.`
        : `Your application status was updated to: ${volunteer.applicationStatus}. ${volunteer.rejectionReason || ''}`,
      type: volunteer.applicationStatus === 'approved' ? 'success' : 'warning',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    db.save();
    db.logAudit(admin.id, admin.fullName, 'VOLUNTEER_STATUS_UPDATE', 'VolunteerProfile', `Updated ${volunteer.fullName} (${volunteer.volunteerId}) status to ${volunteer.applicationStatus}`, req.ip);

    res.json({ success: true, message: 'Volunteer status updated successfully', data: volunteer });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update volunteer: ' + err.message });
  }
});

/**
 * 4.5 Central Project Management (Admin)
 */
portalRouter.get('/admin/projects', (req: AuthRequest, res: Response) => {
  res.json({ success: true, data: db.get('projects') });
});

portalRouter.post('/admin/projects', (req: AuthRequest, res: Response) => {
  try {
    const {
      title, description, objectives, leadMemberId, leadMemberName,
      teamMemberIds, priority, startDate, deadline, milestones
    } = req.body;

    if (!title || !description || !deadline) {
      res.status(400).json({ success: false, message: 'Project title, description, and deadline are required.' });
      return;
    }

    const now = new Date().toISOString();
    const newProject: ProjectItem = {
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      description: description.trim(),
      objectives: Array.isArray(objectives) ? objectives : (objectives ? [objectives] : []),
      leadMemberId: leadMemberId?.trim(),
      leadMemberName: leadMemberName?.trim(),
      teamMemberIds: Array.isArray(teamMemberIds) ? teamMemberIds : [],
      priority: priority || 'medium',
      startDate: startDate || now.split('T')[0],
      deadline: deadline.trim(),
      status: 'active',
      milestones: Array.isArray(milestones) ? milestones : [],
      documents: [],
      createdAt: now,
      updatedAt: now,
    };

    db.get('projects').push(newProject);

    // Notify assigned lead and team members
    const allAssigned = [newProject.leadMemberId, ...(newProject.teamMemberIds || [])].filter(Boolean);
    allAssigned.forEach(memberId => {
      db.get('portal_notifications').push({
        id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: memberId!,
        title: 'New Project Assignment',
        message: `You have been assigned to project: "${newProject.title}". Deadline: ${newProject.deadline}`,
        type: 'action',
        isRead: false,
        createdAt: now,
      });
    });

    db.save();
    db.logAudit(req.user!.id, req.user!.fullName, 'PROJECT_CREATE', 'ProjectItem', `Created project "${newProject.title}"`, req.ip);

    res.status(201).json({ success: true, message: 'Project created successfully', data: newProject });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to create project: ' + err.message });
  }
});

portalRouter.put('/admin/projects/:id', (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const projects = db.get('projects');
    const project = projects.find(p => p.id === id);

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    Object.assign(project, updates, { updatedAt: new Date().toISOString() });
    db.save();
    db.logAudit(req.user!.id, req.user!.fullName, 'PROJECT_UPDATE', 'ProjectItem', `Updated project "${project.title}"`, req.ip);

    res.json({ success: true, message: 'Project updated successfully', data: project });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update project: ' + err.message });
  }
});

portalRouter.delete('/admin/projects/:id', (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const projects = db.get('projects');
    const idx = projects.findIndex(p => p.id === id);

    if (idx === -1) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    const removed = projects.splice(idx, 1)[0];
    db.save();
    db.logAudit(req.user!.id, req.user!.fullName, 'PROJECT_DELETE', 'ProjectItem', `Deleted project "${removed.title}"`, req.ip);

    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to delete project: ' + err.message });
  }
});

/**
 * 4.6 Central Task Assignment & Management (Admin)
 */
portalRouter.get('/admin/tasks', (req: AuthRequest, res: Response) => {
  res.json({ success: true, data: db.get('portal_tasks') });
});

portalRouter.post('/admin/tasks', (req: AuthRequest, res: Response) => {
  try {
    const {
      title, description, category, assignedToId, assignedToName,
      assignedToRole, projectId, projectTitle, priority, startDate,
      deadline, instructions
    } = req.body;

    if (!title || !description || !assignedToId || !deadline) {
      res.status(400).json({
        success: false,
        message: 'Task title, description, assigned member, and deadline are required.',
      });
      return;
    }

    const now = new Date().toISOString();
    const newTask: PortalTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      description: description.trim(),
      category: category || 'seva_member',
      assignedToId: assignedToId.trim(),
      assignedToName: (assignedToName || assignedToId).trim(),
      assignedToRole: assignedToRole || category,
      projectId: projectId?.trim(),
      projectTitle: projectTitle?.trim(),
      priority: priority || 'medium',
      startDate: startDate || now.split('T')[0],
      deadline: deadline.trim(),
      status: 'not_started',
      instructions: instructions?.trim() || '',
      attachments: [],
      progressUpdates: [],
      createdAt: now,
      updatedAt: now,
    };

    db.get('portal_tasks').push(newTask);

    // Notify assignee
    db.get('portal_notifications').push({
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: newTask.assignedToId,
      title: 'New Seva Task Assigned',
      message: `You have been assigned a new task: "${newTask.title}". Deadline: ${newTask.deadline}.`,
      type: 'action',
      isRead: false,
      createdAt: now,
    });

    db.save();
    db.logAudit(req.user!.id, req.user!.fullName, 'TASK_CREATE', 'PortalTask', `Assigned task "${newTask.title}" to ${newTask.assignedToName} (${newTask.assignedToId})`, req.ip);

    res.status(201).json({ success: true, message: 'Task assigned successfully', task: newTask, data: newTask });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to assign task: ' + err.message });
  }
});

portalRouter.put('/admin/tasks/:id', (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminComments, priority, deadline, instructions } = req.body;
    const tasks = db.get('portal_tasks');
    const task = tasks.find(t => t.id === id);

    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    const prevStatus = task.status;
    if (status) task.status = status as TaskStatus;
    if (adminComments !== undefined) task.adminComments = adminComments;
    if (priority) task.priority = priority;
    if (deadline) task.deadline = deadline;
    if (instructions) task.instructions = instructions;
    task.updatedAt = new Date().toISOString();

    // If status changed to completed or rejected_for_revision, notify the assignee
    if (status && status !== prevStatus) {
      db.get('portal_notifications').push({
        id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: task.assignedToId,
        title: `Task Review: "${task.title}"`,
        message: status === 'completed'
          ? `Great job! Your submission for task "${task.title}" was verified and approved by the administration.`
          : `Task status updated to: ${status.replace('_', ' ').toUpperCase()}. Admin comments: ${adminComments || 'None'}`,
        type: status === 'completed' ? 'success' : 'warning',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    db.save();
    db.logAudit(req.user!.id, req.user!.fullName, 'TASK_UPDATE', 'PortalTask', `Updated task "${task.title}" to status ${task.status}`, req.ip);

    res.json({ success: true, message: 'Task updated successfully', data: task });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update task: ' + err.message });
  }
});

portalRouter.delete('/admin/tasks/:id', (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const tasks = db.get('portal_tasks');
    const idx = tasks.findIndex(t => t.id === id);

    if (idx === -1) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    const removed = tasks.splice(idx, 1)[0];
    db.save();
    db.logAudit(req.user!.id, req.user!.fullName, 'TASK_DELETE', 'PortalTask', `Deleted task "${removed.title}"`, req.ip);

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to delete task: ' + err.message });
  }
});

/**
 * 4.7 Issue Seva Record / Receipt
 */
portalRouter.post('/admin/seva-records', (req: AuthRequest, res: Response) => {
  try {
    const { memberId, title, date, hoursSpent, location, supervisorName, receiptNumber, description } = req.body;

    if (!memberId || !title || !date) {
      res.status(400).json({ success: false, message: 'Member ID, title, and date are required.' });
      return;
    }

    const record: SevaRecordItem = {
      id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      memberId: memberId.trim(),
      userId: memberId.trim(),
      title: title.trim(),
      date: date.trim(),
      hoursSpent: Number(hoursSpent) || 0,
      location: location?.trim() || 'Vyenkatesh Ashram, Mahuli',
      supervisorName: supervisorName?.trim() || req.user!.fullName,
      receiptNumber: receiptNumber?.trim() || `REC-${Date.now().toString().slice(-6)}`,
      description: description?.trim() || '',
      createdAt: new Date().toISOString(),
    };

    db.get('seva_records').push(record);

    db.get('portal_notifications').push({
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: memberId.trim(),
      title: 'Seva Record / Receipt Issued',
      message: `An official Seva record "${record.title}" (${record.hoursSpent} hrs, Receipt #${record.receiptNumber}) has been credited to your profile.`,
      type: 'success',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    db.save();
    db.logAudit(req.user!.id, req.user!.fullName, 'SEVA_RECORD_ISSUE', 'SevaRecordItem', `Issued record ${record.receiptNumber} for ${record.memberId}`, req.ip);

    res.status(201).json({ success: true, message: 'Seva record issued successfully', data: record });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to issue seva record: ' + err.message });
  }
});

/**
 * 4.9 Admin Reset User Password
 */
portalRouter.post('/admin/users/:userId/reset-password', (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const users = db.get('users');
    const user = users.find(u => u.id === userId || u.portalId === userId || u.username === userId);

    if (!user) {
      res.status(404).json({ success: false, message: 'User account not found' });
      return;
    }

    let tempPassword = '';
    if (user.role === 'admission_applicant') {
      const enq = db.get('admission_enquiries').find(e =>
        e.registrationId === user.portalId ||
        e.id === user.portalId ||
        e.applicantName.toLowerCase() === user.fullName.toLowerCase()
      );
      const residentName = enq?.applicantName || user.fullName.replace(/\s*\(Guardian:.*\)$/i, '') || 'Resident';
      const year = enq?.dobOrYear || '1985';
      tempPassword = generateAdmissionPassword(residentName, year);
    } else {
      let dob = '2000-01-01';
      if (user.role === 'seva_member') {
        const prof = db.get('seva_members').find(p => p.userId === user.id || p.memberId === user.portalId);
        if (prof) dob = prof.dob;
      } else if (user.role === 'member') {
        const prof = db.get('society_members').find(p => p.userId === user.id || p.membershipId === user.portalId);
        if (prof) dob = prof.dob;
      } else if (user.role === 'volunteer') {
        const prof = db.get('volunteers').find(p => p.userId === user.id || p.volunteerId === user.portalId);
        if (prof) dob = prof.dob;
      }
      tempPassword = generateInitialPassword(user.fullName, dob);
    }

    user.passwordHash = bcrypt.hashSync(tempPassword, 10);
    user.mustChangePassword = true;
    user.updatedAt = new Date().toISOString();
    db.save();

    db.logAudit(req.user!.id, req.user!.fullName, 'ADMIN_RESET_PASSWORD', 'User', `Reset password for user ${user.portalId || user.username}`, req.ip);

    res.json({
      success: true,
      message: `Password reset successfully for ${user.fullName} (${user.portalId || user.username}). Temporary initial credential restored. User must change password upon next login.`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to reset password: ' + err.message });
  }
});

/**
 * 4.10 Admin Admission Enquiries Management
 */
portalRouter.get('/admin/admissions', (req: AuthRequest, res: Response) => {
  try {
    const { status, search } = req.query;
    let list = db.get('admission_enquiries');

    if (status && status !== 'all') {
      list = list.filter(a => a.status === status);
    }

    if (search && typeof search === 'string') {
      const q = search.trim().toLowerCase();
      list = list.filter(a =>
        (a.applicantName && a.applicantName.toLowerCase().includes(q)) ||
        (a.registrationId && a.registrationId.toLowerCase().includes(q)) ||
        (a.guardianFirstName && a.guardianFirstName.toLowerCase().includes(q)) ||
        (a.guardianPhone && a.guardianPhone.includes(q)) ||
        (a.residentName && a.residentName.toLowerCase().includes(q)) ||
        (a.id && a.id.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch admission enquiries: ' + err.message });
  }
});

portalRouter.get('/admin/admissions/:id', (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const list = db.get('admission_enquiries');
    const item = list.find(a => a.id === id || a.registrationId === id);

    if (!item) {
      res.status(404).json({ success: false, message: 'Admission enquiry not found.' });
      return;
    }

    res.json({ success: true, data: item });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch admission enquiry: ' + err.message });
  }
});

portalRouter.put('/admin/admissions/:id/status', (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, rejectionReason, requestedInfoNotes } = req.body;
    const admin = req.user!;

    const allowedStatuses: AdmissionStatus[] = ['pending_review', 'approved', 'rejected', 'more_info_required'];
    if (!status || !allowedStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: `Invalid admission status. Must be one of: ${allowedStatuses.join(', ')}`
      });
      return;
    }

    if (status === 'rejected' && (!rejectionReason || !rejectionReason.trim())) {
      res.status(400).json({
        success: false,
        message: 'A rejection reason is mandatory when rejecting an admission enquiry.'
      });
      return;
    }

    const list = db.get('admission_enquiries');
    const item = list.find(a => a.id === id || a.registrationId === id);

    if (!item) {
      res.status(404).json({ success: false, message: 'Admission enquiry not found' });
      return;
    }

    const prevStatus = item.status;
    const now = new Date().toISOString();

    item.status = status;
    if (adminNotes !== undefined) item.adminNotes = adminNotes.trim();
    if (rejectionReason !== undefined) item.rejectionReason = rejectionReason.trim();
    if (requestedInfoNotes !== undefined) item.requestedInfoNotes = requestedInfoNotes.trim();
    item.updatedAt = now;

    if (!Array.isArray(item.statusHistory)) {
      item.statusHistory = [];
    }

    const statusNote = rejectionReason?.trim() || requestedInfoNotes?.trim() || adminNotes?.trim() || `Status updated from ${prevStatus} to ${status}`;

    item.statusHistory.push({
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status,
      date: now,
      updatedBy: admin.fullName,
      notes: statusNote
    });

    // Notify applicant account
    const applicantTargetId = item.registrationId || item.id;
    let notifMessage = '';
    let notifType: 'info' | 'success' | 'warning' | 'action' = 'info';

    if (status === 'approved') {
      notifType = 'success';
      notifMessage = `Congratulations! Your admission enquiry (${applicantTargetId}) for ${item.applicantName} has been APPROVED by Vyenkatesh Ashram administration. ${adminNotes ? `Admin Notes: ${adminNotes}` : 'Our team will contact you for resident onboarding formalities.'}`;
    } else if (status === 'rejected') {
      notifType = 'warning';
      notifMessage = `Your admission enquiry (${applicantTargetId}) for ${item.applicantName} was reviewed and could not be approved at this time. Reason: ${rejectionReason}`;
    } else if (status === 'more_info_required') {
      notifType = 'warning';
      notifMessage = `Action Required for your admission enquiry (${applicantTargetId}): Administration requested additional details or documents. Instructions: ${requestedInfoNotes || adminNotes || 'Please check remarks in your dashboard.'}`;
    } else {
      notifMessage = `Your admission enquiry status has been marked as ${status.replace('_', ' ').toUpperCase()}.`;
    }

    db.get('portal_notifications').push({
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: applicantTargetId,
      title: `Admission Status: ${status.replace('_', ' ').toUpperCase()}`,
      message: notifMessage,
      type: notifType,
      isRead: false,
      createdAt: now,
    });

    db.save();
    db.logAudit(
      admin.id,
      admin.fullName,
      'ADMISSION_STATUS_CHANGE',
      'AdmissionEnquiry',
      `Updated admission enquiry ${item.registrationId || item.id} (${item.applicantName}) to ${status}`,
      req.ip
    );

    res.json({
      success: true,
      message: `Admission enquiry status updated to ${status.replace('_', ' ').toUpperCase()}`,
      data: item
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update admission status: ' + err.message });
  }
});

/**
 * 4.11 Applicant Response to More Info Request
 */
portalRouter.post('/admission/respond-info', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    if (user.role !== 'admission_applicant' && user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Only admission applicants can respond to information requests.' });
      return;
    }

    const { additionalDetails } = req.body;
    if (!additionalDetails || !additionalDetails.trim()) {
      res.status(400).json({ success: false, message: 'Please provide the requested details or explanations.' });
      return;
    }

    const portalId = user.portalId || user.username;
    const cleanMob = (user.mobile || '').replace(/\D/g, '');
    const enquiry = db.get('admission_enquiries').find(e =>
      e.registrationId === portalId ||
      e.id === portalId ||
      (cleanMob && (e.guardianPhone || '').replace(/\D/g, '') === cleanMob)
    );

    if (!enquiry) {
      res.status(404).json({ success: false, message: 'Admission enquiry record not found.' });
      return;
    }

    const now = new Date().toISOString();
    enquiry.status = 'pending_review';
    enquiry.additionalMessage = `${enquiry.additionalMessage ? enquiry.additionalMessage + '\n\n' : ''}[Applicant Info Update ${now.split('T')[0]}]: ${additionalDetails.trim()}`;
    enquiry.updatedAt = now;

    if (!Array.isArray(enquiry.statusHistory)) {
      enquiry.statusHistory = [];
    }

    enquiry.statusHistory.push({
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status: 'pending_review',
      date: now,
      updatedBy: user.fullName,
      notes: `Applicant provided requested details: "${additionalDetails.trim().substring(0, 120)}..."`
    });

    db.save();
    db.logAudit(
      user.id,
      user.fullName,
      'ADMISSION_APPLICANT_RESPONSE',
      'AdmissionEnquiry',
      `Applicant submitted requested info for enquiry ${enquiry.registrationId}`,
      req.ip
    );

    res.json({
      success: true,
      message: 'Your additional details have been recorded and your enquiry is back under Pending Review by the admin team.',
      data: enquiry
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to submit additional information: ' + err.message });
  }
});
