"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { Users, Package, ShoppingCart, FileText, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const router = useRouter();
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
        setLoading(false);
      }
    } catch {
      router.push("/auth/login");
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F2C] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const modules = [
    {
      title: "Gestión de Productos",
      description: "Agrega, edita y elimina productos del catálogo.",
      icon: <Package size={32} className="text-[#00E6F6]" />,
      link: "/gestion-productos",
      color: "from-cyan-500/20 to-blue-500/10",
      border: "border-cyan-500/30",
    },
    {
      title: "Gestión de Usuarios",
      description: "Visualiza y administra todos los usuarios registrados.",
      icon: <Users size={32} className="text-purple-400" />,
      link: "/admin/usuarios",
      color: "from-purple-500/20 to-fuchsia-500/10",
      border: "border-purple-500/30",
    },
    {
      title: "Gestión de Pedidos",
      description: "Administra todos los pedidos y cambia sus estados.",
      icon: <ShoppingCart size={32} className="text-green-400" />,
      link: "/admin/pedidos",
      color: "from-green-500/20 to-emerald-500/10",
      border: "border-green-500/30",
    },
    {
      title: "Auditoría",
      description: "Revisa el historial de acciones y cambios en el sistema.",
      icon: <FileText size={32} className="text-orange-400" />,
      link: "/admin/auditoria",
      color: "from-orange-500/20 to-red-500/10",
      border: "border-orange-500/30",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0F2C] text-white p-8">
      <div className="max-w-6xl mx-auto mt-10">
        <div className="mb-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00E6F6] to-blue-500 mb-4"
          >
            Dashboard de Administración
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Bienvenido al panel de control central. Selecciona el módulo que deseas gestionar.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((mod, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Link href={mod.link}>
                <div className={`group h-full p-6 rounded-3xl border ${mod.border} bg-gradient-to-br ${mod.color} backdrop-blur-xl hover:shadow-[0_0_30px_rgba(0,230,246,0.15)] transition-all duration-300 relative overflow-hidden`}>
                  
                  {/* Decorative blob */}
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-500"></div>

                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0A0F2C]/50 border border-white/10 mb-4 group-hover:scale-110 transition-transform duration-300">
                      {mod.icon}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                      <ArrowRight className="text-white/70" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-[#00E6F6] transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-gray-400">
                    {mod.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
