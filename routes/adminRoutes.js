const adminRoute = require("express").Router();
const { verifyToken } = require("../config/secret");
const { details } =require("../controllers/adminController");


adminRoute.get("/details", verifyToken, details);


module.exports = adminRoute;