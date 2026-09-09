export async function getFiguras() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/figuras`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Error al obtener las figuras");
  return res.json();
}

export async function getFigurasAdmin() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/figuras/admin/all`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Error al obtener las figuras (admin)");
  return res.json();
}

export async function getFiguraById(id: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/figuras/${id}`,
  );
  if (!res.ok) throw new Error("Error al obtener la figura");
  return res.json();
}

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function createFigura(data: {
  nombre: string;
  precio: number;
  imagenUrl?: string;
  modelo3dUrl?: string;
  vistaArUrl?: string;
  categorias?: string[];
}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/figuras`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
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
    modelo3dUrl?: string;
    vistaArUrl?: string;
    categorias?: string[];
  },
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/figuras/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
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
      headers: { ...getAuthHeaders() },
    },
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al eliminar la figura");
  }
  return res.json();
}

export async function toggleFiguraEstado(id: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/figuras/${id}/toggle-estado`,
    {
      method: "PATCH",
      headers: { ...getAuthHeaders() },
    },
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al cambiar el estado");
  }
  return res.json();
}
