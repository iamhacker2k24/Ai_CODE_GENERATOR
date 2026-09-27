import React from "react";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Dashboard() {
  const userData = useSelector((state) => state.user.userData);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setErrror] = useState(null);
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* ================= HEADER ================= */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* LEFT SIDE */}
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-lg hover:bg-white/10 transition"
            >
              <ArrowLeft size={16} />
            </button>

            {/* Dashboard Title */}
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>

          {/* NEW WEBSITE BUTTON */}
          <button
            onClick={() => navigate("/createwebsite")}
            className="px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:scale-105 transition"
          >
            + New Website
          </button>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          {/* Welcome Text */}
          <p className="text-sm text-zinc-400 mb-1">Welcome Back</p>

          {/* User Name */}
          <h1 className="text-3xl font-bold">{userData?.name || "User"}</h1>
        </motion.div>

        {/* ================= DASHBOARD CONTENT ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Websites Card */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.05] transition">
            <p className="text-sm text-zinc-400">Websites</p>

            <h2 className="text-3xl font-bold mt-2">0</h2>
          </div>

          {/* Projects Card */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.05] transition">
            <p className="text-sm text-zinc-400">Projects</p>

            <h2 className="text-3xl font-bold mt-2">0</h2>
          </div>

          {/* Account Card */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.05] transition">
            <p className="text-sm text-zinc-400">Account</p>

            <h2 className="text-lg font-semibold mt-2">
              {userData?.email || "No email"}
            </h2>
          </div>
        </motion.div>

        {/* ================= EMPTY STATE ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] min-h-[300px] flex flex-col items-center justify-center text-center"
        >
          <h2 className="text-xl font-semibold">No websites yet</h2>

          <p className="text-sm text-zinc-400 mt-2 max-w-md">
            Create your first website and start building something amazing.
          </p>

          <button
            onClick={() => navigate("/generate")}
            className="px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:scale-105 transition"
          >
            + New Project
          </button>
        </motion.div>

        {loading && <div className="">loading uour website </div>}
        {error && <div className="">{error}</div>}
      </div>
    </div>
  );
}

export default Dashboard;
