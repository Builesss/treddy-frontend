"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";

type Figura = {
  producto_id: number;
  nombre: string;
  imagenUrl: string;
  precio_base: number;
  descripcion: string;
  stock: number;
};

function ensureSessionId() {
  let sid = localStorage.getItem("sessionId");
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem("sessionId", sid);
  }
  return sid;
}

export default function TarjetaExpandible({
  figura,
  onClose,
}: {
  figura: Figura;
  onClose: () => void;
}) {
  const [mostrarAR, setMostrarAR] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (mostrarAR && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error("Error accediendo a la cámara:", err));
    } else {
      // si se apaga el AR, corta la cámara
      stopCamera();
    }
    // limpia al desmontar
    return () => stopCamera();
  }, [mostrarAR]);

  if (!figura) return null;

  const handleComprar = async () => {
    try {
      const sessionId = ensureSessionId();
      const res = await fetch(`http://localhost:4000/api/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-id": sessionId,
        },
        body: JSON.stringify({
          productoId: figura.producto_id,
          cantidad: 1,
        }),
      });

      if (!res.ok) throw new Error("No se pudo agregar al carrito");

      // ✅ Toast de agregado y cierre de tarjeta
      await Swal.fire({
        icon: "success",
        title: "Agregado al carrito",
        text: `${figura.nombre} se añadió correctamente.`,
        timer: 1200,
        showConfirmButton: false,
        background: "#0F173A",
        color: "white",
      });

      stopCamera();
      onClose();
    } catch (e) {
      console.error("Error al agregar al carrito:", e);
      Swal.fire({
        icon: "error",
        title: "Ups...",
        text: "No pudimos agregar el producto. Intenta de nuevo.",
        confirmButtonColor: "#00E6F6",
        background: "#0F173A",
        color: "white",
      });
    }
  };

  const handlePersonalizar = () => {
    // aquí tu lógica de personalización
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-[#0F173A] p-6 rounded-xl max-w-md w-full text-center relative text-white">
        <button
          onClick={() => setMostrarAR((v) => !v)}
          className="absolute top-3 left-3 bg-gray-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-gradient-to-r from-cyan-500 to-blue-500 hover:text-black transition"
        >
          AR
        </button>
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="absolute top-3 right-3 text-white py-2 px-4 rounded-lg hover:text-[#00E6F6]"
        >
          X
        </button>

        <p className="text-[#00E6F6] font-bold mt-1">
          Disponible: {figura.stock}
        </p>

        <Image
          src={figura.imagenUrl || "/images/placeholder.png"}
          alt={figura.nombre}
          width={350}
          height={400}
          className="mx-auto mb-4 rounded-lg"
        />

        <h2 className="text-2xl font-bold mb-2">{figura.nombre}</h2>
        <p className="text-[#00E6F6] font-bold mb-2">${figura.precio_base}</p>
        <p className="text-gray-300 mb-4">{figura.descripcion}</p>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleComprar}
            disabled={figura.stock <= 0}
            className="bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white hover:bg-gradient-to-r from-cyan-500 to-blue-500 hover:text-black px-8 py-3 rounded-full hover:opacity-90 font-semibold shadow-lg"
          >
            {figura.stock > 0 ? "Comprar" : "Sin stock"}
          </button>
          <button
            onClick={handlePersonalizar}
            className="bg-gray-600 text-white font-semibold py-2 rounded-full hover:bg-gradient-to-r from-cyan-500 to-blue-500 hover:text-black transition"
          >
            Personalizar
          </button>
        </div>
      </div>

      {mostrarAR && (
        <div className="w-1/2 bg-black rounded-xl flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      )}
    </div>
  );
}
