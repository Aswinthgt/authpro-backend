const profileRoute = require("express").Router();
const { verifyToken } = require("../config/secret");
const { User } = require("../models/user");
const { upload } = require("../controllers/multer");
const { imageUpload, getImage, deleteImage } = require("../controllers/profileController");

profileRoute.get("/", verifyToken, async (req, res) => {
    res.send("");
});

profileRoute.post("/imageupload", verifyToken, upload.single('image'), imageUpload);


profileRoute.get("/image", verifyToken, getImage);


profileRoute.delete("/image", verifyToken, deleteImage)


profileRoute.get("/details", verifyToken, async (req, res) => {

    const user = await User.findById(req.userId);
    if (user.role === 'admin') {
        return res.redirect("/admin/details");
    }
    if (user.role === "user") {
        res.redirect("/user/details");
    }

})



module.exports = profileRoute;