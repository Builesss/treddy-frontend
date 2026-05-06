"use client";

import { useState } from "react";
import { Sparkles, MessageSquare, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Newsletter() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = () => {
    setIsSubscribed(true);
    // Here we would normally call the API
  };

  return (
    <section className="px-4 sm:px-8 py-16 sm:py-24 relative overflow-hidden bg-[#030712]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-[1600px] mx-auto relative rounded-[3rem] overflow-hidden bg-[#0A0F2C] border border-white/5 shadow-2xl"
      >
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 opacity-50" />
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2 opacity-50" />
        </div>

        <div className="relative p-6 sm:p-12 md:p-24 flex flex-col items-center text-center z-10">
          <AnimatePresence mode="wait">
            {!isSubscribed ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                className="flex flex-col items-center"
              >
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 rounded-full mb-8 backdrop-blur-md">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm font-black text-cyan-400 uppercase tracking-widest">
                    Treddy Inner Circle
                  </span>
                </div>

                <h3 className="text-3xl sm:text-4xl md:text-7xl font-black text-white mb-6 sm:mb-8 leading-[1.1] tracking-tighter">
                  ÚNETE AL CLUB <br />{" "}
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    MÁS EXCLUSIVO
                  </span>
                </h3>

                <p className="text-[#B5B8C5] text-xl max-w-2xl mb-12 font-medium leading-relaxed">
                  Accede a lanzamientos anticipados, descuentos secretos y
                  contenido VIP sobre personalización 3D.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg p-3 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-2xl">
                  <input
                    type="email"
                    placeholder="Escribe tu mejor email"
                    className="flex-grow px-8 py-4 rounded-2xl bg-transparent text-white placeholder:text-white/20 focus:outline-none font-bold"
                  />
                  <button
                    onClick={handleSubscribe}
                    className="px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-cyan-400 hover:shadow-[0_10px_40px_rgba(6,182,212,0.4)] transition-all transform active:scale-95"
                  >
                    SUSCRIBIRME
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center"
              >
                <div className="w-24 h-24 rounded-full bg-cyan-500 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(6,182,212,0.5)]">
                  <CheckCircle2 className="w-12 h-12 text-black" />
                </div>
                <h3 className="text-4xl md:text-6xl font-black text-white mb-4">
                  ¡BIENVENIDO AL CLUB!
                </h3>
                <p className="text-cyan-400 text-xl font-bold">
                  Revisa tu correo para el primer secreto.
                </p>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="mt-12 w-1 h-12 bg-gradient-to-b from-cyan-400 to-transparent"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-20 pt-10 border-t border-white/5 flex flex-wrap justify-center items-center gap-12 opacity-40 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-3 text-white font-black uppercase text-sm cursor-pointer hover:text-cyan-400 transition-colors">
              <MessageSquare className="w-5 h-5" /> Discord
            </div>
            <div className="text-white font-black uppercase text-sm cursor-pointer hover:text-cyan-400 transition-colors">
              Instagram
            </div>
            <div className="text-white font-black uppercase text-sm cursor-pointer hover:text-cyan-400 transition-colors">
              TikTok
            </div>
            <div className="text-white font-black uppercase text-sm cursor-pointer hover:text-cyan-400 transition-colors">
              Pinterest
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
