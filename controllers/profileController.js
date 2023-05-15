const { User } = require("../models/user");
const path = require("path");
const fs = require("fs");




const imageUpload = async (req, res) => {

    const final = await User.updateOne({ _id: req.userId }, {
        $set: {
            filename: req.file.filename,
            imagePath: req.file.path
        }
    })

    if (final.acknowledged == true) {
        res.redirect("/profile/image");
    } else {
        res.status(404).json({ message: "Image not Found" });
    }
}



const getImage = async (req, res) => {  

    const user = await User.findById(req.userId); 
    if (!user.imagePath) {
        res.status(404).json({ message: "image not Found" });
    } else {
        const paths = path.resolve(user.imagePath);
        res.sendFile(paths);
    }

}



const deleteImage = async (req, res) => {

    try {
        const user = await User.findById(req.userId);
        fs.unlink(user.imagePath, err => {
            if (err) {
                console.error(err);
            }
        });
        const mongoDelete = await User.findByIdAndUpdate(req.userId, {
            $unset: { filename: '', imagePath: '' }
        });
        if (mongoDelete) {
            res.send({ message: "Image deleted successfully!" });
        }

    } catch (e) {
        return res.status(500).send('Server error');
    }

}

const details = async (req, res) => {

    const user = await User.findById(req.userId);
    if (user.role === 'admin') {
        return res.redirect("/admin/details");
    }
    if (user.role === "user") {
        res.redirect("/user/details");
    }

}







module.exports = { imageUpload, getImage, deleteImage, details };