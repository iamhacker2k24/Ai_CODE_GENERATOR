const moongose = require("moongose");
const schema = moongose.Schema


const messageSchema = new schema({
    role: {
        type: String,
        enum: ["ai", "user"],
        required: true
    },
    content: {
        type: String,
        required: true
    }
},
    { timestamps: true })



const websiteSchema = new moongose.schema({
    user: {
        type: schema.Types.objectId,
        ref: "User",
        required: true
    },
    tittle: {
        type: String,
        default: "Untitled Website"
    },
    latestCode: {
        type: String,
        required: true
    },
    converstation: [
        messageSchema
    ],
    deployed: {
        type: Boolean,
        default: false
    },
    deployUrl: {
        type: String
    },
    slug: {
        type: String,
        unique: true
    }

}, {
    timestamps: true
})

const Website = moongose.model("website", websiteSchema)
export default Website;