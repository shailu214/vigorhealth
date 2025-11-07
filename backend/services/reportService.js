const PDFDocument = require('pdfkit');
const fs = require('fs').promises;
const path = require('path');

/**
 * Generate a comprehensive health report PDF for the new AssessmentData structure
 * @param {Object} assessmentData - AssessmentData document with populated userId
 * @returns {String} File path to the generated PDF (relative to reports directory)
 */
async function generateHealthReport(assessmentData) {
  try {
    const doc = new PDFDocument({ 
      size: 'A4', 
      margin: 50,
      info: {
        Title: 'Health Assessment Report',
        Author: 'AI Health Assessment Platform',
        Subject: 'Personal Health Analysis',
        Keywords: 'health, assessment, wellness, AI'
      }
    });

    // Create reports directory if it doesn't exist
    const reportsDir = path.join(__dirname, '../reports');
    try {
      await fs.access(reportsDir);
    } catch {
      await fs.mkdir(reportsDir, { recursive: true });
    }

    // Generate unique filename with user ID and timestamp for security
    const userId = assessmentData.userId._id || assessmentData.userId;
    const timestamp = Date.now();
    const fileName = `health-report-${userId}-${timestamp}.pdf`;
    const filePath = path.join(reportsDir, fileName);
    
    // Pipe PDF to file
    doc.pipe(require('fs').createWriteStream(filePath));

    // Add content to PDF with new data structure
    await addReportContent(doc, assessmentData);

    // Finalize PDF
    doc.end();

    // Wait for file to be written
    await new Promise((resolve) => {
      doc.on('end', resolve);
    });

    // Return just the filename (not full path) for security
    return fileName;

  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate health report');
  }
}

/**
 * Add content to the PDF document
 * @param {PDFDocument} doc - PDF document
 * @param {Object} assessmentData - AssessmentData with new structure
 */
async function addReportContent(doc, assessmentData) {
  const primaryColor = '#3B82F6';
  const secondaryColor = '#6B7280';
  const accentColor = '#10B981';

  // Header
  addHeader(doc, primaryColor);
  
  // Patient Information (from userId population)
  addPatientInfo(doc, assessmentData, primaryColor);
  
  // Health Scores (from assessment_result)
  if (assessmentData.assessment_result) {
    addHealthScores(doc, assessmentData, primaryColor, accentColor);
  }
  
  // Blood Count Results
  if (assessmentData.blood_count && Object.keys(assessmentData.blood_count).length > 0) {
    addBloodCountSection(doc, assessmentData, primaryColor);
  }
  
  // Lifestyle Analysis
  if (assessmentData.lifestyle) {
    addLifestyleSection(doc, assessmentData, primaryColor);
  }
  
  // Diet Analysis
  if (assessmentData.diet) {
    addDietSection(doc, assessmentData, primaryColor);
  }
  
  // Mental Health Assessment
  if (assessmentData.mental_health) {
    addMentalHealthSection(doc, assessmentData, primaryColor);
  }
  
  // Risk Factors and AI Recommendations
  if (assessmentData.assessment_result) {
    if (assessmentData.assessment_result.riskFactors && assessmentData.assessment_result.riskFactors.length > 0) {
      addRiskFactorsSection(doc, assessmentData, primaryColor);
    }
    
    if (assessmentData.assessment_result.recommendations && assessmentData.assessment_result.recommendations.length > 0) {
      addRecommendationsSection(doc, assessmentData, primaryColor);
    }
  }
  
  // Disclaimer
  addDisclaimer(doc, secondaryColor);
  
  // Footer
  addFooter(doc, secondaryColor);
}

function addHeader(doc, color) {
  doc.fontSize(24)
     .fillColor(color)
     .text('Health Assessment Report', 50, 50, { align: 'center' });
  
  doc.fontSize(12)
     .fillColor('#6B7280')
     .text(`Generated on ${new Date().toLocaleDateString()}`, 50, 80, { align: 'center' });
  
  // Add a line
  doc.moveTo(50, 100)
     .lineTo(545, 100)
     .strokeColor(color)
     .stroke();
  
  doc.moveDown(2);
}

function addPatientInfo(doc, assessmentData, color) {
  const startY = doc.y;
  
  doc.fontSize(16)
     .fillColor(color)
     .text('Personal Information', 50, startY);
  
  doc.moveDown(0.5);
  
  if (assessmentData.userId) {
    const user = assessmentData.userId;
    doc.fontSize(11)
       .fillColor('#000000');
    
    doc.text(`Name: ${user.name || 'N/A'}`, 50);
    doc.text(`Age: ${user.age || 'N/A'} years`, 50);
    doc.text(`Gender: ${user.gender || 'N/A'}`, 50);
    doc.text(`Country: ${user.country || 'N/A'}`, 50);
    doc.text(`Assessment Date: ${new Date(assessmentData.createdAt).toLocaleDateString()}`, 50);
  }
  
  doc.moveDown(1);
}

function addHealthScores(doc, assessmentData, primaryColor, accentColor) {
  if (!assessmentData.assessment_result) return;
  
  const startY = doc.y;
  
  doc.fontSize(16)
     .fillColor(primaryColor)
     .text('Health Assessment Results', 50, startY);
  
  doc.moveDown(0.5);
  
  const result = assessmentData.assessment_result;
  
  // Overall Score
  doc.fontSize(14)
     .fillColor('#000000')
     .text(`Overall Health Score: ${result.overallScore || 'N/A'}/100`, 50);
  
  doc.moveDown(0.5);
  
  // Category scores if available
  if (result.categories) {
    const scoreData = [
      { label: 'Physical Health', score: result.categories.physical, color: accentColor },
      { label: 'Mental Health', score: result.categories.mental, color: '#8B5CF6' },
      { label: 'Lifestyle', score: result.categories.lifestyle, color: '#F59E0B' }
    ];
    
    scoreData.forEach((item, index) => {
      if (item.score !== undefined) {
        const y = doc.y + (index * 25);
        
        // Score label
        doc.fontSize(11)
           .fillColor('#000000')
           .text(`${item.label}: ${item.score}/100`, 50, y);
        
        // Score bar
        const barWidth = 200;
        const scoreWidth = (item.score / 100) * barWidth;
        
        // Background bar
        doc.rect(250, y - 2, barWidth, 10)
           .fillColor('#E5E7EB')
           .fill();
        
        // Score bar
        doc.rect(250, y - 2, scoreWidth, 10)
           .fillColor(item.color)
           .fill();
      }
    });
    
    doc.y += (scoreData.filter(item => item.score !== undefined).length * 25);
  }
  
  // AI Insights
  if (result.aiInsights) {
    doc.moveDown(1);
    doc.fontSize(12)
       .fillColor(primaryColor)
       .text('AI Health Analysis:', 50);
    
    doc.fontSize(10)
       .fillColor('#000000')
       .text(result.aiInsights, 50, doc.y, { width: 495, align: 'justify' });
  }
  
  doc.moveDown(1);
}

function addBloodCountSection(doc, assessmentData, color) {
  doc.addPage();
  
  doc.fontSize(16)
     .fillColor(color)
     .text('Blood Count Results', 50, 50);
  
  doc.moveDown(0.5);
  
  const bloodCount = assessmentData.blood_count;
  
  // Blood pressure
  if (bloodCount.bloodPressure) {
    doc.fontSize(11)
       .fillColor('#000000')
       .text(`Blood Pressure: ${bloodCount.bloodPressure.systolic}/${bloodCount.bloodPressure.diastolic} mmHg`, 50);
  }
  
  // Basic blood counts
  if (bloodCount.hemoglobin) {
    doc.text(`Hemoglobin: ${bloodCount.hemoglobin} g/dL`, 50);
  }
  
  if (bloodCount.whiteBloodCells) {
    doc.text(`White Blood Cells: ${bloodCount.whiteBloodCells} cells/μL`, 50);
  }
  
  if (bloodCount.platelets) {
    doc.text(`Platelets: ${bloodCount.platelets} cells/μL`, 50);
  }
  
  // Cholesterol
  if (bloodCount.cholesterol) {
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor(color).text('Cholesterol Profile:', 50);
    doc.fontSize(11).fillColor('#000000');
    
    if (bloodCount.cholesterol.total) {
      doc.text(`Total Cholesterol: ${bloodCount.cholesterol.total} mg/dL`, 50);
    }
    if (bloodCount.cholesterol.hdl) {
      doc.text(`HDL Cholesterol: ${bloodCount.cholesterol.hdl} mg/dL`, 50);
    }
    if (bloodCount.cholesterol.ldl) {
      doc.text(`LDL Cholesterol: ${bloodCount.cholesterol.ldl} mg/dL`, 50);
    }
  }
  
  // Blood Sugar
  if (bloodCount.bloodSugar) {
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor(color).text('Blood Sugar:', 50);
    doc.fontSize(11).fillColor('#000000');
    
    if (bloodCount.bloodSugar.fasting) {
      doc.text(`Fasting Blood Sugar: ${bloodCount.bloodSugar.fasting} mg/dL`, 50);
    }
    if (bloodCount.bloodSugar.postMeal) {
      doc.text(`Post-meal Blood Sugar: ${bloodCount.bloodSugar.postMeal} mg/dL`, 50);
    }
  }
  
  doc.moveDown(1);
}

function addBloodWorkSection(doc, assessment, color) {
  doc.addPage();
  
  doc.fontSize(16)
     .fillColor(color)
     .text('Blood Work Results', 50, 50);
  
  doc.moveDown(0.5);
  
  const bloodWork = assessment.bloodWork;
  const normalRanges = {
    hemoglobin: { min: 12, max: 17, unit: 'g/dL' },
    totalCholesterol: { min: 0, max: 200, unit: 'mg/dL' },
    hdlCholesterol: { min: 40, max: 999, unit: 'mg/dL' },
    ldlCholesterol: { min: 0, max: 100, unit: 'mg/dL' },
    triglycerides: { min: 0, max: 150, unit: 'mg/dL' },
    fastingGlucose: { min: 70, max: 100, unit: 'mg/dL' },
    hba1c: { min: 0, max: 5.7, unit: '%' }
  };
  
  Object.entries(bloodWork).forEach(([key, value]) => {
    if (value !== undefined && value !== null && 
        key !== 'dataSource' && key !== 'uploadedFile') {
      
      const range = normalRanges[key];
      let status = 'Normal';
      let statusColor = '#10B981';
      
      if (range) {
        if (value < range.min) {
          status = 'Low';
          statusColor = '#F59E0B';
        } else if (value > range.max) {
          status = 'High';
          statusColor = '#EF4444';
        }
      }
      
      doc.fontSize(11)
         .fillColor('#000000')
         .text(`${formatFieldName(key)}: ${value} ${range?.unit || ''}`, 50, doc.y, { continued: true })
         .fillColor(statusColor)
         .text(` (${status})`);
      
      doc.moveDown(0.3);
    }
  });
  
  doc.moveDown(1);
}

function addDietSection(doc, assessmentData, color) {
  const diet = assessmentData.diet;
  
  doc.fontSize(16)
     .fillColor(color)
     .text('Dietary Assessment', 50, doc.y);
  
  doc.moveDown(0.5);
  doc.fontSize(11).fillColor('#000000');
  
  if (diet.type) {
    doc.text(`Diet Type: ${diet.type}`, 50);
  }
  
  if (diet.fruits) {
    doc.text(`Fruit Intake: ${diet.fruits}`, 50);
  }
  
  if (diet.vegetables) {
    doc.text(`Vegetable Intake: ${diet.vegetables}`, 50);
  }
  
  if (diet.waterIntake) {
    doc.text(`Water Intake: ${diet.waterIntake} liters/day`, 50);
  }
  
  if (diet.processedFoods) {
    doc.text(`Processed Food Consumption: ${diet.processedFoods}`, 50);
  }
  
  if (diet.supplements && diet.supplements.length > 0) {
    doc.moveDown(0.5);
    doc.text('Supplements:', 50);
    diet.supplements.forEach(supplement => {
      doc.text(`• ${supplement.name} - ${supplement.dosage} (${supplement.frequency})`, 60);
    });
  }
  
  doc.moveDown(1);
}

function addLifestyleSection(doc, assessmentData, color) {
  const lifestyle = assessmentData.lifestyle;
  
  doc.fontSize(16)
     .fillColor(color)
     .text('Lifestyle Assessment', 50, doc.y);
  
  doc.moveDown(0.5);
  doc.fontSize(11).fillColor('#000000');
  
  if (lifestyle.diet) {
    doc.text(`Diet Type: ${lifestyle.diet.type}`, 50);
    doc.text(`Diet Quality: ${lifestyle.diet.quality}`, 50);
    doc.text(`Fruits/Vegetables per day: ${lifestyle.diet.fruits_vegetables}`, 50);
    doc.moveDown(0.5);
  }
  
  if (lifestyle.exercise) {
    doc.text(`Exercise Frequency: ${lifestyle.exercise.frequency} times/week`, 50);
    doc.text(`Exercise Intensity: ${lifestyle.exercise.intensity}`, 50);
    doc.text(`Exercise Duration: ${lifestyle.exercise.duration} minutes`, 50);
    doc.moveDown(0.5);
  }
  
  if (lifestyle.sleep) {
    doc.text(`Sleep Duration: ${lifestyle.sleep.hoursPerNight} hours/night`, 50);
    doc.text(`Sleep Quality: ${lifestyle.sleep.quality}`, 50);
    doc.moveDown(0.5);
  }
  
  if (lifestyle.stress) {
    doc.text(`Stress Level: ${lifestyle.stress.level}`, 50);
    doc.moveDown(0.5);
  }
  
  doc.moveDown(1);
}

function addMentalHealthSection(doc, assessmentData, color) {
  const mental = assessmentData.mental_health;
  
  doc.fontSize(16)
     .fillColor(color)
     .text('Mental Health Assessment', 50, doc.y);
  
  doc.moveDown(0.5);
  doc.fontSize(11).fillColor('#000000');
  
  doc.text(`Overall Mood: ${mental.mood}`, 50);
  doc.text(`Anxiety Level: ${mental.anxiety?.level}`, 50);
  doc.text(`Depression Symptoms: ${mental.depression?.symptoms}`, 50);
  doc.text(`Fatigue Level: ${mental.fatigue?.level}`, 50);
  doc.text(`Energy Level: ${mental.energy?.level}`, 50);
  
  doc.moveDown(1);
}

function addRiskFactorsSection(doc, assessmentData, color) {
  const riskFactors = assessmentData.assessment_result.riskFactors;
  
  doc.fontSize(16)
     .fillColor(color)
     .text('Risk Factors', 50, doc.y);
  
  doc.moveDown(0.5);
  
  riskFactors.forEach((risk, index) => {
    doc.fontSize(11)
       .fillColor('#000000')
       .text(`${index + 1}. ${risk}`, 50);
    
    doc.moveDown(0.3);
  });
  
  doc.moveDown(1);
}

function addRecommendationsSection(doc, assessmentData, color) {
  const recommendations = assessmentData.assessment_result.recommendations;
  
  doc.addPage();
  
  doc.fontSize(16)
     .fillColor(color)
     .text('Personalized Recommendations', 50, 50);
  
  doc.moveDown(0.5);
  
  // List recommendations
  recommendations.forEach((recommendation, index) => {
    doc.fontSize(11)
       .fillColor('#000000')
       .text(`${index + 1}. ${recommendation}`, 50, doc.y, { width: 495 });
    
    doc.moveDown(0.3);
  });
}

function addDisclaimer(doc, color) {
  doc.addPage();
  
  doc.fontSize(14)
     .fillColor('#EF4444')
     .text('IMPORTANT MEDICAL DISCLAIMER', 50, 50, { align: 'center' });
  
  doc.moveDown(1);
  
  const disclaimer = `This health assessment report is generated by an AI system and is intended for informational and educational purposes only. It should NOT be considered as medical advice, diagnosis, or treatment recommendation.

Key Points:
• This report does not replace professional medical consultation
• Always consult with qualified healthcare professionals for medical concerns
• Do not stop or change any medications based on this report
• Seek immediate medical attention for any serious health symptoms
• The AI analysis may not account for all individual health factors
• Lab values should be interpreted by medical professionals
• This assessment is not validated for medical diagnosis

The creators of this platform are not liable for any medical decisions made based on this report. Your health is important - please work with qualified healthcare providers for all medical matters.`;
  
  doc.fontSize(10)
     .fillColor(color)
     .text(disclaimer, 50, doc.y, { 
       width: 495, 
       align: 'justify',
       lineGap: 2
     });
}

function addFooter(doc, color) {
  const bottomMargin = 50;
  const pageHeight = doc.page.height;
  
  doc.fontSize(8)
     .fillColor(color)
     .text(
       `Generated by AI Health Assessment Platform | ${new Date().toISOString()}`,
       50,
       pageHeight - bottomMargin,
       { align: 'center', width: 495 }
     );
}

function formatFieldName(fieldName) {
  const fieldNames = {
    hemoglobin: 'Hemoglobin',
    hematocrit: 'Hematocrit',
    rbc: 'Red Blood Cells',
    wbc: 'White Blood Cells',
    platelets: 'Platelets',
    totalCholesterol: 'Total Cholesterol',
    hdlCholesterol: 'HDL Cholesterol',
    ldlCholesterol: 'LDL Cholesterol',
    triglycerides: 'Triglycerides',
    fastingGlucose: 'Fasting Glucose',
    hba1c: 'HbA1c',
    alt: 'ALT',
    ast: 'AST',
    creatinine: 'Creatinine',
    bun: 'BUN',
    tsh: 'TSH',
    t3: 'T3',
    t4: 'T4',
    vitaminD: 'Vitamin D',
    vitaminB12: 'Vitamin B12',
    folate: 'Folate',
    iron: 'Iron',
    ferritin: 'Ferritin',
    crp: 'C-Reactive Protein'
  };
  
  return fieldNames[fieldName] || fieldName;
}

function getRiskColor(riskLevel) {
  const colors = {
    low: '#10B981',
    moderate: '#F59E0B',
    high: '#EF4444',
    very_high: '#DC2626'
  };
  
  return colors[riskLevel] || '#6B7280';
}

module.exports = {
  generateHealthReport
};