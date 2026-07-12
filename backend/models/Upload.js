const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema(
    {
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task"
        },

        file_name: {
            type: String
        },

        file_url: {
            type: String
        },

        file_type: {
            type: String
        },
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model("Upload", uploadSchema);