const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// Trust proxy for rate limiting to work correctly
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3001',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.use('/uploads', express.static('uploads'));

// MongoDB connection (optional for demo)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/health-assessment')
.then(() => {
  console.log('✅ Connected to MongoDB');
  
  // Start automatic data deletion service for GDPR compliance
  try {
    const DataDeletionService = require('./services/dataDeletionService');
    DataDeletionService.startCleanupService();
  } catch (error) {
    console.log('⚠️  Data deletion service not available (demo mode)');
  }
})
.catch(err => {
  console.log('⚠️  MongoDB not available - running in demo mode');
  console.log('   API endpoints will return mock data');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/health', require('./routes/health'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/reports', require('./routes/reports'));
// WooCommerce routes - temporarily disabled
// const wooCommerceRoutes = require('./routes/woocommerce');
// app.use('/api/woocommerce', wooCommerceRoutes);
app.use('/api/settings', require('./routes/settings'));
app.use('/api/gdpr', require('./routes/gdpr'));
app.use('/api/admin', require('./routes/admin'));
// API config endpoint for frontend - public access
app.get('/api/config', (req, res) => {
  res.json({
    success: true,
    data: {
      apiUrl: `http://localhost:${process.env.PORT || 5001}`,
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001',
      features: {
        aiChat: true,
        healthAssessment: true,
        reportGeneration: true,
        gdprCompliance: true,
        adminDashboard: true
      },
      providers: {
        openai: { enabled: false },
        gemini: { enabled: false },
        claude: { enabled: false }
      }
    }
  });
});

app.use('/api/config', require('./routes/config'));

// Root endpoint - API information
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'AI Health Assessment Platform API',
    version: '1.0.0',
      endpoints: {
      auth: '/api/auth',
      health: '/api/health',
      chat: '/api/chat',
      upload: '/api/upload',
      reports: '/api/reports',
      woocommerce: '/api/woocommerce',
      admin: '/api/admin',
      gdpr: '/api/gdpr',
      healthCheck: '/api/health-check'
    },
    frontend: 'http://localhost:3001',
    docs: 'API documentation available at /api/health-check for server status'
  });
});

// Health check endpoint
app.get('/api/health-check', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value'
    });
  }
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
});