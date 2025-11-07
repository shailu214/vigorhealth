const Config = require('../models/Config');

/**
 * WooCommerce Service for handling e-commerce integration
 */
class WooCommerceService {
  constructor() {
    this.config = null;
    this.client = null;
  }

  /**
   * Initialize WooCommerce client with current configuration
   */
  async initialize() {
    try {
      const configDoc = await Config.findOne({ type: 'woocommerce' });
      if (!configDoc || !configDoc.config.enabled) {
        throw new Error('WooCommerce integration not enabled');
      }

      this.config = configDoc.config;
      
      // For now, we'll use a mock client until WooCommerce package is installed
      this.client = {
        get: this.mockRequest.bind(this),
        post: this.mockRequest.bind(this),
        put: this.mockRequest.bind(this),
        delete: this.mockRequest.bind(this)
      };

      return true;
    } catch (error) {
      console.error('WooCommerce initialization error:', error);
      return false;
    }
  }

  /**
   * Mock request method for testing (replace with actual WooCommerce client)
   */
  async mockRequest(endpoint, params = {}) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));

    const mockData = {
      products: this.getMockProducts(params.per_page || 10, params.page || 1),
      orders: this.getMockOrders(params.per_page || 10, params.page || 1),
      customers: this.getMockCustomers(params.per_page || 10, params.page || 1),
      categories: this.getMockCategories(),
      'system_status': this.getMockSystemStatus()
    };

    const endpointKey = endpoint.split('?')[0];
    return {
      data: mockData[endpointKey] || [],
      status: 200,
      headers: {
        'x-wp-total': mockData[endpointKey]?.length || 0,
        'x-wp-totalpages': 1
      }
    };
  }

  /**
   * Get products from WooCommerce store
   */
  async getProducts(params = {}) {
    if (!this.client) {
      await this.initialize();
    }

    try {
      const response = await this.client.get('products', {
        per_page: params.per_page || 20,
        page: params.page || 1,
        status: params.status || 'publish',
        category: params.category || '',
        search: params.search || '',
        orderby: params.orderby || 'date',
        order: params.order || 'desc'
      });

      return {
        success: true,
        data: response.data,
        pagination: {
          total: parseInt(response.headers['x-wp-total']),
          totalPages: parseInt(response.headers['x-wp-totalpages']),
          currentPage: params.page || 1,
          perPage: params.per_page || 20
        }
      };
    } catch (error) {
      console.error('Get products error:', error);
      return {
        success: false,
        message: 'Failed to fetch products from WooCommerce'
      };
    }
  }

  /**
   * Get orders from WooCommerce store
   */
  async getOrders(params = {}) {
    if (!this.client) {
      await this.initialize();
    }

    try {
      const response = await this.client.get('orders', {
        per_page: params.per_page || 20,
        page: params.page || 1,
        status: params.status || 'any',
        customer: params.customer || '',
        after: params.after || '',
        before: params.before || '',
        orderby: params.orderby || 'date',
        order: params.order || 'desc'
      });

      return {
        success: true,
        data: response.data,
        pagination: {
          total: parseInt(response.headers['x-wp-total']),
          totalPages: parseInt(response.headers['x-wp-totalpages']),
          currentPage: params.page || 1,
          perPage: params.per_page || 20
        }
      };
    } catch (error) {
      console.error('Get orders error:', error);
      return {
        success: false,
        message: 'Failed to fetch orders from WooCommerce'
      };
    }
  }

  /**
   * Get customers from WooCommerce store
   */
  async getCustomers(params = {}) {
    if (!this.client) {
      await this.initialize();
    }

    try {
      const response = await this.client.get('customers', {
        per_page: params.per_page || 20,
        page: params.page || 1,
        search: params.search || '',
        orderby: params.orderby || 'registered_date',
        order: params.order || 'desc'
      });

      return {
        success: true,
        data: response.data,
        pagination: {
          total: parseInt(response.headers['x-wp-total']),
          totalPages: parseInt(response.headers['x-wp-totalpages']),
          currentPage: params.page || 1,
          perPage: params.per_page || 20
        }
      };
    } catch (error) {
      console.error('Get customers error:', error);
      return {
        success: false,
        message: 'Failed to fetch customers from WooCommerce'
      };
    }
  }

  /**
   * Get product categories
   */
  async getCategories() {
    if (!this.client) {
      await this.initialize();
    }

    try {
      const response = await this.client.get('products/categories', {
        per_page: 100,
        hide_empty: true
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get categories error:', error);
      return {
        success: false,
        message: 'Failed to fetch categories from WooCommerce'
      };
    }
  }

  /**
   * Get store statistics
   */
  async getStoreStats() {
    try {
      const [products, orders, customers] = await Promise.all([
        this.getProducts({ per_page: 1 }),
        this.getOrders({ per_page: 1 }),
        this.getCustomers({ per_page: 1 })
      ]);

      const recentOrders = await this.getOrders({ 
        per_page: 10, 
        status: 'processing,completed' 
      });

      const totalRevenue = recentOrders.success 
        ? recentOrders.data.reduce((sum, order) => sum + parseFloat(order.total || 0), 0)
        : 0;

      return {
        success: true,
        data: {
          totalProducts: products.success ? products.pagination?.total || 0 : 0,
          totalOrders: orders.success ? orders.pagination?.total || 0 : 0,
          totalCustomers: customers.success ? customers.pagination?.total || 0 : 0,
          totalRevenue: totalRevenue.toFixed(2),
          recentOrders: recentOrders.success ? recentOrders.data.slice(0, 5) : []
        }
      };
    } catch (error) {
      console.error('Get store stats error:', error);
      return {
        success: false,
        message: 'Failed to fetch store statistics'
      };
    }
  }

  // Mock data generators
  getMockProducts(perPage = 10, page = 1) {
    const products = [];
    for (let i = 0; i < perPage; i++) {
      const id = (page - 1) * perPage + i + 1;
      products.push({
        id: id,
        name: `Health Product ${id}`,
        type: 'simple',
        status: 'publish',
        featured: Math.random() > 0.7,
        catalog_visibility: 'visible',
        description: `<p>Health supplement product description ${id}</p>`,
        short_description: `Brief description for product ${id}`,
        sku: `HEALTH-${id.toString().padStart(4, '0')}`,
        price: (Math.random() * 100 + 10).toFixed(2),
        regular_price: (Math.random() * 100 + 10).toFixed(2),
        sale_price: '',
        stock_status: Math.random() > 0.2 ? 'instock' : 'outofstock',
        manage_stock: true,
        stock_quantity: Math.floor(Math.random() * 100),
        categories: [
          { id: Math.floor(Math.random() * 5) + 1, name: 'Supplements' }
        ],
        images: [
          {
            id: id,
            src: `https://via.placeholder.com/300x300?text=Product+${id}`,
            name: `product-${id}.jpg`
          }
        ],
        date_created: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        date_modified: new Date().toISOString()
      });
    }
    return products;
  }

  getMockOrders(perPage = 10, page = 1) {
    const orders = [];
    const statuses = ['pending', 'processing', 'completed', 'cancelled'];
    
    for (let i = 0; i < perPage; i++) {
      const id = (page - 1) * perPage + i + 1000;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      orders.push({
        id: id,
        parent_id: 0,
        number: id.toString(),
        order_key: `wc_order_${id}`,
        created_via: 'checkout',
        version: '8.0.0',
        status: status,
        currency: 'USD',
        date_created: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        total: (Math.random() * 200 + 20).toFixed(2),
        total_tax: '0.00',
        customer_id: Math.floor(Math.random() * 100) + 1,
        billing: {
          first_name: `Customer${i}`,
          last_name: 'Smith',
          email: `customer${i}@example.com`,
          phone: '+1234567890'
        },
        line_items: [
          {
            id: id * 10,
            name: `Health Product ${i + 1}`,
            product_id: i + 1,
            quantity: Math.floor(Math.random() * 3) + 1,
            price: (Math.random() * 50 + 10).toFixed(2)
          }
        ]
      });
    }
    return orders;
  }

  getMockCustomers(perPage = 10, page = 1) {
    const customers = [];
    for (let i = 0; i < perPage; i++) {
      const id = (page - 1) * perPage + i + 1;
      customers.push({
        id: id,
        date_created: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        email: `customer${id}@example.com`,
        first_name: `Customer${id}`,
        last_name: 'Smith',
        role: 'customer',
        username: `customer${id}`,
        billing: {
          first_name: `Customer${id}`,
          last_name: 'Smith',
          email: `customer${id}@example.com`,
          phone: '+1234567890'
        },
        orders_count: Math.floor(Math.random() * 10),
        total_spent: (Math.random() * 500).toFixed(2)
      });
    }
    return customers;
  }

  getMockCategories() {
    return [
      { id: 1, name: 'Vitamins & Supplements', slug: 'vitamins-supplements' },
      { id: 2, name: 'Fitness Equipment', slug: 'fitness-equipment' },
      { id: 3, name: 'Healthy Foods', slug: 'healthy-foods' },
      { id: 4, name: 'Health Monitoring', slug: 'health-monitoring' },
      { id: 5, name: 'Personal Care', slug: 'personal-care' }
    ];
  }

  getMockSystemStatus() {
    return {
      environment: {
        home_url: this.config?.storeUrl || 'https://example-store.com',
        site_url: this.config?.storeUrl || 'https://example-store.com',
        version: '8.0.0',
        wp_version: '6.3'
      },
      database: {
        wc_version: '8.0.0',
        database_version: '8.0.0',
        database_prefix: 'wp_',
        maxmind_geoip_database: 'GeoLite2-Country.mmdb'
      }
    };
  }
}

module.exports = new WooCommerceService();