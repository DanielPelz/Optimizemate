const mongoose = require('mongoose');
const CheckSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    urlCounter: {
        type: Number,
        required: false,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    pageData: {
        type: Object,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    screenshot: {
        type: String,
    },
    homepageData: {
        type: Object,
        required: true,
    },
    logs: {
        type: Object,
        required: true,
    }
});

const Check = mongoose.model('Check', CheckSchema, "checks");



module.exports = {
    Check,
}