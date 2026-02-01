const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    dateLost: {
        type: Date,
        required: true,
    },
    images: [{
        type: String, // URLs or paths to images
    }],
    status: {
        type: String,
        enum: ['reported', 'claimed', 'solved'],
        default: 'reported',
    },
    lost_userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, // The user who lost the item reports it
    },
    founder_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null, // Populated when someone claims to have found it
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Item', itemSchema);
