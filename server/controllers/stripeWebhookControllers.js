const stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"]
    let event;
    try {

        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            proecss.env.STRIPE_WEBHOOK_SECRET
        )
    } catch (error) {
        console.log(error.message)
    }

    if (event.type == "checkout.session.completed") {
        const seccion = event.data.object cosnt useId
    }
}


// 9.06