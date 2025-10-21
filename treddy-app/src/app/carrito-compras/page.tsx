/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { getFiguras } from "../../lib/api";
import Image from "next/image";
import Nav from "../../pages/nav";
import Footer from "../../pages/footer";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function Carrito() {
  const [figuras, setFiguras] = useState<any[]>([]);
  const router = useRouter();

  const total = figuras.reduce(
    (suma: number, figura: any) =>
      suma + Number(figura.precio_base) * Number(figura.cantidad),
    0
  );

  useEffect(() => {
    getFiguras()
      .then(setFiguras)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const eliminarFigura = (producto_id: number) => {
    setFiguras((prev) => prev.filter((figura) => figura.producto_id !== producto_id));
  };

  const actualizarCantidad = (producto_id: number, nuevaCantidad: number) => {
    if (nuevaCantidad < 1) return;
    setFiguras((prev) =>
      prev.map((figura) =>
        figura.producto_id === producto_id
          ? { ...figura, cantidad: String(nuevaCantidad) }
          : figura
      )
    );
  };

  const procederAlPago = async () => {
    const token = localStorage.getItem('token');

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
        customClass: {
          popup: 'rounded-popup'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/login');
        }
      });
      return;
    }

    try {
      Swal.fire({
        title: 'Procesando...',
        text: 'Creando preferencia de pago',
        allowOutsideClick: false,
        background: "#0F173A",
        color: "white",
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const res = await fetch(
        `https://2f0f3a58c2e0.ngrok-free.app/api/payment/create_preference`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: figuras.map((figura: any) => ({
              id: figura.producto_id,
              title: figura.nombre,
              quantity: Number(figura.cantidad),
              currency_id: "COP",
              unit_price: Number(figura.precio_base),
            })),
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Error al crear la preferencia de pago");
      }

      const data = await res.json();
      console.log("Preferencia creada:", data);

      Swal.close();

      const mp = new (window as any).MercadoPago(
        process.env.NEXT_PUBLIC_MP_PUBLIC_KEY,
        { locale: "es-CO" }
      );

      console.log("Abriendo checkout con preference ID:", data.id);
      mp.checkout({
        preference: { id: data.id },
        autoOpen: true,
      });

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
                {/* Encabezados */}
                <div className="grid grid-cols-6 gap-4 p-3 rounded-lg font-semibold text-[#B5B8C5] text-center">
                  <h1>Imagen</h1>
                  <h2>Nombre</h2>
                  <h2>Precio base</h2>
                  <h2>Cantidad</h2>
                  <h2>Subtotal</h2>
                  <h2>Acciones</h2>
                </div>

                {/* Filas del carrito */}
                {figuras.map((figura: any) => (
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

                    {/* Contador funcional */}
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
                      ${Number(figura.precio_base) * Number(figura.cantidad || 1)}
                    </span>

                    {/* Botón eliminar */}
                    <button
                      onClick={() => eliminarFigura(figura.producto_id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>

              {/* Total */}
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