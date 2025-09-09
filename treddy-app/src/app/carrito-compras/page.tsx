/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { getFiguras } from "../../lib/api";
import Image from "next/image";
import Nav from "@/pages/nav";
import Footer from "@/pages/footer";


export default function Carrito() {
  const [figuras, setFiguras] = useState([]);
  const total = figuras.reduce(
    (suma: number, figura: any) => suma + Number(figura.precio_base),
    0
  );
  useEffect(() => {
    getFiguras().then(setFiguras).catch(console.error);
  }, []);

  return (
    <main className="min-h-screen bg-[#0A0F2C] text-white flex flex-col">
      {/* NAVBAR */}
      <Nav />

      <div className="flex-grow flex flex-col items-center justify-center px-4 mt-10">
        <h2 className="text-2xl font-bold mb-6 text-center">Tu carrito</h2>

        <div className="bg-[#0F173A] w-full max-w-md rounded-2xl shadow-lg p-8 py-10 mb-10">
          {figuras.length === 0 ? (
            <p className="text-center text-[#B5B8C5]">Tu carrito está vacío.</p>
          ) : (
            <>
              <div className="space-y-4">
                {figuras.map((figura: any) => (
                  <div
                    key={figura.producto_id}
                    className="flex justify-between items-center bg-[#1a214f] p-3 rounded-lg"
                  >
                    <Image
                      src={figura.imagenUrl}
                      alt={figura.nombre}
                      width={70}
                      height={70}
                    ></Image>
                    <p>{figura.nombre}</p>
                    <span>${figura.precio_base}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${total}</span>
              </div>

              <button className="mt-6 w-full bg-[#00E6F6] text-black py-2 rounded-full font-medium hover:bg-[#00c8d4]">
                Proceder al pago
              </button>
            </>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </main>
  );
}
