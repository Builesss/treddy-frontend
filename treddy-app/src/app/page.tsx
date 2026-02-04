/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFiguras } from "../lib/api";
import Image from "next/image";
import Footer from "@/pages/footer";
import Nav from "@/pages/nav";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export default function HomePage() {
  const [figuras, setFiguras] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    getFiguras().then(setFiguras).catch(console.error);
  }, []);

  useEffect(() => {
    if (figuras.length === 0) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, figuras.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? figuras.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === figuras.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleVerMas = (nombre: string) => {
    router.push(`/catalogo?search=${encodeURIComponent(nombre)}`);
  };

  return (
    <main className="min-h-screen bg-[#0A0F2C] text-white relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>
      <Nav />

      <section className="mx-8 flex flex-col md:flex-row justify-between items-center border border-[#1a1f40] px-35 py-10 bg-[#0F173A]/20 rounded-2xl shadow-2xl backdrop-blur-md mt-10">
        <div className="max-w-xxl">
          <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-tight">
            Treddy Figuras 3D
          </h2>
          <p className="mt-5 text-lg text-[#B5B8C5]">
            Personaliza o crea tu propia figura impresa en 3D
          </p>
          <button
            onClick={() => router.push("/catalogo")}
            className="mt-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-8 py-3 rounded-full hover:opacity-90 font-semibold shadow-lg"
          >
            Inicia ahora
          </button>
        </div>

        {figuras.length > 0 && (
          <motion.section
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative w-full md:w-[800px] h-[400px] bg-[#0F173A]/40 backdrop-blur-xl border border-[#1a1f40] rounded-2xl overflow-hidden group"
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
                  <div className="relative w-64 h-64 mb-4 filter">
                    <Image
                      src={figuras[currentIndex].imagenUrl}
                      alt={figuras[currentIndex].nombre}
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                  <motion.h3
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold text-white tracking-wide"
                  >
                    {figuras[currentIndex].nombre}
                  </motion.h3>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-[#00E6F6] hover:text-black transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-[#00E6F6] hover:text-black transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={24} />
            </button>

            <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3">
              {figuras.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-[#00E6F6] shadow-[0_0_10px_#00E6F6]"
                      : "w-2 bg-gray-500 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </motion.section>
        )}
      </section>

      <section className="px-8 py-16">
        <h3 className="text-3xl text-center font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-tight mb-10">
          Productos Populares
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {figuras.slice(0, 7).map((figura: any, index: number) => (
            <motion.div
              key={figura.producto_id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className={`group relative bg-[#10193F]/40 backdrop-blur-md p-5 rounded-2xl text-center border border-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all duration-300 flex flex-col ${
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
      </section>

      <section className="mx-8 px-70 py-8 flex flex-col md:flex-row border border-[#1a1f40] justify-between items-center bg-[#0F173A]/20 rounded-2xl shadow-2xl backdrop-blur-md">
        <div className="max-w-xl">
          <h4 className="text-4xl mb-2 font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-tight">
            Visualiza tu imagen en realidad aumentada
          </h4>
          <p className="mt-5 text-lg text-[#B5B8C5]">
            Usa tu cámara para ver cómo se vería tu figura 3D en un espacio real
            antes de comprarla. ¡Haz tu compra con total confianza!
          </p>
          <button
            onClick={() => router.push("/personalizacion")}
            className="mt-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-8 py-3 rounded-full hover:opacity-90 font-semibold shadow-lg"
          >
            Pruébalo ahora
          </button>
        </div>
        <div className="mt-10 md:mt-0">
          <Image
            src="/treddy-sublogo.png"
            alt="Treddy Logo"
            width={450}
            height={250}
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
