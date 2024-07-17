const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // {fullname,email,username,phoneNumber,urlimage,bio,fb,instagram,snapchat,Linkedin,github,Twitter,TikTok,Youtube,Telegram}
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  username: {
    type: String,
    trim: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  urlimage: {
    type: String,
    trim: true
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  bio: {
    type: String,
    trim: true
  },
  fb: {
    type: String,
    trim: true
  },
  whatsapp: {
    type: String,
    trim: true
  },
  messenger: {
    type: String,
    trim: true
  },
  reddit: {
    type: String,
    trim: true
  },
  twitch: {
    type: String,
    trim: true
  },
  instagram: {
    type: String,
    trim: true
  },
  snapchat: {
    type: String,
    trim: true
  },
  Linkedin: {
    type: String,
    trim: true
  },
  github: {
    type: String,
    trim: true
  },
  Twitter: {
    type: String,
    trim: true
  },
  Youtube: {
    type: String,
    trim: true
  },
  Telegram: {
    type: String,
    trim: true
  },
  bgcolorp: {
    type: String,
    trim: true
  },
  skills: {
    type: String,
    trim: true
  },
  education: {
    type: String,
    trim: true
  },
  aboni: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
