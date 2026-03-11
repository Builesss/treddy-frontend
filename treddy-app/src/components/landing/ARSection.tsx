"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ARSection() {
  const router = useRouter();

  return (
    <section className="pt-32 pb-24 px-8">
      <div className="max-w-[1600px] mx-auto border border-white/10 p-12 bg-[#0F173A]/20 rounded-[40px] shadow-2xl backdrop-blur-md flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="max-w-xl text-center md:text-left">
          <h4 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-tight mb-8 ml-10">
            Realidad Aumentada
          </h4>
          <p className="text-xl text-[#B5B8C5] mb-10 leading-relaxed ml-10">
            Usa tu cámara para ver cómo se vería tu figura 3D en tu propio
            espacio antes de ordenarla. Tecnología inmersiva para tu total
            confianza.
          </p>
          <button
            onClick={() => router.push("/personalizacion")}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-10 py-4 rounded-full hover:opacity-90 font-bold shadow-lg transition-all transform hover:scale-105 ml-10"
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
              style={{ width: "auto", height: "auto" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
