const { User } = require("../models/user");
const { hashPassword, comparePassword } = require("../config/bcrypt");
const { generateToken } = require("../config/secret");

const login = async (req, res) => {

    const findUser = await User.find({ email: req.body.email });
    if (findUser.length <= 0) {
        return res.status(404).json({ message: "user not found" });
    }

    const verifyPassword = await comparePassword(req.body.password, findUser[0].password);
    if (!verifyPassword) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = await generateToken(findUser[0]);
    if (!token) {
        res.status(401).json({ message: "Token Generation Failed" })
    } else {
        res.status(200).json({ token })
    }
}


const register = async (req, res) => {

    const user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(409).json({ message: 'Email address already registered' });
    }

    const password = await hashPassword(req.body.password);
    const newUser = new User({
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        email: req.body.email,
        phoneNumber: req.body.phone,
        password: password,
        role:'user'
    });

    newUser.save().then(async (val) => {
        const token = await generateToken(val);
        if (!token) {
            res.status(401).json({ message: "Token Generation Failed" })
        } else {
            res.status(200).json({ token })
        }
    }).catch(err => {
        res.status(409).json({err});
     })


}




module.exports = {
    login,
    register
}