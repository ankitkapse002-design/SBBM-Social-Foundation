import { Router, Response } from 'express';
import { db, EventItem, GalleryAsset, FAQItem, ServiceItem } from '../db';
import { authMiddleware, adminOnly, AuthRequest } from '../middleware/auth';

export const adminRouter = Router();

// Enforce auth & admin privileges on all admin endpoints
adminRouter.use(authMiddleware);
adminRouter.use(adminOnly);

// Real Database-backed metrics
adminRouter.get('/metrics', (req: AuthRequest, res: Response) => {
  const users = db.get('users');
  const admissions = db.get('admission_enquiries');
  const volunteers = db.get('volunteer_enquiries');
  const donations = db.get('donation_enquiries');
  const messages = db.get('contact_messages');
  const membershipRequests = db.get('membership_requests');
  const events = db.get('events');

  const pendingAdmissions = admissions.filter(a => a.status === 'pending_review' || (a.status as string) === 'new' || (a.status as string) === 'reviewing').length;
  const unreadMessages = messages.filter(m => m.status === 'unread').length;
  const pendingMembership = membershipRequests.filter(m => m.status === 'pending').length;
  const pendingDonations = donations.filter(d => d.status === 'pending').length;
  const upcomingEvents = events.filter(e => e.status === 'upcoming').length;

  res.json({
    success: true,
    data: {
      totalRegisteredUsers: users.length,
      memberAccounts: users.filter(u => u.role === 'member').length,
      pendingAdmissions,
      totalAdmissions: admissions.length,
      pendingMembership,
      unreadMessages,
      totalMessages: messages.length,
      volunteerCount: volunteers.length,
      pendingDonations,
      upcomingEvents,
      totalGalleryItems: db.get('gallery_assets').length,
    }
  });
});

// Member Accounts
adminRouter.get('/members', (req: AuthRequest, res: Response) => {
  const users = db.get('users');
  const profiles = db.get('member_profiles');

  const list = users.map(u => {
    const p = profiles.find(prof => prof.userId === u.id);
    return {
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      username: u.username,
      mobile: u.mobile,
      role: u.role,
      memberId: p?.memberId || 'N/A',
      status: p?.status || 'active',
      joinedAt: p?.joinedAt || u.createdAt,
    };
  });

  res.json({ success: true, data: list });
});

// Update Member Status / Role
adminRouter.put('/members/:id', (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { role, status } = req.body;
  const admin = req.user!;

  const users = db.get('users');
  const user = users.find(u => u.id === id);
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }

  if (role && (role === 'admin' || role === 'member')) {
    user.role = role;
  }

  const profiles = db.get('member_profiles');
  const profile = profiles.find(p => p.userId === id);
  if (profile && status) {
    profile.status = status;
  }

  db.save();
  db.logAudit(admin.id, admin.fullName, 'MEMBER_UPDATE', 'User', `Updated user ${user.fullName} (${user.id}) role: ${role}, status: ${status}`, req.ip);

  res.json({ success: true, message: 'Member updated successfully' });
});

// Admission Enquiries
adminRouter.get('/admissions', (req: AuthRequest, res: Response) => {
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
});

adminRouter.get('/admissions/:id', (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const list = db.get('admission_enquiries');
  const item = list.find(a => a.id === id || a.registrationId === id);

  if (!item) {
    res.status(404).json({ success: false, message: 'Admission enquiry not found.' });
    return;
  }

  res.json({ success: true, data: item });
});

adminRouter.put('/admissions/:id', (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, notes, adminNotes, rejectionReason, requestedInfoNotes } = req.body;
  const admin = req.user!;

  const list = db.get('admission_enquiries');
  const item = list.find(a => a.id === id || a.registrationId === id);
  if (!item) {
    res.status(404).json({ success: false, message: 'Admission enquiry not found' });
    return;
  }

  const newStatus = status || item.status;
  if (newStatus === 'rejected' && (!rejectionReason || !rejectionReason.trim())) {
    res.status(400).json({
      success: false,
      message: 'A rejection reason is mandatory when rejecting an admission enquiry.'
    });
    return;
  }

  const prevStatus = item.status;
  const now = new Date().toISOString();

  if (status) item.status = status;
  const effectiveNotes = adminNotes !== undefined ? adminNotes : notes;
  if (effectiveNotes !== undefined) item.adminNotes = effectiveNotes.trim();
  if (rejectionReason !== undefined) item.rejectionReason = rejectionReason.trim();
  if (requestedInfoNotes !== undefined) item.requestedInfoNotes = requestedInfoNotes.trim();
  item.updatedAt = now;

  if (!Array.isArray(item.statusHistory)) {
    item.statusHistory = [];
  }

  const statusNote = rejectionReason?.trim() || requestedInfoNotes?.trim() || effectiveNotes?.trim() || `Status updated from ${prevStatus} to ${newStatus}`;

  item.statusHistory.push({
    id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    status: newStatus,
    date: now,
    updatedBy: admin.fullName,
    notes: statusNote
  });

  // Notify applicant
  const applicantTargetId = item.registrationId || item.id;
  let notifMessage = '';
  let notifType: 'info' | 'success' | 'warning' | 'action' = 'info';

  if (newStatus === 'approved') {
    notifType = 'success';
    notifMessage = `Congratulations! Your admission enquiry (${applicantTargetId}) for ${item.applicantName} has been APPROVED by Vyenkatesh Ashram administration.`;
  } else if (newStatus === 'rejected') {
    notifType = 'warning';
    notifMessage = `Your admission enquiry (${applicantTargetId}) for ${item.applicantName} was reviewed and could not be approved at this time. Reason: ${rejectionReason}`;
  } else if (newStatus === 'more_info_required') {
    notifType = 'warning';
    notifMessage = `Action Required for your admission enquiry (${applicantTargetId}): Administration requested additional details or documents. Instructions: ${requestedInfoNotes || effectiveNotes || 'Please check remarks in your dashboard.'}`;
  } else {
    notifMessage = `Your admission enquiry status has been marked as ${newStatus.replace('_', ' ').toUpperCase()}.`;
  }

  db.get('portal_notifications').push({
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    userId: applicantTargetId,
    title: `Admission Status: ${newStatus.replace('_', ' ').toUpperCase()}`,
    message: notifMessage,
    type: notifType,
    isRead: false,
    createdAt: now,
  });

  db.save();
  db.logAudit(admin.id, admin.fullName, 'ADMISSION_UPDATE', 'AdmissionEnquiry', `Updated status to ${newStatus} for ${item.applicantName || item.residentName} (${id})`, req.ip);

  res.json({ success: true, message: 'Admission enquiry updated successfully', data: item });
});

// Membership Applications
adminRouter.get('/membership-requests', (req: AuthRequest, res: Response) => {
  res.json({ success: true, data: db.get('membership_requests') });
});

adminRouter.put('/membership-requests/:id', (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;
  const admin = req.user!;

  const list = db.get('membership_requests');
  const item = list.find(m => m.id === id);
  if (!item) {
    res.status(404).json({ success: false, message: 'Membership request not found' });
    return;
  }

  if (status) item.status = status;
  if (adminNotes !== undefined) item.adminNotes = adminNotes;
  item.reviewedAt = new Date().toISOString();

  db.save();
  db.logAudit(admin.id, admin.fullName, 'MEMBERSHIP_REVIEW', 'MembershipRequest', `Reviewed request for ${item.fullName} -> ${status}`, req.ip);

  res.json({ success: true, message: 'Membership request updated', data: item });
});

// Volunteer Enquiries
adminRouter.get('/volunteers', (req: AuthRequest, res: Response) => {
  res.json({ success: true, data: db.get('volunteer_enquiries') });
});

adminRouter.put('/volunteers/:id', (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const list = db.get('volunteer_enquiries');
  const item = list.find(v => v.id === id);
  if (!item) {
    res.status(404).json({ success: false, message: 'Volunteer enquiry not found' });
    return;
  }
  if (status) item.status = status;
  db.save();
  res.json({ success: true, message: 'Volunteer status updated', data: item });
});

// Donation Enquiries
adminRouter.get('/donations', (req: AuthRequest, res: Response) => {
  res.json({ success: true, data: db.get('donation_enquiries') });
});

adminRouter.put('/donations/:id', (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const list = db.get('donation_enquiries');
  const item = list.find(d => d.id === id);
  if (!item) {
    res.status(404).json({ success: false, message: 'Donation enquiry not found' });
    return;
  }
  if (status) item.status = status;
  db.save();
  res.json({ success: true, message: 'Donation status updated', data: item });
});

// Contact Messages
adminRouter.get('/messages', (req: AuthRequest, res: Response) => {
  res.json({ success: true, data: db.get('contact_messages') });
});

adminRouter.put('/messages/:id', (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const list = db.get('contact_messages');
  const item = list.find(m => m.id === id);
  if (!item) {
    res.status(404).json({ success: false, message: 'Message not found' });
    return;
  }
  if (status) item.status = status;
  db.save();
  res.json({ success: true, message: 'Message status updated', data: item });
});

// Events CRUD
adminRouter.get('/events', (req: AuthRequest, res: Response) => {
  res.json({ success: true, data: db.get('events') });
});

adminRouter.post('/events', (req: AuthRequest, res: Response) => {
  const { title, description, category, date, time, venue, coverImage, status } = req.body;
  if (!title || !date || !venue) {
    res.status(400).json({ success: false, message: 'Title, date, and venue are required' });
    return;
  }

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const newEvent: EventItem = {
    id: `evt_${Date.now()}`,
    title: title.trim(),
    slug,
    description: description || '',
    category: category || 'Community',
    date,
    time: time || '10:00 AM',
    venue: venue.trim(),
    coverImage: coverImage || '/assets/images/ashram_building.jpg',
    status: status || 'upcoming',
    createdAt: new Date().toISOString(),
  };

  db.get('events').unshift(newEvent);
  db.save();
  db.logAudit(req.user!.id, req.user!.fullName, 'EVENT_CREATE', 'Event', `Created event: ${title}`, req.ip);

  res.status(201).json({ success: true, message: 'Event created successfully', data: newEvent });
});

adminRouter.put('/events/:id', (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const events = db.get('events');
  const event = events.find(e => e.id === id);
  if (!event) {
    res.status(404).json({ success: false, message: 'Event not found' });
    return;
  }

  const { title, description, category, date, time, venue, coverImage, status } = req.body;
  if (title) event.title = title;
  if (description !== undefined) event.description = description;
  if (category) event.category = category;
  if (date) event.date = date;
  if (time) event.time = time;
  if (venue) event.venue = venue;
  if (coverImage) event.coverImage = coverImage;
  if (status) event.status = status;

  db.save();
  db.logAudit(req.user!.id, req.user!.fullName, 'EVENT_UPDATE', 'Event', `Updated event: ${event.title}`, req.ip);

  res.json({ success: true, message: 'Event updated', data: event });
});

adminRouter.delete('/events/:id', (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  let events = db.get('events');
  const index = events.findIndex(e => e.id === id);
  if (index === -1) {
    res.status(404).json({ success: false, message: 'Event not found' });
    return;
  }
  const removed = events.splice(index, 1)[0];
  db.save();
  db.logAudit(req.user!.id, req.user!.fullName, 'EVENT_DELETE', 'Event', `Deleted event: ${removed.title}`, req.ip);
  res.json({ success: true, message: 'Event deleted' });
});

// Gallery CRUD
adminRouter.post('/gallery', (req: AuthRequest, res: Response) => {
  const { title, caption, type, category, mediaUrl } = req.body;
  if (!title || !mediaUrl) {
    res.status(400).json({ success: false, message: 'Title and media URL are required' });
    return;
  }

  const newAsset: GalleryAsset = {
    id: `gal_${Date.now()}`,
    title: title.trim(),
    caption: caption || '',
    type: type || 'photo',
    category: category || 'ashram',
    mediaUrl,
    status: 'published',
    createdAt: new Date().toISOString(),
  };

  db.get('gallery_assets').unshift(newAsset);
  db.save();
  db.logAudit(req.user!.id, req.user!.fullName, 'GALLERY_UPLOAD', 'Gallery', `Added gallery media: ${title}`, req.ip);

  res.status(201).json({ success: true, message: 'Media added to gallery', data: newAsset });
});

adminRouter.delete('/gallery/:id', (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const assets = db.get('gallery_assets');
  const index = assets.findIndex(g => g.id === id);
  if (index === -1) {
    res.status(404).json({ success: false, message: 'Asset not found' });
    return;
  }
  const removed = assets.splice(index, 1)[0];
  db.save();
  db.logAudit(req.user!.id, req.user!.fullName, 'GALLERY_DELETE', 'Gallery', `Removed gallery asset: ${removed.title}`, req.ip);
  res.json({ success: true, message: 'Media removed from gallery' });
});

// FAQs CRUD
adminRouter.post('/faqs', (req: AuthRequest, res: Response) => {
  const { question, answer, category, orderIndex } = req.body;
  if (!question || !answer) {
    res.status(400).json({ success: false, message: 'Question and answer are required' });
    return;
  }

  const newFaq: FAQItem = {
    id: `faq_${Date.now()}`,
    question: question.trim(),
    answer: answer.trim(),
    category: category || 'general',
    orderIndex: Number(orderIndex) || db.get('faqs').length + 1,
    createdAt: new Date().toISOString(),
  };

  db.get('faqs').push(newFaq);
  db.save();
  res.status(201).json({ success: true, message: 'FAQ added', data: newFaq });
});

// Audit Logs
adminRouter.get('/audit-logs', (req: AuthRequest, res: Response) => {
  res.json({ success: true, data: db.get('audit_logs') });
});
