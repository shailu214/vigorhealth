// Vercel serverless function entry point
// This file routes all API requests to the Express server

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Import routes
const authRoutes = require('../backend/routes/auth');
const healthRoutes = require('../backend/routes/health');
const chatRoutes = require('../backend/routes/chat');
const configRoutes = require('../backend/routes/config');
const adminRoutes = require('../backend/routes/admin');
const uploadRoutes = require('../backend/routes/upload');
const reportRoutes = require('../backend/routes/reports');
const woocommerceRoutes = require('../backend/routes/woocommerce');
const gdprRoutes = require('../backend/routes/gdpr');
const settingsRoutes = require('../backend/routes/settings');

const app = express();

// CORS configuration for Vercel
const corsOptions = {
  origin: process.env.VERCEL_URL 
    ? [`https://${process.env.VERCEL_URL}`, 'http://localhost:3000', 'https://*.vercel.app']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection for Vercel
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://shailu446_db_user:Y3oZJZZ0Lz0NfvW9@vigorhealth214.txto8tq.mongodb.net/healthassessment';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0
    });

    isConnected = true;
    console.log('Connected to MongoDB for Vercel');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    vercel: true
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/config', configRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/woocommerce', woocommerceRoutes);
app.use('/api/gdpr', gdprRoutes);
app.use('/api/settings', settingsRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  res.status(error.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : error.message,
    timestamp: new Date().toISOString()
  });
});

// Export handler for Vercel
module.exports = async (req, res) => {
  // Connect to database on each request (Vercel serverless)
  await connectToDatabase();
  
  // Handle the request with Express
  return app(req, res);
};