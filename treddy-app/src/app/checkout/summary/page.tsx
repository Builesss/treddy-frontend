"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Nav from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Loader2, CreditCard, MapPin, Package, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

function ensureSessionId() {
  let sid = localStorage.getItem("sessionId");
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem("sessionId", sid);
  }
  return sid;
}

const BACK_BASE = (process.env.NEXT_PUBLIC_API_URL || "https://treddy-backend.onrender.com").replace(/\/$/, "");
function resolveImageUrl(prod: { imagenUrl?: string; imagen?: string }): string {
  const raw = prod?.imagenUrl ?? prod?.imagen ?? "";
  if (!raw) return "/placeholder.png";
  if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("/")) {
    return raw;
  }
  return `${BACK_BASE}/images/${raw}`;
}

interface CartItem {
  id: number;
  title: string;
  imagenUrl: string;
  unit_price: number;
  quantity: number;
}

interface Direccion {
  id: string;
  alias?: string;
  calle: string;
  numero: string;
  ciudad: string;
  departamento: string;
}

export default function CheckoutSummary() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [figuras, setFiguras] = useState<CartItem[]>([]);
  const [direccion, setDireccion] = useState<Direccion | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  // Totales
  const [subtotal, setSubtotal] = useState(0);
  const impuestoRate = 0.19; // 19% IVA simulado
  const costoEnvio = 10000;

  useEffect(() => {
    // Cargar SDK de MercadoPago
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id || payload.userId || payload.sub);
    } catch {
      router.push("/auth/login");
      return;
    }

    const dirData = localStorage.getItem("selectedAddressData");
    if (!dirData) {
      router.push("/checkout/address");
      return;
    }
    setDireccion(JSON.parse(dirData));

    cargarCarrito();
  }, [router]);

  const cargarCarrito = async () => {
    try {
      const sessionId = ensureSessionId();
      const res = await fetch(`${BACK_BASE}/api/cart?sessionId=${sessionId}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Error cargando carrito");
      const data = await res.json();
      
      const mapped = (data?.carrito_item || []).map((it: { 
        producto_id: number | string; 
        productos: { nombre?: string; imagenUrl?: string; imagen?: string }; 
        precio_unitario: number | string; 
        cantidad: number | string 
      }) => ({
        id: Number(it.producto_id),
        title: it.productos?.nombre ?? "Producto",
        imagenUrl: resolveImageUrl(it.productos),
        unit_price: Number(it.precio_unitario),
        quantity: Number(it.cantidad ?? 1),
      }));

      setFiguras(mapped);

      const sub = mapped.reduce((sum: number, f: CartItem) => sum + f.unit_price * f.quantity, 0);
      setSubtotal(sub);
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === "TREDDYMAKER10") {
      const discountVal = subtotal * 0.15;
      setDiscount(discountVal);
      setIsCouponApplied(true);
      Swal.fire({
        icon: "success",
        title: "¡Cupón aplicado!",
        text: "Has recibido un 15% de descuento en tu compra.",
        background: "#0F173A",
        color: "white",
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Cupón inválido",
        text: "El código ingresado no existe o ha expirado.",
        background: "#0F173A",
        color: "white"
      });
    }
  };

  const enmascararDireccion = (dir: string | undefined) => {
    if (!dir) return "";
    if (dir.length <= 6) return dir;
    return dir.substring(0, 4) + "****" + dir.substring(dir.length - 2);
  };

  const confirmarYPagar = async () => {
    try {
      setPaying(true);
      Swal.fire({
        title: "Generando Orden...",
        text: "Por favor espera mientras preparamos tu pedido",
        allowOutsideClick: false,
        background: "#0F173A", color: "white",
        didOpen: () => Swal.showLoading()
      });

      const res = await fetch(`${BACK_BASE}/api/checkout/temporal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: figuras,
          userId,
          sessionId: ensureSessionId(),
          direccionId: direccion?.id,
          discount: discount
        })
      });

      if (!res.ok) throw new Error("Error creando orden temporal");
      const data = await res.json();

      Swal.close();

      // Abrir MercadoPago
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mp = new (window as any).MercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY, { locale: "es-CO" });
      mp.checkout({ preference: { id: data.preferenceId }, autoOpen: true });

    } catch (error) {
      console.error("Error al pagar:", error);
      Swal.fire({
        icon: "error", title: "Error", text: "Hubo un problema al procesar la orden.",
        background: "#0F173A", color: "white"
      });
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0A0F2C] text-white flex flex-col">
        <Nav />
        <div className="flex-grow flex items-center justify-center"><Loader2 className="animate-spin text-cyan-500" size={48} /></div>
        <Footer />
      </main>
    );
  }

  const subtotalConDescuento = subtotal - discount;
  const impuestos = subtotalConDescuento * impuestoRate;
  const totalPagar = subtotalConDescuento + impuestos + costoEnvio;

  return (
    <main className="min-h-screen bg-[#0A0F2C] text-white">
      <Nav />
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex justify-center items-center gap-3">
          <ShieldCheck size={36} className="text-cyan-500" /> Resumen de tu Pedido
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Detalles del Pedido */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0F173A] rounded-3xl p-6 border border-[#1a1f40]">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-[#1a1f40] pb-3">
                <Package className="text-cyan-400" /> Productos
              </h3>
              <div className="space-y-4">
                {figuras.map(f => (
                  <div key={f.id} className="flex items-center gap-4 bg-[#131b40] p-4 rounded-xl border border-[#2a3055]">
                    <div className="relative w-16 h-16 bg-[#0A0F2C] rounded-lg p-1">
                      <Image src={f.imagenUrl} alt={f.title} fill className="object-contain" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold">{f.title}</h4>
                      <p className="text-sm text-gray-400">Cant: {f.quantity}</p>
                    </div>
                    <div className="font-bold text-cyan-400">
                      ${(f.unit_price * f.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0F173A] rounded-3xl p-6 border border-[#1a1f40] flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                  <MapPin className="text-cyan-400" size={20} /> Dirección de Envío
                </h3>
                <p className="text-gray-400 text-sm">
                  {direccion?.alias ? `${direccion.alias} - ` : ""}
                  {enmascararDireccion(direccion?.calle)} {enmascararDireccion(direccion?.numero)}
                </p>
                <p className="text-gray-500 text-xs mt-1">{direccion?.ciudad}, {direccion?.departamento}</p>
              </div>
              <button 
                onClick={() => router.push("/checkout/address")}
                className="text-cyan-500 hover:text-cyan-400 text-sm font-medium underline"
              >
                Editar
              </button>
            </div>
          </div>

          {/* Resumen Fiscal */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-b from-[#131b40] to-[#0A0F2C] rounded-3xl p-6 border border-[#2a3055] sticky top-24"
            >
              <h3 className="text-xl font-bold mb-6 text-center">Desglose Fiscal</h3>
              
              {/* Cupón Input */}
              <div className="mb-6 pb-6 border-b border-[#2a3055]">
                <label className="text-sm text-gray-400 mb-2 block">¿Tienes un cupón?</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Ej: TREDDY..."
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={isCouponApplied}
                    className="flex-grow bg-[#0A0F2C] border border-[#2a3055] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                  />
                  <button 
                    onClick={handleApplyCoupon}
                    disabled={isCouponApplied || !couponCode}
                    className="bg-cyan-600 hover:bg-cyan-500 text-black px-4 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
                  >
                    {isCouponApplied ? "Aplicado" : "Aplicar"}
                  </button>
                </div>
              </div>

              <div className="space-y-3 text-sm mb-6 pb-6 border-b border-[#2a3055]">
                <div className="flex justify-between text-gray-300">
                  <span>Base Imponible (Subtotal)</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                {isCouponApplied && (
                  <div className="flex justify-between text-green-400 font-medium">
                    <span>Descuento (15%)</span>
                    <span>-${discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-300">
                  <span>Impuestos (19%)</span>
                  <span>${impuestos.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Costo de Envío</span>
                  <span>${costoEnvio.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-lg text-gray-400">Total</span>
                <span className="text-3xl font-extrabold text-white">${totalPagar.toLocaleString()}</span>
              </div>

              <button
                onClick={confirmarYPagar}
                disabled={paying || figuras.length === 0}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-black py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {paying ? <Loader2 className="animate-spin" /> : <CreditCard />}
                Confirmar y Pagar
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                Al confirmar, se generará tu código de orden y serás redirigido a MercadoPago para completar la compra de forma segura.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
