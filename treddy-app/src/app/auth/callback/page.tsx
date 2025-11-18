"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams ? searchParams.get("token") : null;

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);

      Swal.fire({
        icon: "success",
        title: "¡Inicio de sesión exitoso!",
        background: "#0F173A",
        color: "#E0EAFD",
        showConfirmButton: false,
        timer: 1600,
      }).then(() => {
        router.push("/");
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error en el inicio de sesión",
        text: "No se pudo obtener el token. Intenta nuevamente.",
        background: "#0F173A",
        color: "#E0EAFD",
      }).then(() => router.push("/login"));
    }
  }, [token, router]);

  return (
    <div className="flex items-center justify-center min-h-screen text-cyan-400">
      <p>Validando tu sesión, por favor espera...</p>
    </div>
  );
}
