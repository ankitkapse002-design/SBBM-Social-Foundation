import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import {
  db, User, SevaMemberProfile, SocietyMemberProfile, VolunteerProfile,
  ProjectItem, PortalTask, PortalNotification, SevaRecordItem,
  AdmissionEnquiry, AdmissionStatus,
  generatePortalId, generateInitialPassword, generateAdmissionPassword, ApplicationStatus, AccountStatus, TaskStatus
} from '../db';
import { authMiddleware, adminOnly, AuthRequest } from '../middleware/auth';

export const portalRouter = Router();

// =========================================================================
// ADMIN PORTAL MANAGEMENT (FULL LIFECYCLE & WORKFLOWS)
// All portal administrative routes are strictly protected by authMiddleware & adminOnly
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
 * 4.1.1 All Users Directory (Unified Across All Roles)
 */
portalRouter.get('/admin/all-users', (req: AuthRequest, res: Response) => {
  try {
    const users = db.get('users');
    const sevaMembers = db.get('seva_members');
    const societyMembers = db.get('society_members');
    const volunteers = db.get('volunteers');
    const admissions = db.get('admission_enquiries');

    const enriched = users.map(u => {
      let category = 'Other';
      let applicationStatus = 'approved';
      let portalId = u.portalId || u.username;
      let notes = '';

      if (u.role === 'admin') {
        category = 'Administrator';
      } else if (u.role === 'seva_member') {
        category = 'Seva Member';
        const p = sevaMembers.find(s => s.userId === u.id || s.memberId === portalId);
        if (p) {
          applicationStatus = p.applicationStatus;
          notes = p.notes || '';
        }
      } else if (u.role === 'member') {
        category = 'General Member';
        const p = societyMembers.find(m => m.userId === u.id || m.membershipId === portalId);
        if (p) {
          applicationStatus = p.applicationStatus;
        }
      } else if (u.role === 'volunteer') {
        category = 'Volunteer';
        const p = volunteers.find(v => v.userId === u.id || v.volunteerId === portalId);
        if (p) {
          applicationStatus = p.applicationStatus;
        }
      } else if (u.role === 'admission_applicant') {
        category = 'Senior Resident Admission';
        const a = admissions.find(adm => adm.registrationId === portalId || adm.id === portalId);
        if (a) {
          applicationStatus = a.status;
        }
      }

      return {
        id: u.id,
        email: u.email,
        username: u.username,
        fullName: u.fullName,
        mobile: u.mobile,
        role: u.role,
        portalId,
        category,
        accountStatus: u.accountStatus || 'active',
        applicationStatus,
        isVerified: u.isVerified,
        mustChangePassword: u.mustChangePassword,
        notes,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      };
    });

    res.json({ success: true, data: enriched });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch all users: ' + err.message });
  }
});

/**
 * 4.1.2 Unified Pending Registrations (Actionable Queue)
 */
portalRouter.get('/admin/pending-registrations', (req: AuthRequest, res: Response) => {
  try {
    const sevaMembers = db.get('seva_members');
    const societyMembers = db.get('society_members');
    const volunteers = db.get('volunteers');

    const pendingSeva = sevaMembers
      .filter(s => s.applicationStatus === 'pending_approval' || s.applicationStatus === 'under_review')
      .map(s => ({ ...s, category: 'Seva Member', categoryKey: 'seva_member', portalId: s.memberId }));

    const pendingSociety = societyMembers
      .filter(m => m.applicationStatus === 'pending_approval' || m.applicationStatus === 'under_review')
      .map(m => ({ ...m, category: 'General Member', categoryKey: 'society_member', portalId: m.membershipId }));

    const pendingVolunteers = volunteers
      .filter(v => v.applicationStatus === 'pending_approval' || v.applicationStatus === 'under_review')
      .map(v => ({ ...v, category: 'Volunteer', categoryKey: 'volunteer', portalId: v.volunteerId }));

    const combined = [...pendingSeva, ...pendingSociety, ...pendingVolunteers].sort((a, b) =>
      new Date(b.joinedAt || 0).getTime() - new Date(a.joinedAt || 0).getTime()
    );

    res.json({ success: true, data: combined });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch pending registrations: ' + err.message });
  }
});

/**
 * 4.1.3 Update User Account Status & Role
 */
portalRouter.put('/admin/users/:userId/status', (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { accountStatus, role, applicationStatus, rejectionReason } = req.body;
    const admin = req.user!;

    const users = db.get('users');
    const user = users.find(u => u.id === userId || u.portalId === userId || u.username === userId);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (accountStatus) {
      user.accountStatus = accountStatus as AccountStatus;
    }
    if (role && ['admin', 'member', 'seva_member', 'volunteer', 'admission_applicant'].includes(role)) {
      user.role = role as any;
    }
    user.updatedAt = new Date().toISOString();

    // Synchronize underlying profile if approval/rejection was specified
    if (applicationStatus) {
      if (user.role === 'seva_member') {
        const p = db.get('seva_members').find(s => s.userId === user.id || s.memberId === user.portalId);
        if (p) {
          p.applicationStatus = applicationStatus;
          if (rejectionReason) p.rejectionReason = rejectionReason;
          p.reviewedAt = new Date().toISOString();
          p.reviewedBy = admin.fullName;
        }
      } else if (user.role === 'member') {
        const p = db.get('society_members').find(m => m.userId === user.id || m.membershipId === user.portalId);
        if (p) {
          p.applicationStatus = applicationStatus;
          if (rejectionReason) p.rejectionReason = rejectionReason;
          p.reviewedAt = new Date().toISOString();
          p.reviewedBy = admin.fullName;
        }
      } else if (user.role === 'volunteer') {
        const p = db.get('volunteers').find(v => v.userId === user.id || v.volunteerId === user.portalId);
        if (p) {
          p.applicationStatus = applicationStatus;
          if (rejectionReason) p.rejectionReason = rejectionReason;
          p.reviewedAt = new Date().toISOString();
          p.reviewedBy = admin.fullName;
        }
      }
    }

    db.save();
    db.logAudit(admin.id, admin.fullName, 'USER_STATUS_UPDATE', 'User', `Updated user ${user.fullName} (${user.portalId || user.username}) status: ${accountStatus || applicationStatus || 'role changed'}`, req.ip);

    res.json({
      success: true,
      message: `User account updated successfully`,
      data: {
        id: user.id,
        fullName: user.fullName,
        role: user.role,
        portalId: user.portalId,
        accountStatus: user.accountStatus,
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update user status: ' + err.message });
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
      location: location?.trim() || 'SBBM Social Foundation, Mahuli Centre',
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
      notifMessage = `Congratulations! Your admission enquiry (${applicantTargetId}) for ${item.applicantName} has been APPROVED by SBBM Social Foundation administration. ${adminNotes ? `Admin Notes: ${adminNotes}` : 'Our team will contact you for resident onboarding formalities.'}`;
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
