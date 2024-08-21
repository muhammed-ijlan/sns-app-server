
const argon2 = require("argon2");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    mobileNumber: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    role: {
        type: String,
        required: true,
        trim: true,
        enum: ["USER", "ADMIN", "GUEST"],
        default: "GUEST"
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true
    },
    hash: {
        type: String,
    },
    token: {
        type: String
    },

}, { timestamps: true });


userSchema.methods.setHash = async function (password) {
    try {
        this.hash = await argon2.hash(password)
    } catch (error) {
        return Promise.reject(error)
    }
}

userSchema.methods.verifyHash = async function (password) {
    try {
        return await argon2.verify(this.hash, password)
    } catch (error) {
        return Promise.reject(error)
    }
}


const userModel = mongoose.model("users", userSchema)


module.exports = {
    userModel
}