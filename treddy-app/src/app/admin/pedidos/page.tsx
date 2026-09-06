"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { Trash2, Edit2, Package, Clock, CheckCircle, Truck, XCircle, Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import Swal from "sweetalert2";
import Nav from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type OrderType = {
  id: number;
  codigo?: string;
  cliente: string;
  email: string;
  fecha: string;
  total: number;
  estado: string;
};

export default function AdminPedidos() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros y Búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  // Paginación (Max 10 por página)
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    try {
      const decoded = jwtDecode<{ role: string }>(token);
      if (decoded.role !== "administrador") {
        router.push("/");
      } else {
        fetchOrders(token);
      }
    } catch {
      router.push("/auth/login");
    }
  }, [router]);

  const fetchOrders = async (token: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const response = await fetch(`${API_URL}/api/orders/all`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error("Error al obtener pedidos");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'pendiente': return <Clock size={14} className="text-yellow-400"/>;
      case 'en_producción': return <Package size={14} className="text-purple-400"/>;
      case 'enviado': return <Truck size={14} className="text-blue-400"/>;
      case 'entregado': return <CheckCircle size={14} className="text-green-400"/>;
      case 'cancelado': return <XCircle size={14} className="text-red-400"/>;
      default: return <Clock size={14} className="text-gray-400"/>;
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30';
      case 'en_producción': return 'bg-purple-900/30 text-purple-400 border-purple-500/30';
      case 'enviado': return 'bg-blue-900/30 text-blue-400 border-blue-500/30';
      case 'entregado': return 'bg-green-900/30 text-green-400 border-green-500/30';
      case 'cancelado': return 'bg-red-900/30 text-red-400 border-red-500/30';
      default: return 'bg-gray-900/30 text-gray-400 border-gray-500/30';
    }
  };

  const changeStatus = async (orderId: number, currentStatus: string) => {
    const token = localStorage.getItem("token");
    const { value: nuevoEstado } = await Swal.fire({
      title: 'Cambiar Estado',
      html:
        `<select id="estado-select" class="swal2-input bg-[#0A0F2C] text-white border-cyan-500/50">
          <option value="pendiente" ${currentStatus === 'pendiente' ? 'selected' : ''}>Pendiente</option>
          <option value="en_producción" ${currentStatus === 'en_producción' ? 'selected' : ''}>En Producción</option>
          <option value="enviado" ${currentStatus === 'enviado' ? 'selected' : ''}>Enviado</option>
          <option value="entregado" ${currentStatus === 'entregado' ? 'selected' : ''}>Entregado</option>
          <option value="cancelado" ${currentStatus === 'cancelado' ? 'selected' : ''}>Cancelado</option>
        </select>`,
      focusConfirm: false,
      background: '#0F173A',
      color: '#E0EAFD',
      confirmButtonText: 'Guardar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return (document.getElementById('estado-select') as HTMLInputElement).value;
      }
    });

    if (nuevoEstado && nuevoEstado !== currentStatus) {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      try {
        const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ estado: nuevoEstado })
        });
        
        if (res.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Estado Actualizado',
            background: '#0F173A',
            color: '#E0EAFD',
            timer: 1500,
            showConfirmButton: false
          });
          fetchOrders(token!);
        } else {
          throw new Error();
        }
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          background: '#0F173A',
          color: '#E0EAFD',
        });
      }
    }
  };

  const deleteOrder = async (orderId: number) => {
    const result = await Swal.fire({
      title: '¿Eliminar Pedido?',
      text: "Esta acción borrará el pedido de forma permanente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#3B82F6',
      confirmButtonText: 'Sí, eliminar',
      background: '#0F173A',
      color: '#E0EAFD'
    });

    if (result.isConfirmed) {
      const token = localStorage.getItem("token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      
      try {
        const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
          method: 'DELETE',
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (res.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            background: '#0F173A',
            color: '#E0EAFD',
            timer: 1500,
            showConfirmButton: false
          });
          setOrders(orders.filter(o => o.id !== orderId));
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el pedido',
            background: '#0F173A',
            color: '#E0EAFD'
          });
        }
      } catch {
        Swal.fire('Error', 'Problema de conexión', 'error');
      }
    }
  };

  // Filtrado de pedidos
  const filteredOrders = orders.filter((o) => {
    const fullText = `${o.codigo || ""} ${o.id} ${o.cliente} ${o.email}`.toLowerCase();
    const matchesSearch = fullText.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || o.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Paginado
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE) || 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F2C] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0F2C] text-white flex flex-col">
      <Nav />
      <div className="flex-1 p-6 lg:p-12">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
              Gestión de Pedidos
            </h1>
          </motion.div>

          {/* Barra de Filtros y Búsqueda */}
          <div className="bg-[#0F173A] border border-[#1e293b] p-4 rounded-2xl mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar por código, cliente o email..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full bg-[#0A0F2C] border border-[#1e293b] text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-green-500 text-sm transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold uppercase tracking-wider">
                <Filter size={14} className="text-green-400" />
                Estado:
              </div>

              <select
                value={statusFilter}
                onChange={handleStatusChange}
                className="bg-[#0A0F2C] border border-[#1e293b] text-white text-sm px-3 py-2 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
              >
                <option value="todos">Todos los Estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="en_producción">En Producción</option>
                <option value="enviado">Enviado</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          {/* Tabla */}
          <div className="bg-[#0F173A] border border-[#1e293b] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1e293b]/50 text-gray-300 text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold">Código</th>
                    <th className="p-4 font-semibold">Cliente</th>
                    <th className="p-4 font-semibold">Fecha</th>
                    <th className="p-4 font-semibold">Total</th>
                    <th className="p-4 font-semibold">Estado</th>
                    <th className="p-4 font-semibold text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400">
                        No se encontraron pedidos.
                      </td>
                    </tr>
                  ) : (
                    paginatedOrders.map((order, idx) => (
                      <motion.tr 
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="border-t border-[#1e293b] hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4 font-mono text-cyan-400 font-semibold">
                          {order.codigo || `#${order.id}`}
                        </td>
                        <td className="p-4">
                          <p className="font-semibold">{order.cliente}</p>
                          <p className="text-xs text-gray-400">{order.email}</p>
                        </td>
                        <td className="p-4 text-gray-300">{order.fecha}</td>
                        <td className="p-4 font-bold text-white">
                          ${order.total.toLocaleString("es-CO")}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.estado)}`}>
                            {getStatusIcon(order.estado)}
                            <span className="capitalize">{order.estado.replace('_', ' ')}</span>
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => changeStatus(order.id, order.estado)}
                              className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                              title="Cambiar Estado"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => deleteOrder(order.id)}
                              className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Controles de Paginación */}
            {filteredOrders.length > 0 && (
              <div className="p-4 border-t border-[#1e293b] flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400 bg-[#0A0F2C]/40">
                <div>
                  Mostrando <span className="font-semibold text-white">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> a <span className="font-semibold text-white">{Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)}</span> de <span className="font-semibold text-white">{filteredOrders.length}</span> registros
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-[#0A0F2C] border border-[#1e293b] text-gray-300 hover:text-white hover:border-green-500 disabled:opacity-40 disabled:hover:border-[#1e293b] disabled:hover:text-gray-300 transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/30 rounded-lg font-semibold">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-[#0A0F2C] border border-[#1e293b] text-gray-300 hover:text-white hover:border-green-500 disabled:opacity-40 disabled:hover:border-[#1e293b] disabled:hover:text-gray-300 transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

