// Minimal Express server for HireHub
// Loads environment variables from .env (if present) and starts the server

require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

// Simple CORS setup allowing the frontend URL from .env
app.use((req, res, next) => {
  const allowed = process.env.FRONTEND_URL || '*';
  res.header('Access-Control-Allow-Origin', allowed);
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV || 'development' });
});

// Example route
app.get('/', (req, res) => {
  res.send('HireHub backend is running');
});

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
