'use client'
import Image from 'next/image';

type Figura = {
  id: number
  nombre: string
  imagenUrl: string
  precio_base: number
  descripcion: string
  stock: number
}

export default function TarjetaExpandible({ figura, onClose }: { figura: Figura, onClose: () => void }) {
  if (!figura) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-[#0F173A] p-6 rounded-xl max-w-md w-full text-center relative text-white">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-lg hover:text-[#00E6F6]"
        >
          X
        </button>
         <p className="text-[#00E6F6] font-bold mt-1">Disponible: {figura.stock}</p>
        <Image
          src={figura.imagenUrl || "/placeholder.png"} 
          alt={figura.nombre}
          width={350}
          height={400}
          className="mx-auto mb-4 rounded-lg"
        />
        <h2 className="text-2xl font-bold mb-2">{figura.nombre}</h2>
        <p className="text-[#00E6F6] font-bold mb-2">${figura.precio_base}</p>
        <p className="text-gray-300 mb-4">{figura.descripcion}</p>
        <div className="flex flex-col gap-2">
          <button className="bg-[#00E6F6] text-black font-bold py-2 rounded-lg hover:bg-black hover:text-[#00E6F6] transition">
            Comprar
          </button>
          <button className="bg-gray-600 text-white font-semibold py-2 rounded-lg hover:bg-[#00E6F6] hover:text-black transition">
            Personalizar
          </button>
          <button className="bg-gray-600 text-white font-semibold py-2 rounded-lg hover:bg-[#00E6F6] hover:text-black transition">
            enviar a carrito de compras
          </button>
        </div>
      </div>
    </div>
  )
}