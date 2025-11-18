"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import AnimatedBackground from "../../../components/animatedBackground";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    contrasena: "",
    recordar: false,
  });

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
    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
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
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden">
      {/* 🎨 Fondo animado */}
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
            <input
              type="password"
              name="contrasena"
              placeholder="Ingresa tu contraseña"
              value={form.contrasena}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#162435] border border-cyan-500 focus:outline-none"
            />
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

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-8 py-3 rounded-full hover:opacity-90 font-semibold shadow-lg transition-transform hover:scale-[1.02]"
          >
            Ingresar
          </button>
        </form>

        <hr className="my-6 border-cyan-700" />

        <div className="space-y-3">
          <button
            onClick={() =>
              (window.location.href = `http://localhost:4000/api/auth/google`)
            }
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-8 py-3 rounded-full hover:opacity-90 font-semibold shadow-lg"
          >
            <span>📧</span>
            <span>Inicia Sesión con Gmail</span>
          </button>

          <button
            onClick={() =>
              (window.location.href = `http://localhost:4000/api/auth/microsoft`)
            }
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-8 py-3 rounded-full hover:opacity-90 font-semibold shadow-lg"
          >
            <span>🪟</span>
            <span>Inicia Sesión con Microsoft</span>
          </button>
        </div>
      </div>
    </div>
  );
}
