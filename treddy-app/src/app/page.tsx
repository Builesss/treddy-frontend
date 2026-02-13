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
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MousePointerClick,
  Sliders,
  Printer,
  Truck,
  Gamepad2,
  Tv2,
  Home,
  Sparkles,
  Leaf,
  ZoomIn,
  Paintbrush,
  Star,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

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

      <section className="pt-32 pb-24 px-8">
        <div className="max-w-[1600px] mx-auto border border-white/10 p-12 bg-[#0F173A]/20 rounded-[40px] shadow-2xl backdrop-blur-md flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-tight mb-6">
              Treddy Figuras 3D
            </h2>
            <p className="text-xl text-[#B5B8C5] mb-8 leading-relaxed">
              Personaliza o crea tu propia figura impresa en 3D con tecnología
              de vanguardia y acabados profesionales.
            </p>
            <button
              onClick={() => router.push("/catalogo")}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-10 py-4 rounded-full hover:opacity-90 font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all transform hover:scale-105"
            >
              Inicia ahora
            </button>
          </div>

          {figuras.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative w-full md:w-[600px] h-[450px] bg-[#0F173A]/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden group shadow-2xl"
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
            {figuras.slice(0, 7).map((figura: any, index: number) => (
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

      <section className="py-24 px-8 bg-gradient-to-b from-transparent to-[#0F173A]/10">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
              ¿Cómo funciona Treddy?
            </h3>
            <p className="text-[#B5B8C5] text-lg max-w-2xl mx-auto">
              Obtener tu figura personalizada es más fácil de lo que crees.
              Sigue estos simples pasos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
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
            ].map((step, idx) => (
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

      {/* 2. Categories Bento Grid */}
      <section className="py-24 px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h3 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r py-2 from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                Explora por Categoría
              </h3>
              <p className="text-[#B5B8C5] text-lg">
                Encuentra exactamente lo que buscas en nuestras colecciones
                curadas.
              </p>
            </div>
            <button
              onClick={() => router.push("/catalogo")}
              className="group flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            >
              Ver todas las categorías{" "}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-[600px]">
            <motion.div
              whileHover={{ scale: 0.99 }}
              className="md:col-span-8 md:row-span-2 relative group overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600/20 to-cyan-600/20 border border-white/10"
            >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F2C] via-transparent to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-8">
                <Gamepad2 className="w-12 h-12 text-cyan-400 mb-4" />
                <h4 className="text-3xl font-bold text-white mb-2">
                  Videojuegos
                </h4>
                <p className="text-gray-300 max-w-sm mb-4">
                  Tus personajes favoritos de sagas legendarias, con acabados
                  épicos.
                </p>
                <button className="w-fit px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium transition-colors">
                  Explorar Colección
                </button>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 0.99 }}
              className="md:col-span-4 relative group overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-white/10"
            >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578632292335-df3abbb0d586?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F2C] via-transparent to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-8">
                <Tv2 className="w-10 h-10 text-pink-400 mb-2" />
                <h4 className="text-2xl font-bold text-white mb-1">Anime</h4>
                <p className="text-gray-300 text-sm mb-4">
                  Piezas detalladas de los héroes más icónicos del Shonen y
                  Seinen.
                </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 0.99 }}
              className="md:col-span-4 relative group overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-white/10"
            >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F2C] via-transparent to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-8">
                <Home className="w-10 h-10 text-emerald-400 mb-2" />
                <h4 className="text-2xl font-bold text-white mb-1">
                  Deco Hogar
                </h4>
                <p className="text-gray-300 text-sm mb-4">
                  Objetos funcionales y estéticos impresos con diseño
                  minimalista.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Why Treddy Features */}
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
                className="w-full object-cover h-[500px]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Testimonials */}
      <section className="py-24 px-8 overflow-hidden">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
              <Star className="w-4 h-4 fill-current" /> +500 Clientes Felices
            </div>
            <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Lo que dicen de nosotros
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Carlos Ruiz",
                role: "Coleccionista",
                comment:
                  "La calidad de la resina es impresionante. Los detalles en la armadura de mi figura son perfectos.",
                stars: 5,
              },
              {
                name: "Elena Gómez",
                role: "Decoradora",
                comment:
                  "Pedí varios jarrones geométricos para un proyecto y superaron mis expectativas. El acabado es muy suave.",
                stars: 5,
              },
              {
                name: "Mateo Díaz",
                role: "Gamer",
                comment:
                  "Increíble el servicio de AR. Pude ver el tamaño real de mi figura en mi escritorio antes de pedirla.",
                stars: 5,
              },
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-3xl bg-[#0F173A]/40 border border-white/10 backdrop-blur-md relative"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-cyan-400 text-cyan-400"
                    />
                  ))}
                </div>
                <p className="text-gray-300 italic mb-6">
                  &quot;{testimonial.comment}&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-black font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">
                      {testimonial.name}
                    </p>
                    <p className="text-cyan-400/70 text-xs">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reality Augmented Section */}
      <section className="py-24 px-8">
        <div className="max-w-[1600px] mx-auto border border-white/10 p-12 bg-[#0F173A]/20 rounded-[40px] shadow-2xl backdrop-blur-md flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="max-w-xl text-center md:text-left">
            <h4 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-tight mb-8">
              Realidad Aumentada
            </h4>
            <p className="text-xl text-[#B5B8C5] mb-10 leading-relaxed">
              Usa tu cámara para ver cómo se vería tu figura 3D en tu propio
              espacio antes de ordenarla. Tecnología inmersiva para tu total
              confianza.
            </p>
            <button
              onClick={() => router.push("/personalizacion")}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-10 py-4 rounded-full hover:opacity-90 font-bold shadow-lg transition-all transform hover:scale-105"
            >
              Pruébalo ahora
            </button>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 transition-all duration-500" />
            <motion.div
              whileHover={{ rotate: 2, scale: 1.05 }}
              className="relative z-10"
            >
              <Image
                src="/treddy-sublogo.png"
                alt="Treddy AR"
                width={450}
                height={250}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Final CTA / Newsletter-like Section */}
      <section className="px-8 py-24 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-[1600px] mx-auto relative rounded-[40px] overflow-hidden bg-[#0F173A] border border-cyan-500/20"
        >
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative p-12 md:p-20 flex flex-col items-center text-center">
            <Sparkles className="w-16 h-16 text-cyan-400 mb-8" />
            <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight max-w-3xl">
              ¿Listo para dar vida a tus ideas en 3D?
            </h3>
            <p className="text-[#B5B8C5] text-xl max-w-2xl mb-12">
              Únete a nuestra comunidad y sé el primero en recibir ofertas
              exclusivas, lanzamientos de nuevos modelos y tips de
              personalización.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-grow px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold rounded-full hover:opacity-90 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                Suscribirme
              </button>
            </div>

            <div className="mt-12 flex items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
              <div className="flex items-center gap-2 text-white font-medium">
                <MessageSquare className="w-5 h-5" /> Discord
              </div>
              <div className="w-px h-4 bg-gray-600" />
              <div className="text-white font-medium">Instagram</div>
              <div className="w-px h-4 bg-gray-600" />
              <div className="text-white font-medium">TikTok</div>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
