const mongoose = require("mongoose");
const { REVIEWS } = require("../configs/collections");
const Schema = mongoose.Schema;

const reviewsSchema = new Schema({
    review: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
        default: 0
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    courseId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    isBlocked: {
        type: Boolean,
        required: true,
        default: false
    },
    date: {
        type: Date,
        default: Date.now()
    }
},
    { timestamps: true }
)

const reviewsModel = mongoose.model(REVIEWS, reviewsSchema)

module.exports = { reviewsModel };