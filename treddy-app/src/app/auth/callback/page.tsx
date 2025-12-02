"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams ? searchParams.get("token") : null;

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } else {
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    }
  }, [token, router]);

  return (
    <main className="min-h-screen bg-[#0A0F2C] flex flex-col items-center justify-center relative overflow-hidden">

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="z-10 flex flex-col items-center">
        <div className="relative mb-8">
          <div className="w-20 h-20 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse" />
          </div>
        </div>

        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
          Validando credenciales
        </h2>
        <p className="text-[#B5B8C5] text-lg animate-pulse">
          Por favor espera un momento...
        </p>
      </div>
    </main>
  );
}
