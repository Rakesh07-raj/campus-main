const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dateLost: {
    type: Date,
    required: true,
  },
  timeLost: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  reward: {
    type: Boolean,
    default: false,
  },
  rewardAmount: {
    type: Number,
  },
  images: [{
    type: String, // File paths or URLs
  }],
  status: {
    type: String,
    enum: ['reported', 'found', 'claimed', 'closed'],
    default: 'reported',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // User who reported the lost item
  },
  contactEmail: {
    type: String,
  },
  contactPhone: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('LostItem', lostItemSchema);
