/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import Nav from "@/pages/nav";
import Footer from "@/pages/footer";
import {
  getFiguras,
  createFigura,
  updateFigura,
  deleteFigura,
} from "@/lib/api";

export default function ProductManagementPreview() {
  const [figuras, setFiguras] = useState<any[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    precio: "",
    imagenUrl: "",
    categorias: "",
  });

  useEffect(() => {
    cargarFiguras();
  }, []);

  const cargarFiguras = async () => {
    try {
      const data = await getFiguras();
      setFiguras(data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error al cargar las figuras",
        text: "No se pudieron obtener las figuras desde el servidor.",
        confirmButtonColor: "#00E6F6",
      });
    }
  };

  const guardarFigura = async () => {
    if (!nuevoProducto.nombre || !nuevoProducto.precio) {
      Swal.fire({
        icon: "warning",
        title: "Campos requeridos",
        text: "Debes ingresar al menos el nombre y el precio.",
        confirmButtonColor: "#00E6F6",
      });
      return;
    }

    const figuraData = {
      nombre: nuevoProducto.nombre,
      precio: parseFloat(nuevoProducto.precio),
      imagenUrl: nuevoProducto.imagenUrl || "/treddy-sublogo.png",
      categorias: nuevoProducto.categorias
        ? nuevoProducto.categorias.split(",").map((c) => c.trim())
        : [],
    };

    try {
      if (editandoId) {
        await updateFigura(editandoId, figuraData);
        Swal.fire({
          icon: "success",
          title: "Figura actualizada",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await createFigura(figuraData);
        Swal.fire({
          icon: "success",
          title: "Figura creada",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      setNuevoProducto({
        nombre: "",
        precio: "",
        imagenUrl: "",
        categorias: "",
      });
      setEditandoId(null);
      cargarFiguras();
    } catch (error) {
      console.error("Error al guardar figura:", error);
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: "No se pudo guardar la figura.",
        confirmButtonColor: "#00E6F6",
      });
    }
  };

  const eliminarFigura = async (id: number) => {
    const confirmar = await Swal.fire({
      title: "¿Eliminar figura?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmar.isConfirmed) return;

    try {
      await deleteFigura(id);
      Swal.fire({
        icon: "success",
        title: "Figura eliminada",
        timer: 1200,
        showConfirmButton: false,
      });
      cargarFiguras();
    } catch (error) {
      console.error("Error al eliminar figura:", error);
      Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text: "No se pudo eliminar la figura.",
        confirmButtonColor: "#00E6F6",
      });
    }
  };

  const editarFigura = (figura: any) => {
    setNuevoProducto({
      nombre: figura.nombre,
      precio: figura.precio_base?.toString() || figura.precio?.toString() || "",
      imagenUrl: figura.imagenUrl,
      categorias: figura.categoria || "",
    });
    setEditandoId(figura.producto_id);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A0F2C] to-[#0D1333] text-white ">
      <Nav />

      {/* Título principal */}
      <h2 className="text-center text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent py-10 tracking-wide drop-shadow-[0_0_15px_rgba(0,230,246,0.2)]">
        Gestión de Figuras
      </h2>

      <section className="px-4 md:px-8 grid grid-cols-1 lg:grid-cols-[0.7fr_1.3fr] gap-12 mt-5 transition-all duration-300">
        {/* FORMULARIO */}
        <div className="bg-[#10193F]/60 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-[#1e2d45] hover:border-cyan-400/30 transition-all duration-300">
          <h2 className="text-2xl font-semibold mb-6 text-cyan-400 border-b border-cyan-400/20 pb-2">
            {editandoId ? "Editar Figura" : "Agregar Figura"}
          </h2>

          <input
            type="text"
            placeholder="Nombre"
            value={nuevoProducto.nombre}
            onChange={(e) =>
              setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })
            }
            className="w-full mb-4 p-3 rounded-lg bg-[#0C1330] border border-[#1a2640] text-white focus:outline-none focus:border-[#00E6F6] transition"
          />
          <input
            type="number"
            placeholder="Precio"
            value={nuevoProducto.precio}
            onChange={(e) =>
              setNuevoProducto({ ...nuevoProducto, precio: e.target.value })
            }
            className="w-full mb-4 p-3 rounded-lg bg-[#0C1330] border border-[#1a2640] text-white focus:outline-none focus:border-[#00E6F6] transition"
          />
          <input
            type="text"
            placeholder="URL de imagen"
            value={nuevoProducto.imagenUrl}
            onChange={(e) =>
              setNuevoProducto({ ...nuevoProducto, imagenUrl: e.target.value })
            }
            className="w-full mb-4 p-3 rounded-lg bg-[#0C1330] border border-[#1a2640] text-white focus:outline-none focus:border-[#00E6F6] transition"
          />
          <input
            type="text"
            placeholder="Categorías (separadas por comas)"
            value={nuevoProducto.categorias}
            onChange={(e) =>
              setNuevoProducto({ ...nuevoProducto, categorias: e.target.value })
            }
            className="w-full mb-6 p-3 rounded-lg bg-[#0C1330] border border-[#1a2640] text-white focus:outline-none focus:border-[#00E6F6] transition"
          />

          <button
            onClick={guardarFigura}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 rounded-full text-black font-semibold shadow-lg hover:shadow-cyan-500/30 hover:scale-105 transition-transform duration-200"
          >
            {editandoId ? "Guardar Cambios" : "Agregar Figura"}
          </button>
        </div>

        {/* LISTADO DE FIGURAS */}
        <div className="overflow-y-auto overflow-x-visible max-h-[700px] pr-2">
          <h2 className="text-2xl font-semibold mb-6 text-center text-cyan-400 border-b border-cyan-400/20 pb-2">
            Vista previa de figuras
          </h2>

          {figuras.length === 0 ? (
            <p className="text-gray-400 text-center mt-10">
              Aún no hay figuras registradas.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 overflow-visible ml-4 mr-4">
              {figuras.map((f) => (
                <div
                  key={f.producto_id}
                  className="bg-[#0F173A]/70 backdrop-blur-md p-6 rounded-2xl text-center border border-[#1a2640] hover:border-cyan-400/40 shadow-lg hover:shadow-cyan-400/10 transition-all duration-300 hover:scale-105"
                >
                  <Image
                    src={f.imagenUrl}
                    alt={f.nombre}
                    width={160}
                    height={160}
                    className="mx-auto rounded-lg shadow-md"
                  />
                  <p className="mt-4 text-lg font-semibold">{f.nombre}</p>
                  <p className="text-cyan-400 font-bold text-lg">
                    ${Number(f.precio_base ?? f.precio ?? 0).toFixed(2)}
                  </p>

                  {f.categoria && (
                    <p className="text-gray-400 text-sm mt-1 italic">
                      {f.categoria}
                    </p>
                  )}
                  <div className="flex justify-center gap-3 mt-4">
                    <button
                      onClick={() => editarFigura(f)}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-1.5 rounded-lg text-black font-semibold hover:scale-105 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarFigura(f.producto_id)}
                      className="bg-gradient-to-r from-pink-500 to-red-500 px-4 py-1.5 rounded-lg text-black font-semibold hover:scale-105 transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
