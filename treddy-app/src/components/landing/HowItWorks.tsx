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
    <section className="py-24 px-8 bg-gradient-to-b from-transparent to-[#0F173A]/10">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            ¿Cómo funciona Treddy?
          </h3>
          <p className="text-[#B5B8C5] text-lg max-w-2xl mx-auto">
            Obtener tu figura personalizada es más fácil de lo que crees. Sigue
            estos simples pasos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="relative group p-8 rounded-3xl bg-[#0F173A]/40 backdrop-blur-md border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
            >
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-black font-bold text-lg shadow-lg">
                {idx + 1}
              </div>
              <div className="text-cyan-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>
              <h4 className="text-xl font-bold text-white mb-3">
                {step.title}
              </h4>
              <p className="text-[#B5B8C5] text-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
