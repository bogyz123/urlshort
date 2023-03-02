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
    },
    clicksPerMonth: {
        type: Map,
        of: Number,
        default: {
            "January:": 0,
            "February": 0,
            "March": 0,
            "June": 0,
            "July": 0,
            "August": 0,
            "September": 0,
            "October": 0,
            "November": 0,
            "December": 0
        }
    },
});
module.exports = mongoose.model("ShortenedUrl", schema);