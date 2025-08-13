'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function DashBoard() {


return( <div className="min-h-screen bg-[#0b1020] text-white font-sans p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-cyan-400 text-center mb-8">
          ADMIN DASHBOARD
        </h1>

        <div className="flex">
          <aside className="w-1/5 bg-[#10172A] p-4 rounded-lg space-y-4">
            <div className="space-y-2 text-white">
              <div>Dashboard</div>
              <div>Ordenes</div>
              <div>Usuarios</div>
              <div>Configuracion</div>
            </div>
          </aside>

          <main className="w-4/5 pl-6">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-[#131c30] p-4 rounded-lg text-center">
                <div className="text-cyan-400">Totales</div>
                <div className="text-2xl font-semibold">0</div>
              </div>
              <div className="bg-[#131c30] p-4 rounded-lg text-center">
                <div className="text-cyan-400">Ordenes</div>
                <div className="text-2xl font-semibold">0</div>
              </div>
              <div className="bg-[#131c30] p-4 rounded-lg text-center">
                <div className="text-cyan-400">Usuarios</div>
                <div className="text-2xl font-semibold">0</div>
              </div>
              <div className="bg-[#131c30] p-4 rounded-lg text-center">
                <div className="text-cyan-400">Ganancias</div>
                <div className="text-2xl font-semibold">$0.00</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 bg-[#131c30] p-4 rounded-lg">
                <h2 className="text-cyan-400 text-lg mb-4">Lista de figuras</h2>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-cyan-400">
                      <th className="pb-2">Figura</th>
                      <th className="pb-2">Categoria</th>
                      <th className="pb-2">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    <tr className="border-b border-gray-700">
                      <td className="py-2">[img]</td>
                      <td>—</td>
                      <td className="text-cyan-400">—</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="py-2">[img]</td>
                      <td>—</td>
                      <td className="text-cyan-400">—</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="py-2">[img]</td>
                      <td>—</td>
                      <td className="text-cyan-400">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-[#131c30] p-4 rounded-lg">
                <h2 className="text-cyan-400 text-lg mb-4">Ultimas ordenes</h2>
                <div className="space-y-2 text-sm">
                  <div>
                    <div>—</div>
                    <div className="text-cyan-400">Orden #—</div>
                  </div>
                  <div>
                    <div>—</div>
                    <div className="text-cyan-400">Orden #—</div>
                  </div>
                  <div>
                    <div>—</div>
                    <div className="text-cyan-400">Orden #—</div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>)}