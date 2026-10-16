import { Router, Request, Response } from 'express';
import { db } from '../db';

export const publicRouter = Router();

// Services list
publicRouter.get('/services', (req: Request, res: Response) => {
  const services = db.get('services');
  res.json({ success: true, data: services });
});

// Single service by slug or id
publicRouter.get('/services/:identifier', (req: Request, res: Response) => {
  const { identifier } = req.params;
  const services = db.get('services');
  const service = services.find(s => s.slug === identifier || s.id === identifier);
  if (!service) {
    res.status(404).json({ success: false, message: 'Service not found' });
    return;
  }
  res.json({ success: true, data: service });
});

// Events list
publicRouter.get('/events', (req: Request, res: Response) => {
  const { status } = req.query;
  let events = db.get('events');
  if (status && typeof status === 'string') {
    events = events.filter(e => e.status === status);
  }
  res.json({ success: true, data: events });
});

// Single event by id or slug
publicRouter.get('/events/:identifier', (req: Request, res: Response) => {
  const { identifier } = req.params;
  const events = db.get('events');
  const event = events.find(e => e.id === identifier || e.slug === identifier);
  if (!event) {
    res.status(404).json({ success: false, message: 'Event not found' });
    return;
  }
  res.json({ success: true, data: event });
});

// Gallery assets
publicRouter.get('/gallery', (req: Request, res: Response) => {
  const { category, type } = req.query;
  let gallery = db.get('gallery_assets').filter(g => g.status === 'published');
  if (category && typeof category === 'string' && category !== 'all') {
    gallery = gallery.filter(g => g.category === category);
  }
  if (type && typeof type === 'string' && type !== 'all') {
    gallery = gallery.filter(g => g.type === type);
  }
  res.json({ success: true, data: gallery });
});

// FAQs
publicRouter.get('/faqs', (req: Request, res: Response) => {
  const { category } = req.query;
  let faqs = db.get('faqs');
  if (category && typeof category === 'string' && category !== 'all') {
    faqs = faqs.filter(f => f.category === category);
  }
  faqs.sort((a, b) => a.orderIndex - b.orderIndex);
  res.json({ success: true, data: faqs });
});
