import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Sparkles,
  Zap,
  Code2,
  Wand2,
  CheckCircle2,
  Lightbulb,
  AlertCircle,
  Loader2,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import serverUrl from "../config";

const PROMPT_SUGGESTIONS = [
  {
    label: "SaaS Landing Page",
    prompt:
      "Modern AI SaaS landing page with dark obsidian theme, animated hero badge, feature grid with glowing borders, pricing table with monthly/yearly toggle, and FAQ accordion.",
  },
  {
    label: "Designer Portfolio",
    prompt:
      "Minimalist creative portfolio for a senior UI/UX designer. Includes interactive project showcase grid, skills radar, testimonial slider, and a clean contact form.",
  },
  {
    label: "Fintech Dashboard",
    prompt:
      "High-tech crypto and financial analytics dashboard. Features balance card with gradient accents, live transactions table, market trend charts, and asset distribution.",
  },
  {
    label: "Artisanal Coffee Shop",
    prompt:
      "Elegant warm cafe website with full-screen hero imagery, seasonal beverage tabs, online reservation modal, and interactive location map with opening hours.",
  },
];

export default function Generate() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);

  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    console.log("Website Description:", description);

    try {
      setLoading(true);
      setError("");
      const prompt = description;
      const result = await axios.post(
        `${serverUrl}/api/website/generateWebsite`,
        {
          prompt,
        },
        { withCredentials: true }
      );
      console.log(result);

      // Navigate to editor if a website ID is returned
      const websiteId =
        result?.data?.websiteId ||
        result?.data?.website?._id ||
        result?.data?._id ||
        result?.data?.id;

      if (websiteId) {
        navigate(`/editor/${websiteId}`);
      }
    } catch (err) {
      console.log(err.message);
      const errData = err.response?.data;
      const errorMessage =
        errData?.messsage || // Backend typo "messsage" with 3 s's
        errData?.message ||
        errData?.msg ||
        err.message ||
        "Generation encountered an issue. Please verify your connection and try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const wordCount = description.trim() ? description.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-screen bg-[#060608] text-white selection:bg-purple-500/30 selection:text-purple-200 relative overflow-x-hidden font-sans">
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-32 w-[450px] h-[450px] bg-indigo-600/12 rounded-full blur-[140px]" />
        <div className="absolute -bottom-32 left-10 w-[450px] h-[450px] bg-pink-600/10 rounded-full blur-[150px]" />
        {/* Subtle grid mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      {/*   STICKY TOP NAVIGATION BAR   */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-zinc-950/70 border-b border-zinc-800/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Left Side: Back & Brand */}
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => navigate("/dashboard")}
              aria-label="Back to dashboard"
              className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                <Wand2 size={16} />
              </div>
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                GenWeb
                <span className="text-xs px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/25 text-purple-300 font-medium">
                  Studio
                </span>
              </h1>
            </div>
          </div>

          {/* Right Side: Credits & Quick Links */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/pricing")}
              title={
                (userData?.credits ?? 0) < 25
                  ? "Credits Low (< 25). Click to get more credits on Pricing page!"
                  : "Available Credits. Click to view Pricing plans."
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
                (userData?.credits ?? 0) < 25
                  ? "bg-red-500/15 border-red-500/40 text-red-400 animate-pulse hover:bg-red-500/25"
                  : "bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white"
              }`}
            >
              {(userData?.credits ?? 0) < 25 ? (
                <AlertCircle size={13} className="text-red-400 shrink-0" />
              ) : (
                <Zap size={13} className="text-amber-400 shrink-0" />
              )}
              <span>
                <strong className={`font-semibold ${(userData?.credits ?? 0) < 25 ? "text-red-300" : "text-white"}`}>
                  {userData?.credits ?? 0}
                </strong>{" "}
                Credits
              </span>
              {(userData?.credits ?? 0) < 25 && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-red-500/25 text-red-300 border border-red-500/40 ml-0.5">
                  Low
                </span>
              )}
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 text-xs font-medium text-zinc-300 hover:text-white transition cursor-pointer"
            >
              <Layers size={13} />
              <span>My Projects</span>
            </button>
          </div>
        </div>
      </header>

      {/*   MAIN CONTAINER   */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/*   HERO INTRO   */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-4 shadow-[0_0_20px_rgba(168,85,247,0.12)]">
            <Sparkles size={13} className="text-purple-400" />
            <span>AI Neural Web Synthesis</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Build Websites with{" "}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
              Real AI Power
            </span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto mt-3.5 leading-relaxed">
            Describe your application vision in plain English. GenWeb synthesizes clean semantic HTML, Tailwind styling, and interactive JavaScript in seconds.
          </p>
        </motion.div>

        {/*   ERROR ALERT NOTIFICATION   */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 sm:p-5 flex items-start gap-3.5 text-red-200"
            >
              <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-300">
                  {String(error).toLowerCase().includes("credit")
                    ? "Insufficient Credits"
                    : "Generation Error"}
                </p>
                <p className="text-xs text-red-400/90 mt-0.5">{error}</p>
                {String(error).toLowerCase().includes("credit") && (
                  <button
                    onClick={() => navigate("/pricing")}
                    className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-red-600/30 transition cursor-pointer"
                  >
                    <span>Get More Credits</span>
                    <ArrowRight size={13} />
                  </button>
                )}
              </div>
              <button
                onClick={() => setError("")}
                className="text-xs text-red-400 hover:text-red-200 underline cursor-pointer"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/*   INTERACTIVE PROMPT CARD   */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative rounded-3xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-purple-900/10"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Code2 size={16} />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Describe Your Website
              </h3>
            </div>

            {description && (
              <button
                onClick={() => setDescription("")}
                disabled={loading}
                className="text-xs text-zinc-400 hover:text-white transition cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Textarea Input */}
          <div className="relative group">
            <textarea
              name="description"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              placeholder="e.g. Build a sleek SaaS landing page for an AI copywriter with a dark modern theme, pricing cards with toggle, live feature demo mockups, and client testimonials..."
              className="w-full h-56 p-5 sm:p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800 text-white placeholder-zinc-500 text-sm leading-relaxed outline-none resize-none focus:border-purple-500/70 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 disabled:opacity-50"
            />

            {/* Live Character & Word Count Badge */}
            <div className="absolute bottom-4 right-4 flex items-center gap-3 pointer-events-none text-[11px] font-medium text-zinc-500">
              <span>{wordCount} words</span>
              <span className="w-1 h-1 rounded-full bg-zinc-700" />
              <span>{description.length} characters</span>
            </div>
          </div>

          {/* Quick-Prompt Suggestions */}
          <div className="mt-5">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-2.5">
              <Lightbulb size={13} className="text-amber-400" />
              <span className="font-medium">Need inspiration? Click a starter template:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {PROMPT_SUGGESTIONS.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  disabled={loading}
                  onClick={() => setDescription(item.prompt)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/60 hover:border-purple-500/40 text-xs text-zinc-300 hover:text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/*   GENERATE ACTION BUTTON   */}
          <div className="mt-8 pt-6 border-t border-zinc-800/70 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-zinc-400 text-center sm:text-left">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>AI Engine Ready • 100% Responsive Code</span>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!description.trim() || loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 shadow-xl shadow-purple-600/25 hover:shadow-purple-600/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin text-white" />
                  <span>Synthesizing Website...</span>
                </>
              ) : (
                <>
                  <Wand2 size={16} />
                  <span>Generate Website</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/*   PILLARS / WHAT TO EXPECT   */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
        >
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 backdrop-blur-xl p-5 hover:border-zinc-700 transition">
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <CheckCircle2 size={16} />
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Production-Ready
              </h4>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Synthesizes semantic HTML5, modern Tailwind CSS, and interactive JavaScript without messy boilerplate.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 backdrop-blur-xl p-5 hover:border-zinc-700 transition">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <CheckCircle2 size={16} />
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Live Sandbox Preview
              </h4>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Test and interact with your website instantly inside our built-in real-time browser preview.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 backdrop-blur-xl p-5 hover:border-zinc-700 transition">
            <div className="flex items-center gap-2 text-pink-400 mb-2">
              <CheckCircle2 size={16} />
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Continuous Iteration
              </h4>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Easily refine styles, ask for code adjustments, or edit the codebase directly inside the interactive code editor.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
