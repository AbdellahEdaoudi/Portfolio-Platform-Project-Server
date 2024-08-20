const mongoose = require('mongoose');

const FriendRequestSchema = new mongoose.Schema({
  from: { type: String, required: true }, 
  to: { type: String, required: true },
  status: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.models.FriendRequest || mongoose.model('FriendRequest', FriendRequestSchema);
