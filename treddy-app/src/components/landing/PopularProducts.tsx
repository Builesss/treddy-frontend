"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Figura } from "@/lib/types";

interface PopularProductsProps {
  figuras: Figura[];
  handleVerMas: (nombre: string) => void;
}

export default function PopularProducts({
  figuras,
  handleVerMas,
}: PopularProductsProps) {
  return (
    <section className="py-24 px-8 relative overflow-hidden bg-[#030712]">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -translate-x-1/2 pointer-events-none" />

      <div className="max-w-[1600px] mx-auto">
        <div className="text-center mb-16">
          <motion.h3
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black bg-gradient-to-r py-3 from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2 tracking-tighter"
          >
            PRODUCTOS POPULARES
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#B5B8C5] text-lg max-w-2xl mx-auto"
          >
            Nuestras creaciones más solicitadas, listas para ser parte de tu
            colección.
          </motion.p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {figuras.slice(0, 7).map((figura: Figura, index: number) => (
            <motion.div
              key={figura.producto_id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{
                y: -10,
                rotateX: 5,
                rotateY: 5,
                transition: { duration: 0.3 },
              }}
              style={{ perspective: 1000 }}
              className={`group relative bg-[#10193F]/40 backdrop-blur-md p-6 rounded-[2rem] text-center border border-white/5 hover:border-cyan-500/30 transition-all duration-300 flex flex-col ${
                index === 0 ? "md:col-span-2 lg:col-span-2 lg:row-span-2" : ""
              }`}
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
                      width={index === 0 ? 500 : 180}
                      height={index === 0 ? 300 : 180}
                      style={{ width: "auto", height: "auto" }}
                      className="mx-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-500 ease-in-out group-hover:drop-shadow-[0_30px_60px_rgba(6,182,212,0.3)]"
                    />
                  </motion.div>
                </div>
                <div className="mt-auto w-full">
                  <p className="uppercase tracking-[0.3em] text-[10px] text-cyan-400/60 font-black mb-2">
                    Premium Edition
                  </p>
                  <p
                    className={`font-black text-white uppercase tracking-tight group-hover:text-cyan-300 transition-colors ${index === 0 ? "text-4xl" : "text-xl"}`}
                  >
                    {figura.nombre}
                  </p>
                  <div className="my-4 h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  <div className="flex items-center justify-between gap-4">
                    <p
                      className={`font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-tight ${index === 0 ? "text-4xl" : "text-2xl"}`}
                    >
                      ${figura.precio_base}
                    </p>
                    <button
                      onClick={() => handleVerMas(figura.nombre)}
                      className={`group/btn relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:text-black hover:bg-white rounded-xl font-bold transition-all duration-500 flex items-center justify-center gap-2 ${index === 0 ? "px-8 py-4 text-xl" : "px-4 py-2 text-sm"}`}
                    >
                      Detalles
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Holographic Reflection Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/0 via-white/[0.03] to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]" />

              {/* Card Glow Background */}
              <div className="absolute -inset-[1px] bg-gradient-to-br from-cyan-500/20 to-blue-600/20 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 pointer-events-none rounded-[2rem]" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
