const express = require("express");
const router = express.Router();

const {
    uploadFile,
} = require("../controlles/upload.controller.js");

const protect = require("../middleware/protect.js");
const upload = require("../middleware/upload.js");

router.post("/upload/:id", protect, upload.single("file"), uploadFile);


module.exports = router;