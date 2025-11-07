const mongoose = require('mongoose');

// Temporary assessment data - deleted after report download or manual deletion
const assessmentDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  lifestyle: {
    exercise: {
      type: String,
      enum: ['never', 'rarely', 'sometimes', 'often', 'daily']
    },
    smoking: {
      type: String,
      enum: ['never', 'former', 'occasionally', 'regularly']
    },
    alcohol: {
      type: String,
      enum: ['never', 'rarely', 'moderate', 'heavy']
    },
    sleep: {
      hours: {
        type: Number,
        min: 0,
        max: 24
      },
      quality: {
        type: String,
        enum: ['poor', 'fair', 'good', 'excellent']
      }
    },
    stress: {
      level: {
        type: String,
        enum: ['low', 'moderate', 'high', 'very-high']
      },
      management: {
        type: String,
        enum: ['none', 'some', 'good', 'excellent']
      }
    }
  },
  blood_count: {
    hemoglobin: {
      type: Number,
      min: 0,
      max: 30
    },
    whiteBloodCells: {
      type: Number,
      min: 0
    },
    platelets: {
      type: Number,
      min: 0
    },
    bloodPressure: {
      systolic: {
        type: Number,
        min: 0,
        max: 300
      },
      diastolic: {
        type: Number,
        min: 0,
        max: 200
      }
    },
    cholesterol: {
      total: {
        type: Number,
        min: 0
      },
      hdl: {
        type: Number,
        min: 0
      },
      ldl: {
        type: Number,
        min: 0
      }
    },
    bloodSugar: {
      fasting: {
        type: Number,
        min: 0
      },
      postMeal: {
        type: Number,
        min: 0
      }
    }
  },
  diet: {
    type: {
      type: String,
      enum: ['omnivore', 'vegetarian', 'vegan', 'keto', 'mediterranean', 'other']
    },
    fruits: {
      type: String,
      enum: ['never', 'rarely', 'sometimes', 'daily', 'multiple-daily']
    },
    vegetables: {
      type: String,
      enum: ['never', 'rarely', 'sometimes', 'daily', 'multiple-daily']
    },
    waterIntake: {
      type: Number,
      min: 0,
      max: 10 // liters per day
    },
    processedFoods: {
      type: String,
      enum: ['never', 'rarely', 'sometimes', 'often', 'daily']
    },
    supplements: [{
      name: String,
      dosage: String,
      frequency: String
    }]
  },
  mental_health: {
    mood: {
      type: String,
      enum: ['very-poor', 'poor', 'fair', 'good', 'excellent']
    },
    anxiety: {
      level: {
        type: String,
        enum: ['none', 'mild', 'moderate', 'severe']
      },
      triggers: [String]
    },
    depression: {
      symptoms: {
        type: String,
        enum: ['none', 'mild', 'moderate', 'severe']
      },
      duration: {
        type: String,
        enum: ['none', 'recent', 'months', 'years']
      }
    },
    socialSupport: {
      type: String,
      enum: ['poor', 'fair', 'good', 'excellent']
    },
    workLifeBalance: {
      type: String,
      enum: ['poor', 'fair', 'good', 'excellent']
    }
  },
  assessment_result: {
    overallScore: {
      type: Number,
      min: 0,
      max: 100
    },
    riskFactors: [String],
    recommendations: [String],
    aiInsights: String,
    categories: {
      physical: {
        type: Number,
        min: 0,
        max: 100
      },
      mental: {
        type: Number,
        min: 0,
        max: 100
      },
      lifestyle: {
        type: Number,
        min: 0,
        max: 100
      }
    }
  },
  report_generated: {
    type: Boolean,
    default: false
  },
  reportUrl: {
    type: String // Path to generated PDF file
  },
  reportGeneratedAt: {
    type: Date
  },
  reportDownloaded: {
    type: Boolean,
    default: false
  },
  reportDownloadedAt: {
    type: Date
  },
  reportExpiresAt: {
    type: Date // Auto-delete after 24 hours if not downloaded
  },
  scheduledForDeletion: {
    type: Date
    // TTL index defined below to avoid duplication
  }
}, {
  timestamps: true
});

// Index for efficient queries
assessmentDataSchema.index({ userId: 1, createdAt: -1 });
assessmentDataSchema.index({ scheduledForDeletion: 1 }, { expireAfterSeconds: 0 }); // TTL for immediate deletion
assessmentDataSchema.index({ reportExpiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL for 24-hour report deletion
assessmentDataSchema.index({ report_generated: 1 });
assessmentDataSchema.index({ reportDownloaded: 1 });

// Method to mark report as generated with 24-hour expiration
assessmentDataSchema.methods.markReportGenerated = function(reportUrl) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
  
  this.report_generated = true;
  this.reportUrl = reportUrl;
  this.reportGeneratedAt = now;
  this.reportExpiresAt = expiresAt; // Auto-delete after 24 hours if not downloaded
  
  return this.save();
};

// Method to mark report as downloaded and schedule immediate deletion
assessmentDataSchema.methods.markReportDownloaded = function() {
  this.reportDownloaded = true;
  this.reportDownloadedAt = new Date();
  this.scheduledForDeletion = new Date(); // Immediate deletion via TTL
  return this.save();
};

// Method to mark for deletion (used when report is downloaded)
assessmentDataSchema.methods.markForDeletion = function() {
  this.reportDownloadedAt = new Date();
  this.scheduledForDeletion = new Date(); // Immediate deletion via TTL
  return this.save();
};

// Static method to delete all assessment data for a user
assessmentDataSchema.statics.deleteUserAssessmentData = async function(userId) {
  return await this.deleteMany({ userId: userId });
};

// Static method to get assessment statistics (for admin dashboard)
assessmentDataSchema.statics.getStatistics = async function() {
  const User = mongoose.model('User');
  
  const [
    totalUsers,
    totalAssessments,
    completedAssessments,
    downloadedReports,
    deletedData
  ] = await Promise.all([
    User.countDocuments(),
    this.countDocuments(),
    this.countDocuments({ report_generated: true }),
    this.countDocuments({ reportDownloadedAt: { $exists: true } }),
    // Deleted data count is approximate (users with no current assessment data)
    User.countDocuments().then(async (total) => {
      const usersWithData = await this.distinct('userId');
      return total - usersWithData.length;
    })
  ]);

  // Monthly statistics
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const monthlyStats = await Promise.all([
    User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    this.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    this.countDocuments({ 
      reportDownloadedAt: { $gte: thirtyDaysAgo }
    })
  ]);

  return {
    total: {
      users: totalUsers,
      assessments: totalAssessments,
      completedAssessments: completedAssessments,
      downloadedReports: downloadedReports,
      deletedData: deletedData
    },
    monthly: {
      newUsers: monthlyStats[0],
      newAssessments: monthlyStats[1],
      downloadedReports: monthlyStats[2]
    },
    lastUpdated: new Date()
  };
};

module.exports = mongoose.model('AssessmentData', assessmentDataSchema);