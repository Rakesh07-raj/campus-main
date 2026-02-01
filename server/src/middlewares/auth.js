const { verifyTokenAndSendPayload } = require("../utils/auth");

const handleCheckAuthentication = (req, res, next) => {
    try {
        req.user = null;
        const token = req.cookies?.auth_token;
        if (!token) return res.status(401).json({ msg: "Please Login First!" });

        const user = verifyTokenAndSendPayload(token);

        if (!user) return res.status(401).json({ msg: "Invalid token. Please Login Again!" });

        req.user = user;
        next();
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: `Internal Server Error : ${err.message}` });
    }
}

// Alias for better naming
module.exports = handleCheckAuthentication;