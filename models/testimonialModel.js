const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {
    TESTIMONIALS
} = require("../configs/_index").collections;

const testimonialShema = new Schema({
    fullname: {
        type: String,
        required: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
    },
    isBlocked: {
        type: Boolean,
        default: false,
        required: true,
    }
}, { timestamps: true });

const testimonialModel = new mongoose.model(TESTIMONIALS, testimonialShema)

module.exports = {
    testimonialModel
}