/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getFiguras } from '../lib/api';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const [figuras, setFiguras] = useState([]);

  useEffect(() => {
    getFiguras().then(setFiguras).catch(console.error);
  }, []);

  return (
    <main className="min-h-screen bg-[#0A0F2C] text-white">
      <header className="flex justify-between items-center px-8 py-6 bg-[#0A0F2C] border-b border-[#1a1f40]">
        <h1 className="text-2xl font-bold text-[#00E6F6]">TREDDY</h1>
        <nav className="space-x-6">
          <Link href="#" className="hover:text-[#00E6F6]">Inicio</Link>
          <Link href="#" className="hover:text-[#00E6F6]">Productos</Link>
          <Link href="#" className="hover:text-[#00E6F6]">Personalizar</Link>
          <Link href="#" className="hover:text-[#00E6F6]">Contacto</Link>
        </nav>
        <div className="space-x-4">
          <button>🔍</button>
          <button>👤</button>
          <button>🛒</button>
        </div>
      </header>

      <section className="flex flex-col md:flex-row justify-between items-center px-8 py-16">
        <div className="max-w-xl">
          <h2 className="text-5xl font-bold">Treddy Figuras 3D</h2>
          <p className="mt-4 text-lg text-[#B5B8C5]">Personaliza o crea tu propia figura impresa en 3D</p>
          <button className="mt-6 bg-[#00E6F6] text-black px-6 py-2 rounded-full hover:bg-[#00c8d4] font-medium">Inicia ahora</button>
        </div>
        <div className="mt-10 md:mt-0">
          <Image src="/treddy-logo.png" alt="Treddy Logo" width={180} height={180} />
        </div>
      </section>

      <section className="px-8 py-10">
        <h3 className="text-2xl font-bold mb-6">Productos Populares</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {figuras.map((figura: any) => (
            <div key={figura.producto_id} className="bg-[#0F173A] p-4 rounded-lg text-center">
              <Image src={figura.imagenUrl} alt={figura.nombre} width={100} height={100} className="mx-auto" />
              <p className="mt-2 font-medium">{figura.nombre}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-8 py-16 bg-[#0F173A] flex flex-col md:flex-row justify-between items-center">
        <div className="max-w-xl">
          <h4 className="text-xl font-bold mb-2">Visualiza tu imagen en realidad aumentada</h4>
          <p className="text-[#B5B8C5]">Usa tu cámara para ver cómo se vería tu figura 3D en un espacio real antes de comprarla. ¡Haz tu compra con total confianza!</p>
          <button className="mt-6 bg-[#00E6F6] text-black px-6 py-2 rounded-full hover:bg-[#00c8d4] font-medium">Pruébalo ahora</button>
        </div>
        <div className="mt-10 md:mt-0">
          <Image src="/treddy-sublogo.png" alt="Treddy Logo" width={250} height={250} />
        </div>
      </section>
    </main>
  );
}
