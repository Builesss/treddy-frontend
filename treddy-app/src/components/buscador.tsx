'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getFiguras } from '@/lib/api'
import TarjetaExpandible from './TarjetaExpandible'

export default function Buscador() {
  const [figuras, setFiguras] = useState<any[]>([])
  const [filtradas, setFiltradas] = useState<any[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [seleccionada, setSeleccionada] = useState<any | null>(null)

  useEffect(() => {
    getFiguras()
      .then((res) => {
        setFiguras(res)
        setFiltradas(res)
      })
      .catch(console.error)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value
    setBusqueda(valor)
    setFiltradas(
      figuras.filter((item) =>
        item.nombre.toLowerCase().includes(valor.toLowerCase())
      )
    )
  }

  return (
    <div className="w-full">
      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={busqueda}
          onChange={handleChange}
          placeholder="Buscar figura..."
          className="w-full max-w-md p-2 rounded-lg text-white"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {filtradas.map((figura) => (
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
    </div>
  )
}