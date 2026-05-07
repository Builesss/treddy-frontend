export async function getUserProfile() {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!res.ok) throw new Error("Error al obtener el perfil");
  return res.json();
}

export async function updateUserProfile(data: {
  nombre?: string;
  apellido?: string;
  telefono?: string;
}) {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  );
  if (!res.ok) throw new Error("Error al actualizar el perfil");
  return res.json();
}

export async function getUserOrders() {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/user/orders`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!res.ok) throw new Error("Error al obtener los pedidos");
  return res.json();
}

export async function cancelOrder(orderId: number, motivo: string) {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/cancel`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ motivo }),
    },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al cancelar el pedido");
  return data;
}
