const authRoute = require("express").Router();
const { login, register } = require("../controllers/authController");



authRoute.post("/login", login)

authRoute.post("/register", register)

module.exports = authRoute;
