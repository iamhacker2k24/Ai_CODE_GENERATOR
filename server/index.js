const express = require("express")
const app = express();

const dotenv = require("dotenv");
const connectDb = require("./config/db");
dotenv.config();






const serverStared = async () => {
    await connectDb()
    app.listen(process.env.PORT, () => {
        console.log(`server started at ${process.env.PORT}`)
    })
}



serverStared();