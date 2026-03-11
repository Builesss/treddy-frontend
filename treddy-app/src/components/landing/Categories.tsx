"use client";

import { motion } from "framer-motion";
import { Gamepad2, Tv2, Home, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Categories() {
  const router = useRouter();

  return (
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
              <h4 className="text-2xl font-bold text-white mb-1">Deco Hogar</h4>
              <p className="text-gray-300 text-sm mb-4">
                Objetos funcionales y estéticos impresos con diseño minimalista.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
