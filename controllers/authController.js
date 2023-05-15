const { User } = require("../models/user");
const crypto = require("crypto");
const { hashPassword, comparePassword } = require("../config/bcrypt");
const { generateToken } = require("../config/secret");
const unirest = require("unirest");
const NodeCache = require("node-cache");
const nodemailer = require("nodemailer");
const path = require("path");

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
    let success = myCache.set(`${phonenumber}`, obj, 5 * 60);

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



const emailgenerate = async (req, res) => {

    const phonenumber = req.body.phone;

    const details = myCache.get(`${phonenumber}`);
    delete details.otp;
    const token = crypto.randomBytes(20).toString('hex');
    details.token = token;
    const verifyUrl = `http://localhost:3000/auth/verify-email?email=${details.email}&phone=${phonenumber}&token=${token}`;
    const success = myCache.set(`${phonenumber}`, details, 5 * 60);

    if (!success) {
        return res.status(401).json({ message: "Email Verification link generation Failed" })
    }

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_PASS,
        },
    });

    var mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: details.email,
        subject: 'email from Nodejs',
        text: 'Verification',
        html:
            `<p>Please click on the following link to verify your email address:</p>
        <a href=${verifyUrl}>h${verifyUrl}</a>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.status(401).json({ message: "Email Verification link generation Failed" })
        } else {
            res.json({ message: "check your email to verify Your account" })
        }
    });

}



const emailVerification = async (req, res) => {

    const { phone, email, token } = req.query;

    const details = myCache.get(`${phone}`);

    const value = myCache.get(`${phone}`);
    if (value == undefined) {
        return res.status(498).json(`link Expired`)
    }
    
    if(details.token !== token){
         res.status(400).json({message:"invalid token"})
    }

    const newUser = new User({
        firstName: details.firstname,
        lastName: details.lastname,
        email: details.email,
        phoneNumber: details.phone,
        password: details.password,
        role: 'user',
    });

    newUser.save().then(async (val) => {
        const paths = path.join(__dirname, '..',"views","emailvadated.html");
        res.sendFile(paths)

    }).catch(err => {
        res.status(409).json({ err });
    })


}


module.exports = {
    login,
    register,
    verify,
    otpgenerate,
    emailgenerate,
    emailVerification
}