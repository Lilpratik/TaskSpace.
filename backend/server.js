const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const PORT = process.env.PORT || 5050;

const connectDB = require("./db/db.config.js");
const userRoutes = require("./routes/user.routes.js");
const taskRoutes = require("./routes/task.routes.js");
const uploadRoutes = require("./routes/upload.routes.js");
// middlware 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// calling connectiont to db
connectDB();


// test api 
app.get("/", (req, res) => {
    res.send("Server running!");
});

// dev api
app.use("/api/auth", userRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/task", uploadRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
