/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import Nav from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getFiguras, createFigura, updateFigura, deleteFigura } from "@/services/figuras.service";

export default function ProductManagementPreview() {
  const [figuras, setFiguras] = useState<any[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    precio: "",
    categorias: "",
  });
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string>("");

  const showTreddyAlert = (
    type: "success" | "error" | "warning" | "info",
    title: string,
    text?: string,
    options: any = {}
  ) => {
    Swal.fire({
      icon: type,
      title,
      text,
      background: "#0F173A",
      color: "#E0EAFD",
      confirmButtonColor: type === "success" ? "#00E6F6" : "#3B82F6",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      showCancelButton: options.showCancelButton || false,
      timer: options.timer || (type === "success" ? 1500 : undefined),
      customClass: {
        popup: "rounded-2xl shadow-lg border border-cyan-700",
        title: "text-cyan-400 font-semibold",
      },
      ...options,
    });
  };

  useEffect(() => {
    cargarFiguras();
  }, []);

  const cargarFiguras = async () => {
    try {
      const data = await getFiguras();
      setFiguras(data);
    } catch (error) {
      console.error(error);
      showTreddyAlert("error", "Error al cargar las figuras");
    }
  };

  const subirImagen = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gcs/image`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Error al subir imagen");
    const data = await res.json();
    return data.url;
  };

  const guardarFigura = async () => {
    if (!nuevoProducto.nombre || !nuevoProducto.precio) {
      showTreddyAlert("warning", "Faltan campos", "Nombre y precio son obligatorios");
      return;
    }

    let imagenUrl = "";

    try {
      if (imagenFile) {
        imagenUrl = await subirImagen(imagenFile);
      }

      const figuraData = {
        nombre: nuevoProducto.nombre,
        precio: parseFloat(nuevoProducto.precio),
        imagenUrl,
        categorias: nuevoProducto.categorias
          ? nuevoProducto.categorias.split(",").map((c) => c.trim())
          : [],
      };

      if (editandoId) {
        await updateFigura(editandoId, figuraData);
        showTreddyAlert("success", "Figura actualizada correctamente");
      } else {
        await createFigura(figuraData);
        showTreddyAlert("success", "Figura creada correctamente");
      }

      setNuevoProducto({ nombre: "", precio: "", categorias: "" });
      setImagenFile(null);
      setImagenPreview("");
      setEditandoId(null);
      cargarFiguras();
    } catch (error) {
      console.error("Error al guardar figura:", error);
      showTreddyAlert("error", "Error al guardar la figura");
    }
  };

  const editarFigura = (f: any) => {
    setNuevoProducto({
      nombre: f.nombre,
      precio: f.precio_base?.toString() || "",
      categorias: f.categoria || "",
    });
    setImagenPreview(f.imagenUrl);
    setEditandoId(f.producto_id);
  };

  const eliminarFigura = async (id: number) => {
    const confirmar = await Swal.fire({
      title: "¿Eliminar figura?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#0F173A",
      color: "#E0EAFD",
    });
    if (!confirmar.isConfirmed) return;

    try {
      await deleteFigura(id);
      showTreddyAlert("success", "Figura eliminada correctamente");
      cargarFiguras();
    } catch {
      showTreddyAlert("error", "Error al eliminar figura");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A0F2C] to-[#0D1333] text-white">
      <Nav />

      <h2 className="text-center text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent py-10">
        Gestión de Figuras
      </h2>

      <section className="px-4 md:px-8 grid grid-cols-1 lg:grid-cols-[0.5fr_1.3fr] gap-12 mt-5 transition-all duration-300">

        <div className="bg-[#10193F]/60 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-[#1e2d45] hover:border-cyan-400/30 transition-all duration-300">
          <h2 className="text-2xl font-semibold mb-6 text-cyan-400 border-b border-cyan-400/20 pb-2">
            {editandoId ? "Editar Figura" : "Agregar Figura"}
          </h2>

          <input
            type="text"
            placeholder="Nombre"
            value={nuevoProducto.nombre}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
            className="w-full mb-4 p-3 rounded-lg bg-[#0C1330] border border-[#1a2640] text-white focus:border-[#00E6F6]"
          />

          <input
            type="number"
            placeholder="Precio"
            value={nuevoProducto.precio}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
            className="w-full mb-4 p-3 rounded-lg bg-[#0C1330] border border-[#1a2640] text-white focus:border-[#00E6F6]"
          />


          <div className="mb-4">
            <label className="block mb-2 text-cyan-400 font-semibold">Imagen del producto</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImagenFile(file);
                  setImagenPreview(URL.createObjectURL(file));
                }
              }}
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/20 file:text-cyan-400 hover:file:bg-cyan-500/30"
            />
            {imagenPreview && (
              <Image
                src={imagenPreview}
                alt="Vista previa"
                width={160}
                height={160}
                className="mt-4 mx-auto rounded-lg border border-cyan-600"
              />
            )}
          </div>

          <input
            type="text"
            placeholder="Categorías (separadas por comas)"
            value={nuevoProducto.categorias}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, categorias: e.target.value })}
            className="w-full mb-6 p-3 rounded-lg bg-[#0C1330] border border-[#1a2640] text-white focus:border-[#00E6F6]"
          />

          <button
            onClick={guardarFigura}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 rounded-full text-black font-semibold shadow-lg hover:scale-105 transition"
          >
            {editandoId ? "Guardar Cambios" : "Agregar Figura"}
          </button>
        </div>


        <div className="overflow-y-auto overflow-x-visible max-h-[700px] pr-2">
          <h2 className="text-2xl font-semibold mb-6 text-center text-cyan-400">
            Vista previa de figuras
          </h2>

          {figuras.length === 0 ? (
            <p className="text-gray-400 text-center mt-10">Aún no hay figuras registradas.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 overflow-visible ml-4 mr-4">
              {figuras.map((f) => (
                <div
                  key={f.producto_id}
                  className="bg-[#0F173A]/70 p-6 rounded-2xl text-center border border-[#1a2640] hover:border-cyan-400/40 shadow-lg transition-all duration-300 hover:scale-105"
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
                    <p className="text-gray-400 text-sm mt-1 italic">{f.categoria}</p>
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
