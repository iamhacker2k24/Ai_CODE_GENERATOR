const moongosh = require("mongoose")

const connectDb = async () => {
    try {
        await moongosh.connect(process.env.DB_URL);
        console.log("db connected ")

    } catch (error) {
        console.log(error.message);
    }
}


module.exports= connectDb;