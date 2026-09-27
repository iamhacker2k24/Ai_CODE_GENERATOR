import React, { useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const serverUrl = "http://localhost:3000";

const Pricing = () => {
  const navigate = useNavigate();

 const userData = useSelector((state) => state.user.userData);
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      key: "free",
      name: "Free",
      price: "₹0",
      credits: 50,
      description: "For beginners exploring AI website generation",
      features: [
        "Basic AI generation",
        "50 credits",
        "Responsive layouts",
        "Basic editing",
      ],
      popular: false,
      button: "Get Started",
    },
    {
      key: "pro",
      name: "Pro",
      price: "₹499",
      credits: 500,
      description: "For serious creators & freelancers",
      features: [
        "Everything in Free",
        "500 credits",
        "Faster generation",
        "Edit & regenerate",
        "Priority processing",
      ],
      popular: true,
      button: "Upgrade to Pro",
    },
    {
      key: "team",
      name: "Team",
      price: "₹999",
      credits: 1200,
      description: "For teams building projects together",
      features: [
        "Everything in Pro",
        "1200 credits",
        "Team collaboration",
        "Dedicated support",
      ],
      popular: false,
      button: "Contact Sales",
    },
  ];

  const handleBuy = async (planKey) => {
    // User is not logged in
    if (!userData) {
      navigate("/");
      return;
    }

    // Free plan does not require payment
    if (planKey === "free") {
      navigate("/dashboard");
      return;
    }

    try {
      setLoading(true);

      const result = await axios.post(
        `${serverUrl}/api/billing`,
        {
          planType: planKey,
        },
        {
          withCredentials: true,
        },
      );

      console.log("Billing response:", result.data);

      if (result.data?.sessionUrl) {
        window.location.href = result.data.sessionUrl;
      } else {
        console.error("No session URL received");
      }
    } catch (error) {
      console.error("Billing error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white px-6 pt-16 pb-24">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-20 w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px]" />

        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-purple-600/20 blur-[120px]" />
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="
          relative z-10
          mb-8
          flex items-center gap-2
          text-sm
          text-zinc-400
          hover:text-white
          transition
        "
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-4xl mx-auto text-center"
      >
        <p className="text-sm font-medium text-indigo-400 mb-3">
          SIMPLE PRICING
        </p>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Choose the plan that
          <span className="block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            works for you
          </span>
        </h1>

        <p className="mt-5 text-zinc-400 max-w-2xl mx-auto">
          Generate websites faster with AI. Choose a plan based on your
          generation and editing needs.
        </p>
      </motion.div>

      {/* Plans */}
      <div className="relative z-10 max-w-6xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p, i) => (
          <motion.div
            key={p.key}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
            }}
            className={`
              relative
              rounded-3xl
              border
              p-7
              backdrop-blur-xl
              ${
                p.popular
                  ? "border-indigo-500/60 bg-indigo-500/10 shadow-2xl shadow-indigo-500/10"
                  : "border-white/10 bg-white/[0.03]"
              }
            `}
          >
            {/* Popular badge */}
            {p.popular && (
              <div
                className="
                absolute
                -top-3
                left-1/2
                -translate-x-1/2
                rounded-full
                bg-indigo-500
                px-4
                py-1
                text-xs
                font-semibold
              "
              >
                Most Popular
              </div>
            )}

            {/* Plan name */}
            <h2 className="text-xl font-semibold">{p.name}</h2>

            {/* Description */}
            <p className="mt-2 text-sm text-zinc-400 min-h-[40px]">
              {p.description}
            </p>

            {/* Price */}
            <div className="mt-7 flex items-end gap-2">
              <span className="text-4xl font-bold">{p.price}</span>

              {p.key !== "free" && (
                <span className="pb-1 text-sm text-zinc-500">/month</span>
              )}
            </div>

            {/* Credits */}
            <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm text-zinc-400">Included credits</p>

              <p className="mt-1 text-xl font-semibold">{p.credits}</p>
            </div>

            {/* Features */}
            <div className="mt-7 space-y-3">
              {p.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 text-sm text-zinc-300"
                >
                  <div
                    className="
                    mt-0.5
                    flex
                    h-5
                    w-5
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-indigo-500/10
                    text-indigo-400
                  "
                  >
                    <Check size={13} />
                  </div>

                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Button */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              disabled={loading}
              onClick={() => handleBuy(p.key)}
              className={`
                mt-8
                w-full
                rounded-xl
                py-3
                font-semibold
                transition
                flex
                items-center
                justify-center
                gap-2

                ${
                  p.popular
                    ? "bg-indigo-500 hover:bg-indigo-600"
                    : "bg-white/10 hover:bg-white/20"
                }

                ${loading ? "opacity-60 cursor-not-allowed" : ""}
              `}
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Processing...
                </>
              ) : (
                p.button
              )}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
