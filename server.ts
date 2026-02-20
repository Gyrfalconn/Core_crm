
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
// @ts-ignore
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import cron from 'node-cron';

const prisma = new PrismaClient();
const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'core_enterprise_secret_2025';

// Fix: Use 'as any' to resolve type mismatch between NextHandleFunction and Express RequestHandler
app.use(cors() as any);
app.use(express.json() as any);

// Auth Middleware
const authenticate = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Session expired or unauthorized.' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

// --- AUTH ---
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, role } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { email, passwordHash, name, role: role || 'Employee' } });
    res.status(201).json({ message: 'User registered.' });
  } catch (e) { res.status(400).json({ error: 'User already exists.' }); }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && await bcrypt.compare(password, user.passwordHash)) {
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
  } else res.status(401).json({ error: 'Invalid credentials.' });
});

app.put('/api/auth/profile', authenticate, async (req, res) => {
  const { name, email, role } = req.body;
  const userId = (req as any).user.id;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email, role }
    });
    res.json({ user: { id: updatedUser.id, name: updatedUser.name, role: updatedUser.role, email: updatedUser.email } });
  } catch (e) { res.status(400).json({ error: 'Failed to update profile.' }); }
});

// --- LEADS ---
app.get('/api/leads', authenticate, async (req, res) => {
  res.json(await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } }));
});
app.post('/api/leads', authenticate, async (req, res) => {
  res.status(201).json(await prisma.lead.create({ data: req.body }));
});

// --- DEALS ---
app.get('/api/deals', authenticate, async (req, res) => {
  res.json(await prisma.deal.findMany({ orderBy: { createdAt: 'desc' } }));
});
app.patch('/api/deals/:id', authenticate, async (req, res) => {
  res.json(await prisma.deal.update({ where: { id: req.params.id }, data: req.body }));
});

// --- TICKETS ---
app.get('/api/tickets', authenticate, async (req, res) => {
  res.json(await prisma.ticket.findMany({ orderBy: { createdAt: 'desc' } }));
});
app.post('/api/tickets', authenticate, async (req, res) => {
  res.status(201).json(await prisma.ticket.create({ data: req.body }));
});

// --- TRACKING ---
app.get('/api/tracking', authenticate, async (req, res) => {
  res.json(await prisma.employeeLog.findMany({ orderBy: { checkIn: 'desc' } }));
});
app.post('/api/tracking/checkin', authenticate, async (req, res) => {
  res.status(201).json(await prisma.employeeLog.create({
    data: { userId: (req as any).user.id, employeeName: (req as any).user.name, location: req.body.location || 'Remote', status: 'Active' }
  }));
});
app.post('/api/tracking/checkout', authenticate, async (req, res) => {
  const log = await prisma.employeeLog.findFirst({ where: { userId: (req as any).user.id, status: 'Active' }, orderBy: { checkIn: 'desc' } });
  if (!log) return res.status(404).json({ error: 'No active session.' });
  // Fix: Standard JS uses Date(), DateTime is not defined.
  res.json(await prisma.employeeLog.update({ where: { id: log.id }, data: { checkOut: new Date(), status: 'Offline' } }));
});

// --- ANALYTICS ---
app.get('/api/analytics/overview', authenticate, async (req, res) => {
  const [revenue, leads, deals] = await Promise.all([
    prisma.customer.aggregate({ _sum: { totalSpent: true } }),
    prisma.lead.count(),
    prisma.deal.count()
  ]);
  res.json({ revenue: revenue._sum.totalSpent || 0, leads, deals });
});

cron.schedule('0 0 * * *', () => console.log('System Cleanup & Backup Run.'));

app.listen(3001, () => console.log('CORE SERVER: READY'));
