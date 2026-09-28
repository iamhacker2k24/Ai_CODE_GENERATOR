import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Plus,
  Globe,
  Sparkles,
  Code2,
  ExternalLink,
  RefreshCw,
  Search,
  Calendar,
  Zap,
  AlertCircle,
  ArrowRight,
  Laptop,
  Clock,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import serverUrl from "../config";

export default function Dashboard() {
  const userData = useSelector((state) => state.user.userData);
  const navigate = useNavigate();

  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Auto fetch websites from backend on mount and whenever refreshed
  useEffect(() => {
    let ignore = false;

    const fetchAllWebsites = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/website/getAll`, {
          withCredentials: true,
        });

        if (!ignore) {
          let list = [];
          if (Array.isArray(res.data)) {
            list = res.data;
          } else if (Array.isArray(res.data?.websites)) {
            list = res.data.websites;
          } else if (Array.isArray(res.data?.data)) {
            list = res.data.data;
          } else if (Array.isArray(res.data?.allWebsites)) {
            list = res.data.allWebsites;
          } else if (res.data && typeof res.data === "object") {
            const foundArray = Object.values(res.data).find(Array.isArray);
            if (foundArray) list = foundArray;
          }
          setWebsites(list);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          console.error("Error fetching websites:", err);
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load websites. Please check your backend connection."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
          setIsRefreshing(false);
        }
      }
    };

    fetchAllWebsites();

    return () => {
      ignore = true;
    };
  }, [refreshTrigger]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefreshTrigger((prev) => prev + 1);
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "Recently created";
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return "Recently created";
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recently created";
    }
  };

  // Filtered websites based on search query
  const filteredWebsites = useMemo(() => {
    if (!searchQuery.trim()) return websites;
    const query = searchQuery.toLowerCase();
    return websites.filter((site) => {
      const title = (site.title || site.prompt || "").toLowerCase();
      const prompt = (site.prompt || site.description || "").toLowerCase();
      return title.includes(query) || prompt.includes(query);
    });
  }, [websites, searchQuery]);

  return (
    <div className="min-h-screen bg-[#060608] text-white selection:bg-purple-500/30 selection:text-purple-200 relative overflow-x-hidden font-sans">
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/15 rounded-full blur-[130px]" />
        <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px]" />
        <div className="absolute -bottom-32 left-1/3 w-[450px] h-[450px] bg-pink-600/10 rounded-full blur-[140px]" />
        {/* Subtle grid mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      {/*   STICKY TOP NAVIGATION BAR   */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-zinc-950/70 border-b border-zinc-800/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Left Side: Back & Breadcrumb */}
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => navigate("/")}
              aria-label="Back to home"
              className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                <Globe size={16} />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                  GenWeb <span className="text-zinc-500 font-normal">/</span> Dashboard
                </h1>
              </div>
            </div>
          </div>

          {/* Right Side: Quick Stats & New Website Action */}
          <div className="flex items-center gap-3">
            {/* User Credits Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300">
              <Zap size={13} className="text-amber-400" />
              <span>
                <strong className="text-white font-semibold">{userData?.credits ?? 0}</strong> Credits
              </span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || loading}
              title="Refresh website list"
              className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={isRefreshing || loading ? "animate-spin text-purple-400" : ""}
              />
            </button>

            {/* New Website Button */}
            <button
              onClick={() => navigate("/generate")}
              className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus size={16} className="transition-transform group-hover:rotate-90 duration-300" />
              <span>New Website</span>
            </button>
          </div>
        </div>
      </header>

      {/*   MAIN DASHBOARD CONTENT   */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium mb-2.5">
                <Sparkles size={12} className="text-purple-400" />
                <span>AI Workspace & Management</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
                  {userData?.name || "Creator"}
                </span>{" "}
                👋
              </h2>
              <p className="text-sm text-zinc-400 mt-1.5 max-w-2xl">
                Explore all your synthesized web apps, launch live interactive sandboxes, or prompt a brand-new project.
              </p>
            </div>

            {/* Quick Action Link to Pricing / Plan */}
            <div className="flex items-center gap-3 self-start md:self-auto">
              <button
                onClick={() => navigate("/pricing")}
                className="px-3.5 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-purple-500/40 text-xs font-medium text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
              >
                <Zap size={14} className="text-amber-400" />
                <span>Upgrade Plan</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/*   METRICS & STATS CARDS   */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10"
        >
          {/* Websites Card */}
          <div className="relative group overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900/70 backdrop-blur-xl p-5 sm:p-6 transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Total Websites
              </span>
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                <Globe size={18} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-white tracking-tight">
                {loading ? "..." : websites.length}
              </h3>
              <span className="text-xs text-purple-400 font-medium">Synthesized</span>
            </div>
            <p className="text-xs text-zinc-400 mt-2">
              Live interactive apps generated with AI
            </p>
          </div>

          {/* Credits Remaining Card */}
          <div className="relative group overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900/70 backdrop-blur-xl p-5 sm:p-6 transition-all duration-300 hover:border-indigo-500/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.1)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Credits Remaining
              </span>
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                <Zap size={18} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-white tracking-tight">
                {userData?.credits ?? 0}
              </h3>
              <span className="text-xs text-indigo-400 font-medium">Tokens</span>
            </div>
            <p className="text-xs text-zinc-400 mt-2">
              Used for generative prompts and live revisions
            </p>
          </div>

          {/* Account Profile Card */}
          <div className="relative group overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900/70 backdrop-blur-xl p-5 sm:p-6 transition-all duration-300 hover:border-pink-500/40 hover:shadow-[0_0_30px_rgba(236,72,153,0.1)] sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Active Account
              </span>
              <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 group-hover:scale-110 transition-transform">
                <Sparkles size={18} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-lg font-bold text-white truncate">
                {userData?.email || "user@example.com"}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400 font-medium">Session Active</span>
              </div>
            </div>
            <p className="text-xs text-zinc-400 mt-2">
              Connected to GenWeb cloud workspace
            </p>
          </div>
        </motion.div>

        {/*   WEBSITES SECTION HEADER & CONTROLS   */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
              <Laptop size={18} />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Generated Websites
            </h3>
            {!loading && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                {filteredWebsites.length}
              </span>
            )}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search websites by name or prompt..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm text-white placeholder-zinc-500 outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-white cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/*   ERROR ALERT STATE   */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-red-200"
          >
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-red-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-300">Failed to load websites</p>
                <p className="text-xs text-red-400/80 mt-0.5">{error}</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="px-4 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-xs font-semibold text-red-200 transition-colors self-start sm:self-auto cursor-pointer"
            >
              Retry
            </button>
          </motion.div>
        )}

        {/*   LOADING STATE SKELETONS   */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 space-y-4 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800" />
                  <div className="w-16 h-5 rounded-full bg-zinc-800" />
                </div>
                <div className="w-3/4 h-5 rounded bg-zinc-800" />
                <div className="w-full h-12 rounded bg-zinc-800/50" />
                <div className="pt-4 border-t border-zinc-800/60 flex justify-between items-center">
                  <div className="w-20 h-4 rounded bg-zinc-800" />
                  <div className="w-24 h-8 rounded-lg bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/*   EMPTY STATE   */}
        {!loading && !error && websites.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/50 via-zinc-900/30 to-black/40 backdrop-blur-xl min-h-[380px] p-8 sm:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden"
          >
            <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-purple-600/20 via-indigo-600/20 to-pink-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-5 shadow-[0_0_40px_rgba(168,85,247,0.15)]">
              <Globe size={32} />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              No websites created yet
            </h3>

            <p className="text-sm text-zinc-400 mt-2 max-w-md leading-relaxed">
              Synthesize your very first full-featured website in seconds with AI. Just write a prompt and watch the code generate in real time.
            </p>

            <button
              onClick={() => navigate("/generate")}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-purple-600/25 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus size={16} />
              <span>Create Your First Website</span>
            </button>
          </motion.div>
        )}

        {/*   NO SEARCH RESULTS STATE   */}
        {!loading && !error && websites.length > 0 && filteredWebsites.length === 0 && (
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-12 text-center">
            <Search size={28} className="mx-auto text-zinc-500 mb-3" />
            <h4 className="text-base font-semibold text-white">No websites match your search</h4>
            <p className="text-xs text-zinc-400 mt-1">
              Try adjusting your search terms or clear the filter.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        )}

        {/*   WEBSITES GRID DISPLAY   */}
        {!loading && !error && filteredWebsites.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredWebsites.map((site, index) => {
                const siteId = site._id || site.id;
                const siteTitle =
                  site.title ||
                  (site.prompt ? site.prompt.slice(0, 40) + "..." : null) ||
                  `Project #${index + 1}`;
                const promptDesc = site.prompt || site.description || "Generated with GenWeb AI";
                const createdDate = formatDate(site.createdAt);

                return (
                  <motion.div
                    key={siteId || index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                    className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800/90 bg-gradient-to-b from-zinc-900/60 to-zinc-950/70 hover:from-zinc-900/80 hover:to-zinc-900/90 backdrop-blur-xl p-5 transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_10px_30px_rgba(168,85,247,0.12)] hover:-translate-y-1"
                  >
                    {/* Top Row: Mini Mock Browser Header & Status */}
                    <div>
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/60">
                        {/* 3 Browser Dots */}
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                        </div>

                        {/* Status Badge */}
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Ready
                        </span>
                      </div>

                      {/* Website Icon & Title */}
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
                          <Code2 size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                            {siteTitle}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                            <Calendar size={12} />
                            <span>{createdDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Prompt Description Preview */}
                      <p className="text-xs text-zinc-400 line-clamp-2 mt-3 leading-relaxed">
                        {promptDesc}
                      </p>

                      {/* Tech Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-4">
                        <span className="px-2 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700/60 text-[10px] font-medium text-zinc-300">
                          HTML5
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700/60 text-[10px] font-medium text-zinc-300">
                          Tailwind
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700/60 text-[10px] font-medium text-zinc-300">
                          JavaScript
                        </span>
                        {site.latestCode && (
                          <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-[10px] font-medium text-purple-300">
                            Full Source
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-5 pt-4 border-t border-zinc-800/70 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                        <Clock size={12} />
                        <span>Interactive App</span>
                      </div>

                      <button
                        onClick={() => navigate(siteId ? `/editor/${siteId}` : "/generate")}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <span>Open Editor</span>
                        {siteId ? <ArrowRight size={13} /> : <ExternalLink size={13} />}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
}
