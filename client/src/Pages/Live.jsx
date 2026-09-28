import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";
import { Sparkles, LoaderCircle, AlertCircle, ArrowLeft } from "lucide-react";

export default function Live() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [website, setWebsite] = useState(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchWebsite = async () => {
      if (!id) {
        setError("Invalid website ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          `http://localhost:3000/api/website/get-by-id/${id}`,
          {
            withCredentials: true,
          }
        );

        if (!ignore) {
          const data = res.data;
          setWebsite(data);
          const html = data?.latestCode || data?.website?.latestCode || "";
          setCode(html);

          // Update page title
          if (data?.title) {
            document.title = `${data.title} • Live Preview`;
          }
        }
      } catch (err) {
        if (!ignore) {
          console.error("Failed to load live website:", err);
          setError(
            err.response?.data?.message ||
              err.message ||
              "Website not found or failed to load."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchWebsite();

    return () => {
      ignore = true;
    };
  }, [id]);

  // Loading Screen
  if (loading) {
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center bg-[#060608] text-white font-sans relative overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-600/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-purple-600/30 animate-pulse">
            <Sparkles size={24} />
          </div>
          <div className="flex items-center gap-2.5 text-sm font-medium text-zinc-300">
            <LoaderCircle size={18} className="animate-spin text-purple-400" />
            <span>Loading live website...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error Screen
  if (error || !code) {
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center bg-[#060608] text-white px-6 font-sans relative overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="text-center max-w-md p-8 rounded-3xl border border-red-500/20 bg-zinc-900/60 backdrop-blur-xl relative z-10 shadow-2xl">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-xl font-bold mb-2 text-white">
            Website Not Found
          </h2>
          <p className="text-sm text-red-300/80 mb-6 leading-relaxed">
            {error || "The requested website code is empty or could not be loaded."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={15} />
            <span>Return to GenWeb</span>
          </button>
        </div>
      </div>
    );
  }

  // Full-Screen Live Website Render with Flying Watermark
  return (
    <div className="w-screen h-[100dvh] relative overflow-hidden bg-white">
      {/* Full-Page Website Iframe */}
      <iframe
        title={website?.title || "Live Website"}
        srcDoc={code}
        className="w-full h-full border-0 block"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      />

      {/* Flying / Floating Brand Watermark Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.35 }}
        className="fixed bottom-5 right-5 z-50 pointer-events-auto"
      >
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          title="Generated with GenWeb AI — Create your own website in seconds"
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-zinc-950/90 hover:bg-zinc-900 border border-white/20 hover:border-purple-500/60 backdrop-blur-xl shadow-2xl shadow-black/80 text-white transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer"
        >
          {/* Glowing Animated Icon */}
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-sm shadow-purple-500/40">
            <Sparkles
              size={12}
              className="group-hover:rotate-12 transition-transform duration-300"
            />
          </div>

          {/* Watermark Label */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-zinc-400 font-normal">Made with</span>
            <span className="font-bold bg-gradient-to-r from-purple-300 via-indigo-200 to-pink-300 bg-clip-text text-transparent">
              GenWeb.ai
            </span>
          </div>
        </a>
      </motion.div>
    </div>
  );
}
