const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  urlimage: { type: String, trim: true },
  fullname: { type: String, required: true, trim: true },
  username: { type: String, trim: true, unique: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  phoneNumber: { type: String, trim: true },
  country: { type: String, trim: true },
  category: { type: String, trim: true },
  
  // Social Media Fields
  Media: {
    fb: { type: String, trim: true },
    whatsapp: { type: String, trim: true },
    messenger: { type: String, trim: true },
    reddit: { type: String, trim: true },
    twitch: { type: String, trim: true },
    instagram: { type: String, trim: true },
    snapchat: { type: String, trim: true },
    Linkedin: { type: String, trim: true },
    github: { type: String, trim: true },
    Twitter: { type: String, trim: true },
    Youtube: { type: String, trim: true },
    Telegram: { type: String, trim: true }
  },

  // Profile Details in Different Languages
  en: {
    bio: { type: String, trim: true },
    services: { type: String, trim: true },
    education: { type: String, trim: true },
    skills: { type: String, trim: true },
    languages: { type: String, trim: true },
    experience: { type: String, trim: true },
    bgcolorp: { type: String, trim: true }
  },
  fr: {
    bio: { type: String, trim: true },
    services: { type: String, trim: true },
    education: { type: String, trim: true },
    skills: { type: String, trim: true },
    languages: { type: String, trim: true },
    experience: { type: String, trim: true },
    bgcolorp: { type: String, trim: true }
  },
  de: {
    bio: { type: String, trim: true },
    services: { type: String, trim: true },
    education: { type: String, trim: true },
    skills: { type: String, trim: true },
    languages: { type: String, trim: true },
    experience: { type: String, trim: true },
    bgcolorp: { type: String, trim: true }
  },
  ar: {
    bio: { type: String, trim: true },
    services: { type: String, trim: true },
    education: { type: String, trim: true },
    skills: { type: String, trim: true },
    languages: { type: String, trim: true },
    experience: { type: String, trim: true },
    bgcolorp: { type: String, trim: true }
  },

  aboni: { type: Boolean, default: false },
  isOnline: { type: Boolean, default: false },
  blocked: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
