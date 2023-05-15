const userRoute = require("express").Router();
const { verifyToken } = require("../config/secret");
const {details} =require("../controllers/userController");


userRoute.get("/details",details)


module.exports = userRoute;