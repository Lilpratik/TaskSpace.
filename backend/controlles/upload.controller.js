const Upload = require("../models/Upload.js");

/* Upload file */

const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No File uploaded"
            });
        }

        await Upload.create({
            uploadedBy: req.user._id,
            taskId: req.params.id,
            file_name: req.file.originalname,
            file_url: req.file.path,
            file_type: req.file.mimetype,
        });

        res.status(201).json({
            message: "File uploaded successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    uploadFile,
};

