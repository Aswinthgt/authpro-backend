const userRoute = require("express").Router();
const { verifyToken } = require("../config/secret");
const { User } = require("../models/user");


userRoute.get("/details", verifyToken, async (req, res) => {

    const user = await User.findById(req.userId);
    if (!user) {
        return res.status(404).json({ message: `user not found` })
    }
    detail = [{
        userName: `${user.firstName} ${user.lastName}`, role: user.role
    }];
    res.status(200).json({
        role: "user",
        details: detail
    });

})


module.exports = userRoute;