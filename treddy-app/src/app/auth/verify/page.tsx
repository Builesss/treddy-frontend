"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import AnimatedBackground from "@/components/ui/AnimatedBackground";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verificando tu cuenta...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token de verificación ausente o inválido.");
      return;
    }

    const verifyToken = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const response = await fetch(`${apiUrl}/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (!response.ok) {
          setStatus("error");
          setMessage(data.message || "Error al verificar la cuenta.");
          return;
        }

        setStatus("success");
        setMessage(data.message || "Cuenta verificada con éxito.");
        
        Swal.fire({
          icon: "success",
          title: "¡Cuenta verificada!",
          text: "Ahora puedes iniciar sesión.",
          background: "#0F173A",
          color: "#E0EAFD",
          confirmButtonColor: "#00E6F6",
          confirmButtonText: "Ir al Login",
          customClass: {
            popup: "rounded-2xl shadow-lg border border-cyan-700",
            title: "text-cyan-400 font-semibold",
            confirmButton: "rounded-full px-6 py-2 text-black font-semibold shadow-md",
          },
        }).then(() => {
          router.push("/auth/login");
        });

      } catch {
        setStatus("error");
        setMessage("Error de conexión al servidor.");
      }
    };

    verifyToken();
  }, [token, router]);

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden">
      <AnimatedBackground />

      {status !== "success" && (
        <div className="relative bg-[#0F173A] text-white p-10 rounded-2xl shadow-lg w-full max-w-lg border border-cyan-700/50 text-center">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full flex justify-center items-center border border-cyan-500 mb-4">
              <span className="text-5xl">
                {status === "loading" ? "⏳" : "❌"}
              </span>
            </div>
            <h2 className="text-2xl font-bold mt-4">
              {status === "loading" ? "Verificando..." : "Error de Verificación"}
            </h2>
            <p className="text-lg text-cyan-400 mt-2">
              {message}
            </p>
          </div>

          {status === "error" && (
            <button
              onClick={() => router.push("/auth/login")}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-8 py-3 rounded-full hover:opacity-90 font-semibold shadow-lg transition-transform hover:scale-[1.02] mt-4"
            >
              Ir al Login
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="relative flex justify-center items-center min-h-screen bg-[#0F173A]">
        <h2 className="text-2xl text-cyan-400">Cargando...</h2>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
