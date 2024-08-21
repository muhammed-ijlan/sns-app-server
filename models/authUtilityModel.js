const mongoose = require("mongoose");
const { AUTH_UTILITIES } = require("../configs/collections");
const Schema = mongoose.Schema;

const authUtilitySchema = new Schema({
    name: {
        type: String,
        enum: ["OTP", "EMAIL", "SIGNUP", "RESET_PASSWORD", "LOGIN"],
        default: "EMAIL",
        required: true,
        index: true
    },
    userId: {
        type: Schema.Types.ObjectId
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    metaData: {
    },
}, { timestamps: true })

const authUtilityModel = mongoose.model(AUTH_UTILITIES, authUtilitySchema)

module.exports = { authUtilityModel };