const User = require("../models/user-model");
const { generateTokenAndSendCookie } = require("../utils/auth");

const handleUserSignUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const isAlreadyUser = await User.findOne({ email });

        if (isAlreadyUser) {
            return res.status(400).json({ msg: "User Already There. Please Login!" });
        }

        const createdUser = await User.create({ name, email, password });
        const { password: _, ...userWithoutPwd } = createdUser.toObject();
        generateTokenAndSendCookie(createdUser, res);

        return res.status(201).json({ msg: "User Signup Successfully!", user: userWithoutPwd });

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err.msg })
    }
}
const handleUserSignIn = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "User not found!" });

    const verified = await user.verifyPassword(password);
    if (!verified) return res.status(400).json({ msg: "Wrong password!" });

    const { password: _, ...userWithoutPwd } = user.toObject();



    generateTokenAndSendCookie(user, res);
    return res.status(200).json({ msg: `User Signin successful`, user: userWithoutPwd });
};



const handleGetCurrentUser = async (req, res) => {
    try {
        const { email } = req.user;

        const user = await User.findOne({ email }).select('-password ');
        return res.status(200).json({ msg: `Welcome Back ${user.name}`, user });

    } catch (err) {
        return res.status(500).json({ msg: err.msg })
    }
};


const handleLogoutUser = async (req, res) => {
    try {
        res.clearCookie("auth_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });

        return res.status(200).json({ msg: "User LogOut Successfully!" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: `Internal Server Error : ${err.message}` })
    }
}

module.exports = {
    handleGetCurrentUser, handleUserSignIn, handleUserSignUp,
    handleLogoutUser
}