import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Generate() {
  const navigate = useNavigate();

  const [description, setDescription] = useState("");

  const handleGenerate = () => {
    console.log("Website Description:", description);

    // Later you can send this to your backend / AI API
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* ================= HEADER ================= */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-4">

            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 rounded-lg hover:bg-white/10 transition"
            >
              <ArrowLeft size={16} />
            </button>

            <h1 className="text-lg font-semibold">
              Genweb
              <span className="text-zinc-400">.ai</span>
            </h1>

          </div>

        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* ================= HERO ================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Build Websites with{" "}
            <span className="bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Real AI Power
            </span>
          </h1>

          <p className="text-zinc-400 max-w-2xl mx-auto">
            This process may take several minutes. genweb.ai focuses on
            quality, not shortcuts.
          </p>
        </motion.div>

        {/* ================= WEBSITE DESCRIPTION ================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-14"
        >
          <h1 className="text-xl font-semibold mb-2">
            Describe your website
          </h1>

          <div className="relative">

            <textarea
              name="description"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your website in detail..."
              className="w-full h-56 p-6 rounded-3xl bg-black/60 border border-white/10 outline-none resize-none text-sm leading-relaxed focus:ring-2 focus:ring-white/20 transition"
            />

            {/* Character Count */}
            <div className="absolute bottom-4 right-5 text-xs text-zinc-500">
              {description.length} characters
            </div>

          </div>
        </motion.div>

        {/* ================= GENERATE BUTTON ================= */}
        <div className="flex justify-center">

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleGenerate}
            disabled={!description.trim()}
            className="flex justify-center items-center gap-2 bg-white text-black px-8 py-3 rounded-xl font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Generate Website
          </motion.button>

        </div>

      </div>
    </div>

    // 4.20
  );
}

export default Generate;