/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getFiguras } from '../lib/api';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '../pages/footer'; 
import Nav from '../pages/nav';

export default function HomePage() {
  const [figuras, setFiguras] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getFiguras().then(setFiguras).catch(console.error);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? figuras.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === figuras.length - 1 ? 0 : prev + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <main className="min-h-screen bg-[#0A0F2C] text-white">
      <Nav/>

      <section className="flex flex-col md:flex-row justify-between items-center px-8 py-16">
        <div className="max-w-xl">
          <h2 className="text-5xl font-bold">Treddy Figuras 3D</h2>
          <p className="mt-4 text-lg text-[#B5B8C5]">
            Personaliza o crea tu propia figura impresa en 3D
          </p>
          <button className="mt-6 bg-[#00E6F6] text-black px-6 py-2 rounded-full hover:bg-[#00c8d4] font-medium">
            Inicia ahora
          </button>
        </div>

        {/* CARRUSEL */}
        {figuras.length > 0 && (
          <section className="w-200 bg-[#0F173A] rounded-lg shadow-md my-1 py-5">
            <div className="relative w-full overflow-hidden rounded-lg">
              <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {figuras.map((figura: any) => (
                  <div
                    key={figura.id}
                    className="flex-shrink-0 w-full flex justify-center items-center p-6"
                  >
                    <div className="text-center">
                      <Image
                        src={figura.imagenUrl}
                        alt={figura.nombre}
                        width={150}
                        height={150}
                        className="mx-auto rounded-md"
                      />
                      <p className="mt-2 font-medium">{figura.nombre}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botón anterior */}
              <button
                onClick={prevSlide}
                type="button"
                className="absolute inset-y-0 left-0 flex items-center justify-center w-12 h-full text-white hover:bg-white/10"
              >
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              {/* Botón siguiente */}
              <button
                onClick={nextSlide}
                type="button"
                className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-white hover:bg-white/10"
              >
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>

              {/* Dots de navegación */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2">
                {figuras.map((_: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-[#00E6F6]' : 'bg-gray-400'}`}
                  ></button>
                ))}
              </div>
            </div>
          </section>
        )}
      </section>

      {/* PRODUCTOS POPULARES */}
      <section className="px-8 py-10">
        <h3 className="text-2xl font-bold mb-6">Productos Populares</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {figuras.map((figura: any) => (
            <div key={figura.id} className="bg-[#0F173A] p-4 rounded-lg text-center">
              <Image src={figura.imagenUrl} alt={figura.nombre} width={100} height={100} className="mx-auto" />
              <p className="mt-2 font-medium">{figura.nombre}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN AR */}
      <section className="px-8 py-16 bg-[#0F173A] flex flex-col md:flex-row justify-between items-center mb-10">
        <div className="max-w-xl">
          <h4 className="text-xl font-bold mb-2">Visualiza tu imagen en realidad aumentada</h4>
          <p className="text-[#B5B8C5]">
            Usa tu cámara para ver cómo se vería tu figura 3D en un espacio real antes de comprarla. ¡Haz tu compra con total confianza!
          </p>
          <button className="mt-6 bg-[#00E6F6] text-black px-6 py-2 rounded-full hover:bg-[#00c8d4] font-medium">
            Pruébalo ahora
          </button>
        </div>
        <div className="mt-10 md:mt-0">
          <Image src="/treddy-sublogo.png" alt="Treddy Logo" width={250} height={250} />
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </main>
  );
}
