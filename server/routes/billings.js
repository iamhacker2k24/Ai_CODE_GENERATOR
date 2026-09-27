const express = require("express");

const isAuth = require("../middleWare/isAuth");
const getCurrentuser = require("../controllers/userControllers");
const billing = require("../controllers/billingcontrollers");


const billingRouter = express.Router();

billingRouter.post("/billing", billing);

module.exports = billingRouter;