"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import AnimatedBackground from "@/components/ui/AnimatedBackground";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    contrasena: "",
    confirmarContrasena: "",
    aceptar: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };


  const showAlert = (type: "success" | "error" | "warning", title: string, text?: string) => {
    Swal.fire({
      icon: type,
      title,
      text,
      background: "#0F173A",
      color: "#E0EAFD",
      confirmButtonColor: type === "success" ? "#00E6F6" : "#3B82F6",
      confirmButtonText: "Aceptar",
      showConfirmButton: true,
      timer: type === "success" ? 1800 : undefined,
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


    if (!form.aceptar) {
      showAlert("warning", "Atención", "Debes aceptar los términos y condiciones.");
      return;
    }

    if (form.contrasena !== form.confirmarContrasena) {
      showAlert("error", "Error", "Las contraseñas no coinciden.");
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://treddy-backend.onrender.com";
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          apellido: form.apellido,
          telefono: form.telefono,
          email: form.email,
          contrasena: form.contrasena,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showAlert("error", "Error en el registro", data.message || "No se pudo registrar el usuario.");
        return;
      }

      Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: "Ahora puedes iniciar sesión con tu cuenta.",
        background: "#0F173A",
        color: "#E0EAFD",
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,
        customClass: {
          popup: "rounded-2xl shadow-lg border border-cyan-700",
          title: "text-cyan-400 font-semibold",
        },
      }).then(() => {
        router.push("/auth/login");
      });
    } catch (error) {
      console.error("Error en fetch:", error);
      showAlert("error", "Error de conexión", "No se pudo conectar con el servidor. Intenta más tarde.");
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden">

      <AnimatedBackground />


      <div className="relative bg-[#0F173A] text-white p-10 rounded-2xl shadow-lg w-full max-w-lg border border-cyan-700/50">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full flex justify-center items-center border border-cyan-500">
            <span className="text-5xl">🐻</span>
          </div>
          <h2 className="text-2xl font-bold mt-4">Regístrate</h2>
          <p className="text-sm text-cyan-500 mt-1">
            ¿Ya tienes una cuenta?{" "}
            <a href="login" className="underline text-cyan-400">
              Inicia Sesión
            </a>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              className="p-2 rounded bg-[#162435] border border-cyan-500 focus:outline-none"
            />
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={form.apellido}
              onChange={handleChange}
              className="p-2 rounded bg-[#162435] border border-cyan-500 focus:outline-none"
            />
          </div>


          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="telefono"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={handleChange}
              className="p-2 rounded bg-[#162435] border border-cyan-500 focus:outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Correo"
              value={form.email}
              onChange={handleChange}
              className="p-2 rounded bg-[#162435] border border-cyan-500 focus:outline-none"
            />
          </div>


          <div className="grid grid-cols-2 gap-3">
            <input
              type="password"
              name="contrasena"
              placeholder="Contraseña"
              value={form.contrasena}
              onChange={handleChange}
              className="p-2 rounded bg-[#162435] border border-cyan-500 focus:outline-none"
            />
            <input
              type="password"
              name="confirmarContrasena"
              placeholder="Confirmar Contraseña"
              value={form.confirmarContrasena}
              onChange={handleChange}
              className="p-2 rounded bg-[#162435] border border-cyan-500 focus:outline-none"
            />
          </div>


          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="aceptar"
              checked={form.aceptar}
              onChange={handleChange}
            />
            <label className="text-sm">
              Aceptar{" "}
              <span className="text-cyan-400 underline cursor-pointer">
                términos y condiciones
              </span>
            </label>
          </div>


          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-8 py-3 rounded-full hover:opacity-90 font-semibold shadow-lg transition-transform hover:scale-[1.02]"
          >
            Registrarse
          </button>
        </form>

        <hr className="my-6 border-cyan-700" />


        <div className="space-y-3">
          <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-8 py-3 rounded-full hover:opacity-90 font-semibold shadow-lg">
            <span>📧</span>
            <span>Regístrate con Gmail</span>
          </button>
          <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-8 py-3 rounded-full hover:opacity-90 font-semibold shadow-lg">
            <span>🪟</span>
            <span>Regístrate con Microsoft</span>
          </button>
        </div>
      </div>
    </div>
  );
}
