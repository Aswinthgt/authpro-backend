const adminRoute = require("express").Router();
const { verifyToken } = require("../config/secret");
const { User } = require("../models/user");


adminRoute.get("/details", verifyToken, async (req, res) => {

    const user = await User.find({});
    let detail = [];
    user.forEach(value => {
        detail.push({ userName: `${value.firstName} ${value.lastName}`, role: value.role })
    })
    res.status(200).json({
        role: "admin",
        details: detail
    });

});


module.exports = adminRoute;