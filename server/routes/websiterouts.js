const express = require("express");
const isAuth = require("../middleWare/isAuth");
const getCurrentuser = require("../controllers/userControllers");
const { generateWebsite, getWebsiteByid, getAll, changes } = require("../controllers/websiteControllers");


const websiterouts = express.Router();

websiterouts.post("/generatewebsite", isAuth, generateWebsite);
websiterouts.get("/get-by-id/:id", getWebsiteByid)
websiterouts.post("/update/:id", changes)
websiterouts.get("/getAll", isAuth, getAll)



module.exports = websiterouts;