# 🚀 Vercel Deployment Guide for VigorHealth

## 📋 Overview

This guide will help you deploy the VigorHealth AI Health Assessment Platform to Vercel with both frontend and backend (serverless functions).

## 🏗️ Architecture on Vercel

- **Frontend**: React app served as static files
- **Backend**: Node.js API routes as Vercel serverless functions
- **Database**: MongoDB Atlas (cloud database)
- **File Storage**: Vercel's built-in file system (temporary) or external storage

## 📦 Prerequisites

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Prepare Your Repository

Make sure your code is committed to GitHub:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## 🚀 Deployment Steps

### Step 1: Initialize Vercel Project

```bash
# Navigate to your project directory
cd "e:\Plugin\AI Plugin\Latest AI chatbot\healthassessment"

# Initialize Vercel project
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: vigorhealth
# - Directory: ./
# - Override settings? Yes
```

### Step 2: Configure Environment Variables

Set up your environment variables in Vercel:

#### Via Vercel CLI:

```bash
# MongoDB connection
vercel env add MONGODB_URI production
# Enter: mongodb+srv://shailu446_db_user:Y3oZJZZ0Lz0NfvW9@vigorhealth214.txto8tq.mongodb.net/healthassessment

# JWT Secret
vercel env add JWT_SECRET production
# Enter: your-super-secret-jwt-key-change-this-in-production

# Frontend API URL (will be your Vercel domain)
vercel env add REACT_APP_API_URL production
# Enter: https://your-vercel-app.vercel.app

# Node Environment
vercel env add NODE_ENV production
# Enter: production

# CORS Origin
vercel env add CORS_ORIGIN production
# Enter: https://your-vercel-app.vercel.app

# Session Secret
vercel env add SESSION_SECRET production
# Enter: your-session-secret-change-this

# Upload settings
vercel env add UPLOAD_MAX_SIZE production
# Enter: 10485760

vercel env add UPLOAD_PATH production
# Enter: /tmp/uploads
```

#### Via Vercel Dashboard:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the following variables:

| Variable Name       | Value                                                                                                  | Environment |
| ------------------- | ------------------------------------------------------------------------------------------------------ | ----------- |
| `MONGODB_URI`       | `mongodb+srv://shailu446_db_user:Y3oZJZZ0Lz0NfvW9@vigorhealth214.txto8tq.mongodb.net/healthassessment` | Production  |
| `JWT_SECRET`        | `your-super-secret-jwt-key-change-this-in-production`                                                  | Production  |
| `REACT_APP_API_URL` | `https://your-app-name.vercel.app`                                                                     | Production  |
| `NODE_ENV`          | `production`                                                                                           | Production  |
| `CORS_ORIGIN`       | `https://your-app-name.vercel.app`                                                                     | Production  |
| `SESSION_SECRET`    | `your-session-secret-change-this`                                                                      | Production  |
| `UPLOAD_MAX_SIZE`   | `10485760`                                                                                             | Production  |
| `UPLOAD_PATH`       | `/tmp/uploads`                                                                                         | Production  |

### Step 3: Deploy to Production

```bash
# Deploy to production
vercel --prod

# Your app will be deployed to: https://your-app-name.vercel.app
```

## 🔧 Project Structure for Vercel

```
/
├── api/                          # Vercel serverless functions
│   └── index.js                 # Main API handler
├── backend/                     # Backend source code
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── middleware/
├── frontend/                    # React frontend
│   ├── src/
│   ├── public/
│   └── build/                   # Built files (created during deployment)
├── vercel.json                  # Vercel configuration
└── package.json                # Root package.json
```

## 🌐 Custom Domain Setup (Optional)

### 1. Add Custom Domain in Vercel Dashboard

1. Go to your project in Vercel Dashboard
2. Go to Settings → Domains
3. Add your domain (e.g., `vigorhealth.com`)
4. Follow DNS setup instructions

### 2. Update Environment Variables

After setting up custom domain, update:

```bash
vercel env add REACT_APP_API_URL production
# Enter: https://yourdomain.com

vercel env add CORS_ORIGIN production
# Enter: https://yourdomain.com
```

## 🔍 Local Development with Vercel

### 1. Install Dependencies

```bash
npm run install-deps
```

### 2. Start Vercel Development Server

```bash
vercel dev

# Or use the npm script
npm run vercel:dev
```

This will start:

- Frontend: http://localhost:3000
- API: http://localhost:3000/api/\*

## 📊 Monitoring and Analytics

### 1. Vercel Analytics

Enable analytics in your Vercel dashboard to monitor:

- Page views
- Performance metrics
- Error rates
- Geographic distribution

### 2. Function Logs

View serverless function logs:

```bash
vercel logs
```

Or in the Vercel dashboard under Functions tab.

## 🚨 Important Considerations for Vercel

### 1. Serverless Function Limitations

- **Execution Time**: Max 30 seconds (configured in vercel.json)
- **Memory**: 1024MB default
- **Cold Starts**: Functions may have cold start delays
- **File System**: Use `/tmp` for temporary files only

### 2. File Uploads

For file uploads, consider using:

- **Vercel Blob Storage** (recommended)
- **AWS S3**
- **Cloudinary**
- **Google Cloud Storage**

### 3. Database Connections

- MongoDB connections are pooled per function
- Use connection pooling and proper error handling
- Consider using MongoDB Atlas for better performance

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Build Failures

```bash
# Check build logs
vercel logs

# Common fixes:
# - Ensure all dependencies are in package.json
# - Check Node.js version compatibility
# - Verify environment variables are set
```

#### 2. API Routes Not Working

- Verify `vercel.json` routes configuration
- Check serverless function logs
- Ensure MongoDB connection is working

#### 3. CORS Issues

```bash
# Update CORS_ORIGIN environment variable
vercel env add CORS_ORIGIN production
# Enter your Vercel domain
```

#### 4. Environment Variables Not Loading

- Check if variables are set in Vercel dashboard
- Verify variable names match your code
- Redeploy after adding new variables

## 📈 Performance Optimization

### 1. Frontend Optimization

- Enable source map generation: Set `GENERATE_SOURCEMAP=false`
- Use React lazy loading for components
- Optimize images and assets

### 2. Backend Optimization

- Implement database connection pooling
- Use caching where appropriate
- Optimize API response sizes

### 3. Vercel-Specific Optimizations

- Use Vercel Edge Functions for static content
- Enable compression in vercel.json
- Configure proper cache headers

## 🔄 CI/CD with GitHub Integration

### 1. Connect GitHub Repository

1. Go to Vercel Dashboard
2. Import your GitHub repository
3. Configure build settings

### 2. Automatic Deployments

- **Production**: Deploys from `main` branch
- **Preview**: Deploys from pull requests
- **Development**: Use `vercel dev` locally

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Node.js Functions](https://vercel.com/docs/functions/serverless-functions/runtimes/node-js)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)

## 🎯 Quick Commands Reference

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Initialize project
vercel

# Deploy to production
vercel --prod

# Start development server
vercel dev

# View logs
vercel logs

# Add environment variable
vercel env add VARIABLE_NAME production

# List deployments
vercel ls
```

## ✅ Deployment Checklist

- [ ] Vercel CLI installed and logged in
- [ ] All environment variables configured
- [ ] MongoDB Atlas accessible from Vercel
- [ ] Frontend builds successfully
- [ ] API routes working in development
- [ ] CORS configured correctly
- [ ] Custom domain set up (optional)
- [ ] Analytics enabled
- [ ] Monitoring configured

Your VigorHealth platform is now ready for Vercel deployment! 🚀
