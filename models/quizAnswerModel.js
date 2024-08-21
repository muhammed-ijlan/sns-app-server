const mongoose = require("mongoose");
const { USERS, COURSES, QUIZ_ANSWERS, QUIZZES } = require("../configs/collections");
const Schema = mongoose.Schema;

const responseSchema = new Schema(
    {
        questionId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "questions",
        },
        answers: {
            type: [String],
            required: true
        },
        mark: {
            type: Number,
            default: 0
        },
        negativeMark: {
            type: Number,
            min: 0,
        },
        status: {
            type: String,
            required: true,
            enum: ["CORRECT", "INCORRECT", "NOT_ANSWERED"],
            default: "NOT_ANSWERED"
        }
    },
    {
        timestamps: true
    }
);



const quizAnswerSchema = new Schema(
    {
        studentId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: USERS,
        },
        moduleId: {
            type: Schema.Types.ObjectId,
            required: true,
            // unique: true
        },
        courseId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: COURSES,
        },
        quizId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: QUIZZES,
            // unique: true,
        },
        response: {
            type: [responseSchema]
        },
        isBlocked: {
            type: Boolean,
            required: true,
            default: false
            // answer invalidated by admin
        },
        isFinished: {
            type: Boolean,
            required: true,
            default: false
        },
        totalMarks: {
            type: Number,
            default: 0
        },
        securedMarks: {
            type: Number,
            default: 0
        },
        isPassed: {
            type: Boolean,
            required: true,
            default: false
        },
    },
    {
        timestamps: true
    }
);

// quizAnswerSchema.index({ courseId: 1, studentId: 1 }, { unique: true });


const quizAnswerModel = mongoose.model(QUIZ_ANSWERS, quizAnswerSchema);

module.exports = {
    quizAnswerModel
}
