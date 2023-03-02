const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true
    },
    shortenedUrl: {
        type: String,
        required: true,
        default: 'x'
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
    },
    createdAt: {
        type: Date,
        required: true
    }
});
module.exports = mongoose.model("ShortenedUrl", schema);