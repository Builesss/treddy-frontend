/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Nav from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingCart, CreditCard, Loader2 } from "lucide-react";

function ensureSessionId() {
  let sid = localStorage.getItem("sessionId");
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem("sessionId", sid);
  }
  return sid;
}

const BACK_BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
function resolveImageUrl(prod: any): string {
  const raw = prod?.imagenUrl ?? prod?.imagen ?? "";
  if (!raw) return "/placeholder.png";

  if (
    raw.startsWith("http://") ||
    raw.startsWith("https://") ||
    raw.startsWith("/")
  ) {
    return raw;
  }

  return `${BACK_BASE}/images/${raw}`;
}

type FiguraCarrito = {
  producto_id: number;
  nombre: string;
  imagenUrl: string;
  precio_base: number;
  cantidad: number;
};

export default function Carrito() {
  const [figuras, setFiguras] = useState<FiguraCarrito[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const router = useRouter();

  const total = figuras.reduce(
    (suma: number, f: FiguraCarrito) =>
      suma + Number(f.precio_base) * Number(f.cantidad),
    0
  );

  const cargarCarrito = async () => {
    try {
      setLoading(true);
      const sessionId = ensureSessionId();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://treddy-backend.onrender.com";
      const res = await fetch(
        `${apiUrl}/api/cart?sessionId=${sessionId}`,
        {
          cache: "no-store",
        }
      );

      if (!res.ok) throw new Error("No se pudo obtener el carrito");
      const data = await res.json();

      const mapped: FiguraCarrito[] = (data?.carrito_item || []).map(
        (it: any) => ({
          producto_id: Number(it.producto_id),
          nombre: it.productos?.nombre ?? "Producto",
          imagenUrl: resolveImageUrl(it.productos),
          precio_base: Number(it.precio_unitario),
          cantidad: Number(it.cantidad ?? 1),
        })
      );

      setFiguras(mapped);
    } catch (e) {
      console.error("Error cargando carrito:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCarrito();
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  const eliminarFigura = async (producto_id: number) => {
    try {
      setProcessingId(producto_id);
      const sessionId = ensureSessionId();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://treddy-backend.onrender.com";
      const res = await fetch(
        `${apiUrl}/api/cart/items/${producto_id}?sessionId=${sessionId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("No se pudo eliminar el producto");
      setFiguras((prev) => prev.filter((f) => f.producto_id !== producto_id));
    } catch (e) {
      console.error("Error eliminando producto:", e);
    } finally {
      setProcessingId(null);
    }
  };

  const actualizarCantidad = async (
    producto_id: number,
    nuevaCantidad: number
  ) => {
    if (nuevaCantidad < 1) return;
    try {
      setProcessingId(producto_id);
      const sessionId = ensureSessionId();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://treddy-backend.onrender.com";
      const res = await fetch(
        `${apiUrl}/api/cart/items/${producto_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            cantidad: Number(nuevaCantidad),
          }),
        }
      );
      if (!res.ok) throw new Error("No se pudo actualizar la cantidad");
      setFiguras((prev) =>
        prev.map((f) =>
          f.producto_id === producto_id
            ? { ...f, cantidad: Number(nuevaCantidad) }
            : f
        )
      );
    } catch (e) {
      console.error("Error actualizando cantidad:", e);
    } finally {
      setProcessingId(null);
    }
  };

  const procederAlPago = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        title: "Inicia sesión",
        text: "Debes iniciar sesión para realizar una compra",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#00E6F6",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Iniciar sesión",
        cancelButtonText: "Cancelar",
        background: "#0F173A",
        color: "white",
        customClass: { popup: "rounded-popup" },
      }).then((result) => {
        if (result.isConfirmed) router.push("auth/login");
      });
      return;
    }

    // Decode JWT to check verification status
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.estado === "Pendiente") {
        Swal.fire({
          title: "Verifica tu correo",
          html: "Debes verificar tu correo electrónico antes de realizar una compra.<br><br>Revisa tu bandeja de entrada (y spam) para encontrar el enlace de verificación.",
          icon: "warning",
          confirmButtonColor: "#00E6F6",
          confirmButtonText: "Entendido",
          background: "#0F173A",
          color: "white",
          customClass: {
            popup: "rounded-2xl border border-cyan-500/30",
            title: "text-cyan-400 font-semibold",
          },
        });
        return;
      }
    } catch {
      // If token can't be decoded, continue with the purchase attempt
    }

    try {
      Swal.fire({
        title: "Procesando...",
        text: "Creando preferencia de pago",
        allowOutsideClick: false,
        background: "#0F173A",
        color: "white",
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Decodificar el token para obtener el userId
      let userId = null;
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId = payload.id || payload.userId || payload.sub;
      } catch (e) {
        console.error("Error al decodificar el token para userId:", e);
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://treddy-backend.onrender.com";
      const res = await fetch(
        `${apiUrl}/api/payment/create_preference`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: figuras.map((f) => ({
              id: f.producto_id,
              title: f.nombre,
              quantity: Number(f.cantidad),
              currency_id: "COP",
              unit_price: Number(f.precio_base),
            })),
            userId: userId, // Enviar el userId al backend
            sessionId: ensureSessionId(), // Enviar el sessionId al backend
          }),
        }
      );

      if (!res.ok) throw new Error("Error al crear la preferencia de pago");
      const data = await res.json();

      Swal.close();

      const mp = new (window as any).MercadoPago(
        process.env.NEXT_PUBLIC_MP_PUBLIC_KEY,
        { locale: "es-CO" }
      );
      mp.checkout({ preference: { id: data.id }, autoOpen: true });
    } catch (error) {
      console.error("Error en checkout:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al procesar el pago. Intenta nuevamente.",
        icon: "error",
        confirmButtonColor: "#00E6F6",
        background: "#0F173A",
        color: "white",
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0F2C] text-white overflow-hidden relative">

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>
      <Nav />
      <div className="flex-grow flex flex-col items-center justify-start px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-5xl"
        >
          <h2 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-[#00E6F6] to-cyan-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
            <ShoppingCart className="text-[#00E6F6]" size={32} />
            Tu Carrito
          </h2>

          <div className="bg-[#0F173A]/60 backdrop-blur-xl rounded-3xl border border-[#1a1f40] p-6 md:p-10">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="animate-spin text-[#00E6F6]" size={48} />
                <p className="text-gray-400">Cargando tu carrito...</p>
              </div>
            ) : figuras.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-[#1a214f] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart size={40} className="text-gray-500" />
                </div>
                <p className="text-xl text-[#B5B8C5] mb-6">Tu carrito está vacío.</p>
                <button
                  onClick={() => router.push("/catalogo")}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-8 py-3 rounded-full font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              <>

                <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-[#1a1f40] text-gray-400 font-medium text-sm uppercase tracking-wider mb-4">
                  <div className="col-span-6">Producto</div>
                  <div className="col-span-2 text-center">Precio</div>
                  <div className="col-span-2 text-center">Cantidad</div>
                  <div className="col-span-2 text-center">Total</div>
                </div>

                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {figuras.map((figura) => (
                      <motion.div
                        key={figura.producto_id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="group bg-[#131b40] hover:bg-[#1a214f] p-4 rounded-2xl border border-[#1a1f40] hover:border-cyan-500/30 transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative overflow-hidden"
                      >

                        <button
                          onClick={() => eliminarFigura(figura.producto_id)}
                          disabled={processingId === figura.producto_id}
                          className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors"
                        >
                          {processingId === figura.producto_id ? (
                            <Loader2 className="animate-spin" size={20} />
                          ) : (
                            <Trash2 size={20} />
                          )}
                        </button>


                        <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                          <div className="relative w-24 h-24 bg-[#0A0F2C] rounded-xl p-2 flex-shrink-0">
                            <Image
                              src={figura.imagenUrl}
                              alt={figura.nombre}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-white mb-1">
                              {figura.nombre}
                            </h3>
                            <p className="text-sm text-gray-400 md:hidden">
                              ${figura.precio_base.toLocaleString()}
                            </p>
                          </div>
                        </div>


                        <div className="hidden md:block col-span-2 text-center font-medium text-gray-300">
                          ${figura.precio_base.toLocaleString()}
                        </div>


                        <div className="col-span-1 md:col-span-2 flex justify-center">
                          <div className="flex items-center bg-[#0A0F2C] rounded-full p-1 border border-[#2a3055]">
                            <button
                              onClick={() =>
                                actualizarCantidad(
                                  figura.producto_id,
                                  Number(figura.cantidad) - 1
                                )
                              }
                              disabled={processingId === figura.producto_id}
                              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1a214f] text-cyan-400 transition-colors disabled:opacity-50"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-8 text-center font-bold text-white">
                              {processingId === figura.producto_id ? (
                                <Loader2 className="animate-spin mx-auto" size={14} />
                              ) : (
                                figura.cantidad
                              )}
                            </span>
                            <button
                              onClick={() =>
                                actualizarCantidad(
                                  figura.producto_id,
                                  Number(figura.cantidad) + 1
                                )
                              }
                              disabled={processingId === figura.producto_id}
                              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1a214f] text-cyan-400 transition-colors disabled:opacity-50"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>


                        <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-center gap-4">
                          <span className="font-bold text-[#00E6F6] text-lg">
                            $
                            {(
                              Number(figura.precio_base) * Number(figura.cantidad || 1)
                            ).toLocaleString()}
                          </span>


                          <button
                            onClick={() => eliminarFigura(figura.producto_id)}
                            disabled={processingId === figura.producto_id}
                            className="hidden md:flex p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                            title="Eliminar producto"
                          >
                            {processingId === figura.producto_id ? (
                              <Loader2 className="animate-spin" size={20} />
                            ) : (
                              <Trash2 size={20} />
                            )}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>


                <div className="mt-8 pt-8 border-t border-[#1a1f40] flex flex-col md:flex-row justify-end items-center gap-6">
                  <div className="text-right">
                    <p className="text-gray-400 mb-1">Total a pagar</p>
                    <p className="text-4xl font-extrabold text-white">
                      ${total.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={procederAlPago}
                    className="w-full md:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-10 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <CreditCard size={24} />
                    Proceder al Pago
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}
