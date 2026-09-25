export const generateWebsite = async (req, res) => {


    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({
                message: "prompt is require "
            })
        }
        const user = req.user
        if (!user) {
            return res.status(400).json({
                msg: "user not found"
            })
        }
        
    } catch (error) {

    }

}