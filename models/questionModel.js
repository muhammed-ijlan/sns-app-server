const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    question: {
        type: String,
        requried: true,
        trim: true,
    },
    questionType: {
        type: String,
        requierd: true,
        enum: ["RADIO", "CHECKBOX"],
        default: "RADIO"
    },
    options: {
        type: [String],
        requried: true
    },
    answer: {
        type: [String],
        requried: true,
    },
    courseId: {
        type: Schema.Types.ObjectId,
        requried: true,
    },
    isBlocked: {
        type: Boolean,
        requried: true,
        default: false,
    },
    isFinalized: {
        type: Boolean,
        requried: true,
        default: false,
    },

    keywords: {
        type: [String],
    },

});

const questionModel = mongoose.model("questions", questionSchema)

module.exports = {
    questionModel
}
