const dotenv = require("dotenv")
dotenv.config()
const stripe = require("stripe")

const stripe = new StripeConstructor(process.env.STRIPE_SECRET_KEY)

module.exports = stripe;