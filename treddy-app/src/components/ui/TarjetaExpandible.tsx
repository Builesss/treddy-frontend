"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, ReactNode } from "react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, ShoppingCart, Edit3, Loader2, QrCode, Star, MessageSquare } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

// Componentes locales
import Visualizador3D from "./Visualizador3D";
import VisualizadorAR from "./VisualizadorAR";

// --- Tipos e Interfaces ---
interface Figura {
  producto_id: number;
  nombre: string;
  imagenUrl: string;
  modeloUrl?: string;
  precio_base: number;
  descripcion: string;
  stock: number;
}

interface Review {
  resena_id: string;
  rating: number;
  comentario: string;
  fecha: string;
  autor: string;
}

// --- Helpers ---
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");

function ensureSessionId() {
  if (typeof window === "undefined") return "";
  let sid = localStorage.getItem("sessionId");
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem("sessionId", sid);
  }
  return sid;
}

// --- Componente Principal ---
export default function TarjetaExpandible({ figura, onClose }: { figura: Figura; onClose: () => void }) {
  // Estados de Visualización
  const [viewMode, setViewMode] = useState<"image" | "3d" | "ar" | "qr">("image");
  const [tab, setTab] = useState<"detalles" | "resenas">("detalles");

  // Estados de Carga y Datos
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Estados de nueva reseña
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // --- Efectos ---
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Bloquea el scroll del body mientras el modal está abierto. Esto evita
  // que el fondo detrás del modal se desplace en mobile, lo cual además
  // mantiene fijo el botón de AR (que se ancla al viewport con position: fixed).
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const fetchReviews = useCallback(async () => {
    if (!figura?.producto_id) return;
    try {
      setLoadingReviews(true);
      const res = await fetch(`${API_BASE}/api/resenas/${figura.producto_id}`);
      if (res.ok) setReviews(await res.json());
    } catch (e) {
      console.error("Error fetching reviews:", e);
    } finally {
      setLoadingReviews(false);
    }
  }, [figura.producto_id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // --- Handlers de Acciones ---
  const handleComprar = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/cart/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: ensureSessionId(),
          productoId: figura.producto_id,
          cantidad: 1,
        }),
      });

      if (!res.ok) throw new Error();

      Swal.fire({
        icon: "success",
        title: "¡Agregado!",
        text: `${figura.nombre} se añadió al carrito.`,
        timer: 1500,
        showConfirmButton: false,
        background: "#0F173A",
        color: "white",
      });
      onClose();
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo agregar el producto.", background: "#0F173A", color: "white" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({ icon: "warning", title: "Inicia sesión", text: "Debes estar logueado para opinar.", background: "#0F173A", color: "white" });
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch(`${API_BASE}/api/resenas/${figura.producto_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ rating: newRating, comentario: newComment }),
      });

      if (!res.ok) throw new Error();

      setNewComment("");
      fetchReviews();
      Swal.fire({ icon: "success", title: "¡Gracias!", timer: 1500, showConfirmButton: false, background: "#0F173A", color: "white" });
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo publicar la reseña.", background: "#0F173A", color: "white" });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-[#0F173A]/90 border border-cyan-500/30 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl"
        >
          {/* Botones de Cabecera */}
          <div className="absolute top-3 left-4 z-20 flex gap-2">
            {!isMobile && (
              <HeaderButton
                active={viewMode === "qr"}
                onClick={() => setViewMode(viewMode === "qr" ? "image" : "qr")}
                icon={<QrCode size={16} />}
                label={viewMode === "qr" ? "Imagen" : "QR"}
              />
            )}
            <HeaderButton
              active={viewMode === "3d"}
              onClick={() => setViewMode(viewMode === "3d" ? "image" : "3d")}
              icon={<Camera size={16} />}
              label={viewMode === "3d" ? "Imagen" : "Ver 3D"}
            />
            {isMobile && (
              <HeaderButton
                active={viewMode === "ar"}
                onClick={() => setViewMode(viewMode === "ar" ? "image" : "ar")}
                icon={<Camera size={16} />}
                label="RA"
              />
            )}
          </div>

          <button onClick={onClose} className="absolute top-2 right-4 z-20 p-2 hover:bg-red-500/80 rounded-full text-white transition-colors">
            <X size={20} />
          </button>

          {/* Visualizador Principal */}
          <div className="relative w-full h-80 bg-gradient-to-b from-[#1a214f] to-[#0F173A] mt-14 flex items-center justify-center overflow-hidden">
            {viewMode === "3d" && <Visualizador3D modelUrl={figura.modeloUrl || "/HORNET.glb"} />}
            {viewMode === "ar" && (
              <div
                onTouchStart={e => e.stopPropagation()}
                onTouchMove={e => e.stopPropagation()}
                className="w-full h-full"
              >
                <VisualizadorAR modelUrl={figura.modeloUrl || "/HORNET.glb"} />
              </div>
            )}

            {viewMode === "qr" && (
              <div className="bg-white p-4 rounded-xl">
                <QRCodeSVG value={figura.imagenUrl} size={180} fgColor="#0F173A" />
              </div>
            )}
            {viewMode === "image" && (
              <Image src={figura.imagenUrl || "/images/placeholder.png"} alt={figura.nombre} fill className="object-contain p-6" />
            )}
          </div>

          {/* Contenido inferior */}
          <div className="p-6 flex flex-col gap-4">
            {/* Tabs Selector */}
            <div className="flex gap-2 bg-[#1a214f] p-1 rounded-xl">
              <TabButton active={tab === "detalles"} onClick={() => setTab("detalles")} label="Detalles" />
              <TabButton active={tab === "resenas"} onClick={() => setTab("resenas")} label={`Reseñas (${reviews.length})`} icon={<MessageSquare size={14} />} />
            </div>

            {tab === "detalles" ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white">{figura.nombre}</h2>
                  <div className="flex items-center justify-center gap-3 mt-1">
                    <span className="text-cyan-400 font-bold text-xl">${figura.precio_base.toLocaleString()}</span>
                    <span className={figura.stock > 0 ? "text-green-400" : "text-red-400"}>
                      {figura.stock > 0 ? `En stock (${figura.stock})` : "Agotado"}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mt-3 leading-relaxed">{figura.descripcion}</p>
                </div>

                <div className="space-y-3">
                  <button onClick={handleComprar} disabled={figura.stock <= 0 || loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500 text-black font-bold disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin" /> : <><ShoppingCart size={20} /> Comprar Ahora</>}
                  </button>
                  <button onClick={() => Swal.fire({ title: "Próximamente", background: "#0F173A", color: "white" })} className="btn-secondary w-full py-3 rounded-xl border border-gray-600 text-white flex items-center justify-center gap-2">
                    <Edit3 size={20} /> Personalizar
                  </button>
                </div>
              </motion.div>
            ) : (
              <ResenasSection
                reviews={reviews}
                loading={loadingReviews}
                newRating={newRating}
                setNewRating={setNewRating}
                newComment={newComment}
                setNewComment={setNewComment}
                onSubmit={handleSubmitReview}
                submitting={isSubmittingReview}
              />
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// --- Subcomponentes de Apoyo ---

interface HeaderButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function HeaderButton({ active, onClick, icon, label }: HeaderButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold text-xs transition-all ${active ? "bg-cyan-500 text-black shadow-[0_0_10px_#06b6d4]" : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
        }`}
    >
      {icon} {label}
    </button>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
}

function TabButton({ active, onClick, label, icon }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${active ? "bg-cyan-500/20 text-cyan-400" : "text-gray-400"
        }`}
    >
      {icon} {label}
    </button>
  );
}

interface ResenasSectionProps {
  reviews: Review[];
  loading: boolean;
  newRating: number;
  setNewRating: (r: number) => void;
  newComment: string;
  setNewComment: (c: string) => void;
  onSubmit: () => void;
  submitting: boolean;
}

function ResenasSection({ reviews, loading, newRating, setNewRating, newComment, setNewComment, onSubmit, submitting }: ResenasSectionProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="bg-[#1a214f] p-4 rounded-xl space-y-3">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={20} onClick={() => setNewRating(s)} className={`cursor-pointer ${s <= newRating ? "fill-cyan-400 text-cyan-400" : "text-gray-600"}`} />
          ))}
        </div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Tu opinión importa..."
          className="w-full bg-[#0A0F2C] border border-[#2a3055] rounded-lg p-3 text-sm text-white resize-none h-20"
        />
        <button onClick={onSubmit} disabled={!newComment.trim() || submitting} className="w-full bg-cyan-500/20 text-cyan-400 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
          {submitting ? <Loader2 className="animate-spin" size={16} /> : "Publicar"}
        </button>
      </div>

      <div className="max-h-48 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {loading ? (
          <Loader2 className="animate-spin mx-auto text-cyan-500" />
        ) : reviews.length > 0 ? (
          reviews.map((r: Review) => (
            <div key={r.resena_id} className="bg-[#1a214f]/50 p-3 rounded-lg border border-[#2a3055]/50">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-cyan-400">{r.autor}</span>
                <span className="text-gray-500">{r.fecha}</span>
              </div>
              <div className="flex mb-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={10} className={i < r.rating ? "fill-cyan-400 text-cyan-400" : "text-gray-700"} />)}
              </div>
              <p className="text-gray-300 text-xs">{r.comentario}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-xs py-4">No hay reseñas aún.</p>
        )}
      </div>
    </motion.div>
  );
}