const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_KEY;



function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Invalid token' });
        }
        req.userId = decoded.sub;
        next();
    });
}


async function generateToken(user) {
    try {
        const payload = { sub: user._id };
        const token = await jwt.sign(payload, secret, { expiresIn: '1h' });
        return token;
    } catch (err) {
        console.error(err);
        return null;
    }
}



module.exports = {
    generateToken,

    verifyToken
};

