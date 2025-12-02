/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { getFiguras } from "@/lib/api";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import TarjetaExpandible from "../../components/TarjetaExpandible";
import Nav from "@/pages/nav";
import Footer from "@/pages/footer";
import { Search, Filter, DollarSign } from "lucide-react";

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

  const categorias = Array.from(
    new Set(figuras.map((f) => f.categoria))
  ).filter(Boolean);

  const figurasFiltradas = figuras.filter((figura) => {
    const coincideNombre = figura.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideCategoria =
      categoria === "todas" || figura.categoria === categoria;
    const coincidePrecio =
      figura.precio_base >= precioMin && figura.precio_base <= precioMax;
    return coincideNombre && coincideCategoria && coincidePrecio;
  });

  const totalPaginas = Math.ceil(figurasFiltradas.length / productosPorPagina);
  const inicio = (paginaActual - 1) * productosPorPagina;
  const figurasPagina = figurasFiltradas.slice(
    inicio,
    inicio + productosPorPagina
  );

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0F2C] text-white relative">

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <Nav />

      <h2 className="text-center text-2xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-tight py-10 -mt-5">
        Catálogo de figuras 3D
      </h2>


      <div className="max-w-6xl mx-auto mb-16 px-4">
        <div className="bg-[#0F173A]/60 backdrop-blur-xl border border-[#1a1f40] p-6 rounded-3xl shadow-2xl flex flex-col lg:flex-row gap-6 items-center justify-between">

          <div className="relative w-full lg:w-1/3 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="text-cyan-400 w-5 h-5 group-focus-within:text-[#00E6F6] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Buscar figura..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-[#0A0F2C]/50 border border-[#1a1f40] rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
            />
          </div>

          <div className="relative w-full lg:w-1/4 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Filter className="text-cyan-400 w-5 h-5 group-focus-within:text-[#00E6F6] transition-colors" />
            </div>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full pl-12 pr-10 py-4 bg-[#0A0F2C]/50 border border-[#1a1f40] rounded-2xl text-white appearance-none cursor-pointer focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
            >
              <option value="todas" className="bg-[#0F173A] text-white">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat} className="bg-[#0F173A] text-white">
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto bg-[#0A0F2C]/50 border border-[#1a1f40] rounded-2xl p-2 px-4">
            <DollarSign className="text-cyan-400 w-5 h-5" />
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={precioMin}
                onChange={(e) => setPrecioMin(Number(e.target.value))}
                className="w-20 bg-transparent text-white placeholder-gray-500 focus:outline-none text-center font-medium"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={precioMax}
                onChange={(e) => setPrecioMax(Number(e.target.value))}
                className="w-20 bg-transparent text-white placeholder-gray-500 focus:outline-none text-center font-medium"
              />
            </div>
          </div>

        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-10 md:px-20">
        {figurasPagina.length > 0 ? (
          figurasPagina.map((figura) => (
            <div
              key={figura.producto_id}
              onClick={() => setSeleccionada(figura)}
              className="cursor-pointer bg-[#0F173A] w-full p-4 border border-[#1a1f40] rounded-xl py-5 shadow-lg flex flex-col items-center text-center hover:scale-105 hover:ring-2 hover:ring-cyan-400 transition-transform duration-200"
            >
              <p className="text-[#00E6F6] font-bold mt-1">
                Disponible: {figura.stock}
              </p>
              <Image
                src={figura.imagenUrl || "/placeholder.png"}
                alt={figura.nombre}
                width={200}
                height={150}
                className="mx-auto mb-1 rounded-lg object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              />
              <h3 className="text-white font-semibold text-lg">
                {figura.nombre}
              </h3>
              <p className="text-cyan-400 font-bold text-lg">
                ${Number(figura.precio_base ?? figura.precio ?? 0).toFixed(2)}
              </p>
              <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-6 py-3 rounded-full hover:opacity-90 font-semibold shadow-lg mt-2">
                Ver mas
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400">
            No se encontraron figuras con esos filtros.
          </p>
        )}
      </div>


      {totalPaginas > 1 && (
        <div className="flex justify-center mt-10 mb-16 gap-3">
          <button
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
            className={`px-4 py-2 rounded-lg font-semibold ${paginaActual === 1
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
              className={`px-3 py-2 rounded-lg font-semibold ${paginaActual === i + 1
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
            className={`px-4 py-2 rounded-lg font-semibold ${paginaActual === totalPaginas
              ? "bg-gray-600 text-gray-300 cursor-not-allowed"
              : "bg-[#00E6F6] text-black hover:bg-[#00bcd4]"
              }`}
          >
            Siguiente
          </button>
        </div>
      )}

      {seleccionada && (
        <TarjetaExpandible
          figura={seleccionada}
          onClose={() => setSeleccionada(null)}
        />
      )}

      <Footer />
    </main>
  );
}
