import { AnimatePresence, motion } from "motion/react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";
import axios from "axios";
import { X, Sparkles, ShieldCheck } from "lucide-react";
import serverUrl from "../config";

const LoginModel = ({ open, onClose }) => {
  const handlegoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      // console.log(result)
      const response = await axios.post(
        `${serverUrl}/api/auth/google`,
        {
          name: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL,
        },
        { withCredentials: true },
      );
      if (response.data || response.status === 200) {
        onClose();
        window.location.reload();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-md p-[1px] rounded-3xl bg-gradient-to-br from-purple-500/40 via-indigo-500/30 to-blue-500/20 shadow-[0_25px_80px_rgba(0,0,0,0.85),0_0_50px_rgba(139,92,246,0.15)]"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="relative rounded-[23px] bg-[#09090d]/95 backdrop-blur-2xl border border-white/10 overflow-hidden">
              {/* Background ambient blurs */}
              <motion.div
                animate={{ opacity: [0.25, 0.45, 0.25], scale: [1, 1.1, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-32 -left-32 w-72 h-72 bg-purple-500/25 blur-[120px] pointer-events-none"
              />
              <motion.div
                animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.15, 1] }}
                transition={{ duration: 6, repeat: Infinity, delay: 2, ease: "easeInOut" }}
                className="absolute -bottom-32 -right-32 w-72 h-72 bg-blue-500/25 blur-[120px] pointer-events-none"
              />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 z-20 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="relative px-7 pt-12 pb-8 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 mb-5 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-medium backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>AI Website Builder</span>
                </div>

                {/* Heading */}
                <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2 leading-tight">
                  Welcome to{" "}
                  <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
                    GenWeb.ai
                  </span>
                </h2>

                {/* Subtitle */}
                <p className="text-sm text-zinc-400 mb-8 max-w-xs mx-auto leading-relaxed">
                  Sign in to access your dashboard, generate websites, and export code.
                </p>

                {/* Continue with Google Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative w-full h-12 rounded-xl bg-white text-zinc-900 font-semibold text-sm shadow-lg hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3 overflow-hidden cursor-pointer transition-all duration-200"
                  onClick={handlegoogleAuth}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-zinc-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  <svg className="w-5 h-5 shrink-0 relative z-10" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="relative z-10">Continue with Google</span>
                </motion.button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-7">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Secure Authentication
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                {/* Terms and Privacy Policy */}
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  By continuing, you agree to our{" "}
                  <span className="underline text-zinc-300 hover:text-white cursor-pointer transition-colors">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="underline text-zinc-300 hover:text-white cursor-pointer transition-colors">
                    Privacy Policy
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModel;

