"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, ShoppingCart, Edit3, Loader2 } from "lucide-react";

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
  const [loading, setLoading] = useState(false);
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
        .catch((err) => {
          console.error("Error accediendo a la cámara:", err);
          Swal.fire({
            icon: "error",
            title: "Error de cámara",
            text: "No se pudo acceder a la cámara. Verifica los permisos.",
            background: "#0F173A",
            color: "white",
            confirmButtonColor: "#00E6F6",
          });
          setMostrarAR(false);
        });
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [mostrarAR]);

  if (!figura) return null;

  const handleComprar = async () => {
    try {
      setLoading(true);
      const sessionId = ensureSessionId();
      const res = await fetch(`http://localhost:4000/api/cart/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          productoId: figura.producto_id,
          cantidad: 1,
        }),
      });

      if (!res.ok) throw new Error("No se pudo agregar al carrito");

      await Swal.fire({
        icon: "success",
        title: "¡Agregado!",
        text: `${figura.nombre} se añadió a tu carrito.`,
        timer: 1500,
        showConfirmButton: false,
        background: "#0F173A",
        color: "white",
        customClass: { popup: "rounded-2xl border border-cyan-500/30" },
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
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalizar = () => {
    Swal.fire({
      title: "Próximamente",
      text: "La personalización estará disponible muy pronto.",
      icon: "info",
      confirmButtonColor: "#00E6F6",
      background: "#0F173A",
      color: "white",
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Content - Vertical Layout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-[#0F173A]/90 border border-cyan-500/30 rounded-3xl w-full max-w-md overflow-hidden flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="absolute top-2 right-4 z-20 p-2 bg-black/20 hover:bg-red-500/80 rounded-full text-white transition-all duration-300"
          >
            <X size={20} />
          </button>

          {/* AR Toggle Button */}
          <button
            onClick={() => setMostrarAR(!mostrarAR)}
            className={`absolute top-3 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold text-xs transition-all duration-300 ${
              mostrarAR
                ? "bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30"
                : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30"
            }`}
          >
            <Camera size={16} />
            {mostrarAR ? "Cerrar Cámara" : "AR"}
          </button>

          {/* Image / AR Section */}
          <div className="relative w-full h-80 bg-gradient-to-b from-[#1a214f] to-[#0F173A] flex items-center justify-center p-6 overflow-hidden mt-14">
            {mostrarAR ? (
              <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <span className="bg-black/60 text-cyan-400 px-4 py-1 rounded-full text-xs font-medium backdrop-blur-md">
                    Modo Realidad Aumentada
                  </span>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={figura.imagenUrl || "/images/placeholder.png"}
                  alt={figura.nombre}
                  fill
                  className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                />
              </div>
            )}
          </div>

          {/* Info & Actions Section */}
          <div className="p-6 flex flex-col gap-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-1">
                {figura.nombre}
              </h2>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-cyan-400 font-bold text-xl">
                  ${figura.precio_base.toLocaleString()}
                </span>
                <span className="text-gray-500 text-sm">|</span>
                <span className={`text-sm ${figura.stock > 0 ? "text-green-400" : "text-red-400"}`}>
                  {figura.stock > 0 ? `Stock: ${figura.stock}` : "Agotado"}
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                {figura.descripcion || "Una increíble figura 3D lista para tu colección."}
              </p>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <button
                onClick={handleComprar}
                disabled={figura.stock <= 0 || loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    {figura.stock > 0 ? "Agregar al Carrito" : "Sin Stock"}
                  </>
                )}
              </button>
              
              <button
                onClick={handlePersonalizar}
                className="w-full bg-[#1a214f] text-white font-semibold py-3 rounded-xl border border-[#2a3055] hover:bg-[#232d66] hover:border-cyan-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Edit3 size={20} />
                Personalizar
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
