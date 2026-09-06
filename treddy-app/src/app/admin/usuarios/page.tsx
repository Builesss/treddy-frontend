"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { User, Trash2, Edit2, Shield, Ban, CheckCircle } from "lucide-react";
import Swal from "sweetalert2";

type UserType = {
  usuario_id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  tipo_usuario: string;
  estado?: string;
};

export default function AdminUsuarios() {
  const router = useRouter();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

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
      // Usar URL absoluta al backend asumiendo estándar o variable de entorno
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const response = await fetch(`${API_URL}/api/user/all`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error("Error al obtener usuarios");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (userId: number, currentStatus: string, currentRole: string) => {
    const token = localStorage.getItem("token");
    const { value: formValues } = await Swal.fire({
      title: 'Editar Usuario',
      html:
        `<select id="swal-input1" class="swal2-input bg-[#0A0F2C] text-white border-cyan-500/50">
          <option value="activo" ${currentStatus === 'activo' ? 'selected' : ''}>Activo</option>
          <option value="suspendido" ${currentStatus === 'suspendido' ? 'selected' : ''}>Suspendido</option>
        </select>
        <select id="swal-input2" class="swal2-input bg-[#0A0F2C] text-white border-cyan-500/50 mt-4">
          <option value="cliente" ${currentRole === 'cliente' ? 'selected' : ''}>Cliente</option>
          <option value="administrador" ${currentRole === 'administrador' ? 'selected' : ''}>Administrador</option>
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

  const deleteUser = async (userId: number) => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F2C] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F2C] p-6 lg:p-12 text-white">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00E6F6] to-blue-500">
            Gestión de Usuarios
          </h1>
          <button onClick={() => router.push('/gestion-productos')} className="text-sm text-cyan-400 hover:underline">
            Ir a Productos
          </button>
        </motion.div>

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
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400">
                      No hay usuarios registrados.
                    </td>
                  </tr>
                ) : (
                  users.map((user, idx) => (
                    <motion.tr 
                      key={user.usuario_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
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
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${user.tipo_usuario === 'administrador' ? 'bg-purple-900/30 text-purple-400 border-purple-500/30' : 'bg-blue-900/30 text-blue-400 border-blue-500/30'}`}>
                          {user.tipo_usuario === 'administrador' ? <Shield size={12}/> : <User size={12}/>}
                          {user.tipo_usuario}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${user.estado === 'suspendido' ? 'bg-red-900/30 text-red-400 border-red-500/30' : 'bg-green-900/30 text-green-400 border-green-500/30'}`}>
                          {user.estado === 'suspendido' ? <Ban size={12}/> : <CheckCircle size={12}/>}
                          {user.estado || 'activo'}
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
