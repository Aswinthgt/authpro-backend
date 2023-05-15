const adminRoute = require("express").Router();
const { verifyToken } = require("../config/secret");
const { details } =require("../controllers/adminController");


adminRoute.get("/details",details);


module.exports = adminRoute;