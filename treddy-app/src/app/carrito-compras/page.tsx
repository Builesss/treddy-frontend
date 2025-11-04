/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Nav from "../../pages/nav";
import Footer from "../../pages/footer";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

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
  const router = useRouter();

  const total = figuras.reduce(
    (suma: number, f: FiguraCarrito) =>
      suma + Number(f.precio_base) * Number(f.cantidad),
    0
  );

  const cargarCarrito = async () => {
    try {
      const sessionId = ensureSessionId();
      const res = await fetch(
        `http://localhost:4000/api/cart?sessionId=${sessionId}`,
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
      const sessionId = ensureSessionId();
      const res = await fetch(
        `http://localhost:4000/api/cart/items/${producto_id}?sessionId=${sessionId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("No se pudo eliminar el producto");
      setFiguras((prev) => prev.filter((f) => f.producto_id !== producto_id));
    } catch (e) {
      console.error("Error eliminando producto:", e);
    }
  };

  const actualizarCantidad = async (
    producto_id: number,
    nuevaCantidad: number
  ) => {
    if (nuevaCantidad < 1) return;
    try {
      const sessionId = ensureSessionId();
      const res = await fetch(
        `http://localhost:4000/api/cart/items/${producto_id}`,
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

      const res = await fetch(
        `https://2f0f3a58c2e0.ngrok-free.app/api/payment/create_preference`,
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
    <main className="min-h-screen bg-[#0A0F2C] text-white flex flex-col">
      <Nav />
      <div className="flex-grow flex flex-col items-center justify-center px-4 mt-10">
        <h2 className="text-2xl font-bold mb-6 text-center">Tu carrito</h2>

        <div className="bg-[#0F173A] w-full max-w-4xl rounded-2xl shadow-lg p-8 py-10 mb-10">
          {figuras.length === 0 ? (
            <p className="text-center text-[#B5B8C5]">Tu carrito está vacío.</p>
          ) : (
            <>
              <div className="space-y-4">
                <div className="grid grid-cols-6 gap-4 p-3 rounded-lg font-semibold text-[#B5B8C5] text-center">
                  <h1>Imagen</h1>
                  <h2>Nombre</h2>
                  <h2>Precio base</h2>
                  <h2>Cantidad</h2>
                  <h2>Subtotal</h2>
                  <h2>Acciones</h2>
                </div>

                {figuras.map((figura) => (
                  <div
                    key={figura.producto_id}
                    className="grid grid-cols-6 gap-4 items-center bg-[#1a214f] p-3 rounded-lg text-center"
                  >
                    <Image
                      src={figura.imagenUrl}
                      alt={figura.nombre}
                      width={250}
                      height={250}
                      className="mx-auto"
                    />
                    <p>{figura.nombre}</p>
                    <p>${figura.precio_base}</p>

                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() =>
                          actualizarCantidad(
                            figura.producto_id,
                            Number(figura.cantidad) - 1
                          )
                        }
                        className="bg-[#0F173A] text-white px-2 py-1 rounded-lg hover:bg-[#2b356d]"
                      >
                        -
                      </button>
                      <span>{figura.cantidad}</span>
                      <button
                        onClick={() =>
                          actualizarCantidad(
                            figura.producto_id,
                            Number(figura.cantidad) + 1
                          )
                        }
                        className="bg-[#00E6F6] text-black px-2 py-1 rounded-lg hover:bg-[#00c8d4]"
                      >
                        +
                      </button>
                    </div>

                    <span>
                      $
                      {Number(figura.precio_base) *
                        Number(figura.cantidad || 1)}
                    </span>

                    <button
                      onClick={() => eliminarFigura(figura.producto_id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${total}</span>
              </div>

              <button
                onClick={procederAlPago}
                className="mt-6 w-full bg-[#00E6F6] text-black py-2 rounded-full font-medium hover:bg-[#00c8d4]"
              >
                Proceder al pago
              </button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
