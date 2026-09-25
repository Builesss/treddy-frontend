"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import {
  User, Trash2, Edit2, Shield, Search, ChevronLeft, ChevronRight,
  Filter, Plus, X, Server, RefreshCw
} from "lucide-react";
import Swal from "sweetalert2";
import Nav from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomSelect from "@/components/ui/CustomSelect";

// ──────────────────────────────────────────────
// Tipos
// ──────────────────────────────────────────────
type SpbUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type SpbUserPage = {
  content: SpbUser[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

type LoginResponse = {
  token: string;
};

// ──────────────────────────────────────────────
// Constantes
// ──────────────────────────────────────────────
const ITEMS_PER_PAGE = 10;
const SPB_API = process.env.NEXT_PUBLIC_SPB_API_URL ?? "http://localhost:8080";

// ──────────────────────────────────────────────
// Helper de peticiones SPB (Sin JWT, público)
// ──────────────────────────────────────────────
async function fetchWithSpbAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
    ...(options.headers ?? {}),
  };

  return fetch(url, { ...options, headers });
}

// ──────────────────────────────────────────────
// Componente principal
// ──────────────────────────────────────────────
export default function AdminUsuariosSpb() {
  const router = useRouter();

  // Estado de datos
  const [users, setUsers] = useState<SpbUser[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("todos");
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed para la API

  // Modal de creación / edición
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SpbUser | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "USER" });

  // ── Auth guard (frontend treddy) ──
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/auth/login"); return; }
    try {
      const decoded = jwtDecode<{ role: string }>(token);
      if (decoded.role !== "administrador") router.push("/");
    } catch {
      router.push("/auth/login");
    }
  }, [router]);

  // ── Cargar usuarios ──
  const fetchUsers = useCallback(async (page = 0) => {
    setRefreshing(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        size: String(ITEMS_PER_PAGE),
        ...(searchTerm ? { searchName: searchTerm, searchEmail: searchTerm } : {}),
        ...(roleFilter !== "todos" ? { searchRole: roleFilter } : {}),
      });

      const res = await fetchWithSpbAuth(`${SPB_API}/api/users?${params}`);
      if (!res.ok) throw new Error("Error al cargar usuarios SPB");
      const data: SpbUserPage = await res.json();
      setUsers(data.content);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el microservicio Spring Boot. Verifica que ngrok esté activo.",
        background: "#0F173A",
        color: "#E0EAFD",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchTerm, roleFilter]);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [fetchUsers, currentPage]);

  // Reinicia paginación al cambiar filtros
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, roleFilter]);

  // ── Abrir modal para crear ──
  const openCreateModal = () => {
    setEditingUser(null);
    setForm({ name: "", email: "", password: "", role: "USER" });
    setModalOpen(true);
  };

  // ── Abrir modal para editar ──
  const openEditModal = (user: SpbUser) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, password: "", role: user.role });
    setModalOpen(true);
  };

  // ── Guardar (crear o editar) ──
  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      Swal.fire({ icon: "warning", title: "Campos requeridos", text: "Nombre y email son obligatorios.", background: "#0F173A", color: "#E0EAFD" });
      return;
    }

    const body: Record<string, string> = { name: form.name, email: form.email, role: form.role };
    if (form.password.trim()) body.password = form.password;

    try {
      let res: Response;
      if (editingUser) {
        // Editar
        res = await fetchWithSpbAuth(`${SPB_API}/api/users/${editingUser.id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
      } else {
        // Crear — password requerido
        if (!form.password.trim()) {
          Swal.fire({ icon: "warning", title: "Contraseña requerida", text: "Debes ingresar una contraseña para crear el usuario.", background: "#0F173A", color: "#E0EAFD" });
          return;
        }
        res = await fetchWithSpbAuth(`${SPB_API}/api/users`, {
          method: "POST",
          body: JSON.stringify({ ...body, password: form.password }),
        });
      }

      if (res.ok) {
        setModalOpen(false);
        Swal.fire({ icon: "success", title: editingUser ? "Usuario actualizado" : "Usuario creado", background: "#0F173A", color: "#E0EAFD", timer: 1500, showConfirmButton: false });
        fetchUsers(currentPage);
      } else {
        const data = await res.json().catch(() => ({}));
        Swal.fire({ icon: "error", title: "Error", text: data.error ?? "No se pudo guardar el usuario.", background: "#0F173A", color: "#E0EAFD" });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Error de conexión", background: "#0F173A", color: "#E0EAFD" });
    }
  };

  // ── Eliminar ──
  const handleDelete = async (user: SpbUser) => {
    const result = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: `Esta acción eliminará a "${user.name}" permanentemente.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#3B82F6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#0F173A",
      color: "#E0EAFD",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetchWithSpbAuth(`${SPB_API}/api/users/${user.id}`, { method: "DELETE" });
      if (res.ok) {
        Swal.fire({ icon: "success", title: "Eliminado", background: "#0F173A", color: "#E0EAFD", timer: 1500, showConfirmButton: false });
        fetchUsers(currentPage);
      } else {
        const data = await res.json().catch(() => ({}));
        Swal.fire({ icon: "error", title: "Error", text: data.error ?? "No se pudo eliminar.", background: "#0F173A", color: "#E0EAFD" });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Error de conexión", background: "#0F173A", color: "#E0EAFD" });
    }
  };

  // ── Opciones filtros ──
  const roleOptions = [
    { value: "todos", label: "Todos los Roles" },
    { value: "ADMIN", label: "Admin" },
    { value: "USER", label: "Usuario" },
  ];

  // ── Loading spinner ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F2C] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ──────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#0A0F2C] text-white flex flex-col">
      <Nav />

      <div className="flex-1 p-6 lg:p-12">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00E6F6] to-blue-500">
                Usuarios (SPB)
              </h1>
              <p className="text-gray-400 text-sm mt-1 flex items-center gap-1.5">
                <Server size={14} className="text-cyan-400" />
                Microservicio Spring Boot — {totalElements} registros totales
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Refrescar */}
              <button
                onClick={() => fetchUsers(currentPage)}
                disabled={refreshing}
                className="p-2.5 bg-[#0F173A] border border-[#1e293b] rounded-xl text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors disabled:opacity-50"
                title="Recargar"
              >
                <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
              </button>

              {/* Crear usuario */}
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 shadow-md transition-opacity"
              >
                <Plus size={16} />
                Nuevo usuario
              </button>
            </div>
          </motion.div>

          {/* Filtros */}
          <div className="bg-[#0F173A] border border-[#1e293b] p-4 rounded-2xl mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                onChange={(val) => setRoleFilter(val)}
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
                    <th className="p-4 font-semibold">ID</th>
                    <th className="p-4 font-semibold">Usuario</th>
                    <th className="p-4 font-semibold hidden md:table-cell">Email</th>
                    <th className="p-4 font-semibold">Rol</th>
                    <th className="p-4 font-semibold text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400">
                        No se encontraron usuarios en el microservicio.
                      </td>
                    </tr>
                  ) : (
                    users.map((user, idx) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="border-t border-[#1e293b] hover:bg-white/5 transition-colors"
                      >
                        {/* ID */}
                        <td className="p-4">
                          <span className="text-xs font-mono text-gray-500 bg-[#0A0F2C] px-2 py-1 rounded-lg">
                            #{user.id}
                          </span>
                        </td>

                        {/* Nombre */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-400 border border-cyan-500/30 shrink-0">
                              {user.role === "ADMIN" ? <Shield size={16} /> : <User size={16} />}
                            </div>
                            <span className="font-semibold">{user.name}</span>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="p-4 hidden md:table-cell text-gray-300 text-sm">
                          {user.email}
                        </td>

                        {/* Rol */}
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                              user.role === "ADMIN"
                                ? "bg-purple-900/30 text-purple-400 border-purple-500/30"
                                : "bg-blue-900/30 text-blue-400 border-blue-500/30"
                            }`}
                          >
                            {user.role === "ADMIN" ? <Shield size={11} /> : <User size={11} />}
                            {user.role}
                          </span>
                        </td>

                        {/* Acciones */}
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(user)}
                              className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                              title="Editar"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(user)}
                              className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {totalElements > 0 && (
              <div className="p-4 border-t border-[#1e293b] flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400 bg-[#0A0F2C]/40">
                <div>
                  Página{" "}
                  <span className="font-semibold text-white">{currentPage + 1}</span> de{" "}
                  <span className="font-semibold text-white">{totalPages}</span>
                  {" — "}
                  <span className="font-semibold text-white">{totalElements}</span> registros totales
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
                    disabled={currentPage === 0}
                    className="p-2 rounded-lg bg-[#0A0F2C] border border-[#1e293b] text-gray-300 hover:text-white hover:border-cyan-500 disabled:opacity-40 disabled:hover:border-[#1e293b] disabled:hover:text-gray-300 transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg font-semibold">
                    {currentPage + 1} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages - 1))}
                    disabled={currentPage >= totalPages - 1}
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

      {/* ── Modal Crear / Editar ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#0F173A] border border-[#1e293b] rounded-2xl shadow-2xl w-full max-w-md"
          >
            {/* Cabecera modal */}
            <div className="flex items-center justify-between p-6 border-b border-[#1e293b]">
              <h2 className="text-lg font-bold text-white">
                {editingUser ? "Editar usuario SPB" : "Nuevo usuario SPB"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Body modal */}
            <div className="p-6 space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wider">Nombre *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Nombre completo"
                  className="w-full bg-[#0A0F2C] border border-[#1e293b] text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500 text-sm transition-colors"
                />
              </div>

              {/* Email */}
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

              {/* Contraseña */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wider">
                  Contraseña {editingUser ? "(dejar vacío para no cambiar)" : "*"}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder={editingUser ? "••••••••" : "Nueva contraseña"}
                  className="w-full bg-[#0A0F2C] border border-[#1e293b] text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500 text-sm transition-colors"
                />
              </div>

              {/* Rol */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wider">Rol *</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="w-full bg-[#0A0F2C] border border-[#1e293b] text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500 text-sm transition-colors"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>

            {/* Footer modal */}
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
                {editingUser ? "Guardar cambios" : "Crear usuario"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}
