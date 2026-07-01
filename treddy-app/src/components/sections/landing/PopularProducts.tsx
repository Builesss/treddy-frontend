"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Figura } from "@/types";

interface PopularProductsProps {
  figuras: Figura[];
  handleVerMas: (nombre: string) => void;
}

export default function PopularProducts({
  figuras,
  handleVerMas,
}: PopularProductsProps) {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-8 relative overflow-hidden bg-transparent">
      {/* Background decoration (sutil) */}
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto">
        <div className="text-center mb-16">
          <motion.h3
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r py-3 from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4 tracking-tight"
          >
            Colección Premium
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#B5B8C5] text-lg max-w-2xl mx-auto"
          >
            Nuestras creaciones más solicitadas, listas para ser parte de tu
            colección.
          </motion.p>
        </div>

        {/* Products Grid / Mobile Carousel */}
        <div className="flex md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide pb-8 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
          {figuras.slice(0, 7).map((figura: Figura, index: number) => (
            <motion.div
              key={figura.producto_id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{
                y: -10,
                rotateX: 5,
                rotateY: 5,
                transition: { duration: 0.3 },
              }}
              style={{ perspective: 1000 }}
              className={`group relative bg-[#0F173A]/40 backdrop-blur-xl p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] text-center border border-white/10 shadow-2xl hover:border-cyan-500/30 transition-all duration-500 flex flex-col w-[85vw] sm:w-[60vw] md:w-auto flex-shrink-0 snap-center cursor-pointer ${index === 0 ? "md:col-span-2 lg:col-span-2 lg:row-span-2" : ""
                }`}
              onClick={() => handleVerMas(figura.nombre)}
            >
              <div className="relative z-10 flex flex-col h-full w-full">
                <div className="relative flex-grow mb-4 w-full flex items-center justify-center overflow-visible">
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Image
                      src={figura.imagenUrl}
                      alt={figura.nombre}
                      width={500}
                      height={500}
                      className={`mx-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-500 ease-in-out group-hover:drop-shadow-[0_30px_60px_rgba(6,182,212,0.3)] ${index === 0
                          ? "h-[220px] sm:h-[260px] md:h-[300px] w-auto"
                          : "h-[220px] sm:h-[260px] md:h-[180px] w-auto"
                        }`}
                    />
                  </motion.div>
                </div>
                <div className="mt-auto w-full">
                  <p className="uppercase tracking-[0.3em] text-[10px] text-cyan-400/60 font-black mb-2 text-left">
                    Premium Edition
                  </p>
                  <p
                    className={`font-black text-white uppercase tracking-tight group-hover:text-cyan-300 transition-colors text-left ${index === 0 ? "text-4xl" : "text-xl"}`}
                  >
                    {figura.nombre}
                  </p>
                  <div className="my-4 h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  <div className="flex items-center justify-between gap-4">
                    <p
                      className={`font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-tight ${index === 0 ? "text-4xl" : "text-2xl"}`}
                    >
                      ${figura.precio_base.toLocaleString("es-CO")}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVerMas(figura.nombre);
                      }}
                      className={`group/btn relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:text-black hover:bg-white rounded-xl font-bold transition-all duration-500 flex items-center justify-center gap-2 ${index === 0 ? "px-8 py-4 text-xl" : "px-4 py-2 text-sm"}`}
                    >
                      Detalles
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Holographic Reflection Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/0 via-white/[0.04] to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2.5rem]" />

              {/* Card Glow Background */}
              <div className="absolute -inset-[1px] bg-gradient-to-br from-cyan-500/20 to-blue-600/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 pointer-events-none rounded-[2.5rem]" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
