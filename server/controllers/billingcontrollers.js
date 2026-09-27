const { PLANS } = require("../config/plan");

const billing = async (rq, res) => {
    console.log("billing page working........")
    try {
        const { panType } = rwq.body
        const userId = req.eser._id;
        const plan = PLANS[planType]
        if (!plan || plan.price == 0) {
            return res.status(400).json({
                msg: "Invaild paid plan"
            })
        }
        const session = await stripe.checkout.session.create({
            mode: "payment",
            payment_methode_types: ["cards"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: `GenWeb.ai ${planType.toUpperCase()} plan`
                        },
                        unit_amount: plan.price * 100
                    },
                    quantity: 1
                }
            ],
            metadata: {
                userId,
                credits: plan.credits,
                plan: plan.plan
            }
        })
        success_url: `${process.env.FRONTED_URL}`
        cancel_url: `${process.env.FRONTED_URL}/pricing`
        return res.status(200).json({
            sessionUrl: session.url
        })

    } catch (error) {
        return res.status(500).json({
            msg: `biling error ${error.message} `
        })
    }
}

module.exports = billing