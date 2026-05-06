"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Figura } from "@/types";

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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <section className="pt-20 sm:pt-32 pb-12 sm:pb-24 px-4 sm:px-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1600px] mx-auto border border-white/10 p-6 sm:p-14 bg-[#0F173A]/20 rounded-3xl sm:rounded-[40px] shadow-2xl backdrop-blur-md flex flex-col md:flex-row justify-between items-center gap-8 sm:gap-12 relative z-10"
      >
        <div className="max-w-xl text-center md:text-left">
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-tight mb-4 sm:mb-6 md:ml-10"
          >
            Treddy Figuras 3D
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-xl text-[#B5B8C5] mb-6 sm:mb-8 leading-relaxed md:ml-10"
          >
            Personaliza o crea tu propia figura impresa en 3D con tecnología de
            vanguardia y acabados profesionales.
          </motion.p>
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/catalogo")}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-8 sm:px-10 py-3 sm:py-4 rounded-full hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all md:ml-10 text-sm sm:text-base"
          >
            Inicia ahora
          </motion.button>
        </div>

        {figuras.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-full md:w-[700px] h-[350px] sm:h-[450px] md:h-[550px] bg-[#0F173A]/40 backdrop-blur-xl border border-white/10 rounded-3xl sm:rounded-[2.5rem] overflow-hidden group shadow-2xl flex flex-col"
          >
            {/* Slide Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-white/5 z-20">
              <motion.div
                key={currentIndex}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, ease: "linear" }}
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
              />
            </div>

            <div className="flex-grow flex items-center justify-center p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.8, rotateY: 45 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 1.1, rotateY: -45 }}
                  transition={{ duration: 0.6, type: "spring", damping: 20 }}
                  className="flex flex-col items-center justify-center text-center w-full h-full"
                >
                  <div className="relative w-full h-full max-h-[330px] aspect-square mb-10 -mt-8">
                    <Image
                      src={figuras[currentIndex].imagenUrl}
                      alt={figuras[currentIndex].nombre}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 500px"
                      className="object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.15)] filter brightness-110"
                    />
                  </div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-cyan-400 text-sm font-bold tracking-[0.2em] uppercase mb-2">
                      Destacado
                    </p>
                    <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
                      {figuras[currentIndex].nombre}
                    </h3>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-2 sm:p-4 rounded-full bg-black/40 text-white border border-white/5 hover:bg-cyan-500 hover:text-black hover:border-transparent transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 z-10 backdrop-blur-md"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-2 sm:p-4 rounded-full bg-black/40 text-white border border-white/5 hover:bg-cyan-500 hover:text-black hover:border-transparent transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 z-10 backdrop-blur-md"
            >
              <ChevronRight size={24} />
            </button>

            <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-4 z-10">
              {figuras.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    index === currentIndex
                      ? "w-12 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                      : "w-3 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
