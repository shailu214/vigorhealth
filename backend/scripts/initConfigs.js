const mongoose = require('mongoose');
const Config = require('../models/Config');

async function initConfigs() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/health-assessment', { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    console.log('Connected to MongoDB');

    // Create WooCommerce config if it doesn't exist
    const wooConfig = await Config.findOne({ type: 'woocommerce' });
    if (!wooConfig) {
      await Config.create({
        type: 'woocommerce',
        config: Config.getDefaultWooCommerceConfig()
      });
      console.log('✓ WooCommerce config created');
    } else {
      console.log('✓ WooCommerce config already exists');
    }

    // Create Database config if it doesn't exist
    const dbConfig = await Config.findOne({ type: 'database_config' });
    if (!dbConfig) {
      await Config.create({
        type: 'database_config',
        config: Config.getDefaultDatabaseConfig()
      });
      console.log('✓ Database config created');
    } else {
      console.log('✓ Database config already exists');
    }

    console.log('Configuration initialization completed');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error initializing configs:', error);
    process.exit(1);
  }
}

initConfigs();