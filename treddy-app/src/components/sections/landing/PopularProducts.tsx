"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import Image from "next/image";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { Figura } from "@/types";
// No useRouter needed
import Swal from "sweetalert2";

interface PopularProductsProps {
  figuras: Figura[];
  handleVerMas: (nombre: string) => void;
}

function ProductCard({
  figura,
  index,
  handleVerMas,
}: {
  figura: Figura;
  index: number;
  handleVerMas: (nombre: string) => void;
}) {
  // router removed
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // Simulate quick add to cart
    let sid = localStorage.getItem("sessionId");
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem("sessionId", sid);
    }
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://treddy-backend.onrender.com";
      const res = await fetch(`${apiUrl}/api/cart/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sid,
          productoId: figura.producto_id,
          cantidad: 1,
          precioPersonalizado: figura.precio_base,
        }),
      });

      if (!res.ok) throw new Error("Error al agregar");

      Swal.fire({
        icon: "success",
        title: "Agregado al carrito",
        text: `${figura.nombre} se agregó correctamente.`,
        timer: 2000,
        showConfirmButton: false,
        background: "#0F173A",
        color: "white",
        toast: true,
        position: "top-end",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo agregar al carrito.",
        background: "#0F173A",
        color: "white",
        toast: true,
        position: "top-end",
      });
    }
  };

  const badgeText =
    index === 0 ? "🔥 Top Ventas" : index === 1 ? "✨ Nuevo" : "💎 Premium";
  const badgeColor =
    index === 0
      ? "text-orange-400 bg-orange-400/10 border-orange-400/20"
      : index === 1
      ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
      : "text-cyan-400 bg-cyan-400/10 border-cyan-400/20";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      className={`group relative bg-[#0F173A]/60 backdrop-blur-xl p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] text-left border border-white/10 shadow-2xl flex flex-col overflow-hidden w-[85vw] sm:w-[60vw] md:w-auto flex-shrink-0 snap-center cursor-pointer ${
        index === 0 ? "md:col-span-2 lg:col-span-2 lg:row-span-2" : ""
      }`}
      onClick={() => handleVerMas(figura.nombre)}
    >
      {/* Spotlight Hover Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl sm:rounded-[2.5rem] opacity-0 transition duration-500 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(6, 182, 212, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-10 flex flex-col h-full w-full">
        {/* Dynamic Badge */}
        <div className="absolute top-0 left-0 z-20">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border backdrop-blur-md ${badgeColor}`}
          >
            {badgeText}
          </span>
        </div>

        {/* Image Container */}
        <div className="relative flex-grow mt-8 mb-6 w-full flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.1, rotate: index % 2 === 0 ? 3 : -3 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Image
              src={figura.imagenUrl}
              alt={figura.nombre}
              width={index === 0 ? 400 : 200}
              height={index === 0 ? 400 : 200}
              className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)] transition-all duration-500 ease-in-out group-hover:drop-shadow-[0_20px_40px_rgba(6,182,212,0.4)]"
            />
          </motion.div>
        </div>

        {/* Content Footer */}
        <div className="mt-auto w-full relative z-20">
          <h4
            className={`font-black text-white uppercase tracking-tight group-hover:text-cyan-300 transition-colors ${
              index === 0 ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"
            }`}
          >
            {figura.nombre}
          </h4>
          
          <div className="my-4 h-[1px] w-full bg-gradient-to-r from-cyan-500/50 via-white/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">Precio base</span>
              <p
                className={`font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-none ${
                  index === 0 ? "text-3xl" : "text-2xl"
                }`}
              >
                ${figura.precio_base.toLocaleString("es-CO")}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleQuickAdd}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-cyan-500 hover:text-black hover:border-cyan-500 transition-all duration-300 hover:scale-110 shadow-lg"
                title="Agregar rápido al carrito"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              <button
                className={`group/btn relative overflow-hidden bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:text-black hover:bg-cyan-400 rounded-full font-bold transition-all duration-500 flex items-center justify-center gap-2 ${
                  index === 0 ? "px-6 py-2 sm:py-0 sm:h-12" : "w-10 h-10 sm:w-12 sm:h-12"
                }`}
                title="Ver detalles"
              >
                {index === 0 && <span className="hidden sm:inline">Detalles</span>}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function PopularProducts({
  figuras,
  handleVerMas,
}: PopularProductsProps) {
  return (
    <section className="py-16 sm:py-24 relative overflow-hidden bg-[#0A0F2C]">
      {/* Background decoration */}
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Animated Orb */}
      <motion.div 
        animate={{ 
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" 
      />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <motion.h3
            initial={{ opacity: 0, scale: 0.95 }}
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
            transition={{ delay: 0.1 }}
            className="text-[#B5B8C5] text-base sm:text-lg max-w-2xl mx-auto"
          >
            Nuestras creaciones más solicitadas. Desliza para explorar o haz clic para personalizar tu favorita.
          </motion.p>
        </div>

        {/* Products Grid / Mobile Carousel */}
        <div className="flex md:grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide pb-8 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
          {figuras.slice(0, 7).map((figura: Figura, index: number) => (
            <ProductCard 
              key={figura.producto_id} 
              figura={figura} 
              index={index} 
              handleVerMas={handleVerMas} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
