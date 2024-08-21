const mongoose = require("mongoose");
const { PURCHASED_COURSES, USERS, COURSES, UNITS, QUIZZES, ASSIGNMENTS } = require("../configs/collections");
const Schema = mongoose.Schema;

const unitSchema = new Schema({
    unitId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: UNITS
    },
    isCompleted: {
        type: Boolean,
        required: true,
        default: false
    },
    isOptional: {
        type: Boolean,
        required: true,
        default: true
    },
    isUnlocked: {
        type: Boolean,
        required: true,
        default: false
    },
}, { timestamps: true });


const moduleSchema = new Schema({
    moduleId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    units: {
        type: [unitSchema],
        default: [],
    },
    assignmentId: {
        type: Schema.Types.ObjectId,
        ref: ASSIGNMENTS
    },
    quizId: {
        type: Schema.Types.ObjectId,
        ref: QUIZZES
    },
    unitStatus: {
        type: String,
        required: true,
        enum: ["NA", "PENDING", "COMPLETED"],
        default: "NA"
    },
    assignmentStatus: {
        type: String,
        required: true,
        enum: ["NA", "PENDING", "COMPLETED"],
        default: "NA"
    },
    quizStatus: {
        type: String,
        required: true,
        enum: ["NA", "PENDING", "COMPLETED"],
        default: "NA"
    },
    isCompleted: {
        type: Boolean,
        required: true,
        default: false
    },
    isUnlocked: {
        type: Boolean,
        required: true,
        default: false,
    },
  
}, { timestamps: true })

const purchasedCourseSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: USERS,
    },
    courseId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: COURSES,
    },
    invoiceNumber: {
        type: String,
        required: true,
    },
    modules: {
        type: [moduleSchema],
        required: true,
        default: []
    },
    isCompleted: {
        type: Boolean,
        default: false,
        required: true
    },
    completedOn:{
        type: Date,
    },

}, { timestamps: true });

purchasedCourseSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const purchasedCourseModel = mongoose.model(PURCHASED_COURSES, purchasedCourseSchema);

module.exports = {
    purchasedCourseModel,
}