"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import Button from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter()

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
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://treddy-backend.onrender.com";
      const response = await fetch(`${apiUrl}/api/user/recover-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        showAlert("error", "Error", data.message || "Error al solicitar recuperación");
      } else {
        showAlert("success", "Correo enviado", "Te enviamos un correo con instrucciones para restablecer tu contraseña");
        setTimeout(() => {
          router.push("auth/login");
        }, 2500);
      }
    } catch (error) {
      console.error("Error en forgot-password:", error);
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
          <span className="text-6xl mb-2">🐻</span>
          <h2 className="text-2xl font-bold text-center">Recuperar contraseña</h2>
          <p className="text-sm text-cyan-400 text-center mt-2">
            Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>


        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Ingresa tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#162435] border border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <Button
            type="submit"
            isLoading={loading}
            className="w-full"
          >
            Enviar correo
          </Button>
        </form>
      </div>
    </div>
  );
}
