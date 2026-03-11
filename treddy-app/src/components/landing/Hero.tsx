"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Figura } from "@/lib/types";

interface HeroProps {
  figuras: Figura[];
  currentIndex: number;
  prevSlide: () => void;
  nextSlide: () => void;
  goToSlide: (index: number) => void;
}

export default function Hero({
  figuras,
  currentIndex,
  prevSlide,
  nextSlide,
  goToSlide,
}: HeroProps) {
  const router = useRouter();

  return (
    <section className="pt-32 pb-24 px-8">
      <div className="max-w-[1600px] mx-auto border border-white/10 p-14 bg-[#0F173A]/20 rounded-[40px] shadow-2xl backdrop-blur-md flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="max-w-xl text-center md:text-left">
          <h2 className="text-2xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-tight mb-6 ml-10">
            Treddy Figuras 3D
          </h2>
          <p className="text-xl text-[#B5B8C5] mb-8 leading-relaxed ml-10">
            Personaliza o crea tu propia figura impresa en 3D con tecnología de
            vanguardia y acabados profesionales.
          </p>
          <button
            onClick={() => router.push("/catalogo")}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-10 py-4 rounded-full hover:opacity-90 font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all transform hover:scale-105 ml-10"
          >
            Inicia ahora
          </button>
        </div>

        {figuras.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative w-full md:w-[700px] h-[450px] bg-[#0F173A]/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden group shadow-2xl"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center p-6 text-center"
                >
                  <div className="relative w-72 h-72 mb-6">
                    <Image
                      src={figuras[currentIndex].imagenUrl}
                      alt={figuras[currentIndex].nombre}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    />
                  </div>
                  <motion.h3
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold text-white tracking-wide"
                  >
                    {figuras[currentIndex].nombre}
                  </motion.h3>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 text-white hover:bg-cyan-500 hover:text-black transition-all duration-300 opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 text-white hover:bg-cyan-500 hover:text-black transition-all duration-300 opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronRight size={24} />
            </button>

            <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-3 z-10">
              {figuras.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-10 bg-cyan-400 shadow-[0_0_10px_#00E6F6]"
                      : "w-2 bg-gray-500/50 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
