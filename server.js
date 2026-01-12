const express = require('express');
const app = express();
const PORT = 3801;

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'SpellRightPro Server is running',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Premium plans endpoint
app.get('/api/plans', (req, res) => {
  const PLANS = {
    'school': { name: 'School Premium', price: 4.99 },
    'complete': { name: 'Complete Premium', price: 8.99 },
    'family': { name: 'Family Plan', price: 14.99 }
  };
  res.json({ success: true, plans: PLANS });
});

// Email confirmation endpoint
app.post('/api/send-confirmation', (req, res) => {
  res.json({
    success: true,
    message: 'Email would be sent (mock)',
    email: req.body.email,
    plan: req.body.plan
  });
});

// Payment processing endpoint
app.post('/api/process-payment', (req, res) => {
  res.json({
    success: true,
    transactionId: 'SRP_' + Date.now(),
    message: 'Payment processed successfully'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'SpellRightPro Premium API',
    status: 'running',
    version: '1.0.0',
    endpoints: [
      'GET /api/health',
      'GET /api/plans', 
      'POST /api/send-confirmation',
      'POST /api/process-payment'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════╗
║     SpellRightPro Premium Backend Server            ║
║                                                      ║
║     🚀 Server running on port ${PORT}               ║
║     📍 http://localhost:${PORT}                     ║
║     ⏰ ${new Date().toLocaleString()}                ║
╚══════════════════════════════════════════════════════╝
  `);
});
