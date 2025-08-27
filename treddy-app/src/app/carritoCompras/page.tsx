"use client";
import { useState } from "react";
import { getFiguras } from '../../lib/api';
import Nav from "../../pages/nav";
import Footer from "../../pages/footer";

export default function Carrito() {
  const [figuras, setFiguras] = useState<any[]>([
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <main className="min-h-screen bg-[#0A0F2C] text-white flex flex-col">
      {/* NAVBAR */}
      <Nav />

      
      <div className="flex-grow flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Tu carrito</h2>

        <div className="bg-[#0F173A] w-full max-w-md rounded-2xl shadow-lg p-8">
          {figuras.length === 0 ? (
            
            <p className="text-center text-[#B5B8C5]">
              Tu carrito está vacío.
            </p>
          ) : (
            <>
              
              <div className="space-y-4">
                {figuras.map((p, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-[#1a214f] p-3 rounded-lg"
                  >
                    <p>{p.nombre}</p>
                    <span>${p.precio}</span>
                  </div>
                ))}
              </div>

              
              <div className="mt-6 flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>
                  ${figuras .reduce((acc, p) => acc + p.precio, 0)}
                </span>
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
