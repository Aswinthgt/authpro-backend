const authRoute = require("express").Router();
const { login, register, verify } = require("../controllers/authController");



authRoute.post("/login", login)

authRoute.post("/register", register)

authRoute.post("/verification", verify)

module.exports = authRoute;
