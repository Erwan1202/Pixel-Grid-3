const mongoose = require('mongoose');

const PixelLogSchema = new mongoose.Schema({
    x_coord: {
        type: Number,
        required: true
    },
    y_coord: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: false,
        index: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
});

module.exports = mongoose.model('PixelLog', PixelLogSchema);