const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization');

    // Check if no token
    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied'
      });
    }

    // Extract token without 'Bearer ' prefix
    const actualToken = token.slice(7);

    try {
      // Verify token
      const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
      
      // Get user from token
      const user = await User.findById(decoded.user.id);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Token is not valid - user not found'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated'
        });
      }

      // Add user to request object
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      };
      
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired'
        });
      }
      
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

// Optional auth middleware - doesn't fail if no token provided
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');

    if (token && token.startsWith('Bearer ')) {
      const actualToken = token.slice(7);
      
      try {
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user.id);
        
        if (user && user.isActive) {
          req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name
          };
        }
      } catch (error) {
        // Silently fail for optional auth
        console.log('Optional auth failed:', error.message);
      }
    }
    
    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next(); // Continue without auth
  }
};

// Admin functionality removed

// GDPR consent check middleware
const gdprConsent = async (req, res, next) => {
  try {
    // For anonymous users, check if consent is provided in request
    if (!req.user) {
      const { gdprConsent } = req.body;
      if (!gdprConsent) {
        return res.status(400).json({
          success: false,
          message: 'GDPR consent is required to process health data'
        });
      }
      return next();
    }

    // For authenticated users, check stored consent
    const user = await User.findById(req.user.id);
    if (!user.gdprConsent.consentGiven) {
      return res.status(400).json({
        success: false,
        message: 'GDPR consent is required to process health data'
      });
    }

    next();
  } catch (error) {
    console.error('GDPR consent middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error checking GDPR consent'
    });
  }
};

module.exports = {
  auth,
  optionalAuth,
  gdprConsent
};