const Task = require("../models/Task.js");
const Upload = require("../models/Upload.js");

/* 
Create task 
*/

const createTask = async (req, res) => {
    try {
        const { title, description, completed } = req.body

        if (!title) {
            return res.status(400).json({
                message: "Title is required!"
            });
        }

        const task = await Task.create({
            title,
            description,
            completed,
            userId: req.user._id,
        });

        return res.status(201).json({
            message: "Task created successfully",
            task,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


/* Get all task */

const getAllTask = async (req, res) => {
    try {


        const tasks = await Task.find({ userId: req.user._id });

        if (tasks.length === 0) {
            return res.status(404).json({
                message: "No tasks"
            });
        }

        return res.status(200).json({
            tasks
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

/*
get single task
*/

const getTask = async (req, res) => {
    try {
        const taskId = req.params.id;

        const task = await Task.findOne({
            _id: taskId,
            userId: req.user._id,
        });

        if (!task) {
            return res.status(400).json({
                message: "No task found"
            });
        }

        const files = await Upload.find({
            taskId: task._id,
        });

        res.status(200).json({
            task,
            files,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


/* Update specific task */

const updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const { title, description, completed } = req.body;

        const task = await Task.findOne({
            _id: taskId,
            userId: req.user._id,
        });

        if (!task) {
            return res.status(400).json({
                message: "No task found"
            });
        }

        task.title = title ?? task.title;
        task.description = description ?? task.description;
        task.completed = completed ?? task.completed;

        await task.save();

        res.status(200).json({
            message: "Task updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

/* Delete specific task */
const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;

        const task = await Task.findOne({
            _id: taskId,
            userId: req.user._id,
        });

        if (!task) {
            return res.status(400).json({
                message: "Task not found"
            });
        }

        await task.deleteOne();

        res.status(200).json({
            message: "Task deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createTask,
    getAllTask,
    getTask,
    updateTask,
    deleteTask
};

