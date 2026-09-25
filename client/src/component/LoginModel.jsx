import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";
import axios from "axios";
const LoginModel = ({ open, onClose }) => {
  const handlegoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      // console.log(result)
      const { data } = await axios.post(
        "http://localhost:3000/api/auth/google",
        {
          name: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL,
        },
        { withCredentials: true },
      );
      // console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center  justify-center bg-black/80 backdrop-blur-xl px-4  "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 60 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative w-full max-w-md p-[1px] rounded-3x1 bg-gradient-to-br from-purple-500/40 via-blue-500/30 to-transparent"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="relative rounded-3x1 Obg-[#0b0b0b] border Oborder-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.8)] overflow-hidden">
              <motion.div
                animate={{ opacity: [0.25, 0.4, 0.25] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute -top-32 -left-32 w-80 h-80 bg-blue-500/30 blur-[140px]"
              />
              <motion.div
                animate={{ opacity: [0.2, 0.35, 0.2] }}
                transition={{ duration: 6, repeat: Infinity, delay: 2 }}
                className="absolute -bottom-32 -right-32 w-80 h-80 bg-blue-500/25 blur-[140px]"
              />
              <button className="absolute top-5 right-5 z-20 text-zinc-400 hover:text-white ">
                x
              </button>
              <div className="relative px-8 pt-14 pb-10 text-center">
                <h1 className="inline-block mb-6 px-4 py-1.5 rounded-full 0bg-white/5 border Dborder-white/10 text-xs">
                  AI website builder{" "}
                </h1>
                <h2 className="text-3xl font-semibold leading-tight mb-3 space-x-2">
                  <span>Welcome to</span>
                  <span className="bg-linear-to-r bg-clip-text text-transparent  from-purple-400 to-blue-400 ">
                    GenWeb.ai
                  </span>
                </h2>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="group relative w-full h-13 rounded-x1 bg-white text-black font-semibold shadow-x1 overflow-hidden"
                  onClick={handlegoogleAuth}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-zinc-100 to-white opacity-0 group-hover:opacity-100 transition" />
                  <img
                    src="https://zonalogo.com/assets/google-logo.webp?asset=1783&w=320"
                    alt=""
                    className="h-5 w-5"
                  />
                  Continue with Google
                </motion.button>

                <div className="flex items-center gap-4 my-10 ">
                  <div className="h-px flex bg-white/10">
                    <span>Secure login </span>
                  </div>
                </div>
              </div>
              <p>
                By continuing, you agree to our{" "}
                <span className="underline cursor-pointer hover:text-zinc-300">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="underline cursor-pointer hover:text-zinc-300">
                  Privacy Policy
                </span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModel;
