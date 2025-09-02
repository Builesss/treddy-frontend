'use client';

import Link from "next/link";
import Image from 'next/image';
import { getFiguras } from '@/lib/api';
import { useEffect, useState } from 'react';


{/*subir */}
export default function Catalogo() {
  const [figuras, setFiguras] = useState([]);
  
    useEffect(() => {
      getFiguras().then(setFiguras).catch(console.error);
    }, []);
  return (
    <main className="min-h-screen bg-[#0A1A2F] text-white px-6 py-8">
      {/* Esat porqueria de aqui es el header con su barra de navegacion, gracias por leer */}
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

      {/* EL titulo centrado que debe aparecer por encima de los productos */}
      <h2 className="text-center text-2xl font-bold mb-6">
        CATALOGO DE FIGURAS 3D
      </h2>

      <div className="flex justify-center gap-4 mb-8">
        <select className="bg-[#00E6F6] text-black px-3 py-1 rounded-md">
          <option>Todas las Categorías</option>
        </select>
        <select className="bg-[#00E6F6] text-black px-3 py-1 rounded-md">
          <option>Todas las Subcategorías</option>
        </select>
      </div>

    
       <div className="grid grid-cols-3 gap-6">

  {figuras.map((figura: any) => (
    <div
      key={figura.id}
      className="bg-[#0F173A] p-4 rounded-xl shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform duration-200"
    >
      <Image
        src={figura.imagenUrl}
        alt={figura.nombre}
        width={150}
        height={150}
        className="mx-auto mb-3 rounded-lg"
      />
      <h3 className="text-white font-semibold text-lg">{figura.nombre}</h3>
      {/* precio de los productos*/}
      <p className="text-[#00E6F6] font-bold mt-1">${figura.precio_base}</p>
      <div className="flex flex-col gap-2 w-full mt-4">
        <button className="bg-[#00E6F6] text-black font-bold py-2 rounded-lg hover:bg-black hover:text-[#00E6F6] transition">
          Comprar
        </button>
        <button className="bg-gray-600 text-white font-semibold py-2 rounded-lg hover:bg-[#00E6F6] hover:text-black transition">
          Personalizar
        </button>
      </div>
    </div>
  ))}
</div>
  
       

      {/* Esta porqueria de aqui es la paginacion, para cuando se llega el limite 
      maximo de produtos en una seccion aun no funciona
      solo son estrcutura vacias de button*/}
      <div className="flex justify-center mt-10 gap-2">
        <button className="bg-[#00E6F6] text-black px-3 py-1 rounded-md">1</button>
        <button className="bg-[#00E6F6] text-black px-3 py-1 rounded-md">2</button>
        <button className="bg-[#00E6F6] text-black px-3 py-1 rounded-md">3</button>
      </div>

      <footer/>
    </main>
  );
}
