export async function getFiguras() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/figuras`);
  if (!res.ok) throw new Error('Error al obtener las figuras');
  return res.json();
}

