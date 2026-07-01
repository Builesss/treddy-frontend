"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import { Sparkles, Zap, ShieldCheck, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Figura } from "@/types";
import { useState, useEffect } from "react";

interface HeroProps {
  figuras: Figura[];
}

const ROTATING_WORDS = ["unicas", "precisas", "tuyas", "epicas", "premium"];

function RotatingWord() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % ROTATING_WORDS.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative inline-block overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ y: 36, opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -36, opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="inline-block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
        >
          {ROTATING_WORDS[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}


function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div>
        <p className="text-xl font-black text-white leading-none">{value}</p>
        <p className="text-[11px] text-gray-500 mt-0.5 leading-none">{label}</p>
      </div>
    </div>
  );
}

export default function Hero({
  figuras,
}: HeroProps) {
  const router = useRouter();

  const itemVariants: Variants = {
    hidden: { y: 28, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * 0.12, type: "spring", stiffness: 90, damping: 18 },
    }),
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <section className="pt-8 sm:pt-12 pb-12 sm:pb-24 px-4 sm:px-8 relative overflow-hidden">
      {/* Decorative background elements sutiles igual que antes */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1600px] mx-auto border border-white/10 p-6 sm:p-14 bg-[#0F173A]/20 rounded-3xl sm:rounded-[40px] shadow-2xl backdrop-blur-md flex flex-col md:flex-row justify-between items-center gap-8 sm:gap-12 relative z-10"
      >

        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left md:ml-10">

          <motion.div
            custom={0}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-bold tracking-widest uppercase"
          >
            <Sparkles size={13} className="text-cyan-300" />
            Impresión 3D de alta precisión
          </motion.div>

          <motion.h1
            custom={1}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-3xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-tight mb-5 break-words w-full"
          >
            Treddy — Figuras 3D<br />
            <RotatingWord />
          </motion.h1>

          <motion.p
            custom={2}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-base sm:text-xl text-[#B5B8C5] mb-6 sm:mb-8 leading-relaxed max-w-lg"
          >
            Personaliza o crea tu propia figura impresa en 3D con tecnología de vanguardia y acabados profesionales.
          </motion.p>

          <motion.div
            custom={3}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8 sm:mb-10"
          >
            <button
              onClick={() => router.push("/catalogo")}
              className="group flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-7 py-3.5 rounded-full font-bold text-sm hover:shadow-[0_0_35px_rgba(6,182,212,0.55)] shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
            >
              Ver catalogo
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => router.push("/personalizacion")}
              className="flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm text-white border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 backdrop-blur-sm transition-all duration-300"
            >
              <Zap size={15} className="text-cyan-400" />
              Personalizar
            </button>
          </motion.div>

          <motion.div
            custom={4}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-6 flex-wrap justify-center md:justify-start"
          >
            <Stat value="10k+" label="Pedidos entregados" />
            <div className="w-px h-8 bg-white/10" />
            <Stat value="98%" label="Satisfaccion" />
            <div className="w-px h-8 bg-white/10" />
            <Stat value="48h" label="Tiempo de entrega" />
          </motion.div>

          <motion.div
            custom={5}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="mt-6 flex items-center gap-2 text-[11px] text-gray-500"
          >
            <ShieldCheck size={14} className="text-cyan-600" />
            Pago seguro · Envío protegido · Garantía 15 días
          </motion.div>
        </div>

        {figuras.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 70 }}
            className="flex-shrink-0 w-full lg:w-[500px] xl:w-[600px] flex items-center justify-center relative mt-16 lg:mt-0"
          >
            {/* Glow central */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />

            {/* Figura Flotante Principal */}
            <motion.div
              animate={{ y: [-15, 15, -15] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative w-full max-w-[260px] aspect-[6/7] sm:max-w-none sm:w-[400px] sm:h-[450px] xl:w-[450px] xl:h-[500px] z-20 mx-auto"
            >
              <Image
                src={figuras[0].imagenUrl}
                alt="Figura Premium Destacada"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-contain drop-shadow-[0_20px_50px_rgba(0,230,246,0.25)] filter brightness-110"
              />
            </motion.div>

            {/* Badges Flotantes Premium */}
            {/* Arriba izquierda */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
              className="absolute top-[10%] left-2 sm:-left-10 z-30 flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl bg-[#0F173A]/80 backdrop-blur-xl border border-white/10 shadow-xl"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider font-bold">Material</p>
                <p className="text-xs sm:text-sm text-white font-semibold">Resina 8K</p>
              </div>
            </motion.div>

            {/* Abajo derecha */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5, type: "spring" }}
              className="absolute bottom-[15%] right-2 sm:-right-8 z-30 flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl bg-[#0F173A]/80 backdrop-blur-xl border border-white/10 shadow-xl"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                <ShieldCheck size={16} />
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider font-bold">Acabado</p>
                <p className="text-xs sm:text-sm text-white font-semibold">Pintado a mano</p>
              </div>
            </motion.div>

            {/* Arriba derecha (Pequeño) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5, type: "spring" }}
              className="absolute top-[2%] right-4 sm:right-10 z-10 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-md text-[8px] sm:text-[10px] font-bold text-blue-300 tracking-widest uppercase"
            >
              Exclusivo
            </motion.div>

            {/* Nombre de la figura debajo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="absolute -bottom-6 sm:-bottom-10 left-1/2 -translate-x-1/2 text-center w-full z-10"
            >
              <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight uppercase shadow-black drop-shadow-md">
                {figuras[0].nombre}
              </h3>
              <p className="text-[10px] sm:text-xs text-cyan-400 mt-0.5 sm:mt-1 tracking-widest uppercase font-semibold drop-shadow-md">
                Modelo Destacado
              </p>
            </motion.div>

          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
