const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { USERS, UNITS, QNAS, INSTRUCTORS } = require("../configs/_index").collections

const qNaSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: USERS,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    instructor: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: INSTRUCTORS
        }
        ],
        required: true,
        default: [],
        index: true
    },
    unitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: UNITS,
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        default: "",
    }
});

const qNaModel = mongoose.model(QNAS, qNaSchema);

module.exports = {
    qNaModel
};