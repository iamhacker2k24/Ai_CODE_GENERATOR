const mongoose = require("mongoose")
const schema = mongoose.Schema;

const userSchema = new schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    avatar: {
        type: String
    },
    credits: {
        type: Number,
        default: 100,
        min: 0
    },
    plan: {
        type: String,
        enum: ["free", "pro", "enterprise"],
        default: free
    }


},
    {
        timestamps: true
    }
)

const userData = mongoose.model("userData", userSchema)
module.exports = userData;