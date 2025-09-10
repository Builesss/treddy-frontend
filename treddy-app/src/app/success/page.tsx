"use client";

import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-2xl font-bold text-green-600">✅ Pago Exitoso</h1>
      <p className="mt-2">Tu pago fue aprobado correctamente.</p>
      <Link
        href="/"
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
