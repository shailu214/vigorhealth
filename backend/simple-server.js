const express = require('express');
const cors = require('cors');

console.log('🚀 Starting simple API server for immediate testing...');

const app = express();

// CORS configuration to allow frontend connection
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
}));

// Body parsing middleware
app.use(express.json());

// Simple API config endpoint that the frontend needs
app.get('/api/config', (req, res) => {
  console.log('📡 API Config requested from:', req.get('origin') || 'unknown');
  res.json({
    success: true,
    data: {
      apiUrl: 'http://localhost:5002',
      frontendUrl: 'http://localhost:3001',
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

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
  console.log('🔐 Admin login attempt');
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin123') {
    res.json({
      success: true,
      message: 'Login successful',
      token: 'demo-token-admin-123',
      admin: {
        id: 'admin-1',
        username: 'admin',
        name: 'Administrator',
        role: 'admin'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// AI Providers endpoint
app.get('/api/config/ai-providers', (req, res) => {
  console.log('🤖 AI Providers config requested');
  res.json({
    success: true,
    data: {
      openai: {
        enabled: false,
        apiKey: '',
        model: 'gpt-3.5-turbo',
        maxTokens: 1000,
        temperature: 0.7
      },
      gemini: {
        enabled: false,
        apiKey: '',
        model: 'gemini-pro',
        maxTokens: 1000,
        temperature: 0.7
      },
      claude: {
        enabled: false,
        apiKey: '',
        model: 'claude-3-sonnet-20240229',
        maxTokens: 1000,
        temperature: 0.7
      },
      system: {
        defaultProvider: 'openai',
        fallbackEnabled: true,
        rateLimitPerMinute: 60,
        maxRetries: 3,
        timeout: 30000
      }
    }
  });
});

// Usage stats endpoint
app.get('/api/config/usage-stats', (req, res) => {
  console.log('📊 Usage stats requested');
  res.json({
    success: true,
    data: {
      today: {
        totalRequests: 245,
        successfulRequests: 230,
        failedRequests: 15,
        averageResponseTime: 1250
      },
      thisMonth: {
        totalRequests: 8500,
        successfulRequests: 8100,
        failedRequests: 400,
        averageResponseTime: 1100
      },
      byProvider: {
        openai: 150,
        gemini: 60,
        claude: 25,
        huggingface: 10
      }
    }
  });
});

// Admin dashboard endpoint
app.get('/api/admin/dashboard', (req, res) => {
  console.log('📊 Admin dashboard requested');
  res.json({
    success: true,
    data: {
      overview: {
        totalUsersRegistered: 156,
        totalAssessmentsTaken: 89,
        totalReportsDownloaded: 52,
        totalDataDeleted: 45
      },
      weekly: {
        newUsers: 8,
        newAssessments: 6,
        reportsDownloaded: 4
      },
      monthly: {
        newUsers: 23,
        newAssessments: 18,
        reportsDownloaded: 15
      },
      dataCompliance: {
        usersWithActiveData: 44,
        usersWithDeletedData: 45,
        pendingDeletions: 3,
        compliancePercentage: 89,
        complianceStatus: 'Good'
      },
      trends: {
        assessmentCompletionRate: 85,
        reportDownloadRate: 68
      },
      lastUpdated: new Date()
    },
    notice: 'GDPR-compliant admin dashboard - aggregate statistics only'
  });
});

// Health check endpoint
app.get('/api/health-check', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'AI Health Assessment Platform API (Simplified)',
    version: '1.0.0',
    status: 'Running',
    endpoints: [
      'GET /api/config - API configuration',
      'POST /api/admin/login - Admin login', 
      'GET /api/admin/dashboard - Admin dashboard',
      'GET /api/config/ai-providers - AI providers config',
      'GET /api/config/usage-stats - Usage statistics',
      'GET /api/health-check - Health check'
    ]
  });
});

const PORT = 5002; // Use a different port to avoid conflicts

const server = app.listen(PORT, () => {
  console.log(`✅ Simple API server running on port ${PORT}`);
  console.log(`🔗 Available at: http://localhost:${PORT}`);
  console.log(`📋 Frontend should connect to: http://localhost:${PORT}/api/config`);
  console.log(`🎯 This server provides the basic API endpoints for the admin panel to work`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Server shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});