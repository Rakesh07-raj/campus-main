const mongoose = require('mongoose');

const foundItemSchema = new mongoose.Schema({
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
  dateFound: {
    type: Date,
    required: true,
  },
  timeFound: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor'],
  },
  images: [{
    type: String, // File paths or URLs
  }],
  status: {
    type: String,
    enum: ['available', 'claimed', 'returned', 'closed'],
    default: 'available',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // User who found the item
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // User who claimed the item
  },
  contactEmail: {
    type: String,
  },
  contactPhone: {
    type: String,
  },
  handoverLocation: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('FoundItem', foundItemSchema);
