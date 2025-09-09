'use client'
import Link from "next/link"
import Image from 'next/image'
import { getFiguras } from '@/lib/api'
import { useEffect, useState } from 'react'
import TarjetaExpandible from './TajetaExpandible'

export default function Catalogo() {
  const [figuras, setFiguras] = useState<any[]>([])
  const [seleccionada, setSeleccionada] = useState<any | null>(null)

  useEffect(() => {
    getFiguras().then(setFiguras).catch(console.error)
  }, [])

  return (
    <main className="min-h-screen bg-[#0A1A2F] text-white px-6 py-8">
      <header className="flex justify-between items-center px-8 py-6 border-b border-[#1a1f40]">
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

      <h2 className="text-center text-2xl font-bold mb-6">CATALOGO DE FIGURAS 3D</h2>

      <div className="grid grid-cols-3 gap-6">
        {figuras.map((figura) => (
          <div
            key={figura.producto_id}
            onClick={() => setSeleccionada(figura)}
            className="cursor-pointer bg-[#0F173A] p-4 rounded-xl shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform duration-200"
          >
            <p className="text-[#00E6F6] font-bold mt-1">Disponible:{figura.stock}</p>
            <Image
              src={figura.imagenUrl || "/placeholder.png"}
              alt={figura.nombre}
              width={150}
              height={150}
              className="mx-auto mb-3 rounded-lg"
            />
            <h3 className="text-white font-semibold text-lg">{figura.nombre}</h3>
            <p className="text-[#00E6F6] font-bold mt-1">${figura.precio_base}</p>
            <button className="bg-gray-600 text-white font-semibold py-2 rounded-lg hover:bg-[#00E6F6] hover:text-black transition">
              carrito de compras
            </button>
          </div>
        ))}
      </div>

      {seleccionada && (
        <TarjetaExpandible figura={seleccionada} onClose={() => setSeleccionada(null)} />
      )}
    </main>
  )
}
