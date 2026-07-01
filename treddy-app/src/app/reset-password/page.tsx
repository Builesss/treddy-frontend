"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import AnimatedBackground from "@/components/ui/AnimatedBackground";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams?.get("token");

  const showAlert = (
    type: "success" | "error",
    title: string,
    text?: string
  ) => {
    Swal.fire({
      icon: type,
      title,
      text,
      background: "#0F173A",
      color: "#E0EAFD",
      confirmButtonColor: type === "success" ? "#00E6F6" : "#3B82F6",
      confirmButtonText: "Aceptar",
      showConfirmButton: type === "error",
      timer: type === "success" ? 2500 : undefined,
      timerProgressBar: type === "success",
      customClass: {
        popup: "rounded-2xl shadow-lg border border-cyan-700",
        title: "text-cyan-400 font-semibold",
        confirmButton: "rounded-full px-6 py-2 font-semibold shadow-md",
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      showAlert("error", "Token inválido", "El token ha expirado o no es válido");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://treddy-backend.onrender.com";
      const response = await fetch(`${apiUrl}/api/user/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showAlert("error", "Error", data.message || "Error al restablecer la contraseña");
      } else {
        showAlert("success", "Contraseña actualizada", "Tu contraseña ha sido actualizada con éxito. Ahora puedes iniciar sesión.");
        setTimeout(() => {
          router.push("auth/login");
        }, 2500);
      }
    } catch (error) {
      console.error("Error en reset-password:", error);
      showAlert("error", "Error de conexión", "No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen">
      <AnimatedBackground />

      <div className="bg-[#0F173A] text-white p-8 rounded-2xl shadow-lg w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-6">
          <span className="text-6xl mb-2">🔑</span>
          <h2 className="text-2xl font-bold text-center">Restablecer contraseña</h2>
          <p className="text-sm text-cyan-400 text-center mt-2">
            Ingresa tu nueva contraseña y confírmala.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pr-12 rounded-lg bg-[#162435] border border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-cyan-400 hover:text-cyan-300"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-8 py-3 rounded-full hover:opacity-90 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Actualizando..." : "Actualizar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}
