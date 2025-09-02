'use client';

import Link from "next/link";
import Image from 'next/image';
import Nav from "../../pages/nav";
import Footer from "../../pages/footer";
import { getFiguras } from '../lib/api';


{/*subir */}
export default function Catalogo() {
  return (
    <main className="min-h-screen bg-[#0A1A2F] text-white px-6 py-8">
      {/* Esat porqueria de aqui es el header con su barra de navegacion, gracias por leer */}
      
        <Nav />

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {figuras.map((figura: any) => (
                    <div key={figura.id} className="bg-[#0F173A] p-4 rounded-lg text-center">
                      <Image src={figura.imagenUrl} alt={figura.nombre} width={100} height={100} className="mx-auto" />
                      <p className="mt-2 font-medium">{figura.nombre}</p>
                    </div>
                  ))}
                </div>
          <div className="block gap-2">
            <button className="bg-[#00E6F6] text-black px-3 py-1 rounded-md">
              Comprar
            </button>
            <br />
            <button className="bg-gray-700 px-3 py-1 rounded-md">
              Personalizar
            </button>
          </div>
        </div>

       
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
