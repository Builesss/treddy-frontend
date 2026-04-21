"use client";

import { motion, Variants } from "framer-motion";
import { Gamepad2, Tv2, Home, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Categories() {
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
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  return (
    <section className="py-24 px-8 relative overflow-hidden bg-[#030712]">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-4xl md:text-6xl font-black bg-gradient-to-r py-3 from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2 tracking-tighter">
              EXPLORA COLECCIONES
            </h3>
            <p className="text-[#B5B8C5] text-xl font-medium">
              Curamos lo mejor de la cultura geek para tu estantería.
            </p>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/catalogo")}
            className="group flex items-center gap-3 bg-white/5 border border-white/10 px-8 py-4 rounded-2xl text-cyan-400 hover:text-white hover:bg-white/10 font-black transition-all backdrop-blur-md uppercase text-sm tracking-widest leading-none"
          >
            CATÁLOGO COMPLETO
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[700px]"
        >
          {/* Main Category: Videojuegos */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -10, rotateX: 2, rotateY: 2 }}
            style={{ perspective: 1000 }}
            className="md:col-span-8 md:row-span-2 relative group overflow-hidden rounded-[2.5rem] bg-[#10193F] border border-white/5 shadow-2xl"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1.5s] ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F2C] via-transparent to-black/20" />

            <div className="relative h-full flex flex-col justify-end p-10 md:p-16">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 backdrop-blur-xl border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform">
                <Gamepad2 className="w-8 h-8" />
              </div>
              <h4 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">
                VIDEOJUEGOS
              </h4>
              <p className="text-gray-300 max-w-sm mb-8 font-medium text-lg leading-relaxed">
                Héroes y leyendas del gaming con acabados coleccionistas de alta
                fidelidad.
              </p>
              <button className="w-fit px-10 py-4 bg-white text-black hover:bg-cyan-400 rounded-2xl font-black uppercase text-sm tracking-widest transition-all transform hover:scale-105 active:scale-95 shadow-xl">
                EXPLORAR
              </button>
            </div>
            {/* Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/0 via-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          </motion.div>

          {/* Category: Anime */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -10, rotateX: 2, rotateY: -2 }}
            style={{ perspective: 1000 }}
            className="md:col-span-4 relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-white/5 shadow-2xl"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578632292335-df3abbb0d586?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-50 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1.5s] ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F2C] via-transparent to-transparent" />
            <div className="relative h-full flex flex-col justify-end p-10">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 backdrop-blur-xl border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4 group-hover:rotate-12 transition-transform">
                <Tv2 className="w-6 h-6" />
              </div>
              <h4 className="text-3xl font-black text-white mb-2 tracking-tight">
                ANIME
              </h4>
              <p className="text-gray-300 font-medium text-base mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                Los guerreros más icónicos del Shonen y Seinen en resina
                premium.
              </p>
              <button className="w-fit px-6 py-2 border border-white/20 hover:bg-white hover:text-black rounded-xl text-white text-xs font-black uppercase tracking-widest transition-all">
                VER MÁS
              </button>
            </div>
          </motion.div>

          {/* Category: Deco Hogar */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -10, rotateX: -2, rotateY: -2 }}
            style={{ perspective: 1000 }}
            className="md:col-span-4 relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-white/5 shadow-2xl"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-50 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1.5s] ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F2C] via-transparent to-transparent" />
            <div className="relative h-full flex flex-col justify-end p-10">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:rotate-12 transition-transform">
                <Home className="w-6 h-6" />
              </div>
              <h4 className="text-3xl font-black text-white mb-2 tracking-tight">
                DECO HOGAR
              </h4>
              <p className="text-gray-300 font-medium text-base mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                Minimalismo y arte funcional impreso para transformar tu
                espacio.
              </p>
              <button className="w-fit px-6 py-2 border border-white/20 hover:bg-white hover:text-black rounded-xl text-white text-xs font-black uppercase tracking-widest transition-all">
                VER MÁS
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
