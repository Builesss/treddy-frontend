/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import Image from 'next/image'
import { getFiguras } from '@/lib/api'
import { useEffect, useState } from 'react'
import TarjetaExpandible from '../../components/TarjetaExpandible'
import Nav from "@/pages/nav"
import Footer from "@/pages/footer"

export default function Catalogo() {
  const [figuras, setFiguras] = useState<any[]>([])
  const [seleccionada, setSeleccionada] = useState<any | null>(null)

  useEffect(() => {
    getFiguras().then(setFiguras).catch(console.error)
  }, [])

  return (
    <main className="min-h-screen bg-[#0A1A2F] text-white ">
     <Nav/>
      
      <h2 className="text-center text-2xl font-bold mb-6">CATALOGO DE FIGURAS 3D</h2>

      <div className="grid grid-cols-3 gap-6 px-20">
        {figuras.map((figura) => (
          <div
            key={figura.producto_id}
            onClick={() => setSeleccionada(figura)}
            className="`cursor-pointer bg-[#0F173A] w-140 p-4 rounded-xl py-5 shadow-lg flex flex-col items-center text-center hover:scale-105 hover:ring-2 hover:ring-cyan-400 transition-transform duration-200`"
          >
            <p className="text-[#00E6F6] font-bold mt-1">Disponible:{figura.stock}</p>
            <Image
              src={figura.imagenUrl || "/placeholder.png"}
              alt={figura.nombre}
              width={200}
              height={150}
              className="mx-auto mb-1 rounded-lg"
            />
            <h3 className="text-white font-semibold text-lg">{figura.nombre}</h3>
            <p className="text-[#00E6F6] font-bold mt-1">${figura.precio_base}</p>
            <button className="bg-gray-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-[#00E6F6] hover:text-black transition">
              Carrito de compras
            </button>
          </div>
        ))}
      </div>
        
      {seleccionada && (
        <TarjetaExpandible figura={seleccionada} onClose={() => setSeleccionada(null)} />
      )}
      <Footer/>
    </main>
  )
}
