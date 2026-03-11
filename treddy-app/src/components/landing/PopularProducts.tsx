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
    <section className="py-24 px-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-tight mb-4">
            Productos Populares
          </h3>
          <p className="text-[#B5B8C5] text-lg max-w-2xl mx-auto">
            Nuestras creaciones más solicitadas, listas para ser parte de tu
            colección.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {figuras.slice(0, 7).map((figura: Figura, index: number) => (
            <motion.div
              key={figura.producto_id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className={`group relative bg-[#10193F]/40 backdrop-blur-md p-6 rounded-3xl text-center border border-white/10 hover:border-cyan-500/50 transition-all duration-300 flex flex-col ${
                index === 0 ? "md:col-span-2 lg:col-span-2 lg:row-span-2" : ""
              }`}
            >
              <div className="relative z-10 flex flex-col h-full w-full">
                <div className="relative flex-grow mb-4 w-full flex items-center justify-center overflow-visible">
                  <Image
                    src={figura.imagenUrl}
                    alt={figura.nombre}
                    width={index === 0 ? 450 : 140}
                    height={index === 0 ? 250 : 140}
                    style={{ width: "auto", height: "auto" }}
                    className="mx-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-transform duration-500 ease-in-out group-hover:scale-110 group-hover:rotate-1"
                  />
                </div>
                <div className="mt-auto w-full">
                  <p className="uppercase tracking-widest text-[10px] text-cyan-200/60 font-semibold mb-1">
                    Modelo 3D
                  </p>
                  <p
                    className={`font-bold text-white uppercase tracking-wider group-hover:text-cyan-300 transition-colors ${index === 0 ? "text-3xl" : "text-lg"}`}
                  >
                    {figura.nombre}
                  </p>
                  <div className="my-2 h-[1px] w-1/2 mx-auto bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
                  <p
                    className={`font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-tight mb-3 ${index === 0 ? "text-4xl" : "text-xl"}`}
                  >
                    {figura.precio_base}$
                  </p>
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleVerMas(figura.nombre)}
                      className={`group/btn relative overflow-hidden bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 text-cyan-400 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${index === 0 ? "px-10 py-4 text-xl" : "px-6 py-2"}`}
                    >
                      Ver más
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Decorative Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
