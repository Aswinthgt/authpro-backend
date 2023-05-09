const { User } = require("../models/user");


const details = async (req, res) => {

    const user = await User.find({});
    let detail = [];
    user.forEach(value => {
        detail.push({ userName: `${value.firstName} ${value.lastName}`, role: value.role })
    })
    res.status(200).json({
        role: "admin",
        details: detail
    });

}


module.exports = {details}