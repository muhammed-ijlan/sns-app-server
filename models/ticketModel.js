const mongoose = require("mongoose");
const { TICKETS, USERS } = require("../configs/collections");
const Schema = mongoose.Schema;


const ticketSchema = new Schema({
    title: {
        type: String,
        required: true,
        lowercase: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: USERS,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["INPROGRESS", "REOPEN", "ONHOLD", "NEW"],
        default: "NEW"
    },
    priority: {
        type: Number,
        required: true,
    },
    lastReply: {
        type: Date,
    },
    subject: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    attachment: {
        type: String,
    },
    assignTo: {
        type: String,
        required: true
    }

});


const ticketModel = mongoose.model(TICKETS, ticketSchema);

module.exports = ticketModel;