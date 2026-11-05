import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db, User } from '../db';

const JWT_SECRET = process.env.JWT_SECRET || 'sbbm_social_foundation_secret_key_2026_dignity_care';

export interface AuthRequest extends Request {
  user?: User;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    const users = db.get('users');
    const user = users.find(u => u.id === decoded.userId);

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid token or user not found' });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired session' });
    return;
  }
}

export function adminOnly(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Administrator privileges required' });
    return;
  }
  next();
}

// In-memory rate limiting map for brute-force protection
const rateLimitMap = new Map<string, { count: number; firstAttempt: number }>();

export function rateLimit(windowMs: number = 60000, maxRequests: number = 10) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record) {
      rateLimitMap.set(ip, { count: 1, firstAttempt: now });
      next();
      return;
    }

    if (now - record.firstAttempt > windowMs) {
      rateLimitMap.set(ip, { count: 1, firstAttempt: now });
      next();
      return;
    }

    const isLocalhost = ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1' || ip.includes('localhost');
    const effectiveLimit = isLocalhost ? 1000 : maxRequests;

    record.count++;
    if (record.count > effectiveLimit) {
      res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again in a few moments.'
      });
      return;
    }

    next();
  };
}

export function generateToken(user: User): string {
  return jwt.sign(
    { userId: user.id, username: user.username, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}
