const express = require('express');
const multer = require('multer');
const path = require('path');
const Tesseract = require('tesseract.js');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  },
  fileFilter: function (req, file, cb) {
    // Allow images and PDFs
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, PNG) and PDF files are allowed'));
    }
  }
});

// @route   POST /api/upload/lab-report
// @desc    Upload lab report for OCR processing
// @access  Public
router.post('/lab-report', optionalAuth, upload.single('labReport'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    // For PDF files, we'll need to convert to image first
    // For now, we'll handle image files directly
    if (req.file.mimetype === 'application/pdf') {
      return res.status(400).json({
        success: false,
        message: 'PDF processing not yet implemented. Please upload an image of your lab report.'
      });
    }

    // Process image with OCR
    const result = await Tesseract.recognize(req.file.path, 'eng', {
      logger: m => console.log(m)
    });

    const extractedText = result.data.text;
    
    // Extract blood work values from text
    const bloodWorkData = extractBloodWorkValues(extractedText);

    res.json({
      success: true,
      message: 'Lab report processed successfully',
      data: {
        fileId: req.file.filename,
        extractedText: extractedText,
        bloodWorkData: bloodWorkData,
        originalFilename: req.file.originalname,
        fileSize: req.file.size
      }
    });

  } catch (error) {
    console.error('OCR processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing lab report'
    });
  }
});

// @route   GET /api/upload/ocr-result/:fileId
// @desc    Get OCR extraction results
// @access  Public
router.get('/ocr-result/:fileId', (req, res) => {
  try {
    const { fileId } = req.params;
    
    // In a real implementation, you'd store OCR results in database
    // For now, return a placeholder response
    res.json({
      success: true,
      message: 'OCR result retrieved',
      data: {
        fileId: fileId,
        status: 'completed',
        extractedData: {}
      }
    });

  } catch (error) {
    console.error('Get OCR result error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving OCR result'
    });
  }
});

/**
 * Extract blood work values from OCR text
 * @param {string} text - Extracted text from OCR
 * @returns {object} - Parsed blood work values
 */
function extractBloodWorkValues(text) {
  const bloodWork = {};
  
  // Convert text to lowercase for better matching
  const normalizedText = text.toLowerCase();
  
  // Define comprehensive patterns for common blood work parameters
  const patterns = {
    // Complete Blood Count
    hemoglobin: /(?:hemoglobin|hgb|hb|haemoglobin)[\s:]*(\d+\.?\d*)/i,
    hematocrit: /(?:hematocrit|hct|haematocrit)[\s:]*(\d+\.?\d*)/i,
    rbc: /(?:rbc|red blood cell|red cell|erythrocyte)[\s:]*(\d+\.?\d*)/i,
    wbc: /(?:wbc|white blood cell|white cell|leukocyte)[\s:]*(\d+\.?\d*)/i,
    platelets: /(?:platelets|plt|platelet count|thrombocyte)[\s:]*(\d+\.?\d*)/i,
    
    // Lipid Panel
    totalCholesterol: /(?:total cholesterol|cholesterol total|cholesterol|chol)[\s:]*(\d+\.?\d*)/i,
    hdlCholesterol: /(?:hdl|hdl cholesterol|hdl-c|high density)[\s:]*(\d+\.?\d*)/i,
    ldlCholesterol: /(?:ldl|ldl cholesterol|ldl-c|low density)[\s:]*(\d+\.?\d*)/i,
    triglycerides: /(?:triglycerides|trig|trigs|tg)[\s:]*(\d+\.?\d*)/i,
    
    // Metabolic Panel
    fastingGlucose: /(?:glucose|fasting glucose|blood sugar|gluc|fbs)[\s:]*(\d+\.?\d*)/i,
    hba1c: /(?:hba1c|a1c|hemoglobin a1c|glycated hemoglobin|hgba1c)[\s:]*(\d+\.?\d*)/i,
    creatinine: /(?:creatinine|creat|cr)[\s:]*(\d+\.?\d*)/i,
    bun: /(?:bun|blood urea nitrogen|urea nitrogen)[\s:]*(\d+\.?\d*)/i,
    
    // Liver Function
    alt: /(?:alt|alanine|alanine aminotransferase|sgpt)[\s:]*(\d+\.?\d*)/i,
    ast: /(?:ast|aspartate|aspartate aminotransferase|sgot)[\s:]*(\d+\.?\d*)/i,
    
    // Thyroid
    tsh: /(?:tsh|thyroid stimulating|thyrotropin)[\s:]*(\d+\.?\d*)/i,
    
    // Vitamins and Minerals
    vitaminD: /(?:vitamin d|25-oh|25\(oh\)d|calcidiol)[\s:]*(\d+\.?\d*)/i,
    vitaminB12: /(?:vitamin b12|b12|cobalamin|cyanocobalamin)[\s:]*(\d+\.?\d*)/i,
    iron: /(?:iron|fe|serum iron)[\s:]*(\d+\.?\d*)/i,
    ferritin: /(?:ferritin)[\s:]*(\d+\.?\d*)/i
  };

  // Extract values using patterns
  Object.keys(patterns).forEach(key => {
    const pattern = patterns[key];
    
    // Try multiple approaches to find the value
    let match = normalizedText.match(pattern);
    
    // If not found, try with original text case
    if (!match) {
      match = text.match(pattern);
    }
    
    // If still not found, try with more flexible spacing
    if (!match) {
      const flexiblePattern = new RegExp(
        pattern.source.replace(/\[\\\s:\]\*/g, '[\\s:=\\-]*'),
        'i'
      );
      match = text.match(flexiblePattern);
    }
    
    if (match && match[1]) {
      const value = parseFloat(match[1]);
      if (!isNaN(value) && value > 0) {
        bloodWork[key] = value;
        console.log(`Extracted ${key}: ${value}`);
      }
    }
  });

  console.log('Final extracted blood work data:', bloodWork);
  return bloodWork;
}

module.exports = router;