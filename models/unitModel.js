const {
    UNITS,
    COURSES
} = require("../configs/_index").collections;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const unitSchema = new Schema({
    courseId: {
        type: Schema.Types.ObjectId,
        ref: COURSES,
        required: true
    },
    unitType: {
        type: String,
        enum: ["VIDEO", "READING", "PDF"],
        required: true
    },
    title: {
        type: String,
        requied: true
    },
    duration: {
        type: Number, //mins
        required: true,
        min: 0
    },
    videoURL: {
        type: String
    },
    pdfURL: {
        type: String
    },
    subtitleURL: {
        type: String
    },
    readingContent: {
        type: String
    },
    isOptional: {
        type: Boolean,
        required: true,
        default: true
    },

}, { timestamps: true });


const unitModel = mongoose.model(UNITS, unitSchema)


module.exports = {
    unitModel
}