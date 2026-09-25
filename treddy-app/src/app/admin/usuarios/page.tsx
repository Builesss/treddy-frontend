"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { User, Trash2, Edit2, Shield, Ban, CheckCircle, Search, ChevronLeft, ChevronRight, Filter, Clock, Plus, X } from "lucide-react";
import Swal from "sweetalert2";
import Nav from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomSelect from "@/components/ui/CustomSelect";

type UserType = {
  usuario_id: number | string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  tipo_usuario: string;
  estado?: string;
  source?: string;
};

export default function AdminUsuarios() {
  const router = useRouter();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros y Búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [sourceFilter, setSourceFilter] = useState("todos");

  // Creación de usuario (Modal)
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "cliente" });

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
        fetchUsers(token);
      }
    } catch {
      router.push("/auth/login");
    }
  }, [router]);

  const fetchUsers = async (token: string) => {
    try {
      setLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const SPB_API = process.env.NEXT_PUBLIC_SPB_API_URL || "http://localhost:8080";

      // 1. Obtener usuarios de Supabase (Backend Principal)
      let supaUsers: UserType[] = [];
      try {
        const response = await fetch(`${API_URL}/api/user/all`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          const arr = Array.isArray(data) ? data : (data.users || data.data || []);
          supaUsers = arr.map((u: UserType) => ({ ...u, source: "Supabase" }));
        }
      } catch (err) {
        console.error("Error obteniendo usuarios Supabase", err);
      }

      // 2. Obtener usuarios de Spring Boot (MySQL)
      let spbUsers: UserType[] = [];
      try {
        const responseSpb = await fetch(`${SPB_API}/api/users?page=0&size=1000`, {
          headers: { "ngrok-skip-browser-warning": "true" }
        });
        if (responseSpb.ok) {
          const spbData = await responseSpb.json();
          spbUsers = spbData.content.map((u: { id: number; name: string; email: string; role: string }) => {
            const parts = (u.name || "").split(" ");
            return {
              usuario_id: `spb-${u.id}`,
              nombre: parts[0] || "",
              apellido: parts.slice(1).join(" ") || "",
              email: u.email,
              telefono: "N/A",
              tipo_usuario: u.role || "USER",
              estado: "activo",
              source: "Spring Boot (MySQL)"
            };
          });
        }
      } catch (err) {
        console.warn("No se pudo cargar usuarios de SPB", err);
      }

      // Combinar ambas listas
      setUsers([...supaUsers, ...spbUsers]);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setForm({ name: "", email: "", password: "", role: "cliente" });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      Swal.fire({ icon: "warning", title: "Campos requeridos", text: "Nombre, email y contraseña son obligatorios.", background: "#0F173A", color: "#E0EAFD" });
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const SPB_API = process.env.NEXT_PUBLIC_SPB_API_URL || "http://localhost:8080";
    const partesNombre = form.name.split(" ");
    const nombre = partesNombre[0] || "Usuario";
    const apellido = partesNombre.slice(1).join(" ") || "";

    let supaRes;
    try {
      supaRes = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre,
          apellido: apellido,
          email: form.email,
          telefono: "0000000000",
          contrasena: form.password
        }),
      });
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Fallo la conexión con Supabase.", background: "#0F173A", color: "#E0EAFD" });
      return;
    }

    if (!supaRes.ok) {
      const errData = await supaRes.json().catch(() => ({}));
      Swal.fire({ 
        icon: "error", 
        title: "Error de validación", 
        text: errData.message || errData.error || "Los datos o la contraseña no cumplen los requisitos.", 
        background: "#0F173A", 
        color: "#E0EAFD" 
      });
      return;
    }

    // Si pasó Supabase, el backend Node.js lo guarda en SPB (MySQL) con rol "USER".
    // Si queremos que sea ADMIN en SPB (y admin en supabase), Node.js ya lo guarda como cliente en Supabase.
    // Para no complicarlo mucho en este botón global, simplemente actualizaremos el rol en SPB si es 'administrador'.
    // Ojo: Esto es una simplificación. Si es administrador, Node.js lo guardó en Supabase como "cliente" de todos modos,
    // porque el endpoint /register está hardcodeado para "cliente". 
    // Para simplificar según lo pedido, cerraremos el modal y recargaremos.
    
    if (form.role === "administrador") {
      await new Promise(r => setTimeout(r, 1000));
      try {
        const listRes = await fetch(`${SPB_API}/api/users?page=0&size=1000`, { headers: { "ngrok-skip-browser-warning": "true" }});
        if (listRes.ok) {
          const data = await listRes.json();
          const createdUser = data.content.find((u: { email: string; id: number }) => u.email === form.email);
          if (createdUser) {
            await fetch(`${SPB_API}/api/users/${createdUser.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
              body: JSON.stringify({ name: form.name, email: form.email, role: "ADMIN", password: form.password })
            });
          }
        }
      } catch (e) {
        console.warn("No se pudo actualizar el rol a ADMIN en SPB", e);
      }
    }

    setModalOpen(false);
    Swal.fire({ icon: "success", title: "Usuario creado", background: "#0F173A", color: "#E0EAFD", timer: 1500, showConfirmButton: false });
    const token = localStorage.getItem("token");
    if (token) fetchUsers(token);
  };

  const changeStatus = async (userId: number | string, currentStatus: string, currentRole: string) => {
    if (typeof userId === 'string' && userId.startsWith('spb-')) {
      Swal.fire('Atención', 'Para editar usuarios de MySQL, ve a la pestaña específica de "Usuarios (SPB)".', 'info');
      return;
    }

    const token = localStorage.getItem("token");
    const { value: formValues } = await Swal.fire({
      title: 'Editar Usuario',
      html:
        `<select id="swal-input1" class="swal2-input bg-[#0A0F2C] text-white border-cyan-500/50">
          <option value="activo" ${currentStatus.toLowerCase() === 'activo' ? 'selected' : ''}>Activo</option>
          <option value="pendiente" ${currentStatus.toLowerCase() === 'pendiente' ? 'selected' : ''}>Pendiente</option>
          <option value="suspendido" ${currentStatus.toLowerCase() === 'suspendido' ? 'selected' : ''}>Suspendido</option>
        </select>
        <select id="swal-input2" class="swal2-input bg-[#0A0F2C] text-white border-cyan-500/50 mt-4">
          <option value="cliente" ${currentRole.toLowerCase() === 'cliente' ? 'selected' : ''}>Cliente</option>
          <option value="administrador" ${currentRole.toLowerCase() === 'administrador' ? 'selected' : ''}>Administrador</option>
        </select>`,
      focusConfirm: false,
      background: '#0F173A',
      color: '#E0EAFD',
      confirmButtonText: 'Guardar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return [
          (document.getElementById('swal-input1') as HTMLInputElement).value,
          (document.getElementById('swal-input2') as HTMLInputElement).value
        ]
      }
    });

    if (formValues) {
      const [nuevoEstado, nuevoRol] = formValues;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      
      try {
        const res = await fetch(`${API_URL}/api/user/${userId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ estado: nuevoEstado, tipo_usuario: nuevoRol })
        });
        
        if (res.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            background: '#0F173A',
            color: '#E0EAFD',
            timer: 1500,
            showConfirmButton: false
          });
          fetchUsers(token!);
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

  const deleteUser = async (userId: number | string) => {
    if (typeof userId === 'string' && userId.startsWith('spb-')) {
      Swal.fire('Atención', 'Para eliminar usuarios de MySQL, ve a la pestaña específica de "Usuarios (SPB)".', 'info');
      return;
    }

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer.",
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
        const res = await fetch(`${API_URL}/api/user/${userId}`, {
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
          setUsers(users.filter(u => u.usuario_id !== userId));
        } else {
          const data = await res.json();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.error || 'No se pudo eliminar el usuario',
            background: '#0F173A',
            color: '#E0EAFD'
          });
        }
      } catch {
        Swal.fire('Error', 'Problema de conexión', 'error');
      }
    }
  };

  // Filtrado de usuarios
  const filteredUsers = users.filter((u) => {
    const fullText = `${u.nombre} ${u.apellido} ${u.email} ${u.telefono || ""}`.toLowerCase();
    const matchesSearch = fullText.includes(searchTerm.toLowerCase());
    const userRole = (u.tipo_usuario || "cliente").toLowerCase();
    const matchesRole = roleFilter === "todos" || userRole === roleFilter.toLowerCase();
    const userStatus = (u.estado || "activo").toLowerCase().trim();
    const matchesStatus = statusFilter === "todos" || userStatus === statusFilter.toLowerCase();
    const matchesSource = sourceFilter === "todos" || u.source === sourceFilter;
    return matchesSearch && matchesRole && matchesStatus && matchesSource;
  });

  // Paginado
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const roleOptions = [
    { value: "todos", label: "Todos los Roles" },
    { value: "cliente", label: "Cliente" },
    { value: "administrador", label: "Administrador" },
  ];

  const statusOptions = [
    { value: "todos", label: "Todos los Estados" },
    { value: "activo", label: "Activo" },
    { value: "pendiente", label: "Pendiente" },
    { value: "suspendido", label: "Suspendido" },
  ];

  const sourceOptions = [
    { value: "todos", label: "Ambas Fuentes" },
    { value: "Supabase", label: "Solo Supabase" },
    { value: "Spring Boot (MySQL)", label: "Solo Spring Boot" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F2C] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
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
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
          >
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00E6F6] to-blue-500">
              Gestión de Usuarios
            </h1>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              <Plus size={18} />
              Nuevo usuario
            </button>
          </motion.div>

          {/* Barra de Filtros y Búsqueda */}
          <div className="bg-[#0F173A] border border-[#1e293b] p-4 rounded-2xl mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full bg-[#0A0F2C] border border-[#1e293b] text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500 text-sm transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold uppercase tracking-wider">
                <Filter size={14} className="text-cyan-400" />
                Filtros:
              </div>

              <CustomSelect
                options={roleOptions}
                value={roleFilter}
                onChange={(val) => {
                  setRoleFilter(val);
                  setCurrentPage(1);
                }}
                width="w-44"
              />

              <CustomSelect
                options={statusOptions}
                value={statusFilter}
                onChange={(val) => {
                  setStatusFilter(val);
                  setCurrentPage(1);
                }}
                width="w-44"
              />

              <CustomSelect
                options={sourceOptions}
                value={sourceFilter}
                onChange={(val) => {
                  setSourceFilter(val);
                  setCurrentPage(1);
                }}
                width="w-44"
              />
            </div>
          </div>

          {/* Tabla */}
          <div className="bg-[#0F173A] border border-[#1e293b] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1e293b]/50 text-gray-300 text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold">Usuario</th>
                    <th className="p-4 font-semibold hidden md:table-cell">Contacto</th>
                    <th className="p-4 font-semibold">Rol</th>
                    <th className="p-4 font-semibold">Estado</th>
                    <th className="p-4 font-semibold text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400">
                        No se encontraron usuarios.
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user, idx) => {
                      const st = (user.estado || "activo").toLowerCase();
                      return (
                        <motion.tr 
                          key={user.usuario_id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className="border-t border-[#1e293b] hover:bg-white/5 transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-400 border border-cyan-500/30">
                                <User size={18} />
                              </div>
                              <div>
                                <p className="font-semibold">{user.nombre} {user.apellido}</p>
                                <p className="text-xs text-gray-400">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 hidden md:table-cell text-gray-300">
                            {user.telefono || "Sin teléfono"}
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${user.tipo_usuario.toLowerCase() === 'administrador' ? 'bg-purple-900/30 text-purple-400 border-purple-500/30' : 'bg-blue-900/30 text-blue-400 border-blue-500/30'}`}>
                              {user.tipo_usuario.toLowerCase() === 'administrador' ? <Shield size={12}/> : <User size={12}/>}
                              {user.tipo_usuario}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                              st === 'suspendido'
                                ? 'bg-red-900/30 text-red-400 border-red-500/30'
                                : st === 'pendiente'
                                ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30'
                                : 'bg-green-900/30 text-green-400 border-green-500/30'
                            }`}>
                              {st === 'suspendido' ? <Ban size={12}/> : st === 'pendiente' ? <Clock size={12}/> : <CheckCircle size={12}/>}
                              <span className="capitalize">{user.estado || 'activo'}</span>
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => changeStatus(user.usuario_id, user.estado || 'activo', user.tipo_usuario)}
                                className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                                title="Editar"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => deleteUser(user.usuario_id)}
                                className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>


            {/* Controles de Paginación */}
            {filteredUsers.length > 0 && (
              <div className="p-4 border-t border-[#1e293b] flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400 bg-[#0A0F2C]/40">
                <div>
                  Mostrando <span className="font-semibold text-white">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> a <span className="font-semibold text-white">{Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}</span> de <span className="font-semibold text-white">{filteredUsers.length}</span> registros
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-[#0A0F2C] border border-[#1e293b] text-gray-300 hover:text-white hover:border-cyan-500 disabled:opacity-40 disabled:hover:border-[#1e293b] disabled:hover:text-gray-300 transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg font-semibold">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-[#0A0F2C] border border-[#1e293b] text-gray-300 hover:text-white hover:border-cyan-500 disabled:opacity-40 disabled:hover:border-[#1e293b] disabled:hover:text-gray-300 transition-colors"
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

      {/* ── Modal Crear Usuario ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#0F173A] border border-[#1e293b] rounded-2xl shadow-2xl w-full max-w-md"
          >
            <div className="flex items-center justify-between p-6 border-b border-[#1e293b]">
              <h2 className="text-lg font-bold text-white">Nuevo usuario</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wider">Nombre Completo *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Ej: Juan Perez"
                  className="w-full bg-[#0A0F2C] border border-[#1e293b] text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wider">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="correo@ejemplo.com"
                  className="w-full bg-[#0A0F2C] border border-[#1e293b] text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wider">Contraseña *</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="Nueva contraseña"
                  className="w-full bg-[#0A0F2C] border border-[#1e293b] text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wider">Rol (Aplicado en MySQL) *</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="w-full bg-[#0A0F2C] border border-[#1e293b] text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500 text-sm transition-colors"
                >
                  <option value="cliente">Cliente (USER)</option>
                  <option value="administrador">Administrador (ADMIN)</option>
                </select>
                <p className="text-[10px] text-gray-500 mt-1">* En Supabase se creará temporalmente como cliente.</p>
              </div>
            </div>

            <div className="p-6 border-t border-[#1e293b] flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-[#1e293b] rounded-xl hover:border-gray-500 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 text-black rounded-xl hover:opacity-90 transition-opacity"
              >
                Crear usuario
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}

