// MongoDB initialization script for Docker
// This script sets up the initial database structure and indexes

// Switch to the healthassessment database
db = db.getSiblingDB('healthassessment');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'password', 'role'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
          description: 'must be a valid email address'
        },
        password: {
          bsonType: 'string',
          minLength: 6,
          description: 'must be a string with at least 6 characters'
        },
        role: {
          enum: ['user', 'admin'],
          description: 'must be either user or admin'
        }
      }
    }
  }
});

db.createCollection('healthassessments', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'responses'],
      properties: {
        userId: {
          bsonType: 'objectId',
          description: 'must be a valid ObjectId'
        },
        responses: {
          bsonType: 'object',
          description: 'must be an object containing assessment responses'
        },
        score: {
          bsonType: 'number',
          minimum: 0,
          maximum: 100,
          description: 'must be a number between 0 and 100'
        }
      }
    }
  }
});

db.createCollection('configs', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['type'],
      properties: {
        type: {
          enum: ['ai', 'woocommerce', 'general'],
          description: 'must be a valid configuration type'
        }
      }
    }
  }
});

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ createdAt: 1 });

db.healthassessments.createIndex({ userId: 1 });
db.healthassessments.createIndex({ createdAt: -1 });
db.healthassessments.createIndex({ score: -1 });

db.configs.createIndex({ type: 1 });
db.configs.createIndex({ 'aiProviders.name': 1 });

// Create default admin user (change password in production!)
const defaultAdmin = {
  email: 'admin@vigorhealth.com',
  password: '$2b$10$8Kn/JjXz9WqM3VxZ4YzJXeF.xE5HfKqzOvC7uY1M2B3P4Q5R6S7T8U', // 'admin123'
  role: 'admin',
  firstName: 'Admin',
  lastName: 'User',
  isEmailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

// Insert admin user if it doesn't exist
const existingAdmin = db.users.findOne({ email: 'admin@vigorhealth.com' });
if (!existingAdmin) {
  db.users.insertOne(defaultAdmin);
  print('Default admin user created: admin@vigorhealth.com / admin123');
} else {
  print('Admin user already exists');
}

// Create default AI configuration
const defaultAIConfig = {
  type: 'ai',
  aiProviders: [
    {
      name: 'OpenAI',
      apiKey: '',
      model: 'gpt-3.5-turbo',
      enabled: false,
      maxTokens: 1000,
      temperature: 0.7
    },
    {
      name: 'Gemini',
      apiKey: '',
      model: 'gemini-pro',
      enabled: false,
      maxTokens: 1000,
      temperature: 0.7
    },
    {
      name: 'Claude',
      apiKey: '',
      model: 'claude-3-haiku-20240307',
      enabled: false,
      maxTokens: 1000,
      temperature: 0.7
    },
    {
      name: 'HuggingFace',
      apiKey: '',
      model: 'microsoft/DialoGPT-medium',
      enabled: false,
      maxTokens: 1000,
      temperature: 0.7
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
};

// Insert AI config if it doesn't exist
const existingAIConfig = db.configs.findOne({ type: 'ai' });
if (!existingAIConfig) {
  db.configs.insertOne(defaultAIConfig);
  print('Default AI configuration created');
} else {
  print('AI configuration already exists');
}

// Create default WooCommerce configuration
const defaultWooConfig = {
  type: 'woocommerce',
  woocommerce: {
    url: '',
    consumerKey: '',
    consumerSecret: '',
    enabled: false,
    webhookSecret: '',
    productSync: true,
    orderSync: true
  },
  createdAt: new Date(),
  updatedAt: new Date()
};

// Insert WooCommerce config if it doesn't exist
const existingWooConfig = db.configs.findOne({ type: 'woocommerce' });
if (!existingWooConfig) {
  db.configs.insertOne(defaultWooConfig);
  print('Default WooCommerce configuration created');
} else {
  print('WooCommerce configuration already exists');
}

print('MongoDB initialization completed successfully!');
print('Database: healthassessment');
print('Collections: users, healthassessments, configs');
print('Indexes created for optimal performance');
print('Default configurations inserted');
print('');
print('IMPORTANT: Change the default admin password in production!');
print('Admin credentials: admin@vigorhealth.com / admin123');