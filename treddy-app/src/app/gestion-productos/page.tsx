// src/app/products/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Nav from "@/pages/nav";
import Footer from "@/pages/footer";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagenUrl: string;
}

export default function ProductManagementPage() {
  const [productos, setProductos] = useState<Producto[]>([
    { id: 1, nombre: 'Figura Demo', precio: 29.99, imagenUrl: '/treddy-sublogo.png' },
  ]);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    precio: '',
    imagenUrl: '',
  });

  const [editandoId, setEditandoId] = useState<number | null>(null);

  // Guardar producto (Agregar o Editar)
  const guardarProducto = () => {
    if (!nuevoProducto.nombre || !nuevoProducto.precio) return;

    if (editandoId) {
      // 🔄 Actualizar producto existente
      setProductos((prev) =>
        prev.map((p) =>
          p.id === editandoId
            ? {
                ...p,
                nombre: nuevoProducto.nombre,
                precio: parseFloat(nuevoProducto.precio),
                imagenUrl: nuevoProducto.imagenUrl || '/treddy-sublogo.png',
              }
            : p
        )
      );
      setEditandoId(null); // Salir de modo edición
    } else {
      // ➕ Agregar producto nuevo
      const nuevo = {
        id: Date.now(),
        nombre: nuevoProducto.nombre,
        precio: parseFloat(nuevoProducto.precio),
        imagenUrl: nuevoProducto.imagenUrl || '/treddy-sublogo.png',
      };
      setProductos([...productos, nuevo]);
    }

    // Reset form
    setNuevoProducto({ nombre: '', precio: '', imagenUrl: '' });
  };

  // Eliminar producto
  const eliminarProducto = (id: number) => {
    setProductos(productos.filter((p) => p.id !== id));
    if (editandoId === id) {
      setEditandoId(null);
      setNuevoProducto({ nombre: '', precio: '', imagenUrl: '' });
    }
  };

  // Editar producto (cargar en formulario)
  const editarProducto = (id: number) => {
    const producto = productos.find((p) => p.id === id);
    if (producto) {
      setNuevoProducto({
        nombre: producto.nombre,
        precio: producto.precio.toString(),
        imagenUrl: producto.imagenUrl,
      });
      setEditandoId(producto.id);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0F2C] text-white">
      <Nav />

      <section className="px-8 py-16">
        <h2 className="text-4xl font-bold mb-8 text-center">Gestión de Productos</h2>

        {/* Formulario */}
        <div className="bg-[#0F173A] p-6 rounded-xl shadow-lg max-w-xl mx-auto mb-12">
          <h3 className="text-2xl font-semibold mb-4">
            {editandoId ? "Editar producto" : "Agregar producto"}
          </h3>

          <input
            type="text"
            placeholder="Nombre"
            value={nuevoProducto.nombre}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
            className="w-full mb-3 p-2 rounded bg-[#10193F] border border-gray-600 text-white"
          />

          <input
            type="number"
            placeholder="Precio"
            value={nuevoProducto.precio}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
            className="w-full mb-3 p-2 rounded bg-[#10193F] border border-gray-600 text-white"
          />

          <input
            type="text"
            placeholder="URL de imagen"
            value={nuevoProducto.imagenUrl}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, imagenUrl: e.target.value })}
            className="w-full mb-3 p-2 rounded bg-[#10193F] border border-gray-600 text-white"
          />

          <button
            onClick={guardarProducto}
            className="bg-[#00E6F6] text-black px-6 py-2 rounded-full hover:bg-[#00c8d4] font-medium"
          >
            {editandoId ? "Guardar cambios" : "Agregar"}
          </button>
        </div>

        {/* Lista de productos */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <div
              key={producto.id}
              className="bg-[#10193F] p-5 rounded-xl text-center shadow-lg hover:scale-105 transition-transform"
            >
              <Image
                src={producto.imagenUrl}
                alt={producto.nombre}
                width={120}
                height={120}
                className="mx-auto"
              />
              <p className="mt-3 font-semibold">{producto.nombre}</p>
              <p className="text-cyan-400">${producto.precio.toFixed(2)}</p>

              <div className="flex justify-center gap-2 mt-3">
                <button
                  onClick={() => editarProducto(producto.id)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-1 rounded-lg text-black font-medium"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarProducto(producto.id)}
                  className="bg-gradient-to-r from-pink-500 to-red-500 px-4 py-1 rounded-lg text-black font-medium"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
