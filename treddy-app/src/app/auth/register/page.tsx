"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import Button from "@/components/ui/Button";

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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    // Clear error for this field when user modifies it
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
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

  const validateForm = () => {
    const fieldErrors: Record<string, string> = {};
    if (!form.nombre) fieldErrors.nombre = 'Campo Incompleto';
    if (!form.apellido) fieldErrors.apellido = 'Campo Incompleto';
    if (!form.telefono) fieldErrors.telefono = 'Campo Incompleto';
    if (!form.email) fieldErrors.email = 'Campo Incompleto';
    if (!form.contrasena) {
      fieldErrors.contrasena = 'Campo Incompleto';
    } else {
      const pwd = form.contrasena;
      const hasUpper = /[A-Z]/.test(pwd);
      const hasLower = /[a-z]/.test(pwd);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
      if (pwd.length < 8) {
        fieldErrors.contrasena = 'La contraseña debe tener al menos 8 caracteres';
      } else if (!hasUpper || !hasLower || !hasSpecial) {
        fieldErrors.contrasena = 'La contraseña debe incluir mayúscula, minúscula y carácter especial';
      }
    }
    if (!form.confirmarContrasena) fieldErrors.confirmarContrasena = 'Campo Incompleto';
    else if (form.contrasena && form.confirmarContrasena && form.contrasena !== form.confirmarContrasena) {
      fieldErrors.confirmarContrasena = 'Las contraseñas no coinciden';
    }
    return fieldErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    // Validate required fields
    const fieldErrors = validateForm();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      const messages = Object.entries(fieldErrors)
        .map(([field, msg]) => `${field.charAt(0).toUpperCase() + field.slice(1)}: ${msg}`)
        .join('\n');
      showAlert('error', 'Campos incompletos', messages);
      setIsLoading(false);
      return;
    }

    setErrors({}); if (!form.aceptar) {
      showAlert("warning", "Atención", "Debes aceptar los términos y condiciones.");
      setIsLoading(false);
      return;
    }

    if (form.contrasena !== form.confirmarContrasena) {
      // Set specific errors for password fields
      setErrors({ contrasena: 'Las contraseñas no coinciden', confirmarContrasena: 'Las contraseñas no coinciden' });
      showAlert("error", "Error", "Las contraseñas no coinciden.");
      setIsLoading(false);
      return;
    }

    setErrors({});
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
            <div>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={handleChange}
                className={`w-full p-2 rounded bg-[#162435] border ${errors.nombre ? "border-red-500" : "border-cyan-500"} focus:outline-none`}
              />
              {errors.nombre && <p className="text-sm text-red-500 mt-1">{errors.nombre}</p>}
            </div>
            <div>
              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={form.apellido}
                onChange={handleChange}
                className={`w-full p-2 rounded bg-[#162435] border ${errors.apellido ? "border-red-500" : "border-cyan-500"} focus:outline-none`}
              />
              {errors.apellido && <p className="text-sm text-red-500 mt-1">{errors.apellido}</p>}
            </div>
          </div>


          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                value={form.telefono}
                onChange={handleChange}
                className={`w-full p-2 rounded bg-[#162435] border ${errors.telefono ? "border-red-500" : "border-cyan-500"} focus:outline-none`}
              />
              {errors.telefono && <p className="text-sm text-red-500 mt-1">{errors.telefono}</p>}
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Correo"
                value={form.email}
                onChange={handleChange}
                className={`w-full p-2 rounded bg-[#162435] border ${errors.email ? "border-red-500" : "border-cyan-500"} focus:outline-none`}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>
          </div>


          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="contrasena"
                placeholder="Contraseña"
                value={form.contrasena}
                onChange={handleChange}
                className={`w-full p-2 pr-10 rounded bg-[#162435] border ${errors.contrasena ? "border-red-500" : "border-cyan-500"} focus:outline-none`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-cyan-400 hover:text-cyan-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.contrasena && <p className="text-sm text-red-500 mt-1">{errors.contrasena}</p>}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmarContrasena"
                placeholder="Confirmar Contraseña"
                value={form.confirmarContrasena}
                onChange={handleChange}
                className={`w-full p-2 pr-10 rounded bg-[#162435] border ${errors.confirmarContrasena ? "border-red-500" : "border-cyan-500"} focus:outline-none`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-cyan-400 hover:text-cyan-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.confirmarContrasena && <p className="text-sm text-red-500 mt-1">{errors.confirmarContrasena}</p>}
            </div>
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


          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
          >
            Registrarse
          </Button>
        </form>

        <hr className="my-6 border-cyan-700" />


        <div className="space-y-3">
          <Button
            className="w-full"
            icon={<span>📧</span>}
          >
            Regístrate con Gmail
          </Button>
          <Button
            className="w-full"
            icon={<span>🪟</span>}
          >
            Regístrate con Microsoft
          </Button>
        </div>
      </div>
    </div>
  );
}
