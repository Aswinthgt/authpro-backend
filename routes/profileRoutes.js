const profileRoute = require("express").Router();
const { User } = require("../models/user");
const { upload } = require("../controllers/multer");
const { imageUpload, getImage, deleteImage, details } = require("../controllers/profileController");



profileRoute.post("/imageupload", upload.single('image'), imageUpload);


profileRoute.get("/image", getImage);


profileRoute.delete("/image", deleteImage)


profileRoute.get("/details", details)



module.exports = profileRoute;