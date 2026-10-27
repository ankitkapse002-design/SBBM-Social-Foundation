import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { authRouter } from './routes/auth';
import { enquiriesRouter } from './routes/enquiries';
import { publicRouter } from './routes/public';
import { memberRouter } from './routes/member';
import { adminRouter } from './routes/admin';
import { chatRouter } from './routes/chat';
import { portalRouter } from './routes/portal';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Mount API routes
app.use('/api/auth', authRouter);
app.use('/api/portal', portalRouter);
app.use('/api/enquiries', enquiriesRouter);
app.use('/api/public', publicRouter);
app.use('/api/member', memberRouter);
app.use('/api/admin', adminRouter);
app.use('/api/vyenky', chatRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    organization: 'SBBM Social Foundation Society',
    institution: 'VYENKATESH ASHRAM',
    contact: '+91 98908 98081',
    serverTime: new Date().toISOString(),
  });
});

// Production Unified Static Asset & SPA Serving
const possibleDistPaths = [
  path.resolve(process.cwd(), 'client/dist'),
  path.resolve(__dirname, '../../client/dist'),
  path.resolve(__dirname, '../client/dist'),
];

let clientDistPath: string | null = null;
for (const p of possibleDistPaths) {
  if (fs.existsSync(p) && fs.existsSync(path.join(p, 'index.html'))) {
    clientDistPath = p;
    break;
  }
}

if (clientDistPath) {
  console.log(`[Production] Serving static client build from: ${clientDistPath}`);
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath!, 'index.html'));
  });
}

// Global 404 for unhandled API endpoints
app.all('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `API endpoint ${req.method} ${req.path} not found` });
});

// Centralized error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Unhandled Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'An unexpected server error occurred.' : (err.message || 'Internal server error'),
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  SBBM Social Foundation & Vyenkatesh Ashram API Server`);
  console.log(`  Running on http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
