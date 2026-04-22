export async function registerUser(data: {
  nombre: string;
  apellido: string;
  email: string;
  contrasena: string;
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  if (!res.ok) throw new Error("Error en el registro");
  return res.json();
}

export async function loginUser(data: { email: string; contrasena: string }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Credenciales incorrectas");
  return res.json();
}
