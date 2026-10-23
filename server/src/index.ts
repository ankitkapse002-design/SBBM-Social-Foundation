import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
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

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  SBBM Social Foundation & Vyenkatesh Ashram API Server`);
  console.log(`  Running on http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
