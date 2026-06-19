// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');
// require('dotenv').config();

// const app = express();

// // ─── Security Middleware ────────────────────────────────────────────────────
// app.use(helmet());
// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:3000',
//   credentials: true,
// }));

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100,
//   message: { success: false, message: 'Too many requests, please try again later.' },
// });
// app.use('/api/', limiter);

// // ─── Body Parsing ───────────────────────────────────────────────────────────
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ─── Logging ────────────────────────────────────────────────────────────────
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

// // ─── Database Connection ────────────────────────────────────────────────────
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log('✅  MongoDB connected'))
//   .catch((err) => {
//     console.error('❌  MongoDB connection error:', err.message);
//     process.exit(1);
//   });

// // ─── Routes ─────────────────────────────────────────────────────────────────
// app.use('/api/auth',     require('./routes/auth'));
// app.use('/api/services', require('./routes/services'));
// app.use('/api/plans',    require('./routes/plans'));
// app.use('/api/bookings', require('./routes/bookings'));
// app.use('/api/reviews',  require('./routes/reviews'));
// app.use('/api/slots',    require('./routes/slots'));
// app.use('/api/admin',    require('./routes/admin'));

// // ─── Health Check ────────────────────────────────────────────────────────────
// app.get('/api/health', (req, res) => {
//   res.json({ success: true, message: 'SplashX API is running 🚗✨', timestamp: new Date() });
// });

// // ─── 404 Handler ────────────────────────────────────────────────────────────
// app.use((req, res) => {
//   res.status(404).json({ success: false, message: 'Route not found' });
// });

// // ─── Global Error Handler ────────────────────────────────────────────────────
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.statusCode || 500).json({
//     success: false,
//     message: err.message || 'Internal server error',
//   });
// });

// // ─── Start Server ────────────────────────────────────────────────────────────
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀  Server running on http://localhost:${PORT}`);
// });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Load .env explicitly from backend folder
require('dotenv').config({
  path: path.resolve(__dirname, '.env')
});

console.log('PORT =', process.env.PORT);
console.log('MONGO_URI =', process.env.MONGO_URI);

const app = express();

// Security Middleware
app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
});

app.use('/api/', limiter);

// Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
  })
  .catch((err) => {
    console.error('FULL ERROR');
    console.error(err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/plans', require('./routes/plans'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/slots', require('./routes/slots'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/invoice', require('./routes/invoice'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'SplashX API is running 🚗✨',
    timestamp: new Date(),
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});