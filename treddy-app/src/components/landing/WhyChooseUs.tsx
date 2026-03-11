"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Leaf, ZoomIn, Paintbrush, CheckCircle2 } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section className="py-24 px-8 bg-[#0F173A]/10">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <h3 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-12 py-6">
            ¿Por qué elegir Treddy?
          </h3>
          <div className="space-y-8">
            {[
              {
                icon: <Leaf className="text-emerald-400" />,
                title: "Bio-Materiales",
                desc: "Utilizamos PLA biodegradable de alta resistencia, cuidando el planeta mientras creamos arte.",
              },
              {
                icon: <ZoomIn className="text-cyan-400" />,
                title: "Precisión Increíble",
                desc: "Nuestras impresoras están calibradas para capturar hasta el detalle más mínimo de tu modelo.",
              },
              {
                icon: <Paintbrush className="text-blue-400" />,
                title: "Pintura Profesional",
                desc: "Ofrecemos servicios de post-procesado y pintura a mano por artistas locales.",
              },
              {
                icon: <CheckCircle2 className="text-purple-400" />,
                title: "Garantía de Satisfacción",
                desc: "¿No estás feliz con el resultado? Lo re-imprimimos sin costo adicional para ti.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-800/50 flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h5 className="text-xl font-bold text-white mb-2">
                    {feature.title}
                  </h5>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-500/20 blur-[100px] rounded-full" />
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1633526543814-9718c8922b7a?q=80&w=2070&auto=format&fit=crop"
              alt="3D Printer detail"
              width={600}
              height={800}
              style={{ width: "auto", height: "auto" }}
              className="w-full object-cover h-[500px]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
