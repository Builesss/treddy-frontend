"use client";

import { motion } from "framer-motion";
import { MousePointerClick, Sliders, Printer, Truck } from "lucide-react";

const steps = [
  {
    icon: <MousePointerClick className="w-10 h-10" />,
    title: "Explora",
    desc: "Navega por nuestro catálogo o sube tu propio diseño.",
  },
  {
    icon: <Sliders className="w-10 h-10" />,
    title: "Personaliza",
    desc: "Elige el tamaño y los acabados que prefieras.",
  },
  {
    icon: <Printer className="w-10 h-10" />,
    title: "Impresión",
    desc: "Fabricamos tu pieza con tecnología de última generación.",
  },
  {
    icon: <Truck className="w-10 h-10" />,
    title: "Envío",
    desc: "Recíbela en la puerta de tu casa lista para exhibir.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-8 relative overflow-hidden bg-[#0A0F2C]">
      {/* Animated Path Decoration (Desktop Only) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-2 hidden md:block">
        <svg
          className="absolute inset-0 w-full overflow-visible"
          viewBox="0 0 1000 100"
        >
          <motion.path
            d="M 0 50 Q 250 150 500 50 Q 750 -50 1000 50"
            fill="none"
            stroke="url(#gradient-path)"
            strokeWidth="2"
            strokeDasharray="10 10"
            animate={{ strokeDashoffset: -100 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          <defs>
            <linearGradient
              id="gradient-path"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
              <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-[1600px] mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-6"
          >
            NUESTRO PROCESO
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#B5B8C5] text-xl max-w-2xl mx-auto font-medium"
          >
            De la idea a tus manos en cuatro simples pasos optimizados.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-12">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, type: "spring" }}
              whileHover={{ y: -15 }}
              className="relative group perspective-1000"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center justify-center text-cyan-400 font-black text-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-20 transition-all group-hover:bg-cyan-500 group-hover:text-black group-hover:scale-110">
                {idx + 1}
              </div>
              <div className="p-10 rounded-[2.5rem] bg-[#0F173A]/30 backdrop-blur-xl border border-white/5 hover:border-cyan-500/40 transition-all duration-500 h-full flex flex-col items-center text-center shadow-2xl group-hover:shadow-cyan-500/10">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center text-cyan-400 mb-8 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                  {step.icon}
                </div>
                <h4 className="text-2xl font-black text-white mb-4 tracking-tight">
                  {step.title}
                </h4>
                <p className="text-[#B5B8C5] text-base leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
