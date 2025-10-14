'use client'

import Image from 'next/image'
import { useState } from 'react'
import Nav from '@/pages/nav'
import Footer from '@/pages/footer'
import { Edit3, LogOut, Settings, User, Lock, ShoppingBag } from 'lucide-react'

export default function Perfil() {
  const [usuario, setUsuario] = useState({
    nombre: 'Sebastián Builes',
    email: 'sebas@treddy.com',
    telefono: '+57 300 123 4567',
    rol: 'Cliente',
    fechaRegistro: '2025-01-20',
    avatar: '/perfil-avatar.png',
  })

  const [modoEdicion, setModoEdicion] = useState(false)

  return (
    <main className="flex flex-col min-h-screen bg-[#0A0F2C] text-white">
      <Nav />

      {/* Encabezado */}
      <section className="max-w-5xl mx-auto py-12 px-6 md:px-0 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Mi Perfil
        </h1>
        <p className="text-gray-400 mt-2">Administra tu información y preferencias</p>
      </section>

      {/* Contenedor principal */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-0 mb-10">
        {/* Panel izquierdo - Avatar e info básica */}
        <div className="bg-[#0F173A] rounded-2xl p-6 shadow-lg flex flex-col items-center text-center border border-[#1a1f40]">
          <div className="relative">
            <Image
              src={usuario.avatar}
              alt="Avatar"
              width={120}
              height={120}
              className="rounded-full border-2 border-[#00E6F6]"
            />
            <button
              onClick={() => alert('Funcionalidad pendiente: cambiar foto')}
              className="absolute bottom-1 right-1 bg-[#00E6F6] text-black rounded-full p-1 hover:opacity-80"
            >
              <Edit3 size={16} />
            </button>
          </div>

          <h2 className="text-xl font-bold mt-4">{usuario.nombre}</h2>
          <p className="text-sm text-gray-400">{usuario.rol}</p>

          <button
            onClick={() => alert('Cerrar sesión')}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-5 py-2 rounded-full mt-6 font-semibold hover:opacity-90 transition"
          >
            <LogOut size={18} /> Cerrar sesión
          </button>
        </div>

        {/* Panel central - Información */}
        <div className="bg-[#0F173A] rounded-2xl p-6 shadow-lg border border-[#1a1f40] col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <User /> Información personal
            </h3>
            <button
              onClick={() => setModoEdicion(!modoEdicion)}
              className="flex items-center gap-1 text-[#00E6F6] hover:underline"
            >
              <Edit3 size={16} /> {modoEdicion ? 'Guardar' : 'Editar'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div>
              <p className="text-sm text-gray-400">Nombre</p>
              {modoEdicion ? (
                <input
                  type="text"
                  className="w-full bg-[#1A214A] rounded-lg p-2 mt-1 text-white"
                  value={usuario.nombre}
                  onChange={(e) =>
                    setUsuario({ ...usuario, nombre: e.target.value })
                  }
                />
              ) : (
                <p className="text-white">{usuario.nombre}</p>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-400">Correo electrónico</p>
              <p>{usuario.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Teléfono</p>
              {modoEdicion ? (
                <input
                  type="text"
                  className="w-full bg-[#1A214A] rounded-lg p-2 mt-1 text-white"
                  value={usuario.telefono}
                  onChange={(e) =>
                    setUsuario({ ...usuario, telefono: e.target.value })
                  }
                />
              ) : (
                <p>{usuario.telefono}</p>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-400">Fecha de registro</p>
              <p>{usuario.fechaRegistro}</p>
            </div>
          </div>

          <hr className="my-6 border-[#1a1f40]" />

          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Settings /> Configuración
            </h3>
            <button
              onClick={() => alert('Funcionalidad pendiente: cambiar contraseña')}
              className="flex items-center gap-2 bg-[#1A214A] hover:bg-[#00E6F6] hover:text-black transition px-4 py-2 rounded-lg"
            >
              <Lock size={18} /> Cambiar contraseña
            </button>
            <button
              onClick={() => alert('Funcionalidad pendiente: preferencias')}
              className="flex items-center gap-2 bg-[#1A214A] hover:bg-[#00E6F6] hover:text-black transition px-4 py-2 rounded-lg"
            >
              <Settings size={18} /> Preferencias de cuenta
            </button>
          </div>
        </div>
      </section>

      {/* Historial de pedidos */}
      <section className="max-w-5xl mx-auto mb-20 px-6 md:px-0">
        <h3 className="text-2xl font-bold flex items-center gap-2 mb-6">
          <ShoppingBag /> Historial de compras
        </h3>

        <div className="overflow-x-auto bg-[#0F173A] rounded-2xl border border-[#1a1f40] shadow-lg">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="bg-[#1A214A] text-gray-400 uppercase">
              <tr>
                <th className="px-6 py-3"># Pedido</th>
                <th className="px-6 py-3">Producto</th>
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i} className="border-b border-[#1a1f40] hover:bg-[#1A214A]">
                  <td className="px-6 py-3">ORD-{1000 + i}</td>
                  <td className="px-6 py-3">Figura personalizada #{i}</td>
                  <td className="px-6 py-3">2025-10-12</td>
                  <td className="px-6 py-3 text-[#00E6F6]">Entregado</td>
                  <td className="px-6 py-3">$120.000</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Footer />
    </main>
  )
}
