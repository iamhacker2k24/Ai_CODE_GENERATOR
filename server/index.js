const express = require("express")
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


app.use(express.json());
app.use(cookieParser())



const dotenv = require("dotenv");
const connectDb = require("./config/db");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
dotenv.config();




app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    next();
});

app.use("/api/auth", authRouter)
app.use("/api/user",userRouter)









const serverStared = async () => {
    await connectDb()
    app.listen(process.env.PORT, () => {
        console.log(`server started at ${process.env.PORT}`)
    })
}



serverStared();