"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { Leaf, ZoomIn, Paintbrush, CheckCircle2, Sparkles } from "lucide-react";

export default function WhyChooseUs() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const features = [
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Bio-Materiales",
      desc: "PLA biodegradable de alta resistencia, cuidando el planeta en cada impresión.",
      color: "text-emerald-400",
      glow: "shadow-[0_0_20px_rgba(52,211,153,0.2)]",
    },
    {
      icon: <ZoomIn className="w-6 h-6" />,
      title: "Precisión Micrónica",
      desc: "Capturamos hasta el detalle más mínimo con resolución de capa de 0.05mm.",
      color: "text-cyan-400",
      glow: "shadow-[0_0_20px_rgba(34,211,238,0.2)]",
    },
    {
      icon: <Paintbrush className="w-6 h-6" />,
      title: "Acabado de Autor",
      desc: "Pintura a mano y post-procesado profesional por artistas especializados.",
      color: "text-purple-400",
      glow: "shadow-[0_0_20px_rgba(192,132,252,0.2)]",
    },
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      title: "Garantía Treddy",
      desc: "Si el resultado no supera tus expectativas, lo re-imprimimos sin costo.",
      color: "text-blue-400",
      glow: "shadow-[0_0_20px_rgba(96,165,250,0.2)]",
    },
  ];

  return (
    <section className="py-16 sm:py-32 px-4 sm:px-8 relative overflow-hidden bg-[#0A0F2C]">
      {/* Background Decorative Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto border border-white/10 p-6 sm:p-12 md:p-20 bg-[#0F173A]/10 rounded-3xl sm:rounded-[40px] shadow-2xl backdrop-blur-md relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="z-10"
          >
            <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-widest text-sm mb-6">
              <Sparkles className="w-5 h-5" /> EXCELENCIA TREDDY
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-7xl font-black text-white mb-6 sm:mb-10 leading-[1.1] tracking-tighter">
              ¿QUÉ NOS HACE <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                DIFERENTES?
              </span>
            </h3>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl transition-all group ${feature.glow}`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform ${feature.color}`}
                  >
                    {feature.icon}
                  </div>
                  <h5 className="text-xl font-bold text-white mb-3 tracking-tight">
                    {feature.title}
                  </h5>
                  <p className="text-[#B5B8C5] leading-relaxed text-sm font-medium">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <div className="relative group">
            {/* Visual HUD Decoration */}
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 50 }}
              className="relative z-10 rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl bg-[#0A0F2C]"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-transparent z-10" />
              <Image
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=2070&auto=format&fit=crop"
                alt="3D Engineering Detail"
                width={800}
                height={1000}
                className="w-full object-cover h-[350px] sm:h-[500px] lg:h-[700px] grayscale group-hover:grayscale-0 transition-all duration-[2s] ease-out group-hover:scale-110"
              />

              {/* Floating Tech Badges */}
              <div className="absolute top-10 right-10 z-20 bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />
                <span className="text-white font-black text-xs uppercase tracking-tighter">
                  Calibrado High-Res
                </span>
              </div>
            </motion.div>

            {/* Floating Cube Ornament */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl blur-2xl opacity-30 z-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
