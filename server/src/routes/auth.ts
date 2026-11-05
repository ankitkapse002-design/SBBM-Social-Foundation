import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db';
import { authMiddleware, generateToken, rateLimit, AuthRequest } from '../middleware/auth';

export const authRouter = Router();

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
    }
  });
});

// Change Password (for authenticated administrator)
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

    const cleanCurrent = (currentPassword || '').trim();
    const isMatch = bcrypt.compareSync(currentPassword, user.passwordHash) || bcrypt.compareSync(cleanCurrent, user.passwordHash);

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

      db.logAudit(user.id, user.fullName, 'PASSWORD_CHANGE', 'User', 'Administrator changed account password', req.ip);
    }

    res.json({
      success: true,
      message: 'Password changed successfully. You can now use your new password.',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update password: ' + err.message });
  }
});
