const { User } = require("../models/user");
const crypto = require("crypto");
const { hashPassword, comparePassword } = require("../config/bcrypt");
const { generateToken } = require("../config/secret");
const unirest = require("unirest");
const NodeCache = require("node-cache");

const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });



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
    const phonenumber = req.body.phone
    const otp = crypto.randomInt(1000, 9999);
    const obj = req.body;
    obj.password = password;
    obj.otp = otp;
    success = myCache.set(`${phonenumber}`, obj, 5 * 60);

    if (!success) {
        return res.status(404).json({ message: "OTP Generating Failed" })
    }

    res.redirect(`/auth/otpgenerate?phone=${phonenumber}`)

    
}


const otpgenerate = async (req, res) => {

    const phonenumber = req.query.phone;

    const value = myCache.get(`${phonenumber}`);
    if (value == undefined) {
        return res.status(498).json(`OTP Expired`)
    }

    const otp = crypto.randomInt(1000, 9999);
    const obj = value;
    obj.otp = otp;
    success = myCache.set(`${phonenumber}`, obj, 5 * 60);

    if (!success) {
        return res.status(404).json({ message: "OTP Generating Failed" })
    }

    await unirest.post('https://www.fast2sms.com/dev/bulkV2')
        .headers({
            'Authorization': process.env.OTP_AUTH,
            "cache-control": "no-cache"
        })
        .send({
            "variables_values": otp,
            "route": "otp",
            "numbers": phonenumber,
        })
        .end(async (response) => {
            if (response.body.return) {
                res.status(200).json({
                    message: 'OTP sent to your Mobile. Please verify your Mobile.',
                    phoneNumber: phonenumber
                });
            } else {
                res.status(400).json({ message: `verification failed` })
            }
        });
}



const verify = async (req, res) => {

    const { phoneNumber, otp } = req.body;

    const value = myCache.get(`${phoneNumber}`);
    if (value == undefined) {
        return res.status(498).json(`OTP Expired`)
    }
    if (parseInt(value.otp) !== parseInt(otp)) {
        return res.status(400).send('Invalid OTP');
    }

    const newUser = new User({
        firstName: value.firstname,
        lastName: value.lastname,
        email: value.email,
        phoneNumber: value.phone,
        password: value.password,
        role: 'user',
    });

    newUser.save().then(async (val) => {
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
    verify,
    otpgenerate
}