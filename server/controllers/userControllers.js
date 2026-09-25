 const getCurrentuser = async (req, res) => {
    console.log("now user auth")
    try {
        if (!req.user) {
            return res.json({ user: null })
        }
        return res.json(req.user)
    } catch (error) {
        return res.status(500).json({
            msg: "get current useer error "
        })
    }
}

module.exports= getCurrentuser