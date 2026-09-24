const userData = require("../model/usermodel");

const googleAuth = async (req, res) => {
    try {

        const { name, email, avatar } = req.body;
        if (!email) {
            return res.status(400).json({
                message: "email is required "
            });
        }

        const user = await userData.findOne({ email })
        if (!user) {
            user = await userData.create({ name, email, avatar })
        }



    } catch (error) {

    }

}

// 45