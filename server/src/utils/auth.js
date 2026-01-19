const jwt = require("jsonwebtoken"); // This File for managing the token and cookie so user not to login every time the page reload.

const jwtSecret = process.env.JWT_SECRET;

const generateTokenAndSendCookie = (user, res) => {
    const userPayload = {
        _id: user._id,
        email: user.email,
        name: user.name
    };

    const token = jwt.sign(userPayload, jwtSecret);

    res.clearCookie("auth_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    
    res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

}

const verifyTokenAndSendPayload = (token) => {
    return jwt.verify(token, jwtSecret);
}

module.exports = {
    generateTokenAndSendCookie,
    verifyTokenAndSendPayload
}