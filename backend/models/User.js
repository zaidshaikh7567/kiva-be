const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password required only if not using Google auth
    }
  },
  googleId: {
    type: String,
    default: null,
    sparse: true // Allows multiple null values but unique when set
  },
  active: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['super_admin', 'user'],
    default: 'user'
  },
  profileImage: {
    type: String,
    default: null
  },
  otp: {
    type: String,
    default: null
  },
  otpExpires: {
    type: Date,
    default: null
  },
  fcmTokens: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  // Only hash password if it's modified and exists (not Google-only users)
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
