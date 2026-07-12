const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser
} = require("../controlles/user.controller.js");
const protect = require("../middleware/protect.js");

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;