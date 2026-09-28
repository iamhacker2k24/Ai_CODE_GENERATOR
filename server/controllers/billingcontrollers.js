const PLANS = require("../config/plan");
const stripe = require("../config/stripe");


//billing is not completed ok
const billing = async (req, res) => {
    console.log("billing page working........")
    // console.log(PLANS.pro)
    try {
        const { planType } = req.body
        //  console.log(req.user)
        // const userId = req.user._id;
        // console.log(planType)
        const user = req.user;
        console.log(user._id)
        const plan = PLANS[planType]
        // console.log(plan)
        if (!plan || plan.price == 0) {
            return res.status(400).json({
                msg: "Invaild paid plan"
            })
        }
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
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
                userId: user._id.toString(),
                credits: plan.credits,
                plan: plan.plan
            },
            success_url: `${process.env.FRONTED_URL}`,
            cancel_url: `${process.env.FRONTED_URL}/pricing`
        })


        console.log(session)
        return res.status(200).json({
            sessionUrl: session.url
        })

    } catch (error) {
        return res.status(500).json({
            msg: `biling error => ${error.message} `
        })
    }
}

module.exports = billing