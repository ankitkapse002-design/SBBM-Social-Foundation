import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db, User, MemberProfile } from '../db';
import { authMiddleware, generateToken, rateLimit, AuthRequest } from '../middleware/auth';

export const authRouter = Router();

// Member Registration
authRouter.post('/register', rateLimit(60000, 10), (req: Request, res: Response) => {
  try {
    const { fullName, email, mobile, password, address, emergencyContact } = req.body;

    if (!fullName || !email || !mobile || !password) {
      res.status(400).json({ success: false, message: 'Full name, email, mobile number and password are required' });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
      return;
    }

    const users = db.get('users');
    const existingEmail = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existingEmail) {
      res.status(400).json({ success: false, message: 'An account with this email address already exists' });
      return;
    }

    const existingMobile = users.find(u => u.mobile.replace(/\D/g, '') === mobile.replace(/\D/g, ''));
    if (existingMobile) {
      res.status(400).json({ success: false, message: 'An account with this mobile number already exists' });
      return;
    }

    const now = new Date().toISOString();
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const passwordHash = bcrypt.hashSync(password, 10);
    const memberId = `SSBM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser: User = {
      id: userId,
      email: email.trim().toLowerCase(),
      username: email.trim().toLowerCase(),
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      passwordHash,
      role: 'member',
      isVerified: true,
      mustChangePassword: false,
      createdAt: now,
      updatedAt: now,
    };

    const newProfile: MemberProfile = {
      id: `mp_${Date.now()}`,
      userId,
      memberId,
      address: address?.trim() || 'Not specified',
      emergencyContact: emergencyContact?.trim() || mobile.trim(),
      status: 'active',
      joinedAt: now,
    };

    users.push(newUser);
    db.get('member_profiles').push(newProfile);
    db.save();

    db.logAudit(newUser.id, newUser.fullName, 'MEMBER_REGISTER', 'User', `Registered new member account with ID ${memberId}`, req.ip);

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        mobile: newUser.mobile,
        role: newUser.role,
        memberId: newProfile.memberId,
        mustChangePassword: false,
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Registration failed: ' + err.message });
  }
});

// Member Login
authRouter.post('/login', rateLimit(60000, 15), (req: Request, res: Response) => {
  try {
    const { loginId, password } = req.body;
    if (!loginId || !password) {
      res.status(400).json({ success: false, message: 'Email/Mobile and password are required' });
      return;
    }

    const users = db.get('users');
    const cleanId = loginId.trim().toLowerCase();
    const user = users.find(u => 
      u.email.toLowerCase() === cleanId || 
      u.username.toLowerCase() === cleanId ||
      u.mobile.replace(/\D/g, '') === cleanId.replace(/\D/g, '')
    );

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const profiles = db.get('member_profiles');
    const profile = profiles.find(p => p.userId === user.id);

    const token = generateToken(user);
    db.logAudit(user.id, user.fullName, 'MEMBER_LOGIN', 'User', 'User logged in', req.ip);

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
        memberId: profile?.memberId || 'PENDING',
        mustChangePassword: user.mustChangePassword,
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Login failed: ' + err.message });
  }
});

// Admin Login
authRouter.post('/admin/login', rateLimit(60000, 8), (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ success: false, message: 'Username and password are required' });
      return;
    }

    const users = db.get('users');
    const cleanUser = username.trim().toLowerCase();
    const admin = users.find(u => 
      u.role === 'admin' && (u.username.toLowerCase() === cleanUser || u.email.toLowerCase() === cleanUser)
    );

    if (!admin) {
      res.status(401).json({ success: false, message: 'Invalid administrator credentials' });
      return;
    }

    const isMatch = bcrypt.compareSync(password, admin.passwordHash);
    if (!isMatch) {
      db.logAudit('anonymous', username, 'ADMIN_LOGIN_FAIL', 'Security', `Failed login attempt for admin username: ${username}`, req.ip);
      res.status(401).json({ success: false, message: 'Invalid administrator credentials' });
      return;
    }

    const token = generateToken(admin);
    db.logAudit(admin.id, admin.fullName, 'ADMIN_LOGIN_SUCCESS', 'Security', 'Admin authenticated', req.ip);

    res.json({
      success: true,
      message: 'Admin authentication successful',
      token,
      user: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        fullName: admin.fullName,
        role: admin.role,
        mustChangePassword: admin.mustChangePassword,
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Admin login failed: ' + err.message });
  }
});

// Get current profile
authRouter.get('/me', authMiddleware, (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const profiles = db.get('member_profiles');
  const profile = profiles.find(p => p.userId === user.id);

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      mobile: user.mobile,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
      profile: profile || null,
    }
  });
});

// Change Password (with required password rotation support)
authRouter.post('/change-password', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user!;

    if (!newPassword || newPassword.length < 8) {
      res.status(400).json({ success: false, message: 'New password must be at least 8 characters long' });
      return;
    }

    if (!currentPassword) {
      res.status(400).json({ success: false, message: 'Current password is required' });
      return;
    }

    const isMatch = bcrypt.compareSync(currentPassword, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Current password does not match' });
      return;
    }

    if (currentPassword === newPassword) {
      res.status(400).json({ success: false, message: 'New password must be different from your current password' });
      return;
    }

    const users = db.get('users');
    const target = users.find(u => u.id === user.id);
    if (target) {
      target.passwordHash = bcrypt.hashSync(newPassword, 10);
      target.mustChangePassword = false;
      target.updatedAt = new Date().toISOString();
      db.save();

      db.logAudit(user.id, user.fullName, 'PASSWORD_CHANGE', 'User', 'User changed account password', req.ip);
    }

    res.json({
      success: true,
      message: 'Password changed successfully. You can now use your new password.',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update password: ' + err.message });
  }
});
