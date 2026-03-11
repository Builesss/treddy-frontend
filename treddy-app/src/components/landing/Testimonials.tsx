"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
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
  {
    name: "Laura Martínez",
    role: "Diseñadora",
    comment:
      "El nivel de detalle es increíble. Ideal para mis prototipos de diseño industrial.",
    stars: 5,
  },
  {
    name: "Javier López",
    role: "Fan de Marvel",
    comment:
      "Pedí un busto de Iron Man y la pintura es profesional. Realmente parece metal.",
    stars: 5,
  },
  {
    name: "Sofía Castro",
    role: "Arquitecta",
    comment:
      "Las maquetas que imprimí con Treddy son precisas y resistentes. El mejor servicio 3D.",
    stars: 5,
  },
  {
    name: "Andrés Villa",
    role: "Entusiasta Tech",
    comment:
      "La tecnología que usan es de punta. No hay rayas de impresión visibles a simple vista.",
    stars: 5,
  },
  {
    name: "Isabel Ortiz",
    role: "Artista Digital",
    comment:
      "Darle vida a mis esculturas digitales nunca fue tan fácil y con tanta fidelidad.",
    stars: 5,
  },
  {
    name: "Miguel Rojas",
    role: "Hobbista",
    comment:
      "Excelente atención al cliente y tiempos de entrega rápidos. Muy recomendados.",
    stars: 5,
  },
];

interface TestimonialsProps {
  testimonialIndex: number;
  setTestimonialIndex: (index: number | ((prev: number) => number)) => void;
}

export default function Testimonials({
  testimonialIndex,
  setTestimonialIndex,
}: TestimonialsProps) {
  const totalPages = Math.ceil(testimonials.length / 3);

  return (
    <section className="py-24 px-8 overflow-hidden bg-[#030712]">
      <div className="max-w-[1500px] mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-current" /> +500 Clientes Felices
          </div>
          <h3 className="text-4xl md:text-6xl font-black bg-gradient-to-r py-3 from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4 tracking-tighter">
            LO QUE DICEN DE NOSOTROS
          </h3>
        </div>

        <div className="relative max-w-[1600px] mx-auto">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4"
              >
                {testimonials
                  .slice(testimonialIndex * 3, testimonialIndex * 3 + 3)
                  .map((testimonial, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-8 rounded-[40px] bg-[#0F173A]/40 border border-white/10 backdrop-blur-md relative flex flex-col h-full hover:border-cyan-500/30 transition-all duration-300 group/card"
                    >
                      <div className="flex justify-center gap-1 mb-6">
                        {[...Array(testimonial.stars)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 fill-cyan-400 text-cyan-400"
                          />
                        ))}
                      </div>
                      <p className="text-lg text-gray-200 italic mb-8 leading-relaxed text-center flex-grow">
                        &quot;{testimonial.comment}&quot;
                      </p>
                      <div className="flex flex-col items-center gap-4 mt-auto">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-black font-bold text-lg shadow-lg group-hover/card:scale-110 transition-transform">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div className="text-center">
                          <p className="text-white font-bold text-base">
                            {testimonial.name}
                          </p>
                          <p className="text-cyan-400 text-sm font-medium">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>

                      <div className="absolute top-6 left-6 text-cyan-500/10 text-6xl font-serif select-none pointer-events-none">
                        &ldquo;
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={() =>
              setTestimonialIndex((prev: number) =>
                prev === 0 ? totalPages - 1 : prev - 1,
              )
            }
            className="absolute left-0 md:-left-24 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-cyan-500 hover:text-black transition-all group z-10"
          >
            <ChevronLeft
              size={24}
              className="group-hover:scale-110 transition-transform"
            />
          </button>

          <button
            onClick={() =>
              setTestimonialIndex((prev: number) =>
                prev === totalPages - 1 ? 0 : prev + 1,
              )
            }
            className="absolute right-0 md:-right-24 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-cyan-500 hover:text-black transition-all group z-10"
          >
            <ChevronRight
              size={24}
              className="group-hover:scale-110 transition-transform"
            />
          </button>

          <div className="flex justify-center gap-3 mt-12">
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setTestimonialIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === testimonialIndex
                    ? "w-10 bg-cyan-400 shadow-[0_0_10px_#00E6F6]"
                    : "w-3 bg-gray-600 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
