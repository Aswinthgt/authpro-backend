const authRoute = require("express").Router();
const { login, register, verify, otpgenerate, emailgenerate, emailVerification } = require("../controllers/authController");



authRoute.post("/login", login)

authRoute.post("/register", register)

authRoute.get("/otpgenerate", otpgenerate)

authRoute.post("/verification", verify)

authRoute.post("/email-token-generate", emailgenerate);

authRoute.get("/verify-email", emailVerification)

module.exports = authRoute;
