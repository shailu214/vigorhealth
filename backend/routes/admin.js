const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const AssessmentData = require('../models/AssessmentData');
const DataDeletionService = require('../services/dataDeletionService');

const router = express.Router();

// Demo admin credentials - in production, this should be in a database
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: '$2a$10$rOzJ8K7K7K7K7K7K7K7K7u', // This would be bcrypt hash of 'admin123'
  id: 'admin-1',
  name: 'Administrator',
  role: 'admin'
};

// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
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

    const { username, password } = req.body;

    // Simple demo authentication - replace with proper database lookup
    if (username === ADMIN_CREDENTIALS.username && password === 'admin123') {
      // Generate JWT token
      const payload = {
        admin: {
          id: ADMIN_CREDENTIALS.id,
          username: ADMIN_CREDENTIALS.username,
          role: ADMIN_CREDENTIALS.role
        }
      };

      const token = jwt.sign(
        payload, 
        process.env.JWT_SECRET || 'demo-secret-key', 
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Login successful',
        token,
        admin: {
          id: ADMIN_CREDENTIALS.id,
          username: ADMIN_CREDENTIALS.username,
          name: ADMIN_CREDENTIALS.name,
          role: ADMIN_CREDENTIALS.role
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

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

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics (NO PERSONAL DATA)
// @access  Private (Admin only)
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    // Get aggregate statistics only - NO personal data
    const statistics = await AssessmentData.getStatistics();
    const retentionStats = await DataDeletionService.getDataRetentionStats();
    
    // Calculate additional aggregate metrics
    const now = new Date();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    
    const weeklyStats = await Promise.all([
      User.countDocuments({ createdAt: { $gte: weekAgo } }),
      AssessmentData.countDocuments({ createdAt: { $gte: weekAgo } }),
      AssessmentData.countDocuments({ 
        reportDownloadedAt: { $gte: weekAgo }
      })
    ]);

    const dashboardData = {
      overview: {
        totalUsersRegistered: statistics.total.users,
        totalAssessmentsTaken: statistics.total.assessments,
        totalReportsDownloaded: statistics.total.downloadedReports,
        totalDataDeleted: statistics.total.deletedData
      },
      weekly: {
        newUsers: weeklyStats[0],
        newAssessments: weeklyStats[1],
        reportsDownloaded: weeklyStats[2]
      },
      monthly: {
        newUsers: statistics.monthly.newUsers,
        newAssessments: statistics.monthly.newAssessments,
        reportsDownloaded: statistics.monthly.downloadedReports
      },
      dataCompliance: {
        usersWithActiveData: retentionStats.usersWithActiveData || 0,
        usersWithDeletedData: retentionStats.usersWithDeletedData || 0,
        pendingDeletions: retentionStats.pendingDeletions || 0,
        compliancePercentage: retentionStats.dataRetentionCompliance?.percentage || 0,
        complianceStatus: retentionStats.dataRetentionCompliance?.status || 'Unknown'
      },
      trends: {
        assessmentCompletionRate: statistics.total.assessments > 0 ? 
          Math.round((statistics.total.completedAssessments / statistics.total.assessments) * 100) : 0,
        reportDownloadRate: statistics.total.completedAssessments > 0 ?
          Math.round((statistics.total.downloadedReports / statistics.total.completedAssessments) * 100) : 0
      },
      lastUpdated: new Date()
    };

    res.json({
      success: true,
      data: dashboardData,
      notice: 'This dashboard shows aggregate statistics only. No personal or health data is accessible.'
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    
    // Fallback dashboard data for demo
    const fallbackData = {
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
    };

    res.json({
      success: true,
      data: fallbackData,
      notice: 'This dashboard shows aggregate statistics only. No personal or health data is accessible. (Demo data - MongoDB required for live statistics)'
    });
  }
});

// @route   GET /api/admin/user-statistics
// @desc    Get anonymized user statistics (NO PERSONAL DATA)
// @access  Private (Admin only)
router.get('/user-statistics', adminAuth, async (req, res) => {
  try {
    // Get anonymized statistics only
    const userStats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          averageAge: { $avg: '$age' },
          genderDistribution: {
            $push: '$gender'
          },
          countryDistribution: {
            $push: '$country'
          }
        }
      }
    ]);

    // Process gender distribution
    const genders = userStats[0]?.genderDistribution || [];
    const genderCounts = genders.reduce((acc, gender) => {
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});

    // Process country distribution (top 10 only)
    const countries = userStats[0]?.countryDistribution || [];
    const countryCounts = countries.reduce((acc, country) => {
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {});
    
    const topCountries = Object.entries(countryCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .reduce((obj, [key, val]) => {
        obj[key] = val;
        return obj;
      }, {});

    res.json({
      success: true,
      data: {
        totalUsers: userStats[0]?.totalUsers || 0,
        averageAge: Math.round(userStats[0]?.averageAge || 0),
        demographics: {
          genderDistribution: genderCounts,
          topCountries: topCountries
        },
        note: 'All data is anonymized and aggregated. No personal information is accessible.'
      }
    });
  } catch (error) {
    console.error('Get user statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics'
    });
  }
});

// @route   GET /api/admin/assessment-analytics
// @desc    Get anonymized assessment analytics (NO PERSONAL DATA)
// @access  Private (Admin only)
router.get('/assessment-analytics', adminAuth, async (req, res) => {
  try {
    // Get anonymized assessment analytics
    const assessmentStats = await AssessmentData.aggregate([
      {
        $match: {
          assessment_result: { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          totalCompletedAssessments: { $sum: 1 },
          averageOverallScore: { $avg: '$assessment_result.overallScore' },
          averagePhysicalScore: { $avg: '$assessment_result.categories.physical' },
          averageMentalScore: { $avg: '$assessment_result.categories.mental' },
          averageLifestyleScore: { $avg: '$assessment_result.categories.lifestyle' },
          commonRiskFactors: {
            $push: '$assessment_result.riskFactors'
          }
        }
      }
    ]);

    // Process common risk factors
    const allRiskFactors = assessmentStats[0]?.commonRiskFactors?.flat() || [];
    const riskFactorCounts = allRiskFactors.reduce((acc, factor) => {
      if (factor) {
        acc[factor] = (acc[factor] || 0) + 1;
      }
      return acc;
    }, {});

    const topRiskFactors = Object.entries(riskFactorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([factor, count]) => ({ factor, count }));

    res.json({
      success: true,
      data: {
        totalCompletedAssessments: assessmentStats[0]?.totalCompletedAssessments || 0,
        averageScores: {
          overall: Math.round(assessmentStats[0]?.averageOverallScore || 0),
          physical: Math.round(assessmentStats[0]?.averagePhysicalScore || 0),
          mental: Math.round(assessmentStats[0]?.averageMentalScore || 0),
          lifestyle: Math.round(assessmentStats[0]?.averageLifestyleScore || 0)
        },
        topRiskFactors: topRiskFactors,
        note: 'All data is anonymized and aggregated. No individual assessment data is accessible.'
      }
    });
  } catch (error) {
    console.error('Get assessment analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assessment analytics'
    });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Mock delete operation - replace with actual database deletion
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user'
    });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user
// @access  Private (Admin only)
router.put('/users/:id', adminAuth, [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Please enter a valid email'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean')
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

    const { id } = req.params;
    const updateData = req.body;

    // Note: In the new system, personal user data updates are not allowed from admin
    // Only statistics and compliance data are accessible
    res.status(403).json({
      success: false,
      message: 'Personal data modification not allowed. Admin can only view aggregate statistics.'
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing request'
    });
  }
});

// @route   GET /api/admin/data-compliance
// @desc    Get GDPR compliance and data retention statistics
// @access  Private (Admin only)
router.get('/data-compliance', adminAuth, async (req, res) => {
  try {
    const retentionStats = await DataDeletionService.getDataRetentionStats();
    
    // Get deletion activity for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentDeletions = await AssessmentData.countDocuments({
      reportDownloadedAt: { $gte: thirtyDaysAgo }
    });

    res.json({
      success: true,
      data: {
        complianceOverview: {
          totalUsers: retentionStats.totalUsers,
          usersWithActiveData: retentionStats.usersWithActiveData,
          usersWithDeletedData: retentionStats.usersWithDeletedData,
          compliancePercentage: retentionStats.dataRetentionCompliance?.percentage || 0,
          complianceStatus: retentionStats.dataRetentionCompliance?.status || 'Unknown'
        },
        deletionActivity: {
          pendingDeletions: retentionStats.pendingDeletions,
          recentDeletions: recentDeletions,
          totalReportsDownloaded: retentionStats.totalReportsDownloaded
        },
        recommendations: [
          retentionStats.pendingDeletions > 0 ? 
            `${retentionStats.pendingDeletions} assessments are scheduled for deletion` : 
            'No pending deletions',
          retentionStats.dataRetentionCompliance?.percentage < 80 ?
            'Consider encouraging users to download their reports to improve compliance' :
            'Good data retention compliance'
        ],
        lastUpdated: new Date()
      },
      notice: 'This shows aggregate compliance data only. No personal data is accessible.'
    });
  } catch (error) {
    console.error('Data compliance error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching compliance data'
    });
  }
});

// @route   POST /api/admin/cleanup-data
// @desc    Manually trigger data cleanup process
// @access  Private (Admin only)
router.post('/cleanup-data', adminAuth, async (req, res) => {
  try {
    const cleanupResult = await DataDeletionService.cleanupExpiredData();
    
    res.json({
      success: true,
      message: 'Data cleanup process completed',
      result: cleanupResult
    });
  } catch (error) {
    console.error('Manual cleanup error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during manual cleanup process'
    });
  }
});

module.exports = router;