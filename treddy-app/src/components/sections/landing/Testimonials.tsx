"use client";

import { useRef, useState, useEffect } from "react";
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

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[40px] bg-[#0F173A]/40 border border-white/10 backdrop-blur-md relative flex flex-col h-full hover:border-cyan-500/30 transition-all duration-300 group/card">
      <div className="flex justify-center gap-1 mb-4 sm:mb-6">
        {[...Array(testimonial.stars)].map((_, i) => (
          <Star
            key={i}
            className="w-4 h-4 sm:w-5 sm:h-5 fill-cyan-400 text-cyan-400"
          />
        ))}
      </div>
      <p className="text-base sm:text-lg text-gray-200 italic mb-6 sm:mb-8 leading-relaxed text-center flex-grow">
        &quot;{testimonial.comment}&quot;
      </p>
      <div className="flex flex-col items-center gap-3 sm:gap-4 mt-auto">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-black font-bold text-lg shadow-lg group-hover/card:scale-110 transition-transform">
          {testimonial.name.charAt(0)}
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-sm sm:text-base">
            {testimonial.name}
          </p>
          <p className="text-cyan-400 text-xs sm:text-sm font-medium">
            {testimonial.role}
          </p>
        </div>
      </div>

      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 text-cyan-500/10 text-5xl sm:text-6xl font-serif select-none pointer-events-none">
        &ldquo;
      </div>
    </div>
  );
}

interface TestimonialsProps {
  testimonialIndex: number;
  setTestimonialIndex: (index: number | ((prev: number) => number)) => void;
}

export default function Testimonials({
  testimonialIndex,
  setTestimonialIndex,
}: TestimonialsProps) {
  const totalPages = Math.ceil(testimonials.length / 3);
  const [isMobile, setIsMobile] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);

  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Track which card is in view on mobile scroll
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !isMobile) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.offsetWidth * 0.82; // ~82% card width + gap
      const index = Math.round(scrollLeft / cardWidth);
      setActiveMobileIndex(Math.min(index, testimonials.length - 1));
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  // Auto scroll effect
  useEffect(() => {
    if (isHovered || isDragging) return;

    const timer = setInterval(() => {
      if (isMobile) {
        const container = scrollRef.current;
        if (container) {
          const cardWidth = container.offsetWidth * 0.82;
          const nextIndex = (activeMobileIndex + 1) % testimonials.length;
          container.scrollTo({
            left: nextIndex * (cardWidth + 16),
            behavior: "smooth",
          });
        }
      } else {
        setTestimonialIndex((prev: number) => (prev === totalPages - 1 ? 0 : prev + 1));
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [isMobile, activeMobileIndex, setTestimonialIndex, totalPages, isHovered, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsHovered(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  return (
    <section 
      className="py-16 sm:py-24 px-4 sm:px-8 overflow-hidden bg-[#0A0F2C]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-[1500px] mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4 sm:mb-6">
            <Star className="w-4 h-4 fill-current" /> +500 Clientes Felices
          </div>
          <h3 className="text-3xl sm:text-4xl md:text-6xl font-black bg-gradient-to-r py-3 from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4 tracking-tighter">
            LO QUE DICEN DE NOSOTROS
          </h3>
        </div>

        {/* Mobile: horizontal scroll, 1 card at a time */}
        {isMobile ? (
          <div className="relative">
            <div
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className={`flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4 ${isDragging ? 'cursor-grabbing snap-none' : 'cursor-grab'}`}
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {testimonials.map((testimonial, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-[82%] snap-center"
                >
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>

            {/* Mobile scroll dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const container = scrollRef.current;
                    if (container) {
                      const cardWidth = container.offsetWidth * 0.82;
                      container.scrollTo({
                        left: idx * (cardWidth + 16),
                        behavior: "smooth",
                      });
                    }
                    setActiveMobileIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeMobileIndex
                      ? "w-8 bg-cyan-400 shadow-[0_0_10px_#00E6F6]"
                      : "w-2 bg-gray-600 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Desktop: paginated 3-card carousel */
          <div className="relative max-w-[1600px] mx-auto">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="grid grid-cols-3 gap-8 py-4 cursor-grab active:cursor-grabbing"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={(e, { offset }) => {
                    setIsDragging(false);
                    const swipe = offset.x;
                    if (swipe < -50) {
                      setTestimonialIndex((prev: number) => (prev === totalPages - 1 ? 0 : prev + 1));
                    } else if (swipe > 50) {
                      setTestimonialIndex((prev: number) => (prev === 0 ? totalPages - 1 : prev - 1));
                    }
                  }}
                >
                  {testimonials
                    .slice(testimonialIndex * 3, testimonialIndex * 3 + 3)
                    .map((testimonial, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <TestimonialCard testimonial={testimonial} />
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
              className="absolute -left-24 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-cyan-500 hover:text-black transition-all group z-10"
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
              className="absolute -right-24 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-cyan-500 hover:text-black transition-all group z-10"
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
        )}
      </div>
    </section>
  );
}
