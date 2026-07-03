"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    contrasena: "",
    recordar: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

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
      timer: type === "success" ? 1600 : undefined,
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
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://treddy-backend.onrender.com";
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          contrasena: form.contrasena,
          recordar: form.recordar,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showAlert(
          "error",
          "Error al iniciar sesión",
          data.message || "Credenciales incorrectas o usuario no encontrado."
        );
        return;
      }

      localStorage.setItem("token", data.token);

      Swal.fire({
        icon: "success",
        title: "¡Inicio de sesión exitoso!",
        background: "#0F173A",
        color: "#E0EAFD",
        showConfirmButton: false,
        timer: 1600,
        timerProgressBar: true,
        customClass: {
          popup: "rounded-2xl shadow-lg border border-cyan-700",
          title: "text-cyan-400 font-semibold",
        },
      }).then(() => {
        router.push("/");
      });
    } catch (error) {
      console.error("Error en login:", error);
      showAlert(
        "error",
        "Error en la conexión",
        "No se pudo conectar con el servidor. Intenta nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden">

      <AnimatedBackground />

      <div className="relative bg-[#0F173A] text-white p-10 rounded-2xl shadow-lg w-full max-w-lg border border-cyan-700/50">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full flex justify-center items-center border border-cyan-500">
            <span className="text-5xl">👨🏻</span>
          </div>
          <h2 className="text-2xl font-bold mt-4">Inicia Sesión</h2>
          <p className="text-sm text-cyan-500 mt-1">
            ¿Es tu primera vez?{" "}
            <a href="register" className="underline text-cyan-400">
              Regístrate
            </a>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-cyan-400 mb-1">Correo</label>
            <input
              type="email"
              name="email"
              placeholder="Ingresa tu correo"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#162435] border border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-cyan-400 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="contrasena"
                placeholder="Ingresa tu contraseña"
                value={form.contrasena}
                onChange={handleChange}
                className="w-full p-2 pr-10 rounded bg-[#162435] border border-cyan-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-cyan-400 hover:text-cyan-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <a
              href="../recover-password"
              className="text-cyan-500 hover:underline"
            >
              ¿Se te olvidó la contraseña?
            </a>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="recordar"
                checked={form.recordar}
                onChange={handleChange}
              />
              <label>Recordar mi sesión</label>
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
          >
            Ingresar
          </Button>
        </form>

        <hr className="my-6 border-cyan-700" />

        <div className="space-y-3">
          <Button
            onClick={() => {
              const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://treddy-backend.onrender.com";
              window.location.href = `${apiUrl}/api/auth/google`;
            }}
            className="w-full"
            icon={<span>📧</span>}
          >
            Inicia Sesión con Gmail
          </Button>

          <Button
            onClick={() => {
              const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://treddy-backend.onrender.com";
              window.location.href = `${apiUrl}/api/auth/microsoft`;
            }}
            className="w-full"
            icon={<span>🪟</span>}
          >
            Inicia Sesión con Microsoft
          </Button>
        </div>
      </div>
    </div>
  );
}
