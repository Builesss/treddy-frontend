'use client';

import Link from "next/link";
import Image from 'next/image';


{/*subir */}
export default function Catalogo() {
  return (
    <main className="min-h-screen bg-[#0A1A2F] text-white px-6 py-8">
      {/* Esat porqueria de aqui es el header con su barra de navegacion, gracias por leer */}
      <header className="flex justify-between items-center px-8 py-8">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Esta es la estructura para la tarjeta, solo copie y pegue las demas 
        y lo meti en un grid para que se acomode*/}
        <div className="bg-[#0F2238] rounded-xl p-4 flex flex-col items-center">
          {/* Aqui va la imagen de la figura el bg-gray lo uso
           solo para marcar que ahi va(quitar una vez puesta la imagen)*/}
          <div className="w-32 h-32 bg-gray-700 rounded-lg mb-4" />
          <h3 className="font-semibold">Oso Meditador</h3>
          <p className="text-sm text-gray-300 mb-2">100.000$</p>
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

        <div className="bg-[#0F2238] rounded-xl p-4 flex flex-col items-center">
          {/* Aqui va la imagen de la figura el bg-gray lo uso
           solo para marcar que ahi va(quitar una vez puesta la imagen)*/}
          <div className="w-32 h-32 bg-gray-700 rounded-lg mb-4" />
          <h3 className="font-semibold">El cazador</h3>
          <p className="text-sm text-gray-300 mb-2">120.000$</p>
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

        <div className="bg-[#0F2238] rounded-xl p-4 flex flex-col items-center">
          {/* Aqui va la imagen de la figura el bg-gray lo uso
           solo para marcar que ahi va(quitar una vez puesta la imagen)*/}
          <div className="w-32 h-32 bg-gray-700 rounded-lg mb-4" />
          <h3 className="font-semibold">El cazador</h3>
          <p className="text-sm text-gray-300 mb-2">120.000$</p>
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

        <div className="bg-[#0F2238] rounded-xl p-4 flex flex-col items-center">
          {/* Aqui va la imagen de la figura el bg-gray lo uso
           solo para marcar que ahi va(quitar una vez puesta la imagen)*/}
          <div className="w-32 h-32 bg-gray-700 rounded-lg mb-4" />
          <h3 className="font-semibold">El cazador</h3>
          <p className="text-sm text-gray-300 mb-2">120.000$</p>
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

        <div className="bg-[#0F2238] rounded-xl p-4 flex flex-col items-center">
          {/* Aqui va la imagen de la figura el bg-gray lo uso
           solo para marcar que ahi va(quitar una vez puesta la imagen)*/}
          <div className="w-32 h-32 bg-gray-700 rounded-lg mb-4" />
          <h3 className="font-semibold">El cazador</h3>
          <p className="text-sm text-gray-300 mb-2">120.000$</p>
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

        <div className="bg-[#0F2238] rounded-xl p-4 flex flex-col items-center">
          {/* Aqui va la imagen de la figura el bg-gray lo uso
           solo para marcar que ahi va(quitar una vez puesta la imagen)*/}
          <div className="w-32 h-32 bg-gray-700 rounded-lg mb-4" />
          <h3 className="font-semibold">El cazador</h3>
          <p className="text-sm text-gray-300 mb-2">120.000$</p>
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

        <div className="bg-[#0F2238] rounded-xl p-4 flex flex-col items-center">

          <div className="w-32 h-32 bg-gray-700 rounded-lg mb-4" />
          <h3 className="font-semibold">El cazador</h3>
          <p className="text-sm text-gray-300 mb-2">120.000$</p>
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

        <div className="bg-[#0F2238] rounded-xl p-4 flex flex-col items-center">
          {/* Aqui va la imagen de la figura el bg-gray lo uso
           solo para marcar que ahi va(quitar una vez puesta la imagen)*/}
          <div className="w-32 h-32 bg-gray-700 rounded-lg mb-4" />
          <h3 className="font-semibold">El cazador</h3>
          <p className="text-sm text-gray-300 mb-2">120.000$</p>
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

        <div className="bg-[#0F2238] rounded-xl p-4 flex flex-col items-center">
          {/* Aqui va la imagen de la figura el bg-gray lo uso
           solo para marcar que ahi va(quitar una vez puesta la imagen)*/}
          <div className="w-32 h-32 bg-gray-700 rounded-lg mb-4" />
          <h3 className="font-semibold">El cazador</h3>
          <p className="text-sm text-gray-300 mb-2">120.000$</p>
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

      <footer className="mt-12 text-center text-[#00E6F6] font-bold text-xl">
        TREDDY
      </footer>
    </main>
  );
}
