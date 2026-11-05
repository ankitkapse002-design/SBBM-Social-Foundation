import { Router, Response } from 'express';
import fs from 'fs';
import path from 'path';
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
    notifMessage = `Congratulations! Your admission enquiry (${applicantTargetId}) for ${item.applicantName} has been APPROVED by SBBM Social Foundation administration.`;
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

// Contact Messages & Official Inquiries
adminRouter.get('/messages', (req: AuthRequest, res: Response) => {
  const { status, search } = req.query;
  let list = db.get('contact_messages') || [];

  if (status && status !== 'all') {
    list = list.filter(m => m.status === status);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    list = list.filter(m =>
      (m.name && m.name.toLowerCase().includes(q)) ||
      (m.email && m.email.toLowerCase().includes(q)) ||
      (m.phone && m.phone.toLowerCase().includes(q)) ||
      (m.message && m.message.toLowerCase().includes(q)) ||
      (m.category && m.category.toLowerCase().includes(q))
    );
  }

  // Sort newest first
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const allMessages = db.get('contact_messages') || [];
  const unreadCount = allMessages.filter(m => m.status === 'unread').length;

  res.json({
    success: true,
    data: list,
    total: allMessages.length,
    unreadCount
  });
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
  if (status && ['unread', 'read', 'replied', 'archived'].includes(status)) {
    item.status = status as any;
  }
  db.save();
  db.logAudit(req.user!.id, req.user!.fullName, 'MESSAGE_STATUS_UPDATE', 'ContactMessage', `Updated message ${id} status to ${status}`, req.ip);
  res.json({ success: true, message: 'Message status updated', data: item });
});

adminRouter.delete('/messages/:id', (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const list = db.get('contact_messages');
  const index = list.findIndex(m => m.id === id);
  if (index === -1) {
    res.status(404).json({ success: false, message: 'Message not found' });
    return;
  }
  const removed = list.splice(index, 1)[0];
  db.save();
  db.logAudit(req.user!.id, req.user!.fullName, 'MESSAGE_DELETE', 'ContactMessage', `Deleted message from ${removed.name} (${id})`, req.ip);
  res.json({ success: true, message: 'Message deleted successfully', data: removed });
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

// Gallery Management Endpoints
adminRouter.get('/gallery', (req: AuthRequest, res: Response) => {
  const { category, status, search } = req.query;
  let list = db.get('gallery_assets') || [];

  if (category && category !== 'all') {
    list = list.filter(g => g.category === category);
  }

  if (status && status !== 'all') {
    list = list.filter(g => g.status === status);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    list = list.filter(g =>
      (g.title && g.title.toLowerCase().includes(q)) ||
      (g.caption && g.caption.toLowerCase().includes(q))
    );
  }

  // Sort newest first
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({ success: true, data: list, total: list.length });
});

// Upload new photograph from computer (Base64)
adminRouter.post('/gallery/upload', (req: AuthRequest, res: Response) => {
  try {
    const { image, filename } = req.body;
    if (!image || typeof image !== 'string') {
      res.status(400).json({ success: false, message: 'No photograph data provided.' });
      return;
    }

    // Match base64 data URL: data:image/(png|jpeg|jpg|webp);base64,...
    const matches = image.match(/^data:image\/([a-zA-Z0-9-+.]+);base64,(.+)$/);
    let ext = 'jpg';
    let base64String = image;

    if (matches) {
      ext = matches[1].toLowerCase();
      if (ext === 'jpeg') ext = 'jpg';
      base64String = matches[2];
    } else if (filename && filename.includes('.')) {
      ext = filename.split('.').pop()!.toLowerCase();
    }

    const validExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    if (!validExtensions.includes(ext)) {
      res.status(400).json({ success: false, message: 'Unsupported format. Please upload JPG, PNG, or WebP.' });
      return;
    }

    const buffer = Buffer.from(base64String, 'base64');
    // Check size: 15MB max
    if (buffer.length > 15 * 1024 * 1024) {
      res.status(400).json({ success: false, message: 'Photograph size exceeds 15MB limit.' });
      return;
    }

    const cleanBase = filename
      ? filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30)
      : 'gallery_photo';
    const uniqueFilename = `${cleanBase}_${Date.now()}.${ext}`;

    const uploadDir = path.resolve(process.cwd(), 'client/public/assets/images/gallery');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const destPath = path.join(uploadDir, uniqueFilename);
    fs.writeFileSync(destPath, buffer);

    // Also mirror into client/dist/assets/images/gallery if client/dist exists
    const distGalleryDir = path.resolve(process.cwd(), 'client/dist/assets/images/gallery');
    if (fs.existsSync(path.resolve(process.cwd(), 'client/dist'))) {
      if (!fs.existsSync(distGalleryDir)) {
        fs.mkdirSync(distGalleryDir, { recursive: true });
      }
      fs.copyFileSync(destPath, path.join(distGalleryDir, uniqueFilename));
    }

    const publicUrl = `/assets/images/gallery/${uniqueFilename}`;
    res.status(201).json({
      success: true,
      message: 'Photograph uploaded successfully',
      url: publicUrl,
      filename: uniqueFilename,
      sizeBytes: buffer.length
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to upload photograph: ' + err.message });
  }
});

adminRouter.post('/gallery', (req: AuthRequest, res: Response) => {
  const { title, caption, type, category, mediaUrl, status } = req.body;
  if (!title || !mediaUrl) {
    res.status(400).json({ success: false, message: 'Title and photograph URL are required.' });
    return;
  }

  const newAsset: GalleryAsset = {
    id: `gal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title: title.trim(),
    caption: caption ? caption.trim() : '',
    type: type || 'photo',
    category: category || 'general',
    mediaUrl,
    status: (status === 'unpublished' || status === 'draft') ? 'draft' : 'published',
    createdAt: new Date().toISOString(),
  };

  db.get('gallery_assets').unshift(newAsset);
  db.save();
  db.logAudit(req.user!.id, req.user!.fullName, 'GALLERY_UPLOAD', 'Gallery', `Added gallery photograph: ${title}`, req.ip);

  res.status(201).json({ success: true, message: 'Photograph added to gallery successfully', data: newAsset });
});

adminRouter.put('/gallery/:id', (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, caption, category, mediaUrl, status } = req.body;
  const assets = db.get('gallery_assets');
  const asset = assets.find(g => g.id === id);
  if (!asset) {
    res.status(404).json({ success: false, message: 'Photograph not found' });
    return;
  }

  if (title !== undefined) asset.title = title.trim();
  if (caption !== undefined) asset.caption = caption.trim();
  if (category !== undefined) asset.category = category;
  if (mediaUrl !== undefined) asset.mediaUrl = mediaUrl;
  if (status !== undefined) {
    asset.status = (status === 'unpublished' || status === 'draft') ? 'draft' : 'published';
  }

  db.save();
  db.logAudit(req.user!.id, req.user!.fullName, 'GALLERY_UPDATE', 'Gallery', `Updated gallery photograph: ${asset.title} (status: ${asset.status})`, req.ip);

  res.json({ success: true, message: 'Photograph updated successfully', data: asset });
});

adminRouter.delete('/gallery/:id', (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const assets = db.get('gallery_assets');
  const index = assets.findIndex(g => g.id === id);
  if (index === -1) {
    res.status(404).json({ success: false, message: 'Photograph not found' });
    return;
  }
  const removed = assets.splice(index, 1)[0];
  db.save();
  db.logAudit(req.user!.id, req.user!.fullName, 'GALLERY_DELETE', 'Gallery', `Removed gallery photograph: ${removed.title}`, req.ip);
  res.json({ success: true, message: 'Photograph removed from gallery successfully', data: removed });
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
