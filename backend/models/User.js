const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6
        },
    },
    {
        timestamps: true
    }
);

// hash password before saving 
userSchema.pre("save", async function () {
    try {
        if (!this.isModified("password")) return;
        const saltRounds = Number(process.env.SALT_ROUNDS) || 10;

        this.password = await bcrypt.hash(this.password, saltRounds);
    } catch (error) {
        console.error(error);
    }
});

// compare password method
userSchema.methods.comparePassword = async function (input) {
    return await bcrypt.compare(input, this.password);
};


module.exports = mongoose.model("User", userSchema);
