// ─── Figuras / Productos ────────────────────────────────────────────────────

export interface Figura {
  producto_id: number;
  nombre: string;
  precio_base: number;
  imagenUrl: string;
  modeloUrl?: string;
  categorias?: string[];
  categoria?: string;
  stock?: number;
}

// ─── Carrito ─────────────────────────────────────────────────────────────────

export interface FiguraCarrito {
  producto_id: number;
  nombre: string;
  imagenUrl: string;
  precio_base: number;
  cantidad: number;
}

// ─── Usuario ─────────────────────────────────────────────────────────────────

export interface Usuario {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rol: string;
  fechaRegistro: string;
}

// ─── Pedidos ─────────────────────────────────────────────────────────────────

export interface Pedido {
  id: number;
  fecha: string;
  estado: string;
  total: number;
}
