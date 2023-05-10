const { User } = require("../models/user");
const crypto = require("crypto");
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

    const otp = crypto.randomInt(1000, 9999);

    ///otpsend code

    const verifed = ''

    if (verifed) {
        const password = await hashPassword(req.body.password);
        const newUser = new User({
            firstName: req.body.firstname,
            lastName: req.body.lastname,
            email: req.body.email,
            phoneNumber: req.body.phone,
            password: password,
            role: 'user',
            otp: otp
        });


        await newUser.save().then(async () => {
            res.status(200).json({ message: 'OTP sent to your email address. Please verify your email address.', phoneNumber: req.body.phone });
        }).catch(err => {
            res.status(500).json({ err });
        })

    }

}



const verify = async (req, res) => {

    const { phoneNumber, otp } = req.body;

    const user = await User.findOne({ phoneNumber });
    if (!user) {
        return res.status(400).send('Invalid');
    }

    if (user.otp !== otp) {
        return res.status(400).send('Invalid OTP');
    }

    user.mobileVerified = true;
    user.save().then(async (val) => {
        const token = await generateToken(val);
        if (!token) {
            res.status(401).json({ message: "Token Generation Failed" })
        } else {
            res.status(200).json({ token })
        }
    }).catch(err => {
        res.status(409).json({ err });
    })

}




module.exports = {
    login,
    register,
    verify
}