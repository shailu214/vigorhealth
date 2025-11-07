const mongoose = require('mongoose');

const healthAssessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous assessments
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  personalInfo: {
    name: {
      type: String,
      required: true,
      encrypted: true
    },
    age: {
      type: Number,
      required: true,
      min: [1, 'Age must be at least 1'],
      max: [120, 'Age cannot exceed 120']
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say'],
      required: true
    },
    height: {
      type: Number,
      required: true,
      min: [50, 'Height must be at least 50cm'],
      max: [300, 'Height cannot exceed 300cm']
    },
    weight: {
      type: Number,
      required: true,
      min: [10, 'Weight must be at least 10kg'],
      max: [500, 'Weight cannot exceed 500kg']
    },
    bmi: {
      type: Number,
      default: function() {
        return (this.weight / ((this.height / 100) ** 2)).toFixed(1);
      }
    }
  },
  
  bloodWork: {
    // Complete Blood Count (CBC)
    hemoglobin: { type: Number, min: 0, max: 30 },
    hematocrit: { type: Number, min: 0, max: 100 },
    rbc: { type: Number, min: 0, max: 10 },
    wbc: { type: Number, min: 0, max: 50 },
    platelets: { type: Number, min: 0, max: 1000 },
    
    // Lipid Panel
    totalCholesterol: { type: Number, min: 0, max: 500 },
    hdlCholesterol: { type: Number, min: 0, max: 200 },
    ldlCholesterol: { type: Number, min: 0, max: 400 },
    triglycerides: { type: Number, min: 0, max: 1000 },
    
    // Glucose and Diabetes
    fastingGlucose: { type: Number, min: 0, max: 500 },
    hba1c: { type: Number, min: 0, max: 20 },
    
    // Liver Function
    alt: { type: Number, min: 0, max: 1000 },
    ast: { type: Number, min: 0, max: 1000 },
    
    // Kidney Function
    creatinine: { type: Number, min: 0, max: 50 },
    bun: { type: Number, min: 0, max: 200 },
    
    // Thyroid
    tsh: { type: Number, min: 0, max: 50 },
    t3: { type: Number, min: 0, max: 20 },
    t4: { type: Number, min: 0, max: 30 },
    
    // Vitamins and Minerals
    vitaminD: { type: Number, min: 0, max: 200 },
    vitaminB12: { type: Number, min: 0, max: 2000 },
    folate: { type: Number, min: 0, max: 100 },
    iron: { type: Number, min: 0, max: 500 },
    ferritin: { type: Number, min: 0, max: 5000 },
    
    // Additional markers
    crp: { type: Number, min: 0, max: 100 }, // C-reactive protein
    
    // Source of data
    dataSource: {
      type: String,
      enum: ['manual', 'ocr_upload'],
      required: true
    },
    uploadedFile: {
      filename: String,
      originalName: String,
      mimetype: String,
      size: Number,
      uploadDate: Date
    }
  },
  
  lifestyle: {
    diet: {
      type: {
        type: String,
        enum: ['omnivore', 'vegetarian', 'vegan', 'keto', 'paleo', 'mediterranean', 'other'],
        required: true
      },
      quality: {
        type: String,
        enum: ['poor', 'fair', 'good', 'excellent'],
        required: true
      },
      fruits_vegetables: {
        type: Number,
        min: 0,
        max: 20,
        required: true
      },
      processed_foods: {
        type: String,
        enum: ['never', 'rarely', 'sometimes', 'often', 'always'],
        required: true
      }
    },
    
    exercise: {
      frequency: {
        type: Number,
        min: 0,
        max: 7,
        required: true
      },
      intensity: {
        type: String,
        enum: ['low', 'moderate', 'high'],
        required: true
      },
      duration: {
        type: Number,
        min: 0,
        max: 300,
        required: true
      },
      type: [{
        type: String,
        enum: ['cardio', 'strength', 'flexibility', 'sports', 'yoga', 'walking']
      }]
    },
    
    sleep: {
      hoursPerNight: {
        type: Number,
        min: 0,
        max: 24,
        required: true
      },
      quality: {
        type: String,
        enum: ['poor', 'fair', 'good', 'excellent'],
        required: true
      },
      bedtime: String,
      wakeTime: String
    },
    
    stress: {
      level: {
        type: String,
        enum: ['low', 'moderate', 'high', 'very_high'],
        required: true
      },
      sources: [{
        type: String,
        enum: ['work', 'family', 'finances', 'health', 'relationships', 'other']
      }],
      management: [{
        type: String,
        enum: ['meditation', 'exercise', 'therapy', 'hobbies', 'social_support', 'none']
      }]
    },
    
    substances: {
      smoking: {
        status: {
          type: String,
          enum: ['never', 'former', 'current'],
          required: true
        },
        frequency: String,
        quitDate: Date
      },
      alcohol: {
        frequency: {
          type: String,
          enum: ['never', 'rarely', 'monthly', 'weekly', 'daily'],
          required: true
        },
        amount: String
      }
    },
    
    hydration: {
      waterIntake: {
        type: Number,
        min: 0,
        max: 10,
        required: true
      },
      unit: {
        type: String,
        enum: ['liters', 'glasses'],
        default: 'glasses'
      }
    }
  },
  
  mentalHealth: {
    mood: {
      type: String,
      enum: ['very_poor', 'poor', 'fair', 'good', 'excellent'],
      required: true
    },
    anxiety: {
      level: {
        type: String,
        enum: ['none', 'mild', 'moderate', 'severe'],
        required: true
      },
      frequency: {
        type: String,
        enum: ['never', 'rarely', 'sometimes', 'often', 'always']
      }
    },
    depression: {
      symptoms: {
        type: String,
        enum: ['none', 'mild', 'moderate', 'severe'],
        required: true
      },
      duration: String
    },
    fatigue: {
      level: {
        type: String,
        enum: ['none', 'mild', 'moderate', 'severe'],
        required: true
      },
      frequency: {
        type: String,
        enum: ['never', 'rarely', 'sometimes', 'often', 'always']
      }
    },
    energy: {
      level: {
        type: String,
        enum: ['very_low', 'low', 'moderate', 'high', 'very_high'],
        required: true
      },
      patterns: String
    },
    cognitiveFunction: {
      memory: {
        type: String,
        enum: ['poor', 'fair', 'good', 'excellent']
      },
      concentration: {
        type: String,
        enum: ['poor', 'fair', 'good', 'excellent']
      },
      mentalClarity: {
        type: String,
        enum: ['poor', 'fair', 'good', 'excellent']
      }
    }
  },
  
  healthScore: {
    overall: {
      type: Number,
      min: 0,
      max: 100
    },
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
  },
  
  riskFactors: [{
    category: {
      type: String,
      enum: ['cardiovascular', 'diabetes', 'metabolic', 'mental_health', 'nutritional', 'lifestyle']
    },
    risk: {
      type: String,
      enum: ['low', 'moderate', 'high', 'very_high']
    },
    description: String,
    recommendations: [String]
  }],
  
  aiAnalysis: {
    summary: {
      type: String,
      encrypted: true
    },
    recommendations: {
      lifestyle: [String],
      diet: [String],
      supplements: [String],
      medical: [String],
      exercise: [String],
      mental_health: [String]
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    model: String,
    analysisDate: {
      type: Date,
      default: Date.now
    }
  },
  
  reportGenerated: {
    type: Boolean,
    default: false
  },
  reportUrl: String,
  reportGeneratedAt: Date,
  
  // GDPR Compliance
  gdprConsent: {
    type: Boolean,
    default: false,
    required: true
  },
  dataRetentionUntil: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    }
  },
  scheduledForDeletion: {
    type: Boolean,
    default: false
  },
  
  // Audit trail
  ipAddress: String,
  userAgent: String,
  
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress'
  }
}, {
  timestamps: true
});

// Indexes for performance
healthAssessmentSchema.index({ userId: 1 });
healthAssessmentSchema.index({ scheduledForDeletion: 1 });
healthAssessmentSchema.index({ createdAt: 1 });

// Virtual for BMI category
healthAssessmentSchema.virtual('bmiCategory').get(function() {
  const bmi = this.personalInfo.bmi;
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
});

// Method to calculate overall health score
healthAssessmentSchema.methods.calculateHealthScore = function() {
  let physicalScore = 70; // Base score
  let mentalScore = 70;
  let lifestyleScore = 70;
  
  // Physical health calculations based on blood work
  if (this.bloodWork) {
    // Example scoring logic - this would be more sophisticated in practice
    if (this.bloodWork.totalCholesterol && this.bloodWork.totalCholesterol > 240) physicalScore -= 10;
    if (this.bloodWork.fastingGlucose && this.bloodWork.fastingGlucose > 126) physicalScore -= 15;
    if (this.bloodWork.hemoglobin && (this.bloodWork.hemoglobin < 12 || this.bloodWork.hemoglobin > 17)) physicalScore -= 5;
  }
  
  // Mental health scoring
  if (this.mentalHealth) {
    const moodScores = { very_poor: -20, poor: -10, fair: 0, good: 10, excellent: 20 };
    mentalScore += moodScores[this.mentalHealth.mood] || 0;
    
    const anxietyScores = { none: 10, mild: 5, moderate: -5, severe: -15 };
    mentalScore += anxietyScores[this.mentalHealth.anxiety.level] || 0;
  }
  
  // Lifestyle scoring
  if (this.lifestyle) {
    // Exercise
    if (this.lifestyle.exercise.frequency >= 3) lifestyleScore += 10;
    
    // Sleep
    const sleepHours = this.lifestyle.sleep.hoursPerNight;
    if (sleepHours >= 7 && sleepHours <= 9) lifestyleScore += 10;
    else lifestyleScore -= 5;
    
    // Smoking
    if (this.lifestyle.substances.smoking.status === 'current') lifestyleScore -= 20;
    
    // Stress
    const stressScores = { low: 10, moderate: 0, high: -10, very_high: -20 };
    lifestyleScore += stressScores[this.lifestyle.stress.level] || 0;
  }
  
  // Ensure scores are within bounds
  physicalScore = Math.max(0, Math.min(100, physicalScore));
  mentalScore = Math.max(0, Math.min(100, mentalScore));
  lifestyleScore = Math.max(0, Math.min(100, lifestyleScore));
  
  const overallScore = Math.round((physicalScore + mentalScore + lifestyleScore) / 3);
  
  this.healthScore = {
    overall: overallScore,
    physical: physicalScore,
    mental: mentalScore,
    lifestyle: lifestyleScore
  };
  
  return this.healthScore;
};

// Method to identify risk factors
healthAssessmentSchema.methods.identifyRiskFactors = function() {
  const risks = [];
  
  // Cardiovascular risk
  if (this.bloodWork && this.bloodWork.totalCholesterol > 240) {
    risks.push({
      category: 'cardiovascular',
      risk: 'high',
      description: 'Elevated total cholesterol levels',
      recommendations: ['Consider dietary changes', 'Increase physical activity', 'Consult with healthcare provider']
    });
  }
  
  // Diabetes risk
  if (this.bloodWork && this.bloodWork.fastingGlucose > 126) {
    risks.push({
      category: 'diabetes',
      risk: 'high',
      description: 'Elevated fasting glucose levels',
      recommendations: ['Monitor blood sugar regularly', 'Reduce refined carbohydrate intake', 'Increase physical activity']
    });
  }
  
  // BMI-related risks
  const bmi = this.personalInfo.bmi;
  if (bmi >= 30) {
    risks.push({
      category: 'metabolic',
      risk: 'high',
      description: 'Obesity (BMI ≥ 30)',
      recommendations: ['Implement structured weight loss plan', 'Increase physical activity', 'Consider nutritional counseling']
    });
  }
  
  // Mental health risks
  if (this.mentalHealth && (this.mentalHealth.depression.symptoms === 'severe' || this.mentalHealth.anxiety.level === 'severe')) {
    risks.push({
      category: 'mental_health',
      risk: 'high',
      description: 'Severe mental health symptoms detected',
      recommendations: ['Seek professional mental health support', 'Consider therapy or counseling', 'Implement stress management techniques']
    });
  }
  
  this.riskFactors = risks;
  return risks;
};

// TTL index for automatic deletion based on GDPR compliance
healthAssessmentSchema.index(
  { dataRetentionUntil: 1 },
  { 
    expireAfterSeconds: 0,
    partialFilterExpression: { scheduledForDeletion: true }
  }
);

module.exports = mongoose.model('HealthAssessment', healthAssessmentSchema);