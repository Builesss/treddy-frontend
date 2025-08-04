// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getFiguras } from '../lib/api';

export default function HomePage() {
  const [figuras, setFiguras] = useState([]);

  useEffect(() => {
    getFiguras().then(setFiguras).catch(console.error);
  }, []);

  return (
    <main className="p-4 text-white">
      <h1 className="text-2xl font-bold">Catálogo de Figuras</h1>
      <ul className="grid grid-cols-2 gap-4 mt-4">
        {figuras.map((figura: any) => (
          <li key={figura.id} className="bg-gray-800 p-4 rounded">
            <h2 className="text-lg">{figura.nombre}</h2>
            <p>{figura.descripcion}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
