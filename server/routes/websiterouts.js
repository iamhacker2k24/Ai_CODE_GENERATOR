const express = require("express");
const isAuth = require("../middleWare/isAuth");
const getCurrentuser = require("../controllers/userControllers");
const { generateWebsite, getWebsiteByid, getAll, changes, manualEdit, deployed } = require("../controllers/websiteControllers");


const websiterouts = express.Router();

websiterouts.post("/generatewebsite", isAuth, generateWebsite);
websiterouts.get("/get-by-id/:id", isAuth, getWebsiteByid)
websiterouts.post("/update/:id", isAuth, changes)
websiterouts.get("/getAll", isAuth, getAll)

//now what if changes done via manually ..ok for this routes ok 
websiterouts.post("/editmanually/:id", isAuth, manualEdit)
websiterouts.get("/deployed/:id", deployed)





module.exports = websiterouts;