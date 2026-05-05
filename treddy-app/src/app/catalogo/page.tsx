/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { getFiguras } from "@/services/figuras.service";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import TarjetaExpandible from "@/components/ui/TarjetaExpandible";
import Nav from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Search, Filter, DollarSign, ArrowRight, Tag } from "lucide-react";

export default function Catalogo() {
  const [figuras, setFiguras] = useState<any[]>([]);
  const [seleccionada, setSeleccionada] = useState<any | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const initialSearch = searchParams?.get("search") || "";
  const initialCategory = searchParams?.get("category") || "todas";

  const [busqueda, setBusqueda] = useState<string>(initialSearch);
  const [categoria, setCategoria] = useState<string>(initialCategory);
  const [precioMin, setPrecioMin] = useState<number>(0);
  const [precioMax, setPrecioMax] = useState<number>(1000000);
  const [paginaActual, setPaginaActual] = useState<number>(1);

  const productosPorPagina = 6;

  useEffect(() => {
    getFiguras().then(setFiguras).catch(console.error);
  }, []);

  useEffect(() => {
    const valorBusqueda = searchParams?.get("search");
    const valorCategoria = searchParams?.get("category");

    if (valorBusqueda) {
      setBusqueda(valorBusqueda);
    }
    if (valorCategoria) {
      setCategoria(valorCategoria);
    }

    if (valorBusqueda || valorCategoria) {
      // Opcional: limpiar la URL si se desea, pero para sincronización es mejor dejarla
      // router.replace("/catalogo", { scroll: false });
    }
  }, [searchParams]);

  const handleCategoriaChange = (nuevaCategoria: string) => {
    setCategoria(nuevaCategoria);
    setPaginaActual(1);
    
    // Actualizar URL
    const params = new URLSearchParams(searchParams?.toString());
    if (nuevaCategoria === "todas") {
      params.delete("category");
    } else {
      params.set("category", nuevaCategoria);
    }
    router.replace(`/catalogo?${params.toString()}`, { scroll: false });
  };

  const categorias = Array.from(
    new Set(figuras.map((f) => f.categoria)),
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
    inicio + productosPorPagina,
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header & Breadcrumbs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <Breadcrumbs 
            items={[
              { label: "Catálogo", href: "/catalogo", active: categoria === "todas" },
              ...(categoria !== "todas" ? [{ label: categoria.charAt(0).toUpperCase() + categoria.slice(1), active: true }] : [])
            ]} 
          />
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Descubre nuestras <span className="text-cyan-400">Figuras 3D</span>
          </h1>
        </div>

        {/* Integrated Filter Panel */}
        <div className="bg-[#0F173A]/60 backdrop-blur-xl border border-[#1a1f40] p-6 rounded-3xl shadow-2xl mb-12">
          {/* Category Tabs */}
          <div className="flex space-x-3 overflow-x-auto pb-6 scrollbar-hide border-b border-white/5 mb-6">
            <button
              onClick={() => handleCategoriaChange("todas")}
              className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 border whitespace-nowrap ${
                categoria === "todas"
                  ? "bg-cyan-500 text-black border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  : "bg-[#0A0F2C]/50 text-gray-400 border-[#1a1f40] hover:border-cyan-500/30 hover:text-cyan-300"
              }`}
            >
              Todas las figuras
            </button>
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoriaChange(cat)}
                className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 border whitespace-nowrap ${
                  categoria === cat
                    ? "bg-cyan-500 text-black border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    : "bg-[#0A0F2C]/50 text-gray-400 border-[#1a1f40] hover:border-cyan-500/30 hover:text-cyan-300"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Search & Price Row */}
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative w-full lg:flex-1 group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="text-cyan-400 w-5 h-5 group-focus-within:text-[#00E6F6] transition-colors" />
              </div>
              <input
                type="text"
                placeholder="¿Qué figura buscas hoy?..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-[#0A0F2C]/40 border border-[#1a1f40] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
              />
            </div>

            <div className="flex items-center gap-6 w-full lg:w-auto">
              <div className="flex items-center gap-3 bg-[#0A0F2C]/40 border border-[#1a1f40] rounded-2xl p-2 px-4 flex-1 lg:flex-none">
                <DollarSign className="text-cyan-400 w-5 h-5" />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={precioMin}
                    onChange={(e) => setPrecioMin(Number(e.target.value))}
                    className="w-20 bg-transparent text-white placeholder-gray-600 focus:outline-none text-center font-medium"
                  />
                  <span className="text-gray-700">|</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={precioMax}
                    onChange={(e) => setPrecioMax(Number(e.target.value))}
                    className="w-20 bg-transparent text-white placeholder-gray-600 focus:outline-none text-center font-medium"
                  />
                </div>
              </div>
              
              <div className="hidden lg:flex items-center text-gray-500 text-sm gap-2">
                <Filter size={16} />
                <span>{figurasFiltradas.length} resultados</span>
              </div>
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
              className="group relative cursor-pointer bg-[#10193F]/40 backdrop-blur-md w-full p-5 border border-white/10 rounded-2xl shadow-lg flex flex-col items-center text-center hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all duration-300 h-full"
            >
              {/* Decorative Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full w-full">
                <div className="absolute top-0 right-0 z-20">
                  <span className="bg-cyan-500/10 text-cyan-400 text-xs font-bold px-2 py-1 rounded-full border border-cyan-500/20">
                    Stock: {figura.stock}
                  </span>
                </div>

                <div className="relative flex-grow mb-4 w-full flex items-center justify-center overflow-visible mt-6">
                  <Image
                    src={figura.imagenUrl || "/placeholder.png"}
                    alt={figura.nombre}
                    width={200}
                    height={150}
                    className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-transform duration-500 ease-in-out group-hover:scale-110 group-hover:rotate-1"
                  />
                </div>

                <div className="mt-auto w-full">
                  <p className="uppercase tracking-widest text-[10px] text-cyan-200/60 font-semibold mb-1">
                    Modelo 3D
                  </p>
                  <h3 className="font-bold text-white uppercase tracking-wider text-xl group-hover:text-cyan-300 transition-colors">
                    {figura.nombre}
                  </h3>
                  <div className="my-3 h-[1px] w-1/2 mx-auto bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent"></div>
                  <p className="font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-tight mb-4 text-2xl">
                    $
                    {Number(figura.precio_base ?? figura.precio ?? 0).toFixed(
                      2,
                    )}
                  </p>
                  <div className="flex justify-center">
                    <button className="group/btn relative overflow-hidden bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 text-cyan-400 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 px-6 py-2">
                      Ver más
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
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
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              paginaActual === 1
                ? "bg-gray-800/50 text-gray-500 border border-gray-700/50 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 text-cyan-400 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600"
            }`}
          >
            Anterior
          </button>

          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => cambiarPagina(i + 1)}
              className={`px-3 py-2 rounded-lg font-semibold transition-all duration-300 ${
                paginaActual === i + 1
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)] border border-cyan-400"
                  : "bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 text-cyan-400 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              paginaActual === totalPaginas
                ? "bg-gray-800/50 text-gray-500 border border-gray-700/50 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 text-cyan-400 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600"
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
