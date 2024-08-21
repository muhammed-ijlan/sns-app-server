const {
    QUIZZES
} = require("../configs/_index").collections;
const mongoose = require("mongoose");
const { QUESTIONS } = require("../configs/collections");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    questionId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: QUESTIONS
    },
    mark: {
        type: Number,
        min: 0,
        required: true,
    },
    negativeMark: {
        type: Number,
        required: true,
        min: 0,
    }
}, { timestamps: true });

const quizSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    questions: {
        type: [questionSchema],
        requried: true
    },
    courseId: {
        type: mongoose.Types.ObjectId,
        requried: true
    },
    totalMark: {
        type: Number,
        requried: true,
        min: 0
    },
    passMark: {
        type: Number,
        requied: true,
        min: 0,
    },
    isBlocked: {
        type: Boolean,
        requried: true,
        default: false,
    },
    isFinalized: {
        type: Boolean,
        requied: true,
        default: false,
    },
    questionsCount: {
        type: Number,
        min: 0
    },
    isOptional: {
        type: Boolean,
        required: true,
        default: false,
    },
}, { timestamps: true });


const quizModel = mongoose.model(QUIZZES, quizSchema)


module.exports = {
    quizModel,
}