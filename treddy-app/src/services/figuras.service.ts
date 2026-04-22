export async function getFiguras() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/figuras`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
  if (!res.ok) throw new Error("Error al obtener las figuras");
  return res.json();
}

export async function getFiguraById(id: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/figuras/${id}`,
  );
  if (!res.ok) throw new Error("Error al obtener la figura");
  return res.json();
}

export async function createFigura(data: {
  nombre: string;
  precio: number;
  imagenUrl?: string;
  categorias?: string[];
}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/figuras`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al crear la figura");
  }
  return res.json();
}

export async function updateFigura(
  id: number,
  data: {
    nombre?: string;
    precio?: number;
    imagenUrl?: string;
    categorias?: string[];
  },
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/figuras/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al actualizar la figura");
  }
  return res.json();
}

export async function deleteFigura(id: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/figuras/${id}`,
    {
      method: "DELETE",
    },
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al eliminar la figura");
  }
  return res.json();
}
