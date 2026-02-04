"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0F2C]">
      <div className="relative w-32 h-32">
        {/* Outer Ring */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 border-4 border-transparent border-t-cyan-500 border-l-blue-600 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]"
        />

        {/* Inner Ring */}
        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-4 border-4 border-transparent border-b-cyan-300 border-r-purple-500 rounded-full"
        />

        {/* Center Logo/Pulse */}
        <motion.div
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
        </motion.div>
      </div>

      {/* Loading Text */}
      <motion.p
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute mt-40 text-cyan-400 font-bold tracking-widest text-lg uppercase"
      >
        Cargando...
      </motion.p>
    </div>
  );
}
