"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles, Zap, ShieldCheck, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Figura } from "@/types";
import { useState, useEffect, useRef } from "react";

interface HeroProps {
  figuras: Figura[];
  currentIndex: number;
  prevSlide: () => void;
  nextSlide: () => void;
  goToSlide: (index: number) => void;
}

const ROTATING_WORDS = ["unicas", "precisas", "tuyas", "epicas", "premium"];

function RotatingWord() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % ROTATING_WORDS.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative inline-block overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ y: 36, opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -36, opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="inline-block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
        >
          {ROTATING_WORDS[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function FloatingBadge({
  icon,
  text,
  delay,
  className,
}: {
  icon: React.ReactNode;
  text: string;
  delay: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 120 }}
      className={`absolute flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0F173A]/80 border border-cyan-500/20 backdrop-blur-md text-xs font-semibold text-cyan-300 shadow-lg shadow-cyan-500/10 pointer-events-none select-none ${className}`}
    >
      {icon}
      {text}
    </motion.div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div>
        <p className="text-xl font-black text-white leading-none">{value}</p>
        <p className="text-[11px] text-gray-500 mt-0.5 leading-none">{label}</p>
      </div>
    </div>
  );
}

export default function Hero({
  figuras,
  currentIndex,
  prevSlide,
  nextSlide,
  goToSlide,
}: HeroProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlight({ x, y });
  };

  const itemVariants: Variants = {
    hidden: { y: 28, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * 0.12, type: "spring", stiffness: 90, damping: 18 },
    }),
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <section className="pt-20 sm:pt-32 pb-12 sm:pb-24 px-4 sm:px-8 relative overflow-hidden">
      {/* Decorative background elements sutiles igual que antes */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1600px] mx-auto border border-white/10 p-6 sm:p-14 bg-[#0F173A]/20 rounded-3xl sm:rounded-[40px] shadow-2xl backdrop-blur-md flex flex-col md:flex-row justify-between items-center gap-8 sm:gap-12 relative z-10"
      >

        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left md:ml-10">

          <motion.div
            custom={0}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-bold tracking-widest uppercase"
          >
            <Sparkles size={13} className="text-cyan-300" />
            Impresión 3D de alta precisión
          </motion.div>

          <motion.h1
            custom={1}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-tight mb-5"
          >
            Treddy — Figuras 3D<br />
            <RotatingWord />
          </motion.h1>

          <motion.p
            custom={2}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-base sm:text-xl text-[#B5B8C5] mb-6 sm:mb-8 leading-relaxed max-w-lg"
          >
            Personaliza o crea tu propia figura impresa en 3D con tecnología de vanguardia y acabados profesionales.
          </motion.p>

          <motion.div
            custom={3}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8 sm:mb-10"
          >
            <button
              onClick={() => router.push("/catalogo")}
              className="group flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-7 py-3.5 rounded-full font-bold text-sm hover:shadow-[0_0_35px_rgba(6,182,212,0.55)] shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
            >
              Ver catalogo
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => router.push("/personalizacion")}
              className="flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm text-white border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 backdrop-blur-sm transition-all duration-300"
            >
              <Zap size={15} className="text-cyan-400" />
              Personalizar
            </button>
          </motion.div>

          <motion.div
            custom={4}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-6 flex-wrap justify-center md:justify-start"
          >
            <Stat value="10k+" label="Pedidos entregados" />
            <div className="w-px h-8 bg-white/10" />
            <Stat value="98%" label="Satisfaccion" />
            <div className="w-px h-8 bg-white/10" />
            <Stat value="48h" label="Tiempo de entrega" />
          </motion.div>

          <motion.div
            custom={5}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="mt-6 flex items-center gap-2 text-[11px] text-gray-500"
          >
            <ShieldCheck size={14} className="text-cyan-600" />
            Pago seguro · Envío protegido · Garantía 15 días
          </motion.div>
        </div>

        {figuras.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 70 }}
            className="flex-shrink-0 w-full lg:w-[520px] xl:w-[580px] 2xl:w-[640px]"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-cyan-500/15 to-blue-600/15 rounded-[3rem] blur-2xl pointer-events-none" />

              <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                className="relative w-full h-[440px] sm:h-[500px] bg-[#0A0F2C]/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl group"
                style={{
                  background: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(0,230,246,0.08) 0%, transparent 60%), rgba(10,15,44,0.7)`,
                }}
              >
                <div className="absolute top-5 left-5 flex gap-1.5 z-20">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>

                <div className="absolute top-5 right-5 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold tracking-widest uppercase">
                  <Sparkles size={10} />
                  Destacado
                </div>

                <div className="flex-1 h-full flex flex-col items-center justify-center px-8 pt-12 pb-24">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, scale: 0.82, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 1.08, y: -16 }}
                      transition={{ duration: 0.5, type: "spring", damping: 22 }}
                      className="w-full h-full flex flex-col items-center justify-center text-center"
                    >
                      <div className="relative w-full h-[260px] sm:h-[290px]">
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-48 h-48 rounded-full bg-cyan-400/10 blur-3xl" />
                        </div>
                        <Image
                          src={figuras[currentIndex].imagenUrl}
                          alt={figuras[currentIndex].nombre}
                          fill
                          priority
                          sizes="(max-width: 768px) 100vw, 580px"
                          className="object-contain drop-shadow-[0_0_40px_rgba(0,230,246,0.2)] filter brightness-110 hover:scale-105 transition-transform duration-700"
                        />
                      </div>

                      <motion.div
                        initial={{ y: 16, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.25 }}
                        className="mt-4"
                      >
                        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                          {figuras[currentIndex].nombre}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 tracking-widest uppercase">Figura impresa en 3D</p>
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <button
                  onClick={prevSlide}
                  aria-label="Anterior"
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 text-white border border-white/8 hover:bg-cyan-500 hover:text-black hover:border-transparent transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 z-10 backdrop-blur-md"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Siguiente"
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 text-white border border-white/8 hover:bg-cyan-500 hover:text-black hover:border-transparent transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 z-10 backdrop-blur-md"
                >
                  <ChevronRight size={20} />
                </button>

                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
                  {figuras.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      aria-label={`Slide ${index + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        index === currentIndex
                          ? "w-10 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]"
                          : "w-2.5 bg-white/20 hover:bg-white/40"
                      }`}
                    />
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-5 right-5 z-20"
                >
                  <button
                    onClick={() => router.push("/catalogo")}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold hover:bg-cyan-500 hover:text-black transition-all duration-200"
                  >
                    Ver en catalogo
                    <ArrowRight size={12} />
                  </button>
                </motion.div>
              </div>

              <FloatingBadge
                icon={<ShieldCheck size={13} className="text-green-400" />}
                text="Garantia incluida"
                delay={0.9}
                className="-bottom-4 left-6"
              />
              <FloatingBadge
                icon={<Zap size={13} className="text-yellow-400" />}
                text="Entrega express"
                delay={1.1}
                className="-top-4 right-16"
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
