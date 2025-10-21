/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { getFiguras } from "@/lib/api";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import TarjetaExpandible from "../../components/TarjetaExpandible";
import Nav from "@/pages/nav";
import Footer from "@/pages/footer";

export default function Catalogo() {
  const [figuras, setFiguras] = useState<any[]>([]);
  const [seleccionada, setSeleccionada] = useState<any | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const initialSearch = searchParams?.get("search") || "";
  const [busqueda, setBusqueda] = useState<string>(initialSearch);
  const [categoria, setCategoria] = useState<string>("todas");
  const [precioMin, setPrecioMin] = useState<number>(0);
  const [precioMax, setPrecioMax] = useState<number>(1000000);
  const [paginaActual, setPaginaActual] = useState<number>(1);

  const productosPorPagina = 6;

  useEffect(() => {
    getFiguras().then(setFiguras).catch(console.error);
  }, []);

  useEffect(() => {
    const valor = searchParams?.get("search");
    if (valor) {
      setBusqueda(valor);

      router.replace("/catalogo", { scroll: false });
    }
  }, [searchParams, router]);

  const categorias = Array.from(new Set(figuras.map((f) => f.categoria))).filter(Boolean);

  const figurasFiltradas = figuras.filter((figura) => {
    const coincideNombre = figura.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoria === "todas" || figura.categoria === categoria;
    const coincidePrecio =
      figura.precio_base >= precioMin && figura.precio_base <= precioMax;
    return coincideNombre && coincideCategoria && coincidePrecio;
  });

  const totalPaginas = Math.ceil(figurasFiltradas.length / productosPorPagina);
  const inicio = (paginaActual - 1) * productosPorPagina;
  const figurasPagina = figurasFiltradas.slice(inicio, inicio + productosPorPagina);

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0F2C] text-white">
      <Nav />

      <h2 className="text-center text-2xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-tight py-10 -mt-5">
        Catálogo de figuras 3D
      </h2>

      {/* Barra de filtros */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10 px-5">
        {/* Buscar */}
        <input
          type="text"
          placeholder="Buscar figura..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full md:w-1/3 px-5 py-3 rounded-full text-white border border-cyan-400 shadow-md"
        />

        {/* Categoría */}
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full md:w-1/5 px-4 py-3 rounded-full text-black outline-none shadow-md bg-[#0F173A] text-white border border-[#00E6F6] appearance-none"
        >
          <option value="todas">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        {/* Rango de precios */}
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Mín"
            value={precioMin}
            onChange={(e) => setPrecioMin(Number(e.target.value))}
            className="w-24 px-3 py-2 rounded-md text-white border border-cyan-400 shadow-md"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Máx"
            value={precioMax}
            onChange={(e) => setPrecioMax(Number(e.target.value))}
            className="w-24 px-3 py-2 rounded-md text-white border border-cyan-400 shadow-md"
          />
        </div>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-10 md:px-20">
        {figurasPagina.length > 0 ? (
          figurasPagina.map((figura) => (
            <div
              key={figura.producto_id}
              onClick={() => setSeleccionada(figura)}
              className="cursor-pointer bg-[#0F173A] w-full p-4 rounded-xl py-5 shadow-lg flex flex-col items-center text-center hover:scale-105 hover:ring-2 hover:ring-cyan-400 transition-transform duration-200"
            >
              <p className="text-[#00E6F6] font-bold mt-1">
                Disponible: {figura.stock}
              </p>
              <Image
                src={figura.imagenUrl || "/placeholder.png"}
                alt={figura.nombre}
                width={200}
                height={150}
                className="mx-auto mb-1 rounded-lg"
              />
              <h3 className="text-white font-semibold text-lg">{figura.nombre}</h3>
              <p className="text-[#00E6F6] font-bold mt-2">${figura.precio_base}</p>
              <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-6 py-3 rounded-full hover:opacity-90 font-semibold shadow-lg mt-2">
                Carrito de compras
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400">
            No se encontraron figuras con esos filtros.
          </p>
        )}
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex justify-center mt-10 mb-16 gap-3">
          <button
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
            className={`px-4 py-2 rounded-lg font-semibold ${
              paginaActual === 1
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-[#00E6F6] text-black hover:bg-[#00bcd4]"
            }`}
          >
            Anterior
          </button>

          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => cambiarPagina(i + 1)}
              className={`px-3 py-2 rounded-lg font-semibold ${
                paginaActual === i + 1
                  ? "bg-[#00E6F6] text-black"
                  : "bg-[#1a1f40] text-white hover:bg-[#00E6F6] hover:text-black"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className={`px-4 py-2 rounded-lg font-semibold ${
              paginaActual === totalPaginas
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-[#00E6F6] text-black hover:bg-[#00bcd4]"
            }`}
          >
            Siguiente
          </button>
        </div>
      )}

      {seleccionada && (
        <TarjetaExpandible figura={seleccionada} onClose={() => setSeleccionada(null)} />
      )}

      <Footer />
    </main>
  );
}
