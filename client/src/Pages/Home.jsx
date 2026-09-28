import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import LoginModel from "../component/LoginModel";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import serverUrl from "../config";
import {
  Sparkles,
  Code2,
  Layout,
  Rocket,
  ArrowRight,
  Coins,
  Copy,
  Check,
  Terminal,
  RefreshCw,
  Eye,
  AlertCircle,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const highlights = [
    {
      title: "AI Generated Code",
      desc: "Clean semantic HTML, modern styling, and interactive JavaScript synthesized automatically from your natural language prompts.",
      icon: Code2,
      badge: "Intelligent",
      gradient: "from-purple-500 to-indigo-500",
      borderHover: "hover:border-purple-500/40",
      shadowHover: "hover:shadow-[0_0_35px_rgba(168,85,247,0.18)]",
    },
    {
      title: "Fully Responsive Layouts",
      desc: "Engineered from the ground up for seamless fluid responsiveness across mobile, tablet, laptop, and ultra-wide screens.",
      icon: Layout,
      badge: "Adaptive",
      gradient: "from-blue-500 to-cyan-500",
      borderHover: "hover:border-blue-500/40",
      shadowHover: "hover:shadow-[0_0_35px_rgba(59,130,246,0.18)]",
    },
    {
      title: "Production Ready Output",
      desc: "Zero boilerplate friction. Instant interactive live sandbox preview, ready for deployment and continuous customization.",
      icon: Rocket,
      badge: "High-Speed",
      gradient: "from-pink-500 to-rose-500",
      borderHover: "hover:border-pink-500/40",
      shadowHover: "hover:shadow-[0_0_35px_rgba(244,63,94,0.18)]",
    },
  ];

  const [openLogin, setOpenlogin] = useState(false);
  const [openProfile, setopenProfile] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { userData } = useSelector((state) => state.user);

  //   LOGOUT
  const handleLogout = async () => {
    try {
      console.log("logout ");
      setLoggingOut(true);

      const response = await axios.get(
        `${serverUrl}/api/auth/logout`,
        {
          withCredentials: true,
        },
      );

      console.log("Logout response:");

      if (response.ok || response.status === 200) {
        setopenProfile(false);

        // Reload application so Redux/auth state is refreshed
        window.location.reload();
      } else {
        console.error("Logout failed:");
        setLoggingOut(false);
      }
    } catch (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
    }
  };

  return (
    <>
      <div className="relative min-h-screen bg-[#030305] text-white selection:bg-purple-500 selection:text-white overflow-hidden">
        {/*   AMBIENT GLOWS & BACKGROUND GRID   */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top center hero aura */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-purple-600/25 via-indigo-600/15 to-transparent blur-[140px]" />
          {/* Left subtle ambient orb */}
          <div className="absolute top-1/4 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-[150px]" />
          {/* Right subtle ambient orb */}
          <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-[150px]" />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-80" />
        </div>

        {/*   NAVBAR   */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-[#030305]/75 border-b border-white/[0.08]"
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            {/* Logo */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-white/20 group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                GenWeb
                <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  .ai
                </span>
              </span>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Pricing */}
              <div
                onClick={() => navigate("/pricing")}
                className="hidden md:inline-flex items-center text-sm font-medium text-zinc-400 hover:text-white cursor-pointer px-3 py-1.5 rounded-lg hover:bg-white/[0.06] transition"
              >
                Pricing
              </div>

              {/* Credits */}
              {userData && (
                <button
                  onClick={() => navigate("/pricing")}
                  title={
                    (userData.credits ?? 0) < 25
                      ? "Credits Low (< 25). Click to get more credits on Pricing page!"
                      : "Available Credits. Click to view Pricing plans."
                  }
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-xl border text-xs font-medium transition cursor-pointer hover:scale-105 active:scale-95 ${
                    (userData.credits ?? 0) < 25
                      ? "bg-red-500/15 border-red-500/40 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.25)] animate-pulse hover:border-red-400"
                      : "bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/20 text-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.1)] hover:border-yellow-500/40"
                  }`}
                >
                  {(userData.credits ?? 0) < 25 ? (
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  ) : (
                    <Coins className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                  )}
                  <span className={(userData.credits ?? 0) < 25 ? "text-red-300" : "text-zinc-400"}>
                    Credits:
                  </span>
                  <span className={`font-semibold ${(userData.credits ?? 0) < 25 ? "text-red-400 font-mono" : "text-yellow-300"}`}>
                    {userData.credits ?? 0}
                  </span>
                  {(userData.credits ?? 0) < 25 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-red-500/25 text-red-300 border border-red-500/40 ml-0.5">
                      Low
                    </span>
                  )}
                </button>
              )}

              {/*   USER PROFILE / AUTH   */}
              {userData ? (
                <div className="relative">
                  {/* Profile Button */}
                  <button
                    onClick={() => setopenProfile(!openProfile)}
                    className="relative w-10 h-10 rounded-full p-[1.5px] bg-gradient-to-tr from-purple-500 via-indigo-500 to-blue-500 hover:scale-105 transition-all shadow-md focus:outline-none"
                  >
                    <img
                      src={userData.avatar}
                      alt={userData.name || "User"}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </button>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {openProfile && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: -10,
                          scale: 0.95,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                        }}
                        exit={{
                          opacity: 0,
                          y: -10,
                          scale: 0.95,
                        }}
                        transition={{
                          duration: 0.2,
                        }}
                        className="absolute right-0 mt-3 w-64 bg-[#0a0a0d]/95 backdrop-blur-2xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] rounded-2xl overflow-hidden p-2 z-50"
                      >
                        {/* User Information */}
                        <div className="px-3.5 py-3 border-b border-white/[0.08] rounded-xl bg-white/[0.03]">
                          <div className="flex items-center gap-3">
                            <img
                              src={userData.avatar}
                              alt={userData.name || "User"}
                              className="w-10 h-10 rounded-full object-cover border border-white/20 shadow-sm"
                            />

                            <div className="min-w-0">
                              <p className="font-medium text-sm text-white truncate">
                                {userData.name}
                              </p>

                              <p className="text-xs text-zinc-400 truncate">
                                {userData.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Credits */}
                        <div className="px-3.5 py-2.5 my-1.5 flex items-center justify-between rounded-xl bg-gradient-to-r from-yellow-500/10 to-amber-500/5 border border-yellow-500/15">
                          <span className="text-xs text-zinc-400">
                            Available Credits
                          </span>

                          <span className="text-xs font-bold text-yellow-400 flex items-center gap-1.5">
                            <Coins className="w-3.5 h-3.5" />
                            {userData.credits ?? 0}
                          </span>
                        </div>

                        {/* Menu Options */}
                        <div className="space-y-0.5">
                          <button
                            onClick={() => {
                              setopenProfile(false);
                              navigate("/dashboard");
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:bg-white/[0.08] hover:text-white transition"
                          >
                            Dashboard
                          </button>

                          <button
                            onClick={() => setopenProfile(false)}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:bg-white/[0.08] hover:text-white transition"
                          >
                            Settings
                          </button>

                          {/* LOGOUT */}
                          <button
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/15 hover:text-red-300 transition disabled:opacity-50"
                          >
                            {loggingOut ? "Logging out..." : "Logout"}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Login / Get Started */
                <button
                  onClick={() => setOpenlogin(true)}
                  className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs sm:text-sm hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  Get started
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/*   HERO SECTION: 2-COLUMN SPLIT (CODE ANIMATION ON LEFT, AUTH/DASHBOARD ON RIGHT)   */}
        <section className="relative pt-36 sm:pt-44 pb-20 md:pb-28 px-4 sm:px-6 max-w-7xl mx-auto z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* LEFT SIDE: CODE GENERATING ANIMATION */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <CodeWritingShowcase />
            </div>

            {/* RIGHT SIDE: HERO CONTENT & AUTH / DASHBOARD ACTIONS */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 order-1 lg:order-2 text-left"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Next-Gen AI Website Synthesis</span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.08] text-white">
                Build Stunning Websites{" "}
                <span className="block mt-1 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                  With Real AI
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">
                Describe your vision in natural language and let AI synthesize clean, production-ready, responsive websites in seconds.
              </p>

              {/* AUTH / DASHBOARD ACTIONS */}
              {userData ? (
                /* LOGGED IN USER: WELCOME + GO TO DASHBOARD */
                <div className="mt-8 p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-2xl">
                  <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
                    <img
                      src={userData.avatar}
                      alt={userData.name || "User"}
                      className="w-11 h-11 rounded-full object-cover border border-white/20 shadow-md"
                    />
                    <div className="min-w-0">
                      <p className="text-xs text-zinc-400 font-medium">Welcome back,</p>
                      <p className="text-sm font-bold text-white truncate">
                        {userData.name || "Creator"}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-xs font-semibold text-yellow-300">
                      <Coins size={13} className="text-yellow-400" />
                      <span>{userData.credits ?? 0}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="flex-1 px-6 py-3.5 rounded-xl bg-white text-black font-bold text-sm shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(168,85,247,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Go to Dashboard</span>
                      <ArrowRight size={16} />
                    </button>
                    <button
                      onClick={() => navigate("/generate")}
                      className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>+ New Project</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* NOT LOGGED IN: LOGIN / GET STARTED BUTTON */
                <div className="mt-8 space-y-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                    <button
                      onClick={() => setOpenlogin(true)}
                      className="group relative px-8 py-4 rounded-xl bg-white text-black font-bold text-sm sm:text-base shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:shadow-[0_0_40px_rgba(168,85,247,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                    >
                      <span>Get Started / Login</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>

                    <button
                      onClick={() => navigate("/pricing")}
                      className="px-6 py-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white font-medium text-sm border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      View Pricing
                    </button>
                  </div>

                  {/* Benefit checkmarks */}
                  <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>50 Free Credits</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Instant Code Export</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>No Credit Card</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/*   HIGHLIGHTS SECTION   */}
        <section className="relative max-w-7xl mx-auto px-6 pb-28 md:pb-36 z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {highlights.map((h, i) => {
              const IconComponent = h.icon;
              return (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 0,
                    y: 35,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.12,
                  }}
                  className={`group relative rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/[0.08] p-8 backdrop-blur-xl transition-all duration-300 ${h.borderHover} ${h.shadowHover}`}
                >
                  {/* Accent Top Border Highlight */}
                  <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-white/40 transition-colors" />

                  {/* Icon & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${h.gradient} flex items-center justify-center text-white shadow-lg shadow-black/40 group-hover:scale-110 transition-transform duration-200`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-zinc-400 group-hover:text-zinc-200 transition-colors">
                      {h.badge}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold mb-2.5 text-white group-hover:text-zinc-100 transition-colors">
                    {h.title}
                  </h2>

                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {h.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/*   FOOTER   */}
        <footer className="relative border-t border-white/[0.08] py-10 text-center text-sm text-zinc-500 bg-[#020204]/80 backdrop-blur-md z-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="font-semibold text-zinc-300">GenWeb.ai</span>
            </div>
            <p className="text-xs text-zinc-500">
              &copy; {new Date().getFullYear()} GenWeb.ai. All rights reserved.
            </p>
          </div>
        </footer>

        {/*   LOGIN MODAL   */}
        {openLogin && (
          <LoginModel open={openLogin} onClose={() => setOpenlogin(false)} />
        )}
      </div>
    </>
  );
};

// ==========================================
// ANIMATED CODE WRITING & LIVE PREVIEW SHOWCASE
// ==========================================

const CODE_SNIPPET = [
  {
    tokens: [
      { text: "// AI synthesizing responsive component...", color: "text-zinc-500 italic" },
    ],
  },
  {
    tokens: [
      { text: "import ", color: "text-purple-400 font-semibold" },
      { text: "{ motion } ", color: "text-cyan-300" },
      { text: "from ", color: "text-purple-400 font-semibold" },
      { text: '"motion/react";', color: "text-emerald-300" },
    ],
  },
  {
    tokens: [
      { text: "import ", color: "text-purple-400 font-semibold" },
      { text: "{ Sparkles, ArrowRight } ", color: "text-cyan-300" },
      { text: "from ", color: "text-purple-400 font-semibold" },
      { text: '"lucide-react";', color: "text-emerald-300" },
    ],
  },
  {
    tokens: [
      { text: "", color: "" },
    ],
  },
  {
    tokens: [
      { text: "export default function ", color: "text-purple-400 font-semibold" },
      { text: "HeroShowcase", color: "text-yellow-300 font-semibold" },
      { text: "() {", color: "text-zinc-300" },
    ],
  },
  {
    tokens: [
      { text: "  return (", color: "text-purple-400 font-semibold" },
    ],
  },
  {
    tokens: [
      { text: "    <div ", color: "text-blue-400" },
      { text: "className", color: "text-cyan-300" },
      { text: '="relative p-6 rounded-2xl bg-zinc-950 border border-white/10">', color: "text-emerald-300" },
    ],
  },
  {
    tokens: [
      { text: "      <div ", color: "text-blue-400" },
      { text: "className", color: "text-cyan-300" },
      { text: '="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs">', color: "text-emerald-300" },
    ],
  },
  {
    tokens: [
      { text: "        <Sparkles ", color: "text-blue-400" },
      { text: "size", color: "text-cyan-300" },
      { text: "={14} /> AI Powered Website", color: "text-zinc-200" },
      { text: "      </div>", color: "text-blue-400" },
    ],
  },
  {
    tokens: [
      { text: "      <h1 ", color: "text-blue-400" },
      { text: "className", color: "text-cyan-300" },
      { text: '="text-2xl font-black text-white mt-3 leading-tight">', color: "text-emerald-300" },
    ],
  },
  {
    tokens: [
      { text: "        Intelligent Web Creation", color: "text-white font-bold" },
    ],
  },
  {
    tokens: [
      { text: "      </h1>", color: "text-blue-400" },
    ],
  },
  {
    tokens: [
      { text: "      <button ", color: "text-blue-400" },
      { text: "className", color: "text-cyan-300" },
      { text: '="mt-4 px-5 py-2.5 rounded-xl bg-white text-black font-semibold hover:scale-105 transition">', color: "text-emerald-300" },
    ],
  },
  {
    tokens: [
      { text: "        Explore Studio →", color: "text-zinc-900 font-semibold" },
    ],
  },
  {
    tokens: [
      { text: "      </button>", color: "text-blue-400" },
    ],
  },
  {
    tokens: [
      { text: "    </div>", color: "text-blue-400" },
    ],
  },
  {
    tokens: [
      { text: "  );", color: "text-purple-400 font-semibold" },
    ],
  },
  {
    tokens: [
      { text: "}", color: "text-zinc-300" },
    ],
  },
];

const PRECOMPUTED_CODE_LINES = (() => {
  let acc = 0;
  return CODE_SNIPPET.map((line) => {
    const lineStart = acc;
    const tokens = line.tokens.map((token) => {
      const tokenStart = acc;
      acc += token.text.length;
      return {
        ...token,
        start: tokenStart,
        length: token.text.length,
      };
    });
    acc += 1;
    return { lineStart, tokens };
  });
})();

const TOTAL_CODE_CHARS = CODE_SNIPPET.reduce((acc, line) => {
  return acc + line.tokens.reduce((lineAcc, t) => lineAcc + t.text.length, 0) + 1;
}, 0);

function CodeWritingShowcase() {
  const [charCount, setCharCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("code"); // "code" | "preview"

  useEffect(() => {
    let timer;
    if (!isCompleted) {
      timer = setInterval(() => {
        setCharCount((prev) => {
          if (prev >= TOTAL_CODE_CHARS) {
            setIsCompleted(true);
            return prev;
          }
          return prev + 1;
        });
      }, 22);
    } else {
      timer = setTimeout(() => {
        setCharCount(0);
        setIsCompleted(false);
      }, 4500);
    }

    return () => {
      clearInterval(timer);
      clearTimeout(timer);
    };
  }, [isCompleted]);

  const handleCopy = () => {
    const fullCode = CODE_SNIPPET.map((line) =>
      line.tokens.map((t) => t.text).join("")
    ).join("\n");
    navigator.clipboard?.writeText(fullCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRestart = () => {
    setCharCount(0);
    setIsCompleted(false);
  };

  return (
    <div className="relative rounded-3xl border border-white/[0.12] bg-[#09090f]/95 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.85),0_0_60px_rgba(139,92,246,0.12)] overflow-hidden">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-black/60 border-b border-white/[0.08]">
        {/* Window controls */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-sm shadow-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm shadow-amber-500/50" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-sm shadow-emerald-500/50" />
        </div>

        {/* Tab switchers: Code vs Preview */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.05] border border-white/[0.08] text-xs">
          <button
            onClick={() => setActiveTab("code")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-[11px] transition-all cursor-pointer ${
              activeTab === "code"
                ? "bg-white/15 text-white font-semibold shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>HeroSection.jsx</span>
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-[11px] transition-all cursor-pointer ${
              activeTab === "preview"
                ? "bg-white/15 text-white font-semibold shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span>Live Output</span>
          </button>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-medium border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            {isCompleted ? "Build Ready" : "AI Streaming"}
          </span>
        </div>
      </div>

      {/* Prompt Bar */}
      <div className="flex items-center justify-between gap-2 px-4 py-2 bg-white/[0.02] border-b border-white/[0.06] text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span className="text-zinc-400 font-mono text-[11px] truncate">
            Prompt: "Generate SaaS hero with responsive layout & glowing CTA"
          </span>
        </div>
        <div className="flex items-center gap-1 text-zinc-400 shrink-0">
          <button
            onClick={handleRestart}
            className="p-1 rounded-md hover:bg-white/10 hover:text-white transition cursor-pointer"
            title="Restart Typing Animation"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
          <button
            onClick={handleCopy}
            className="p-1 rounded-md hover:bg-white/10 hover:text-white transition flex items-center gap-1 cursor-pointer"
            title="Copy Code"
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>

      {/* Window Body: Either Code Typing or Live Preview */}
      {activeTab === "code" ? (
        <div className="flex flex-col bg-[#06060a]/95 h-[380px] sm:h-[420px]">
          {/* Code Container with syntax colors & cursor */}
          <div className="flex-1 p-4 font-mono text-[11px] sm:text-xs leading-relaxed overflow-y-auto overflow-x-auto select-text scrollbar-thin scrollbar-thumb-white/10">
            {PRECOMPUTED_CODE_LINES.map((line, lineIdx) => {
              if (line.lineStart > charCount) {
                return (
                  <div key={lineIdx} className="flex items-start opacity-25">
                    <span className="w-6 text-zinc-700 select-none text-right pr-3 shrink-0">
                      {lineIdx + 1}
                    </span>
                    <span className="text-zinc-800">·</span>
                  </div>
                );
              }

              return (
                <div key={lineIdx} className="flex items-start">
                  <span className="w-6 text-zinc-600 select-none text-right pr-3 shrink-0">
                    {lineIdx + 1}
                  </span>
                  <div className="flex-1 whitespace-pre-wrap break-all">
                    {line.tokens.map((token, tokenIdx) => {
                      if (charCount <= token.start) {
                        return null;
                      }

                      const isCurrent =
                        charCount > token.start && charCount <= token.start + token.length;
                      const displayText = isCurrent
                        ? token.text.slice(0, charCount - token.start)
                        : token.text;

                      return (
                        <span key={tokenIdx} className={token.color}>
                          {displayText}
                          {isCurrent && (
                            <span className="inline-block w-1.5 h-3.5 bg-purple-400 animate-pulse ml-0.5 align-middle" />
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Status Footer */}
          <div className="flex items-center justify-between px-4 py-2 bg-black/60 border-t border-white/[0.06] text-[10px] text-zinc-500 font-mono">
            <span>Ln 14, Col 28</span>
            <span>UTF-8 · React 19 · Tailwind v4 · 180 tok/s</span>
          </div>
        </div>
      ) : (
        /* Live Preview Tab */
        <div className="flex flex-col bg-[#07070b]/95 h-[380px] sm:h-[420px] p-6 sm:p-8 items-center justify-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-purple-600/20 to-blue-600/20 blur-[80px] pointer-events-none" />

          <div className="relative w-full max-w-sm rounded-2xl bg-white/[0.04] border border-white/10 p-5 shadow-2xl backdrop-blur-xl text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Live Generated Output</span>
            </div>
            <h3 className="text-xl font-bold text-white">Intelligent Web Studio</h3>
            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
              Synthesized in real-time from prompt to full React + Tailwind code.
            </p>
            <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-around text-center">
              <div>
                <p className="text-xs font-bold text-emerald-400">100/100</p>
                <p className="text-[10px] text-zinc-500">Lighthouse</p>
              </div>
              <div>
                <p className="text-xs font-bold text-cyan-400">Instant</p>
                <p className="text-[10px] text-zinc-500">Preview</p>
              </div>
              <div>
                <p className="text-xs font-bold text-purple-400">Tailwind</p>
                <p className="text-[10px] text-zinc-500">v4 Ready</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
