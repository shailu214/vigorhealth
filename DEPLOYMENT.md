# Deployment Configuration Guide

## 🚀 Environment Variables Configuration

### Required Environment Variables for Production

Copy these to your hosting platform (Vercel, Netlify, Heroku, etc.):

```env
# Core Configuration
NODE_ENV=production
PORT=5001

# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthassessment?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-change-this-in-production
JWT_EXPIRE=30d

# AI Provider Keys (Configure via Admin Panel or Environment)
OPENAI_API_KEY=sk-your-openai-api-key
GEMINI_API_KEY=your-gemini-api-key
CLAUDE_API_KEY=your-claude-api-key
HUGGINGFACE_API_KEY=your-huggingface-token

# Frontend URL (Update with your domain)
FRONTEND_URL=https://your-domain.com

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM=noreply@your-domain.com

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Security
ENCRYPTION_KEY=your-32-character-encryption-key-here

# OCR Configuration
GOOGLE_VISION_API_KEY=your-google-vision-api-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# GDPR Compliance
DATA_RETENTION_DAYS=30
AUTO_DELETE_ENABLED=true
```

## 🌐 Platform-Specific Deployment

### Vercel Deployment

1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `frontend/build`
   - Install Command: `npm run install-deps`

### Heroku Deployment

1. Install Heroku CLI
2. Create Heroku app: `heroku create your-app-name`
3. Set environment variables: `heroku config:set VARIABLE=value`
4. Deploy: `git push heroku main`

### Railway Deployment

1. Connect GitHub repository to Railway
2. Configure environment variables in Railway dashboard
3. Railway will auto-detect and deploy both frontend and backend

### Docker Deployment

Use the provided docker-compose.yml file:

```bash
docker-compose up -d
```

## 🔧 Environment Setup Steps

1. **MongoDB Atlas Setup**:

   - Create MongoDB Atlas account
   - Create cluster and database user
   - Get connection string and update MONGODB_URI

2. **AI Provider Setup**:

   - Get OpenAI API key from platform.openai.com
   - Get Gemini API key from Google AI Studio
   - Configure providers via admin panel after deployment

3. **Email Setup**:

   - Configure SMTP settings for report delivery
   - Use app-specific passwords for Gmail

4. **Domain Configuration**:
   - Update FRONTEND_URL with your actual domain
   - Configure CORS settings if needed

## 🔐 Security Checklist

- [ ] Strong JWT secret (32+ characters)
- [ ] Secure database password
- [ ] Environment variables not exposed in frontend
- [ ] HTTPS enabled in production
- [ ] Rate limiting configured
- [ ] File upload restrictions in place
- [ ] GDPR compliance enabled

## 📊 Monitoring Setup

- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Configure analytics
- [ ] Monitor API usage
- [ ] Set up health checks
- [ ] Database monitoring
