const mongoose = require('mongoose');

const ConfigSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true,
    enum: ['ai_providers', 'system_settings', 'email_config', 'woocommerce', 'database_config']
  },
  config: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  version: {
    type: String,
    default: '1.0.0'
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Update lastModified on save
ConfigSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

// Default AI Providers Configuration
ConfigSchema.statics.getDefaultAIConfig = function() {
  return {
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
    huggingface: {
      enabled: false,
      apiKey: '',
      model: 'microsoft/DialoGPT-large',
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
  };
};

// Default WooCommerce Configuration
ConfigSchema.statics.getDefaultWooCommerceConfig = function() {
  return {
    enabled: false,
    storeUrl: '',
    consumerKey: '',
    consumerSecret: '',
    version: 'wc/v3',
    verifySSL: true,
    queryStringAuth: false,
    timeout: 30000,
    syncSettings: {
      syncProducts: true,
      syncOrders: false,
      syncCustomers: false,
      syncInterval: 3600000, // 1 hour
      lastSync: null
    },
    webhooks: {
      enabled: false,
      secret: '',
      endpoints: [
        'product.created',
        'product.updated',
        'order.created',
        'order.updated'
      ]
    }
  };
};

// Default Database Configuration
ConfigSchema.statics.getDefaultDatabaseConfig = function() {
  return {
    mongodb: {
      connectionString: process.env.MONGODB_URI || 'mongodb://localhost:27017/health-assessment',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
        bufferMaxEntries: 0
      }
    },
    backups: {
      enabled: false,
      schedule: '0 2 * * *', // Daily at 2 AM
      retentionDays: 30,
      s3Config: {
        bucket: '',
        region: '',
        accessKeyId: '',
        secretAccessKey: ''
      }
    },
    maintenance: {
      indexOptimization: true,
      collectionStats: true,
      performanceMonitoring: true
    }
  };
};

module.exports = mongoose.model('Config', ConfigSchema);