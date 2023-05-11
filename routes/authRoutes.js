const authRoute = require("express").Router();
const { login, register, verify, otpgenerate } = require("../controllers/authController");



authRoute.post("/login", login)

authRoute.post("/register", register)

authRoute.get("/otpgenerate", otpgenerate)

authRoute.post("/verification", verify)

module.exports = authRoute;
