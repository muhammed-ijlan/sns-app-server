const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { SUPPORT_TICKETS, USERS, COURSES } = require("../configs/collections");


const fileSchema = new Schema({
  fileURL: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  }
}, { _id: true, timestamps: true });


const messageSchema = new Schema({
  message: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  file: fileSchema
}, { _id: true, timestamps: true });


const supportTicketSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: USERS,
    },
    subject: {
      type: String,
      required: true
    },
    messages: [messageSchema],
    adminNote:{
      type: String,
      default: ""
    },
    category: {
      type: String,
      required: true,
      enum: ["ACCOUNT", "COURSE", "OTHERS"]
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: COURSES
    },
    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      default: "OPEN"
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true
  }
);

const supportTicketModel = mongoose.model(SUPPORT_TICKETS, supportTicketSchema);

module.exports = {
  supportTicketModel
};