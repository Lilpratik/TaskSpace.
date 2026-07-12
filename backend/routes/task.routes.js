const express = require("express");
const router = express.Router();
const {
    createTask,
    getAllTask,
    getTask,
    updateTask,
    deleteTask
} = require("../controlles/task.controller.js");

const protect = require("../middleware/protect.js");


router.post("/", protect, createTask);
router.get("/getall", protect, getAllTask);
router.get("/:id", protect, getTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

module.exports = router;