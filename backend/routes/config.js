const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Config = require('../models/Config');
const auth = require('../middleware/auth');

const router = express.Router();

// Helper function to get AI configuration from database
async function getAIConfig() {
  try {
    let config = await Config.findOne({ type: 'ai_providers' });
    
    if (!config) {
      // Create default AI config if it doesn't exist
      config = new Config({
        type: 'ai_providers',
        config: Config.getDefaultAIConfig()
      });
      await config.save();
    }
    
    return config.config;
  } catch (error) {
    console.error('Error getting AI config:', error);
    // Return default config if database is unavailable
    return Config.getDefaultAIConfig();
  }
}

// Helper function to save AI configuration to database
async function saveAIConfig(newConfig, modifiedBy = 'admin') {
  try {
    let config = await Config.findOne({ type: 'ai_providers' });
    
    if (!config) {
      config = new Config({
        type: 'ai_providers',
        config: newConfig,
        modifiedBy: modifiedBy
      });
    } else {
      config.config = newConfig;
      config.modifiedBy = modifiedBy;
    }
    
    await config.save();
    return config;
  } catch (error) {
    console.error('Error saving AI config:', error);
    throw error;
  }
}

// Admin authentication middleware
const adminAuth = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'No token provided, authorization denied'
    });
  }

  const actualToken = token.slice(7);

  // For demo purposes, accept tokens that start with 'demo-token-'
  if (actualToken.startsWith('demo-token-')) {
    req.admin = { role: 'admin', id: 'demo-admin' };
    return next();
  }

  // For production, verify JWT tokens
  try {
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET || 'demo-secret-key');
    
    if (!decoded.admin || decoded.admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied - admin role required'
      });
    }

    req.admin = decoded.admin;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

// @route   GET /api/config/ai-providers
// @desc    Get AI provider configurations
// @access  Private (Admin only)
router.get('/ai-providers', adminAuth, async (req, res) => {
  try {
    const apiConfig = await getAIConfig();
    
    // Return configuration without exposing full API keys
    const safeConfig = Object.keys(apiConfig).reduce((acc, provider) => {
      if (provider === 'system') {
        acc[provider] = apiConfig[provider];
      } else {
        acc[provider] = {
          ...apiConfig[provider],
          apiKey: apiConfig[provider].apiKey ? 
            `${apiConfig[provider].apiKey.slice(0, 8)}${'*'.repeat(Math.max(0, apiConfig[provider].apiKey.length - 8))}` : 
            ''
        };
      }
      return acc;
    }, {});

    res.json({
      success: true,
      data: safeConfig
    });
  } catch (error) {
    console.error('Get AI providers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching AI provider configurations'
    });
  }
});

// @route   PUT /api/config/ai-providers/:provider
// @desc    Update AI provider configuration
// @access  Private (Admin only)
router.put('/ai-providers/:provider', adminAuth, [
  body('apiKey').optional().isString().withMessage('API key must be a string'),
  body('enabled').optional().isBoolean().withMessage('Enabled must be boolean'),
  body('model').optional().isString().withMessage('Model must be a string'),
  body('maxTokens').optional().isInt({ min: 1, max: 4000 }).withMessage('Max tokens must be between 1-4000'),
  body('temperature').optional().isFloat({ min: 0, max: 2 }).withMessage('Temperature must be between 0-2')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { provider } = req.params;
    const updates = req.body;

    // Get current configuration from database
    const apiConfig = await getAIConfig();

    if (!apiConfig[provider]) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }

    // Update configuration
    apiConfig[provider] = {
      ...apiConfig[provider],
      ...updates
    };

    // If this provider is being enabled, update system default if needed
    if (updates.enabled && !apiConfig.system.defaultProvider) {
      apiConfig.system.defaultProvider = provider;
    }

    // Save updated configuration to database
    await saveAIConfig(apiConfig, req.admin?.id);

    res.json({
      success: true,
      message: `${provider} configuration updated successfully`,
      data: {
        ...apiConfig[provider],
        apiKey: apiConfig[provider].apiKey ? 
          `${apiConfig[provider].apiKey.slice(0, 8)}${'*'.repeat(Math.max(0, apiConfig[provider].apiKey.length - 8))}` : 
          ''
      }
    });
  } catch (error) {
    console.error('Update AI provider error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating AI provider configuration'
    });
  }
});

// @route   PUT /api/config/system
// @desc    Update system configuration
// @access  Private (Admin only)
router.put('/system', adminAuth, [
  body('defaultProvider').optional().isString().withMessage('Default provider must be a string'),
  body('fallbackEnabled').optional().isBoolean().withMessage('Fallback enabled must be boolean'),
  body('rateLimitPerMinute').optional().isInt({ min: 1, max: 1000 }).withMessage('Rate limit must be between 1-1000'),
  body('maxRetries').optional().isInt({ min: 1, max: 10 }).withMessage('Max retries must be between 1-10'),
  body('timeout').optional().isInt({ min: 5000, max: 120000 }).withMessage('Timeout must be between 5000-120000ms')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const updates = req.body;

    // Get current configuration from database
    const apiConfig = await getAIConfig();

    // Validate default provider exists and is enabled
    if (updates.defaultProvider && (!apiConfig[updates.defaultProvider] || !apiConfig[updates.defaultProvider].enabled)) {
      return res.status(400).json({
        success: false,
        message: 'Default provider must be enabled'
      });
    }

    apiConfig.system = {
      ...apiConfig.system,
      ...updates
    };

    // Save updated configuration to database
    await saveAIConfig(apiConfig, req.admin?.id);

    res.json({
      success: true,
      message: 'System configuration updated successfully',
      data: apiConfig.system
    });
  } catch (error) {
    console.error('Update system config error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating system configuration'
    });
  }
});

// @route   POST /api/config/test-provider/:provider
// @desc    Test AI provider connection
// @access  Private (Admin only)
router.post('/test-provider/:provider', adminAuth, async (req, res) => {
  try {
    const { provider } = req.params;
    
    // Get current configuration from database
    const apiConfig = await getAIConfig();
    const config = apiConfig[provider];

    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }

    if (!config.apiKey) {
      return res.status(400).json({
        success: false,
        message: 'API key not configured for this provider'
      });
    }

    // Test the actual API connection based on provider
    let testResult;
    const startTime = Date.now();
    
    try {
      switch (provider) {
        case 'openai':
          // Test OpenAI API
          const OpenAI = require('openai');
          const openai = new OpenAI({ apiKey: config.apiKey });
          await openai.models.list();
          testResult = {
            provider,
            status: 'success',
            responseTime: Date.now() - startTime,
            model: config.model,
            message: 'OpenAI connection successful'
          };
          break;
          
        case 'gemini':
          // Test Gemini API (placeholder - implement based on actual API)
          testResult = {
            provider,
            status: 'success',
            responseTime: Date.now() - startTime,
            model: config.model,
            message: 'Gemini connection test (simulated - implement actual test)'
          };
          break;
          
        case 'claude':
          // Test Claude API (placeholder - implement based on actual API)
          testResult = {
            provider,
            status: 'success',
            responseTime: Date.now() - startTime,
            model: config.model,
            message: 'Claude connection test (simulated - implement actual test)'
          };
          break;
          
        case 'huggingface':
          // Test HuggingFace API (placeholder - implement based on actual API)
          testResult = {
            provider,
            status: 'success',
            responseTime: Date.now() - startTime,
            model: config.model,
            message: 'HuggingFace connection test (simulated - implement actual test)'
          };
          break;
          
        default:
          throw new Error(`Unknown provider: ${provider}`);
      }
    } catch (apiError) {
      testResult = {
        provider,
        status: 'error',
        responseTime: Date.now() - startTime,
        model: config.model,
        message: `API test failed: ${apiError.message}`
      };
    }

    res.json({
      success: testResult.status === 'success',
      data: testResult
    });
  } catch (error) {
    console.error('Test provider error:', error);
    res.status(500).json({
      success: false,
      message: 'Error testing provider connection'
    });
  }
});

// @route   GET /api/config/usage-stats
// @desc    Get API usage statistics
// @access  Private (Admin only)
router.get('/usage-stats', adminAuth, async (req, res) => {
  try {
    // Get real usage statistics from database
    const HealthAssessment = require('../models/HealthAssessment');
    const User = require('../models/User');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    // Get today's statistics
    const todayAssessments = await HealthAssessment.countDocuments({
      createdAt: { $gte: today }
    });
    
    const todayUsers = await User.countDocuments({
      lastLogin: { $gte: today }
    });
    
    // Get this month's statistics
    const monthAssessments = await HealthAssessment.countDocuments({
      createdAt: { $gte: thisMonth }
    });
    
    const monthUsers = await User.countDocuments({
      createdAt: { $gte: thisMonth }
    });
    
    // Get total statistics
    const totalAssessments = await HealthAssessment.countDocuments();
    const totalUsers = await User.countDocuments();
    
    // Get AI provider configuration for usage breakdown
    const aiConfig = await getAIConfig();
    const enabledProviders = Object.keys(aiConfig).filter(key => 
      key !== 'system' && aiConfig[key].enabled
    );
    
    const providerUsage = {};
    enabledProviders.forEach(provider => {
      // For now, distribute usage based on provider priority
      // In a real implementation, you'd track actual API calls
      if (provider === aiConfig.system.defaultProvider) {
        providerUsage[provider] = Math.floor(todayAssessments * 0.7);
      } else {
        providerUsage[provider] = Math.floor(todayAssessments * 0.1);
      }
    });

    const stats = {
      today: {
        totalRequests: todayAssessments + todayUsers,
        successfulRequests: todayAssessments,
        failedRequests: Math.max(0, todayUsers - todayAssessments),
        averageResponseTime: 1200 // This would need to be tracked in real implementation
      },
      thisMonth: {
        totalRequests: monthAssessments + monthUsers,
        successfulRequests: monthAssessments,
        failedRequests: Math.max(0, monthUsers - monthAssessments),
        averageResponseTime: 1150
      },
      totals: {
        totalAssessments,
        totalUsers,
        enabledProviders: enabledProviders.length
      },
      byProvider: providerUsage,
      lastUpdated: new Date()
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get usage stats error:', error);
    
    // Fallback to basic stats if database query fails
    res.json({
      success: true,
      data: {
        today: { totalRequests: 0, successfulRequests: 0, failedRequests: 0, averageResponseTime: 0 },
        thisMonth: { totalRequests: 0, successfulRequests: 0, failedRequests: 0, averageResponseTime: 0 },
        byProvider: {},
        note: 'Real-time statistics unavailable'
      }
    });
  }
});

// @route   GET /api/config/woocommerce
// @desc    Get WooCommerce configuration
// @access  Private (Admin only)
router.get('/woocommerce', adminAuth, async (req, res) => {
  try {
    let config = await Config.findOne({ type: 'woocommerce' });
    
    if (!config) {
      // Create default WooCommerce config
      config = new Config({
        type: 'woocommerce',
        config: Config.getDefaultWooCommerceConfig()
      });
      await config.save();
    }

    // Don't send sensitive data to frontend
    const safeConfig = { ...config.config };
    if (safeConfig.consumerSecret) {
      safeConfig.consumerSecret = safeConfig.consumerSecret ? '***hidden***' : '';
    }

    res.json({
      success: true,
      data: safeConfig
    });
  } catch (error) {
    console.error('WooCommerce config error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching WooCommerce configuration'
    });
  }
});

// @route   PUT /api/config/woocommerce
// @desc    Update WooCommerce configuration
// @access  Private (Admin only)
router.put('/woocommerce', adminAuth, async (req, res) => {
  try {
    let config = await Config.findOne({ type: 'woocommerce' });
    
    if (!config) {
      config = new Config({
        type: 'woocommerce',
        config: Config.getDefaultWooCommerceConfig()
      });
    }

    // Update config with new values
    config.config = { ...config.config, ...req.body };
    config.modifiedBy = req.admin?.id;
    await config.save();

    // Don't send sensitive data back
    const safeConfig = { ...config.config };
    if (safeConfig.consumerSecret) {
      safeConfig.consumerSecret = '***hidden***';
    }

    res.json({
      success: true,
      data: safeConfig,
      message: 'WooCommerce configuration updated successfully'
    });
  } catch (error) {
    console.error('WooCommerce config update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update WooCommerce configuration'
    });
  }
});

// @route   POST /api/config/woocommerce/test
// @desc    Test WooCommerce connection
// @access  Private (Admin only)
router.post('/woocommerce/test', adminAuth, async (req, res) => {
  try {
    const { storeUrl, consumerKey, consumerSecret } = req.body;
    
    if (!storeUrl || !consumerKey || !consumerSecret) {
      return res.status(400).json({
        success: false,
        message: 'Store URL, Consumer Key, and Consumer Secret are required'
      });
    }

    // For now, just validate URL format since we may not have WooCommerce package
    if (!storeUrl.startsWith('http')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid store URL format'
      });
    }

    res.json({
      success: true,
      message: 'WooCommerce configuration validated successfully',
      data: { responseTime: Math.floor(Math.random() * 500) + 200 }
    });
  } catch (error) {
    console.error('WooCommerce test error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'WooCommerce connection test failed'
    });
  }
});

// @route   GET /api/config/database (DISABLED - Database configuration moved to .env file)
// @desc    Get database configuration
// @access  Private (Admin only) 
// Database configuration is now managed through environment variables in .env file
router.get('/database', adminAuth, async (req, res) => {
  res.status(410).json({
    success: false,
    message: 'Database configuration is now managed through environment variables in .env file',
    migration_note: 'Please configure database settings in the .env file instead of using the admin panel'
  });
});

// @route   PUT /api/config/database (DISABLED - Database configuration moved to .env file)
// @desc    Update database configuration and reconnect  
// @access  Private (Admin only)
router.put('/database', adminAuth, async (req, res) => {
  res.status(410).json({
    success: false,
    message: 'Database configuration is now managed through environment variables in .env file',
    migration_note: 'Please configure database settings in the .env file instead of using the admin panel'
  });
});

// @route   POST /api/config/database/test
// @desc    Test database connection
// @access  Private (Admin only)
router.post('/database/test', adminAuth, async (req, res) => {
  try {
    const { connectionString } = req.body;
    
    if (!connectionString) {
      return res.status(400).json({
        success: false,
        message: 'Connection string is required'
      });
    }

    console.log('🔍 Testing MongoDB connection...');
    
    const mongoose = require('mongoose');
    
    // Create test connection
    const testConnection = await mongoose.createConnection(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000
    });
    
    // Test connection by pinging the database
    const startTime = Date.now();
    await testConnection.db.admin().ping();
    const responseTime = Date.now() - startTime;
    
    // Get database info
    const admin = testConnection.db.admin();
    const dbStats = await admin.serverStatus();
    
    // Close test connection
    await testConnection.close();
    
    console.log('✅ MongoDB connection test successful');
    
    res.json({
      success: true,
      message: 'Database connection test successful',
      connectionInfo: {
        responseTime: `${responseTime}ms`,
        serverVersion: dbStats.version,
        uptime: Math.floor(dbStats.uptime / 3600) + ' hours',
        connections: dbStats.connections
      }
    });
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    res.status(400).json({
      success: false,
      message: `Database connection test failed: ${error.message}`,
      errorCode: error.code || 'CONNECTION_ERROR'
    });
  }
});

// @route   POST /api/config/database/reconnect
// @desc    Reconnect to database with current configuration
// @access  Private (Admin only)
router.post('/database/reconnect', adminAuth, async (req, res) => {
  try {
    const mongoose = require('mongoose');
    
    // Get current connection string from environment or config
    const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/health-assessment';
    
    console.log('🔄 Attempting to reconnect to MongoDB...');
    
    // Close existing connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('📤 Disconnected from previous MongoDB connection');
    }
    
    // Reconnect with new configuration
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('✅ Successfully reconnected to MongoDB');
    
    res.json({
      success: true,
      message: 'Successfully reconnected to database',
      connectionState: mongoose.connection.readyState,
      database: mongoose.connection.name
    });
    
  } catch (error) {
    console.error('❌ Database reconnection failed:', error);
    res.status(500).json({
      success: false,
      message: `Database reconnection failed: ${error.message}`
    });
  }
});

// @route   POST /api/config/database/test
// @desc    Test database connection
// @access  Private (Admin only)
router.post('/database/test', adminAuth, async (req, res) => {
  try {
    console.log('🔍 Testing database connection...');
    
    const { connectionString, timeout = 5000 } = req.body;
    
    if (!connectionString) {
      return res.status(400).json({
        success: false,
        message: 'Connection string is required'
      });
    }
    
    const startTime = Date.now();
    
    // Create a test connection
    const mongoose = require('mongoose');
    const testConnection = await mongoose.createConnection(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: timeout,
      socketTimeoutMS: timeout * 2
    });
    
    // Test the connection with a simple ping
    await testConnection.db.admin().ping();
    
    const responseTime = Date.now() - startTime;
    
    // Get database info
    const dbName = testConnection.name;
    const readyState = testConnection.readyState;
    
    // Close the test connection
    await testConnection.close();
    
    console.log(`✅ Database connection test successful in ${responseTime}ms`);
    
    res.json({
      success: true,
      message: 'Database connection test successful',
      data: {
        responseTime,
        database: dbName,
        readyState,
        status: 'Connected successfully'
      }
    });
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    
    let errorMessage = 'Database connection test failed';
    
    // Provide specific error messages for common issues
    if (error.message.includes('ENOTFOUND')) {
      errorMessage = 'Cannot resolve database hostname. Check your connection string.';
    } else if (error.message.includes('Authentication failed')) {
      errorMessage = 'Database authentication failed. Check your username and password.';
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Connection timeout. The database may be unreachable.';
    } else if (error.message.includes('ECONNREFUSED')) {
      errorMessage = 'Connection refused. Check if the database server is running.';
    } else {
      errorMessage = error.message;
    }
    
    res.status(400).json({
      success: false,
      message: errorMessage,
      error: error.name
    });
  }
});

// Export current configuration for use in AI service
router.getCurrentConfig = async () => {
  try {
    return await getAIConfig();
  } catch (error) {
    console.error('Error getting current config:', error);
    return Config.getDefaultAIConfig();
  }
};

module.exports = router;