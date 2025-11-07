const express = require('express');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const User = require('../models/User');
const AssessmentData = require('../models/AssessmentData');
const { generateAIRecommendations } = require('../services/aiService');
const { generateHealthReport } = require('../services/reportService');
const DataDeletionService = require('../services/dataDeletionService');

const router = express.Router();

// @route   POST /api/health/start-assessment
// @desc    Start a new health assessment by creating user
// @access  Public (with GDPR consent)
router.post('/start-assessment', [
  body('name').trim().isLength({ min: 1, max: 50 }).withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().isLength({ min: 1 }).withMessage('Phone number is required'),
  body('age').isInt({ min: 1, max: 150 }).withMessage('Age must be between 1 and 150'),
  body('gender').isIn(['male', 'female', 'other', 'prefer-not-to-say']).withMessage('Invalid gender'),
  body('country').trim().isLength({ min: 1 }).withMessage('Country is required'),
  body('gdprConsent').isBoolean().equals('true').withMessage('GDPR consent is required')
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

    const { name, email, phone, age, gender, country } = req.body;

    // Create or find existing user (permanent data)
    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      user = new User({
        name,
        email: email.toLowerCase(),
        phone,
        age,
        gender,
        country
      });
      await user.save();
    } else {
      // Update user info if it exists (in case of changed details)
      user.name = name;
      user.phone = phone;
      user.age = age;
      user.gender = gender;
      user.country = country;
      await user.save();
    }

    // Create new assessment data (temporary)
    const assessmentData = new AssessmentData({
      userId: user._id
    });
    await assessmentData.save();

    res.status(201).json({
      success: true,
      message: 'Health assessment started successfully',
      userId: user._id,
      assessmentId: assessmentData._id,
      sessionInfo: {
        userCreated: !await User.findOne({ email: email.toLowerCase(), createdAt: { $lt: user.createdAt } }),
        assessmentStarted: new Date()
      }
    });

  } catch (error) {
    console.error('Start assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error starting assessment'
    });
  }
});

// @route   PUT /api/health/update-lifestyle/:assessmentId
// @desc    Update lifestyle information
// @access  Public
router.put('/update-lifestyle/:assessmentId', async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const lifestyleData = req.body;

    const assessment = await AssessmentData.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Update lifestyle data
    assessment.lifestyle = {
      exercise: lifestyleData.exercise,
      smoking: lifestyleData.smoking,
      alcohol: lifestyleData.alcohol,
      sleep: lifestyleData.sleep,
      stress: lifestyleData.stress
    };

    await assessment.save();

    res.json({
      success: true,
      message: 'Lifestyle information updated successfully',
      data: {
        lifestyle: assessment.lifestyle
      }
    });

  } catch (error) {
    console.error('Update lifestyle error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating lifestyle information'
    });
  }
});

// @route   PUT /api/health/update-blood-count/:assessmentId
// @desc    Update blood count data
// @access  Public
router.put('/update-blood-count/:assessmentId', async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const bloodCountData = req.body;

    const assessment = await AssessmentData.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Update blood count data
    assessment.blood_count = {
      hemoglobin: bloodCountData.hemoglobin,
      whiteBloodCells: bloodCountData.whiteBloodCells,
      platelets: bloodCountData.platelets,
      bloodPressure: bloodCountData.bloodPressure,
      cholesterol: bloodCountData.cholesterol,
      bloodSugar: bloodCountData.bloodSugar
    };

    await assessment.save();

    res.json({
      success: true,
      message: 'Blood count data updated successfully',
      data: {
        blood_count: assessment.blood_count
      }
    });

  } catch (error) {
    console.error('Update blood count error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating blood count data'
    });
  }
});

// @route   PUT /api/health/update-diet/:assessmentId
// @desc    Update diet information
// @access  Public
router.put('/update-diet/:assessmentId', async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const dietData = req.body;

    const assessment = await AssessmentData.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Update diet data
    assessment.diet = {
      type: dietData.type,
      fruits: dietData.fruits,
      vegetables: dietData.vegetables,
      waterIntake: dietData.waterIntake,
      processedFoods: dietData.processedFoods,
      supplements: dietData.supplements || []
    };

    await assessment.save();

    res.json({
      success: true,
      message: 'Diet information updated successfully',
      data: {
        diet: assessment.diet
      }
    });

  } catch (error) {
    console.error('Update diet error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating diet information'
    });
  }
});

// @route   PUT /api/health/update-mental-health/:assessmentId
// @desc    Update mental health data
// @access  Public
router.put('/update-mental-health/:assessmentId', async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const mentalHealthData = req.body;

    const assessment = await AssessmentData.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Update mental health data
    assessment.mental_health = {
      mood: mentalHealthData.mood,
      anxiety: mentalHealthData.anxiety,
      depression: mentalHealthData.depression,
      socialSupport: mentalHealthData.socialSupport,
      workLifeBalance: mentalHealthData.workLifeBalance
    };

    await assessment.save();

    res.json({
      success: true,
      message: 'Mental health data updated successfully',
      data: {
        mental_health: assessment.mental_health
      }
    });

  } catch (error) {
    console.error('Update mental health error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating mental health data'
    });
  }
});

// @route   POST /api/health/analyze/:assessmentId
// @desc    Analyze health data and generate recommendations
// @access  Public
router.post('/analyze/:assessmentId', async (req, res) => {
  try {
    const { assessmentId } = req.params;

    const assessment = await AssessmentData.findById(assessmentId).populate('userId');
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Generate AI analysis based on the assessment data
    const aiAnalysis = await generateAIRecommendations(assessment);
    
    // Calculate overall score (simplified scoring for demo)
    let overallScore = 70; // Base score
    
    // Adjust based on lifestyle factors
    if (assessment.lifestyle?.exercise === 'daily') overallScore += 10;
    if (assessment.lifestyle?.smoking === 'never') overallScore += 5;
    if (assessment.lifestyle?.alcohol === 'never' || assessment.lifestyle?.alcohol === 'rarely') overallScore += 5;
    
    // Adjust based on mental health
    if (assessment.mental_health?.mood === 'excellent') overallScore += 10;
    if (assessment.mental_health?.anxiety?.level === 'none') overallScore += 5;
    
    overallScore = Math.min(100, Math.max(0, overallScore)); // Keep within 0-100

    // Update assessment with results
    assessment.assessment_result = {
      overallScore,
      riskFactors: aiAnalysis.riskFactors || [],
      recommendations: aiAnalysis.recommendations || [],
      aiInsights: aiAnalysis.summary || 'Analysis completed',
      categories: {
        physical: Math.floor(Math.random() * 20) + 70, // Demo scores
        mental: Math.floor(Math.random() * 20) + 70,
        lifestyle: Math.floor(Math.random() * 20) + 70
      }
    };

    await assessment.save();

    res.json({
      success: true,
      message: 'Health analysis completed successfully',
      data: {
        overallScore,
        riskFactors: assessment.assessment_result.riskFactors,
        recommendations: assessment.assessment_result.recommendations,
        aiInsights: assessment.assessment_result.aiInsights,
        categories: assessment.assessment_result.categories
      }
    });

  } catch (error) {
    console.error('Health analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during health analysis'
    });
  }
});

// @route   GET /api/health/assessment/:assessmentId
// @desc    Get assessment data
// @access  Public
router.get('/assessment/:assessmentId', async (req, res) => {
  try {
    const { assessmentId } = req.params;

    const assessment = await AssessmentData.findById(assessmentId).populate('userId');
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    res.json({
      success: true,
      data: {
        assessmentId: assessment._id,
        user: {
          name: assessment.userId.name,
          age: assessment.userId.age,
          gender: assessment.userId.gender
        },
        lifestyle: assessment.lifestyle,
        blood_count: assessment.blood_count,
        diet: assessment.diet,
        mental_health: assessment.mental_health,
        assessment_result: assessment.assessment_result,
        report_generated: assessment.report_generated,
        createdAt: assessment.createdAt,
        updatedAt: assessment.updatedAt
      }
    });

  } catch (error) {
    console.error('Get assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving assessment'
    });
  }
});

// @route   POST /api/health/generate-report/:assessmentId
// @desc    Generate PDF health report (available for 24 hours)
// @access  Public
router.post('/generate-report/:assessmentId', async (req, res) => {
  try {
    const { assessmentId } = req.params;

    const assessment = await AssessmentData.findById(assessmentId).populate('userId');
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    if (!assessment.assessment_result) {
      return res.status(400).json({
        success: false,
        message: 'Assessment must be analyzed before generating report'
      });
    }

    if (assessment.report_generated) {
      return res.status(400).json({
        success: false,
        message: 'Report has already been generated for this assessment'
      });
    }

    // Generate PDF report
    const reportFileName = await generateHealthReport(assessment);
    
    // Mark report as generated with 24-hour expiration
    await assessment.markReportGenerated(reportFileName);

    res.json({
      success: true,
      message: 'Health report generated successfully',
      data: {
        assessmentId: assessment._id,
        reportGenerated: true,
        expiresAt: assessment.reportExpiresAt,
        downloadUrl: `/api/health/download-report/${assessment._id}`
      },
      important: [
        'Report is available for download for 24 hours only',
        'Report can only be downloaded ONCE',
        'After download, all assessment data will be permanently deleted',
        'Only your basic profile information will remain'
      ]
    });

  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error generating health report'
    });
  }
});

// @route   GET /api/health/download-report/:assessmentId
// @desc    Download PDF report (ONE TIME ONLY - deletes everything after download)
// @access  Public
router.get('/download-report/:assessmentId', async (req, res) => {
  try {
    const { assessmentId } = req.params;

    const assessment = await AssessmentData.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found or report has already been downloaded'
      });
    }

    if (!assessment.report_generated || !assessment.reportUrl) {
      return res.status(400).json({
        success: false,
        message: 'Report has not been generated yet'
      });
    }

    if (assessment.reportDownloaded) {
      return res.status(403).json({
        success: false,
        message: 'Report has already been downloaded. Each report can only be downloaded once for security.'
      });
    }

    // Check if report has expired
    if (assessment.reportExpiresAt && new Date() > assessment.reportExpiresAt) {
      // Clean up expired report
      await DataDeletionService.deleteUserAssessmentData(assessment.userId);
      
      return res.status(410).json({
        success: false,
        message: 'Report has expired (24-hour limit). Assessment data has been deleted for privacy compliance.'
      });
    }

    const path = require('path');
    const fs = require('fs');
    
    const reportsDir = path.join(__dirname, '../reports');
    const filePath = path.join(reportsDir, assessment.reportUrl);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Report file not found. It may have been automatically deleted.'
      });
    }

    // Set download headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="health-report-${new Date().toISOString().split('T')[0]}.pdf"`);
    
    // Stream file to client
    const fileStream = fs.createReadStream(filePath);
    
    fileStream.on('error', (error) => {
      console.error('File stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Error downloading report'
        });
      }
    });

    fileStream.on('end', async () => {
      try {
        // CRITICAL: After successful download, immediately delete everything
        
        // 1. Mark assessment as downloaded and schedule for deletion
        await assessment.markReportDownloaded();
        
        // 2. Delete the PDF file from server
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting report file:', err);
          } else {
            console.log(`✅ Report file deleted: ${assessment.reportUrl}`);
          }
        });

        // 3. The TTL index will automatically delete the assessment document
        
        console.log(`✅ Report downloaded and data deletion initiated for assessment: ${assessmentId}`);
        
      } catch (error) {
        console.error('Error during post-download cleanup:', error);
      }
    });

    // Start file download
    fileStream.pipe(res);

  } catch (error) {
    console.error('Download report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during report download'
    });
  }
});

// @route   GET /api/health/report-status/:assessmentId
// @desc    Check report generation and download status
// @access  Public
router.get('/report-status/:assessmentId', async (req, res) => {
  try {
    const { assessmentId } = req.params;

    const assessment = await AssessmentData.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    const now = new Date();
    const isExpired = assessment.reportExpiresAt && now > assessment.reportExpiresAt;

    res.json({
      success: true,
      data: {
        assessmentId: assessment._id,
        reportGenerated: assessment.report_generated,
        reportDownloaded: assessment.reportDownloaded,
        reportExpired: isExpired,
        reportGeneratedAt: assessment.reportGeneratedAt,
        reportExpiresAt: assessment.reportExpiresAt,
        reportDownloadedAt: assessment.reportDownloadedAt,
        canDownload: assessment.report_generated && !assessment.reportDownloaded && !isExpired,
        downloadUrl: assessment.report_generated && !assessment.reportDownloaded && !isExpired ? 
          `/api/health/download-report/${assessment._id}` : null,
        status: assessment.reportDownloaded ? 'Downloaded (Data Deleted)' :
               isExpired ? 'Expired (Data Deleted)' :
               assessment.report_generated ? 'Ready for Download' :
               'Report Not Generated'
      }
    });

  } catch (error) {
    console.error('Report status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error checking report status'
    });
  }
});

// @route   DELETE /api/health/delete-data/:userId
// @desc    Manual deletion of all assessment data (GDPR compliance)
// @access  Public
router.delete('/delete-data/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete all assessment data for the user
    const deletionResult = await DataDeletionService.deleteUserAssessmentData(userId);

    if (deletionResult.success) {
      res.json({
        success: true,
        message: 'All assessment data has been permanently deleted',
        deletedCount: deletionResult.deletedCount
      });
    } else {
      res.status(500).json({
        success: false,
        message: deletionResult.message
      });
    }

  } catch (error) {
    console.error('Delete assessment data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting assessment data'
    });
  }
});

// @route   GET /api/health/statistics
// @desc    Get assessment statistics (for admin dashboard)
// @access  Public (no sensitive data)
router.get('/statistics', async (req, res) => {
  try {
    const statistics = await AssessmentData.getStatistics();
    
    res.json({
      success: true,
      data: statistics
    });

  } catch (error) {
    console.error('Get statistics error:', error);
    
    // Fallback statistics for demo (when MongoDB is not available)
    const fallbackStats = {
      total: {
        users: 156,
        assessments: 89,
        completedAssessments: 76,
        downloadedReports: 52,
        deletedData: 45
      },
      monthly: {
        newUsers: 23,
        newAssessments: 18,
        downloadedReports: 15
      },
      lastUpdated: new Date()
    };

    res.json({
      success: true,
      data: fallbackStats,
      note: 'Demo statistics - MongoDB connection required for live data'
    });
  }
});

module.exports = router;