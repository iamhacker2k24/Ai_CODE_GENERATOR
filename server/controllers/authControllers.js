const userData = require("../model/usermodel");
const jwt = require("jsonwebtoken")
const googleAuth = async (req, res) => {
    try {

        const { name, email, avatar } = req.body;
        if (!email) {
            return res.status(400).json({
                message: "email is required "
            });
        }
        console.log(req.body)
        const user = await userData.findOne({ email })
        if (!user) {
            user = await userData.create({ name, email, avatar })
        }
        const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
        console.log(token);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // localhost
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({
            message: `google auth error ${error.message}`
        })
    }
}


const logout = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({
            msg: "logout done "
        })

    } catch (error) {

        return res.status(500).json({
            message: `logout error ${error.message}`
        })
    }
}


module.exports = { logout, googleAuth }