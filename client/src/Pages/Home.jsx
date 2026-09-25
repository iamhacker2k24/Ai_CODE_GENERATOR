import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import LoginModel from "../component/LoginModel";
import { useSelector } from "react-redux";
import axios from "axios";

const Home = () => {
  const highlights = [
    "AI Generated Code",
    "Fully Responsive Layouts",
    "Production Ready Output",
  ];

  const [openLogin, setOpenlogin] = useState(false);
  const [openProfile, setopenProfile] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { userData } = useSelector((state) => state.user);

  // ================= LOGOUT =================
  const handleLogout = async () => {
    try {
      console.log("logout ");
      setLoggingOut(true);

      const response = await axios.get(
        "http://localhost:3000/api/auth/logout",
        {
          withCredentials: true,
        },
      );

    
      console.log("Logout response:");

      if (response.ok) {
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
      <div className="relative min-h-screen bg-[#040404] text-white overflow-hidden">
        {/* ================= NAVBAR ================= */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10"
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            {/* Logo */}
            <div className="text-lg font-semibold">GenWebAi</div>

            {/* Right Side */}
            <div className="flex items-center gap-5">
              {/* Pricing */}
              <div className="hidden md:inline text-sm text-zinc-400 hover:text-white cursor-pointer transition">
                Pricing
              </div>

              {/* Credits */}
              {userData && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 hover:bg-white/10 transition">
                  <span className="text-yellow-400">≡</span>

                  <span className="text-zinc-300">Credits</span>

                  <span>{userData.credits}</span>

                  <span className="font-semibold">+</span>
                </div>
              )}

              {/* ================= USER ================= */}
              {userData ? (
                <div className="relative">
                  {/* Profile Button */}
                  <button
                    onClick={() => setopenProfile(!openProfile)}
                    className="w-10 h-10 rounded-full overflow-hidden border border-white/20 hover:border-white/40 transition"
                  >
                    <img
                      src={userData.avatar}
                      alt={userData.name || "User"}
                      className="w-full h-full object-cover"
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
                        className="absolute right-0 mt-3 w-60 bg-[#0b0b0b] border border-white/10 shadow-2xl rounded-xl overflow-hidden"
                      >
                        {/* User Information */}
                        <div className="px-4 py-3 border-b border-white/10">
                          <div className="flex items-center gap-3">
                            <img
                              src={userData.avatar}
                              alt={userData.name || "User"}
                              className="w-10 h-10 rounded-full object-cover border border-white/10"
                            />

                            <div className="min-w-0">
                              <p className="font-medium text-white truncate">
                                {userData.name}
                              </p>

                              <p className="text-sm text-zinc-400 truncate">
                                {userData.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Credits */}
                        <div className="px-4 py-3 border-b border-white/10">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-400">
                              Available Credits
                            </span>

                            <span className="text-sm font-semibold text-yellow-400">
                              {userData.credits}
                            </span>
                          </div>
                        </div>

                        {/* Menu */}
                        <div className="p-2">
                          <button
                            onClick={() => setopenProfile(false)}
                            className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-white/10 hover:text-white transition"
                          >
                            Profile
                          </button>

                          <button
                            onClick={() => setopenProfile(false)}
                            className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-white/10 hover:text-white transition"
                          >
                            Settings
                          </button>

                          {/* LOGOUT */}
                          <button
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
                          >
                            {loggingOut ? "Logging out..." : "Logout"}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Login */
                <button
                  onClick={() => setOpenlogin(true)}
                  className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 text-sm transition"
                >
                  Get started
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* ================= HERO ================= */}
        <section className="pt-44 pb-22 px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 10 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold tracking-tight"
          >
            Build Stunning Website
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              With AI
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
            }}
            className="mt-8 max-w-2xl mx-auto text-zinc-400 text-lg"
          >
            Describe your idea and let AI generate a modern, responsive,
            production-ready website.
          </motion.p>

          <button
            className="px-10 py-4 rounded-xl bg-white text-black font-semibold hover:scale-105 transition mt-4"
            onClick={() => setOpenlogin(true)}
          >
            Get Started
          </button>
        </section>

        {/* ================= HIGHLIGHTS ================= */}
        <section className="max-w-7xl mx-auto px-6 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {highlights.map((h, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  y: 40,
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
                  delay: i * 0.1,
                }}
                className="rounded-2xl bg-white/5 border border-white/10 p-8 hover:bg-white/[0.07] transition"
              >
                <h2 className="text-xl font-semibold mb-3">{h}</h2>

                <p className="text-sm text-zinc-400">
                  GenWeb.ai builds real websites - clean code, animations,
                  responsiveness and scalable structure.
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="border-t border-white/10 py-10 text-center text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} GenWeb.ai
        </footer>

        {/* ================= LOGIN MODAL ================= */}
        {openLogin && (
          <LoginModel open={openLogin} onClose={() => setOpenlogin(false)} />
        )}
      </div>
    </>
  );
};

export default Home;
