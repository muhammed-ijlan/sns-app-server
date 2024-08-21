const {
    ADMINS
} = require("../configs/_index").collections;
const argon2 = require("argon2");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const adminSchema = new Schema({
    fullname: {
        type: String,
        lowercase: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true
    },
    profilePic: {
        type: String,
    },
    hash: {
        type: String,
        required: true,
    },
    token: {
        type: String
    },
    isBlocked: {
        type: Boolean,
        default: false,
        required: true,
    },
    accType: {
        type: String,
        enum: ["SUB_ADMIN", "SUPER_ADMIN"],
        required: true,
        default: "SUB_ADMIN"
    },
    lastLogin: {
        type: Date,
        required: true,
        default: Date.now()
    },

}, { timestamps: true });


adminSchema.methods.setHash = async function (password) {
    try {
        this.hash = await argon2.hash(password)
    } catch (error) {
        return Promise.reject(error)
    }
}

adminSchema.methods.verifyHash = async function (password) {
    try {
        return await argon2.verify(this.hash, password)
    } catch (error) {
        return Promise.reject(error)
    }
}

const adminModel = mongoose.model(ADMINS, adminSchema)


module.exports = {
    adminModel
}