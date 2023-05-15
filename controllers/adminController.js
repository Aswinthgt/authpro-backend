const { User } = require("../models/user");


const details = async (req, res) => {

    const user = await User.aggregate([{
        $project:{
            firstName: 1,
            role:1,
            _id: 0
        }
    }]);

    res.status(200).json({
        role: "admin",
        details: user
    });

}


module.exports = {details}