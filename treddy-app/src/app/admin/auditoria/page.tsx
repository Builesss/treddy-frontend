"use client";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import Nav from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Auditoria {
  auditoria_id: string;
  usuario_id: string;
  tabla_afectada: string;
  registro_id: string;
  accion: string;
  fecha: string;
  usuarios?: {
    nombre: string;
    apellido: string;
    email: string;
  };
}

export default function AuditoriaPage() {
  const [auditorias, setAuditorias] = useState<Auditoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Búsqueda, Filtros y Paginación
  const [searchTerm, setSearchTerm] = useState("");
  const [accionFilter, setAccionFilter] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchAuditorias = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No estás autenticado");
          setLoading(false);
          return;
        }
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await fetch(`${apiUrl}/api/auditoria`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) {
          if (res.status === 403) {
            setError("Acceso denegado. Se requiere rol de administrador.");
          } else {
            setError("Error al cargar las auditorías");
          }
          throw new Error("Failed to fetch");
        }
        const data = await res.json();
        setAuditorias(data);
      } catch (err: unknown) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuditorias();
  }, []);

  const descargarPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Auditoría de Sistemas", 14, 15);
    
    const tableColumn = ["ID", "Usuario", "Email", "Tabla", "Acción", "Fecha"];
    const tableRows: (string | number)[][] = [];
    filteredAuditorias.forEach(audit => {
      const auditData = [
        audit.auditoria_id,
        audit.usuarios ? `${audit.usuarios.nombre} ${audit.usuarios.apellido}` : audit.usuario_id,
        audit.usuarios?.email || "N/A",
        audit.tabla_afectada,
        audit.accion,
        new Date(audit.fecha).toLocaleString()
      ];
      tableRows.push(auditData);
    });
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("auditoria_sistemas.pdf");
  };

  // Filtrado
  const filteredAuditorias = auditorias.filter((audit) => {
    const userName = audit.usuarios ? `${audit.usuarios.nombre} ${audit.usuarios.apellido}` : audit.usuario_id;
    const fullText = `${audit.auditoria_id} ${userName} ${audit.usuarios?.email || ""} ${audit.tabla_afectada} ${audit.accion}`.toLowerCase();
    const matchesSearch = fullText.includes(searchTerm.toLowerCase());
    
    let matchesAccion = true;
    if (accionFilter !== "todos") {
      matchesAccion = audit.accion.toUpperCase().includes(accionFilter.toUpperCase());
    }
    
    return matchesSearch && matchesAccion;
  });

  // Paginación
  const totalPages = Math.ceil(filteredAuditorias.length / ITEMS_PER_PAGE) || 1;
  const paginatedAuditorias = filteredAuditorias.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleAccionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAccionFilter(e.target.value);
    setCurrentPage(1);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0A0F2C] text-white flex flex-col">
      <Nav />
      <div className="flex-grow flex items-center justify-center p-8 relative z-10">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#00E6F6] font-semibold text-lg">Cargando auditorías...</p>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0A0F2C] text-white flex flex-col">
      <Nav />
      <div className="flex-grow flex items-center justify-center p-8 relative z-10">
        <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-xl backdrop-blur-md text-center max-w-md">
          <p className="text-red-400 font-bold text-lg mb-2">Error de Acceso</p>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0F2C] text-white flex flex-col relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>
      
      <Nav />
      <main className="flex-grow relative z-10 p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00E6F6] to-blue-500">
            Auditoría de Sistemas
          </h1>
          <button
            onClick={descargarPDF}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold py-2.5 px-6 rounded-full shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Descargar PDF
          </button>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div className="bg-[#1a1f40]/60 border border-cyan-500/20 p-4 rounded-2xl mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg backdrop-blur-md">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar en auditoría (usuario, tabla, acción...)"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full bg-[#0A0F2C] border border-cyan-500/20 text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500 text-sm transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold uppercase tracking-wider">
              <Filter size={14} className="text-cyan-400" />
              Acción:
            </div>

            <select
              value={accionFilter}
              onChange={handleAccionChange}
              className="bg-[#0A0F2C] border border-cyan-500/20 text-white text-sm px-3 py-2 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="todos">Todas las Acciones</option>
              <option value="INSERT">Crear (INSERT)</option>
              <option value="UPDATE">Actualizar (UPDATE)</option>
              <option value="DELETE">Eliminar (DELETE)</option>
            </select>
          </div>
        </div>

        <div className="bg-[#1a1f40]/60 backdrop-blur-md shadow-xl rounded-2xl border border-cyan-500/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-6 py-4 border-b border-cyan-500/20 bg-[#0A0F2C]/80 text-left text-xs font-bold text-[#00E6F6] uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 border-b border-cyan-500/20 bg-[#0A0F2C]/80 text-left text-xs font-bold text-[#00E6F6] uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-4 border-b border-cyan-500/20 bg-[#0A0F2C]/80 text-left text-xs font-bold text-[#00E6F6] uppercase tracking-wider">
                    Tabla Afectada
                  </th>
                  <th className="px-6 py-4 border-b border-cyan-500/20 bg-[#0A0F2C]/80 text-left text-xs font-bold text-[#00E6F6] uppercase tracking-wider">
                    Acción
                  </th>
                  <th className="px-6 py-4 border-b border-cyan-500/20 bg-[#0A0F2C]/80 text-left text-xs font-bold text-[#00E6F6] uppercase tracking-wider">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-500/10">
                {paginatedAuditorias.map((audit) => (
                  <tr key={audit.auditoria_id} className="hover:bg-cyan-500/5 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="font-mono text-xs bg-[#0A0F2C] px-2 py-1 rounded text-cyan-400 border border-cyan-500/20">
                        {audit.auditoria_id.substring(0, 8)}...
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="text-white font-medium">
                        {audit.usuarios ? `${audit.usuarios.nombre} ${audit.usuarios.apellido}` : audit.usuario_id}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">{audit.usuarios?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {audit.tabla_afectada}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${audit.accion.toUpperCase().includes('DELETE') ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        audit.accion.toUpperCase().includes('UPDATE') ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                        audit.accion.toUpperCase().includes('INSERT') || audit.accion.toUpperCase().includes('CREATE') ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                        {audit.accion}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(audit.fecha).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {paginatedAuditorias.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 bg-[#0A0F2C]/30">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-12 h-12 mb-4 text-[#00E6F6]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-lg">No se encontraron registros de auditoría.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Controles de Paginación */}
          {filteredAuditorias.length > 0 && (
            <div className="p-4 border-t border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400 bg-[#0A0F2C]/60">
              <div>
                Mostrando <span className="font-semibold text-white">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> a <span className="font-semibold text-white">{Math.min(currentPage * ITEMS_PER_PAGE, filteredAuditorias.length)}</span> de <span className="font-semibold text-white">{filteredAuditorias.length}</span> registros
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-[#0A0F2C] border border-cyan-500/20 text-gray-300 hover:text-white hover:border-cyan-500 disabled:opacity-40 disabled:hover:border-cyan-500/20 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg font-semibold">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-[#0A0F2C] border border-cyan-500/20 text-gray-300 hover:text-white hover:border-cyan-500 disabled:opacity-40 disabled:hover:border-cyan-500/20 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}