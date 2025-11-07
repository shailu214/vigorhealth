const mongoose = require('mongoose');

// User model for permanent user data only
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [1, 'Age must be at least 1'],
    max: [150, 'Age cannot exceed 150']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  }
}, {
  timestamps: true // This adds createdAt and updatedAt automatically
});

// Create indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

// Method to check if user has any pending assessments
userSchema.methods.hasPendingAssessments = async function() {
  const AssessmentData = mongoose.model('AssessmentData');
  const count = await AssessmentData.countDocuments({ userId: this._id });
  return count > 0;
};

module.exports = mongoose.model('User', userSchema);