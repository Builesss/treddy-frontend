"use client";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, ShoppingCart, Edit3, Loader2, QrCode, Star, MessageSquare } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type Figura = {
  producto_id: number;
  nombre: string;
  imagenUrl: string;
  precio_base: number;
  descripcion: string;
  stock: number;
};

function ensureSessionId() {
  let sid = localStorage.getItem("sessionId");
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem("sessionId", sid);
  }
  return sid;
}

export default function TarjetaExpandible({
  figura,
  onClose,
}: {
  figura: Figura;
  onClose: () => void;
}) {
  const [mostrarAR, setMostrarAR] = useState(false);
  const [mostrarQR, setMostrarQR] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [tab, setTab] = useState<"detalles" | "resenas">("detalles");
  const [reviews, setReviews] = useState<{ resena_id: string; rating: number; comentario: string; fecha: string; autor: string }[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);



  const canvasRef = useRef<HTMLDivElement | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const requestRef = useRef<number | null>(null);


  const MODEL_URL = "/HORNET.glb";

  useEffect(() => {
    if (!mostrarAR || !canvasRef.current) return;

    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight;


    if (rendererRef.current) {
      rendererRef.current.dispose();
      if (rendererRef.current.domElement.parentElement) {
        rendererRef.current.domElement.parentElement.removeChild(rendererRef.current.domElement);
      }
    }


    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasRef.current.innerHTML = "";
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;


    const scene = new THREE.Scene();
    sceneRef.current = scene;


    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1, 3);
    cameraRef.current = camera;


    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
    scene.add(hemiLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);


    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controlsRef.current = controls;


    const loader = new GLTFLoader();
    loader.load(
      MODEL_URL,
      (gltf) => {
        if (modelRef.current) scene.remove(modelRef.current);
        modelRef.current = gltf.scene;


        const box = new THREE.Box3().setFromObject(modelRef.current);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());

        const scaleFactor = 1.5 / size;
        modelRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);


        modelRef.current.position.x = -center.x * scaleFactor;
        modelRef.current.position.y = -center.y * scaleFactor;
        modelRef.current.position.z = -center.z * scaleFactor;

        scene.add(modelRef.current);
      },
      undefined,
      (err) => console.error("Error loading GLB:", err)
    );


    const animate = () => {
      requestRef.current = requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();


    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
      }
      if (controlsRef.current) controlsRef.current.dispose();
      if (modelRef.current && sceneRef.current) {
        sceneRef.current.remove(modelRef.current);
      }
    };
  }, [mostrarAR]);

  const fetchReviews = useCallback(async () => {
    if (!figura) return;
    try {
      setLoadingReviews(true);
      const BACK_BASE = (process.env.NEXT_PUBLIC_API_URL || "https://treddy-backend.onrender.com").replace(/\/$/, "");
      const res = await fetch(`${BACK_BASE}/api/resenas/${figura.producto_id}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (e) {
      console.error("Error fetching reviews:", e);
    } finally {
      setLoadingReviews(false);
    }
  }, [figura]);

  useEffect(() => {
    if (figura?.producto_id) {
      fetchReviews();
    }
  }, [figura?.producto_id, fetchReviews]);

  if (!figura) return null;

  const handleComprar = async () => {
    try {
      setLoading(true);
      const sessionId = ensureSessionId();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://treddy-backend.onrender.com";
      const res = await fetch(`${apiUrl}/api/cart/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          productoId: figura.producto_id,
          cantidad: 1,
        }),
      });

      if (!res.ok) throw new Error("No se pudo agregar al carrito");

      await Swal.fire({
        icon: "success",
        title: "¡Agregado!",
        text: `${figura.nombre} se añadió a tu carrito.`,
        timer: 1500,
        showConfirmButton: false,
        background: "#0F173A",
        color: "white",
        customClass: { popup: "rounded-2xl border border-cyan-500/30" },
      });


      onClose();
    } catch (e) {
      console.error("Error al agregar al carrito:", e);
      Swal.fire({
        icon: "error",
        title: "Ups...",
        text: "No pudimos agregar el producto. Intenta de nuevo.",
        confirmButtonColor: "#00E6F6",
        background: "#0F173A",
        color: "white",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalizar = () => {
    Swal.fire({
      title: "Próximamente",
      text: "La personalización estará disponible muy pronto.",
      icon: "info",
      confirmButtonColor: "#00E6F6",
      background: "#0F173A",
      color: "white",
    });
  };

  const handleSubmitReview = async () => {
    if (!newComment.trim() || isSubmittingReview) return;
    setIsSubmittingReview(true);
    
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Inicia sesión",
        text: "Debes tener una cuenta para dejar una reseña.",
        confirmButtonColor: "#00E6F6",
        background: "#0F173A",
        color: "white",
      });
      return;
    }

    try {
      const BACK_BASE = (process.env.NEXT_PUBLIC_API_URL || "https://treddy-backend.onrender.com").replace(/\/$/, "");
      const res = await fetch(`${BACK_BASE}/api/resenas/${figura.producto_id}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: newRating,
          comentario: newComment,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al publicar la reseña");
      }

      await fetchReviews();
      setNewComment("");
      setNewRating(5);
      
      Swal.fire({
        icon: "success",
        title: "Reseña añadida",
        text: "Gracias por tu opinión.",
        timer: 1500,
        showConfirmButton: false,
        background: "#0F173A",
        color: "white",
        customClass: { popup: "rounded-2xl border border-cyan-500/30" },
      });
    } catch (e: unknown) {
      console.error("Error posting review:", e);
      const errorMessage = e instanceof Error ? e.message : "Ocurrió un error inesperado.";
      Swal.fire({
        icon: "error",
        title: "No se pudo guardar",
        text: errorMessage,
        confirmButtonColor: "#EF4444",
        background: "#0F173A",
        color: "white",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            onClose();
          }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-[#0F173A]/90 border border-cyan-500/30 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col no-scrollbar"
        >
          <button
            onClick={() => {
              onClose();
            }}
            className="absolute top-2 right-4 z-20 p-2 bg-black/20 hover:bg-red-500/80 rounded-full text-white transition-all duration-300"
          >
            <X size={20} />
          </button>

          <div className="absolute top-3 left-4 z-20 flex gap-2">
            <button
              onClick={() => {
                if (mostrarAR) {
                  setMostrarAR(false);
                } else {
                  setMostrarAR(true);
                  setMostrarQR(false);
                }
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold text-xs transition-all duration-300 ${mostrarAR
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30"
                  : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30"
                }`}
            >
              <Camera size={16} />
              {mostrarAR ? "Cerrar 3D" : "3D"}
            </button>

            <button
              onClick={() => {
                if (mostrarQR) {
                  setMostrarQR(false);
                } else {
                  setMostrarQR(true);
                  setMostrarAR(false);
                }
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold text-xs transition-all duration-300 ${mostrarQR
                  ? "bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30"
                  : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30"
                }`}
            >
              <QrCode size={16} />
              {mostrarQR ? "Cerrar QR" : "QR"}
            </button>
          </div>

          <div className="relative w-full h-80 bg-gradient-to-b from-[#1a214f] to-[#0F173A] flex items-center justify-center p-6 overflow-hidden mt-14">
            {mostrarAR ? (
              <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <div ref={canvasRef} className="w-full h-full" />
                <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                </div>
              </div>
            ) : mostrarQR ? (
              <div className="flex flex-col items-center justify-center gap-4 bg-#0F173A p-6 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <QRCodeSVG
                  value={figura.imagenUrl || "https://treddy.com"}
                  size={200}
                  level={"H"}
                  includeMargin={true}
                  fgColor="#0F173A"
                />
              </div>
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={figura.imagenUrl || "/images/placeholder.png"}
                  alt={figura.nombre}
                  fill
                  className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                />
              </div>
            )}
          </div>

          <div className="p-6 flex flex-col gap-4">
            {/* TABS */}
            <div className="flex gap-2 bg-[#1a214f] p-1 rounded-xl">
              <button onClick={() => setTab("detalles")} className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${tab === "detalles" ? "bg-cyan-500/20 text-cyan-400 shadow-sm" : "text-gray-400 hover:text-white"}`}>Detalles</button>
              <button onClick={() => setTab("resenas")} className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-1 ${tab === "resenas" ? "bg-cyan-500/20 text-cyan-400 shadow-sm" : "text-gray-400 hover:text-white"}`}>
                <MessageSquare size={14} /> Reseñas ({reviews.length})
              </button>
            </div>

            {tab === "detalles" ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {figura.nombre}
                  </h2>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-cyan-400 font-bold text-xl">
                      ${figura.precio_base.toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-sm">|</span>
                    <span
                      className={`text-sm ${figura.stock > 0 ? "text-green-400" : "text-red-400"
                        }`}
                    >
                      {figura.stock > 0 ? `Stock: ${figura.stock}` : "Agotado"}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {figura.descripcion ||
                      "Una increíble figura 3D lista para tu colección."}
                  </p>
                </div>

                <div className="flex flex-col gap-3 mt-2">
                  <button
                    onClick={handleComprar}
                    disabled={figura.stock <= 0 || loading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <ShoppingCart size={20} />
                        {figura.stock > 0 ? "Agregar al Carrito" : "Sin Stock"}
                      </>
                    )}
                  </button>

                  <button
                    onClick={handlePersonalizar}
                    className="w-full bg-[#1a214f] text-white font-semibold py-3 rounded-xl border border-[#2a3055] hover:bg-[#232d66] hover:border-cyan-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Edit3 size={20} />
                    Personalizar
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                <div className="bg-[#1a214f] p-4 rounded-xl border border-[#2a3055]">
                  <h3 className="text-white font-semibold mb-2">Deja tu valoración</h3>
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={24} className={`cursor-pointer transition-all hover:scale-110 ${star <= newRating ? "fill-cyan-400 text-cyan-400" : "text-gray-500 hover:text-cyan-400/50"}`} onClick={() => setNewRating(star)} />
                    ))}
                  </div>
                  <textarea 
                    value={newComment} 
                    onChange={(e) => setNewComment(e.target.value)} 
                    placeholder="Escribe tu reseña sobre el producto..." 
                    className="w-full bg-[#0A0F2C] border border-[#2a3055] rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 resize-none h-24 mb-3 transition-all"
                  />
                  <button onClick={handleSubmitReview} disabled={!newComment.trim() || isSubmittingReview} className="w-full bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-2.5 rounded-lg transition-all text-sm flex items-center justify-center gap-2">
                    {isSubmittingReview ? <Loader2 className="animate-spin" size={16} /> : <MessageSquare size={16} />}
                    {isSubmittingReview ? "Publicando..." : "Publicar reseña"}
                  </button>
                </div>
                
                <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {loadingReviews ? (
                    <div className="flex justify-center py-4"><Loader2 className="animate-spin text-cyan-500" size={24} /></div>
                  ) : reviews.length > 0 ? reviews.map((review) => (
                    <div key={review.resena_id} className="bg-[#1a214f]/50 p-4 rounded-xl border border-[#2a3055]/50 hover:border-cyan-500/30 transition-all">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-cyan-400 text-sm">{review.autor}</span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} size={12} className={star <= review.rating ? "fill-cyan-400 text-cyan-400" : "text-gray-600"} />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 font-medium">{review.fecha}</span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{review.comentario}</p>
                    </div>
                  )) : (
                    <p className="text-center text-gray-500 text-sm py-4">Aún no hay reseñas. ¡Sé el primero en opinar!</p>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
