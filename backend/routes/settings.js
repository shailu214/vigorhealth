const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Site settings storage (in production, use a database)
let siteSettings = {
  siteName: 'VIGOR HEALTH 360',
  logoUrl: '',
  primaryColor: '#1e40af',
  secondaryColor: '#0891b2',
  footerText: 'A proactive health Solution',
  contactEmail: 'support@vigorhealth360.com',
  supportPhone: '+1-800-VIGOR-360'
};

// Configure multer for logo uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/logos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// GET /api/admin/settings - Get current site settings
router.get('/', (req, res) => {
  try {
    res.json(siteSettings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PUT /api/admin/settings - Update site settings
router.put('/', (req, res) => {
  try {
    const {
      siteName,
      logoUrl,
      primaryColor,
      secondaryColor,
      footerText,
      contactEmail,
      supportPhone
    } = req.body;

    // Update settings
    siteSettings = {
      siteName: siteName || siteSettings.siteName,
      logoUrl: logoUrl || siteSettings.logoUrl,
      primaryColor: primaryColor || siteSettings.primaryColor,
      secondaryColor: secondaryColor || siteSettings.secondaryColor,
      footerText: footerText || siteSettings.footerText,
      contactEmail: contactEmail || siteSettings.contactEmail,
      supportPhone: supportPhone || siteSettings.supportPhone
    };

    // In production, save to database here
    // await Settings.findOneAndUpdate({}, siteSettings, { upsert: true });

    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings: siteSettings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// POST /api/admin/upload-logo - Upload new logo
router.post('/upload-logo', upload.single('logo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate the logo URL
    const logoUrl = `/uploads/logos/${req.file.filename}`;
    
    // Update the logo URL in settings
    siteSettings.logoUrl = logoUrl;

    // In production, save to database here
    // await Settings.findOneAndUpdate({}, { logoUrl }, { upsert: true });

    res.json({
      success: true,
      message: 'Logo uploaded successfully',
      logoUrl: logoUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error uploading logo:', error);
    res.status(500).json({ error: 'Failed to upload logo' });
  }
});

// DELETE /api/admin/logo - Remove current logo
router.delete('/logo', (req, res) => {
  try {
    const currentLogoUrl = siteSettings.logoUrl;
    
    if (currentLogoUrl && currentLogoUrl.startsWith('/uploads/logos/')) {
      // Delete the physical file
      const filePath = path.join(__dirname, '../uploads/logos', path.basename(currentLogoUrl));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Clear the logo URL
    siteSettings.logoUrl = '';

    // In production, save to database here
    // await Settings.findOneAndUpdate({}, { logoUrl: '' }, { upsert: true });

    res.json({
      success: true,
      message: 'Logo removed successfully'
    });
  } catch (error) {
    console.error('Error removing logo:', error);
    res.status(500).json({ error: 'Failed to remove logo' });
  }
});

// GET /api/settings/public - Get public settings (no auth required)
router.get('/public', (req, res) => {
  try {
    // Return only public settings
    const publicSettings = {
      siteName: siteSettings.siteName,
      logoUrl: siteSettings.logoUrl,
      primaryColor: siteSettings.primaryColor,
      secondaryColor: siteSettings.secondaryColor,
      footerText: siteSettings.footerText,
      contactEmail: siteSettings.contactEmail,
      supportPhone: siteSettings.supportPhone
    };

    res.json(publicSettings);
  } catch (error) {
    console.error('Error fetching public settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

module.exports = router;