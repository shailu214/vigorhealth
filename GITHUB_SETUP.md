# GitHub Repository Setup Commands

## Replace YOUR-USERNAME with your actual GitHub username

# Step 1: Add remote repository

git remote add origin https://github.com/YOUR-USERNAME/ai-health-assessment-platform.git

# Step 2: Rename branch to main (GitHub standard)

git branch -M main

# Step 3: Push to GitHub

git push -u origin main

# Alternative: If you named your repository differently, use:

# git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

## After successful push, your repository will be available at:

## https://github.com/YOUR-USERNAME/ai-health-assessment-platform

## To verify the remote was added correctly:

git remote -v

## To check current branch:

git branch
