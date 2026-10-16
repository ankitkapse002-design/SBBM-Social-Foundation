import { Router, Response } from 'express';
import { db } from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

export const memberRouter = Router();

memberRouter.use(authMiddleware);

// Get member profile
memberRouter.get('/profile', (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const profiles = db.get('member_profiles');
  const profile = profiles.find(p => p.userId === user.id);

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      mobile: user.mobile,
      role: user.role,
      createdAt: user.createdAt,
    },
    profile: profile || null,
  });
});

// Update member profile
memberRouter.put('/profile', (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const { address, emergencyContact, dateOfBirth, bloodGroup } = req.body;

  const profiles = db.get('member_profiles');
  let profile = profiles.find(p => p.userId === user.id);

  if (!profile) {
    profile = {
      id: `mp_${Date.now()}`,
      userId: user.id,
      memberId: `SSBM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      address: address || '',
      emergencyContact: emergencyContact || user.mobile,
      dateOfBirth,
      bloodGroup,
      status: 'active',
      joinedAt: new Date().toISOString(),
    };
    profiles.push(profile);
  } else {
    if (address !== undefined) profile.address = address;
    if (emergencyContact !== undefined) profile.emergencyContact = emergencyContact;
    if (dateOfBirth !== undefined) profile.dateOfBirth = dateOfBirth;
    if (bloodGroup !== undefined) profile.bloodGroup = bloodGroup;
  }

  db.save();
  db.logAudit(user.id, user.fullName, 'MEMBER_PROFILE_UPDATE', 'MemberProfile', 'Updated profile information');

  res.json({ success: true, message: 'Profile updated successfully', profile });
});

// Get enquiries associated with this member
memberRouter.get('/my-enquiries', (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const userEmail = user.email.toLowerCase();
  const userPhone = user.mobile.replace(/\D/g, '');

  const admissions = db.get('admission_enquiries').filter(a => 
    (a.applicantEmail && a.applicantEmail.toLowerCase() === userEmail) ||
    a.applicantPhone.replace(/\D/g, '') === userPhone
  );

  const volunteers = db.get('volunteer_enquiries').filter(v =>
    (v.email && v.email.toLowerCase() === userEmail) ||
    v.phone.replace(/\D/g, '') === userPhone
  );

  const donations = db.get('donation_enquiries').filter(d =>
    (d.email && d.email.toLowerCase() === userEmail) ||
    d.phone.replace(/\D/g, '') === userPhone
  );

  const membershipRequests = db.get('membership_requests').filter(m =>
    m.email.toLowerCase() === userEmail ||
    m.mobile.replace(/\D/g, '') === userPhone
  );

  res.json({
    success: true,
    data: {
      admissions,
      volunteers,
      donations,
      membershipRequests,
    }
  });
});
