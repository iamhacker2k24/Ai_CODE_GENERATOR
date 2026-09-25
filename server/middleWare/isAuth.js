const jwt = require("jsonwebtoken");
const userData = require("../model/usermodel");

const isAuth = async (req, res, next) => {

    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({
                msg: "token not found"
            })
        }

        const decode = await jwt.verify(token, process.env.JWT_SECRET)
        console.log(decode);
        req.user = await userData.findById(decode.id)
        next()
    } catch (error) {
        return res.status(500).json({
            msg: "Invaild token "
        })
    }
}

module.exports = isAuth;