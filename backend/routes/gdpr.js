const express = require('express');
const HealthAssessment = require('../models/HealthAssessment');
const User = require('../models/User');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/gdpr/consent
// @desc    Record GDPR consent
// @access  Public
router.post('/consent', optionalAuth, async (req, res) => {
  try {
    const { consent, sessionId } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    // Record consent for assessment session
    const assessment = await HealthAssessment.findOne({ sessionId });
    if (assessment) {
      assessment.gdprConsent = consent;
      assessment.ipAddress = ipAddress;
      assessment.userAgent = userAgent;
      await assessment.save();
    }

    // If user is authenticated, update their consent
    if (req.user) {
      const user = await User.findById(req.user.id);
      if (user) {
        if (consent) {
          await user.giveGDPRConsent(ipAddress, userAgent);
        } else {
          await user.revokeGDPRConsent();
        }
      }
    }

    res.json({
      success: true,
      message: `GDPR consent ${consent ? 'granted' : 'revoked'} successfully`,
      data: {
        consent,
        timestamp: new Date().toISOString(),
        sessionId
      }
    });

  } catch (error) {
    console.error('GDPR consent error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing GDPR consent'
    });
  }
});

// @route   DELETE /api/gdpr/delete-data
// @desc    Delete all user data (GDPR right to be forgotten)
// @access  Public
router.delete('/delete-data', async (req, res) => {
  try {
    const { sessionId, userId, email } = req.body;

    if (!sessionId && !userId && !email) {
      return res.status(400).json({
        success: false,
        message: 'Session ID, User ID, or email is required'
      });
    }

    let deletedCount = 0;
    const deletedItems = [];

    // Delete assessment data by session ID
    if (sessionId) {
      const assessment = await HealthAssessment.findOneAndDelete({ sessionId });
      if (assessment) {
        deletedCount++;
        deletedItems.push(`Assessment session: ${sessionId}`);
      }
    }

    // Delete user data by user ID or email
    if (userId || email) {
      const userQuery = userId ? { _id: userId } : { email };
      const user = await User.findOne(userQuery);
      
      if (user) {
        // Delete all assessments for this user
        const userAssessments = await HealthAssessment.deleteMany({ userId: user._id });
        if (userAssessments.deletedCount > 0) {
          deletedCount += userAssessments.deletedCount;
          deletedItems.push(`${userAssessments.deletedCount} user assessments`);
        }

        // Delete user account
        await User.findByIdAndDelete(user._id);
        deletedCount++;
        deletedItems.push(`User account: ${user.email}`);
      }
    }

    if (deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'No data found to delete'
      });
    }

    res.json({
      success: true,
      message: 'Data deleted successfully as per GDPR requirements',
      data: {
        deletedCount,
        deletedItems,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('GDPR data deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting data'
    });
  }
});

// @route   GET /api/gdpr/data-export
// @desc    Export all user data (GDPR right to data portability)
// @access  Public
router.get('/data-export', async (req, res) => {
  try {
    const { sessionId, userId, email } = req.query;

    if (!sessionId && !userId && !email) {
      return res.status(400).json({
        success: false,
        message: 'Session ID, User ID, or email is required'
      });
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      exportedBy: 'GDPR Data Export Request',
      data: {}
    };

    // Export assessment data by session ID
    if (sessionId) {
      const assessment = await HealthAssessment.findOne({ sessionId }).lean();
      if (assessment) {
        // Remove internal MongoDB fields
        delete assessment._id;
        delete assessment.__v;
        exportData.data.assessment = assessment;
      }
    }

    // Export user data by user ID or email
    if (userId || email) {
      const userQuery = userId ? { _id: userId } : { email };
      const user = await User.findOne(userQuery).select('-password').lean();
      
      if (user) {
        // Remove internal MongoDB fields
        delete user._id;
        delete user.__v;
        exportData.data.user = user;

        // Get all assessments for this user
        const userAssessments = await HealthAssessment.find({ userId: user._id }).lean();
        exportData.data.assessments = userAssessments.map(assessment => {
          delete assessment._id;
          delete assessment.__v;
          delete assessment.userId;
          return assessment;
        });
      }
    }

    if (Object.keys(exportData.data).length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No data found for export'
      });
    }

    // Set headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="gdpr-data-export-${Date.now()}.json"`);

    res.json(exportData);

  } catch (error) {
    console.error('GDPR data export error:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting data'
    });
  }
});

// @route   GET /api/gdpr/privacy-policy
// @desc    Get privacy policy information
// @access  Public
router.get('/privacy-policy', (req, res) => {
  try {
    const privacyPolicy = {
      lastUpdated: '2025-11-06',
      version: '1.0',
      summary: {
        dataCollection: 'We collect health and personal information only with your explicit consent.',
        dataUsage: 'Data is used solely for generating personalized health assessments and recommendations.',
        dataRetention: 'Data is automatically deleted after 30 days unless you request earlier deletion.',
        dataSharing: 'We do not share your personal data with third parties without your consent.',
        userRights: 'You have the right to access, export, correct, or delete your data at any time.'
      },
      rights: [
        'Right to be informed about data processing',
        'Right to access your personal data',
        'Right to rectification of incorrect data',
        'Right to erasure (right to be forgotten)',
        'Right to restrict processing',
        'Right to data portability',
        'Right to object to processing'
      ],
      contact: {
        email: 'privacy@healthassessment.com',
        phone: '+1-800-PRIVACY',
        address: 'Privacy Officer, Health Assessment Platform'
      }
    };

    res.json({
      success: true,
      data: privacyPolicy
    });

  } catch (error) {
    console.error('Privacy policy error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving privacy policy'
    });
  }
});

// @route   POST /api/gdpr/data-correction
// @desc    Request data correction
// @access  Public
router.post('/data-correction', async (req, res) => {
  try {
    const { sessionId, userId, corrections, contactEmail } = req.body;

    if (!sessionId && !userId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID or User ID is required'
      });
    }

    if (!corrections || typeof corrections !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Corrections data is required'
      });
    }

    // In a real implementation, you'd:
    // 1. Log the correction request
    // 2. Queue for manual review if needed
    // 3. Apply automatic corrections for simple fields
    // 4. Send confirmation email

    // For now, we'll just acknowledge the request
    const correctionRequest = {
      id: `correction-${Date.now()}`,
      timestamp: new Date().toISOString(),
      sessionId,
      userId,
      corrections,
      contactEmail,
      status: 'pending',
      message: 'Your data correction request has been received and will be processed within 30 days.'
    };

    res.json({
      success: true,
      message: 'Data correction request submitted successfully',
      data: correctionRequest
    });

  } catch (error) {
    console.error('Data correction error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing data correction request'
    });
  }
});

module.exports = router;