"use client";

import { motion } from "framer-motion";
import { Sparkles, MessageSquare } from "lucide-react";

export default function Newsletter() {
  return (
    <section className="px-8 py-24 mb-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-[1600px] mx-auto relative rounded-[40px] overflow-hidden bg-[#0F173A] border border-cyan-500/20"
      >
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative p-12 md:p-20 flex flex-col items-center text-center">
          <Sparkles className="w-16 h-16 text-cyan-400 mb-8" />
          <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight max-w-3xl">
            ¿Listo para dar vida a tus ideas en 3D?
          </h3>
          <p className="text-[#B5B8C5] text-xl max-w-2xl mb-12">
            Únete a nuestra comunidad y sé el primero en recibir ofertas
            exclusivas, lanzamientos de nuevos modelos y tips de
            personalización.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-grow px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <button className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold rounded-full hover:opacity-90 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              Suscribirme
            </button>
          </div>

          <div className="mt-12 flex items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center gap-2 text-white font-medium">
              <MessageSquare className="w-5 h-5" /> Discord
            </div>
            <div className="w-px h-4 bg-gray-600" />
            <div className="text-white font-medium">Instagram</div>
            <div className="w-px h-4 bg-gray-600" />
            <div className="text-white font-medium">TikTok</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
