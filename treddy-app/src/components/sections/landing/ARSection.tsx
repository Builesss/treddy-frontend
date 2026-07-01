"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ARSection() {
  const router = useRouter();

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-8 relative overflow-hidden bg-[#030712]">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] translate-x-1/2 pointer-events-none" />

      <div className="max-w-[1600px] mx-auto border border-white/10 p-6 sm:p-12 md:p-20 bg-[#0F173A]/10 rounded-3xl sm:rounded-[40px] shadow-2xl backdrop-blur-md flex flex-col md:flex-row justify-between items-center gap-10 sm:gap-16 relative z-10">
        <div className="max-w-xl text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-cyan-400 font-black tracking-[0.3em] uppercase text-sm mb-4 block">
              Tecnología Inmersiva
            </span>
            <h4 className="text-3xl sm:text-4xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-tight mb-6 sm:mb-8">
              REALIDAD AUMENTADA
            </h4>
            <p className="text-base sm:text-xl text-[#B5B8C5] mb-8 sm:mb-10 leading-relaxed font-medium">
              ¿No estás seguro del tamaño? Usa tu cámara para proyectar la
              figura en tu espacio real. Visualiza cada detalle antes de que
              llegue a tu puerta.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button
                onClick={() => router.push("/personalizacion")}
                className="w-full sm:w-auto bg-white text-black px-12 py-5 rounded-2xl hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] font-black transition-all transform hover:scale-105"
              >
                PROBAR AHORA
              </button>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <div className="w-12 h-12 bg-white flex items-center justify-center rounded-lg p-1">
                  {/* Placeholder QR */}
                  <div className="w-full h-full bg-black rounded-[1px] relative">
                    <div className="absolute top-1 left-1 w-2 h-2 border border-white" />
                    <div className="absolute top-1 right-1 w-2 h-2 border border-white" />
                    <div className="absolute bottom-1 left-1 w-2 h-2 border border-white" />
                  </div>
                </div>
                <span className="text-xs text-white/60 font-bold leading-tight uppercase">
                  Escanea para
                  <br />
                  <span className="text-white">ver en móvil</span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative group w-full max-w-[500px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10 rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/20 p-8"
          >
            {/* Scanning Laser Animation */}
            <motion.div
              animate={{ bottom: ["100%", "0%", "100%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] z-20 pointer-events-none"
            />

            <div className="relative aspect-square">
              <Image
                src="/treddy-sublogo.png"
                alt="Treddy AR"
                fill
                className="object-contain filter drop-shadow-[0_0_20px_rgba(34,211,238,0.2)] opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>

            {/* HUD Elements */}
            <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-cyan-400/50" />
            <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-cyan-400/50" />
            <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-cyan-400/50" />
            <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-cyan-400/50" />
          </motion.div>

          {/* Decorative Ring */}
          <div className="absolute -inset-4 border border-cyan-500/20 rounded-[3rem] animate-[spin_10s_linear_infinite] pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
