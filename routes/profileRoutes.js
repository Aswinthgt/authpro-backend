const profileRoute = require("express").Router();
const { verifyToken } = require("../config/secret");
const { User } = require("../models/user");
const { upload } = require("../controllers/multer");
const { imageUpload, getImage, deleteImage, details } = require("../controllers/profileController");



profileRoute.post("/imageupload", verifyToken, upload.single('image'), imageUpload);


profileRoute.get("/image", verifyToken, getImage);


profileRoute.delete("/image", verifyToken, deleteImage)


profileRoute.get("/details", verifyToken, details)



module.exports = profileRoute;