const authRoute = require("express").Router();
const { login, register, verify, otpgenerate, emailgenerate, emaailVerification } = require("../controllers/authController");



authRoute.post("/login", login)

authRoute.post("/register", register)

authRoute.get("/otpgenerate", otpgenerate)

authRoute.post("/verification", verify)

authRoute.post("/email-token-generate", emailgenerate);

authRoute.get("/verify-email", emaailVerification)

module.exports = authRoute;
