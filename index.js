/* eslint-disable */
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.set('trust proxy', 1); // Trust the first proxy (AWS Amplify/WAF)
const port = process.env.PORT || 8000;
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const cron = require('node-cron');
require('./config/db-config');

// Import routes
const bodyParser = require('body-parser');
const router = require('./routes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const listAllObjects = require('./controllers/readNachMandate/readNachMandate');

// Static files
app.use(express.static('public'));

// =========================
// ✅ CORS (LOCAL + PROD ONLY)
// =========================
const allowedOrigins = [
  'http://localhost:3000',
  // 'https://finvest.ambit.co',
  'https://new-staging.dltwom1s6px9l.amplifyapp.com',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow non-browser tools (Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

// ✅ Required for Amplify WAF
app.options('*', cors());

// =========================
// Body & file middlewares
// =========================
const rateLimit = require('express-rate-limit');

// Global Rate Limiter: Prevents a single IP from making too many requests
// and exhausting server threads.
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per window
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(globalLimiter);

app.use(express.urlencoded({extended: true}));

// ✅ Security: Reduced body limit from 50mb to 1mb to prevent memory exhaustion (DoS).
// Large files should be uploaded via 'multipart/form-data' (fileUpload middleware below).
app.use(bodyParser.json({limit: '3mb', extended: true}));
// app.use(express.json()); // Removed redundant call to express.json()
app.use(fileUpload());

// =========================
// Routes
// =========================
app.use('/api/v1/auth', router);
app.use('/api/v1/', router);

// Health check
app.get('/', async (req, res) => {
  res.send({
    success: true,
    message: 'Working successfully!!',
  });
});

// =========================
// Error handler
// =========================
app.use(errorHandler);

// Invalid route handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Invalid route',
  });
});

// =========================
// Server start
// =========================
app.listen(port, () => {
  console.log(`Application listening on port ${port}...`);
});

// =========================
// Cron job
// =========================
cron.schedule('0 2 * * *', () => {
  console.log('Running a task every day at 2 AM');
  listAllObjects();
});
