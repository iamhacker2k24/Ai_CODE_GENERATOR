const express = require("express");

const isAuth = require("../middleWare/isAuth");
const getCurrentuser = require("../controllers/userControllers");


const userRouter = express.Router();

userRouter.get("/me", isAuth, getCurrentuser);

module.exports = userRouter;