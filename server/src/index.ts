import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { authRouter } from './routes/auth';
import { enquiriesRouter } from './routes/enquiries';
import { publicRouter } from './routes/public';
import { adminRouter } from './routes/admin';
import { chatRouter } from './routes/chat';
import { portalRouter } from './routes/portal';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Resilient explicit endpoints for Search Engines & Crawlers
app.get('/robots.txt', (req, res) => {
  const robotsPath = path.resolve(process.cwd(), 'client/public/robots.txt');
  if (fs.existsSync(robotsPath)) {
    res.type('text/plain');
    return res.sendFile(robotsPath);
  }
  res.type('text/plain').send("User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: https://sbbmsocialfoundation.org/sitemap.xml");
});

app.get('/sitemap.xml', (req, res) => {
  const sitemapPath = path.resolve(process.cwd(), 'client/public/sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    res.type('application/xml');
    return res.sendFile(sitemapPath);
  }
  res.status(404).send('Sitemap not found');
});

// Serve static images directly from client/public/assets/images with cache control
const imagesStaticPath = path.resolve(process.cwd(), 'client/public/assets/images');
app.use('/assets/images', express.static(imagesStaticPath, {
  maxAge: '7d',
  etag: true,
  lastModified: true,
}));

// Ensure gallery upload directory exists
const galleryUploadDir = path.join(imagesStaticPath, 'gallery');
if (!fs.existsSync(galleryUploadDir)) {
  fs.mkdirSync(galleryUploadDir, { recursive: true });
}

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
app.use('/api/admin', adminRouter);
app.use('/api/vyenky', chatRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    organization: 'SBBM Social Foundation',
    platform: 'SBBM Social Foundation Digital Platform',
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
  app.use(express.static(clientDistPath, {
    maxAge: '1d',
    setHeaders: (res, filepath) => {
      if (filepath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      } else if (filepath.match(/\.(js|css|woff2|woff|ttf|png|jpg|jpeg|svg|webp|mp4)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
      }
    },
  }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
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
  console.log(`  SBBM Social Foundation API Server`);
  console.log(`  Running on http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
