"use client";
import { useEffect, useState, useCallback } from "react";
import Nav from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Loader2, MapPin, Plus, ArrowRight, Pencil, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Importar el mapa de forma dinámica para evitar errores de SSR
const LeafletMap = dynamic(() => import("./LeafletMap"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#0A0F2C] animate-pulse rounded-xl" />
});

interface Direccion {
  id: string;
  alias: string;
  calle: string;
  numero: string;
  ciudad: string;
  departamento: string;
  codigo_postal: string;
  latitud?: number;
  longitud?: number;
  principal: boolean;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    road?: string;
    pedestrian?: string;
    suburb?: string;
    house_number?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    state?: string;
    postcode?: string;
  };
}

export default function CheckoutAddress() {
  const router = useRouter();
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Estado para nueva dirección
  const [showModal, setShowModal] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [nuevaDir, setNuevaDir] = useState({
    alias: "",
    calle: "",
    numero: "",
    ciudad: "",
    departamento: "",
    codigo_postal: "",
    latitud: undefined as number | undefined,
    longitud: undefined as number | undefined,
    principal: false
  });

  const [mapPosition, setMapPosition] = useState<[number, number]>([4.5709, -74.2973]); // Colombia
  const [zoom, setZoom] = useState(5);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const uid = payload.id || payload.userId || payload.sub;
      setUserId(uid);
      cargarDirecciones(uid);
    } catch {
      router.push("/auth/login");
    }
  }, [router]);

  const cargarDirecciones = async (uid: string) => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://treddy-backend.onrender.com";
      const res = await fetch(`${apiUrl}/api/address/${uid}`);
      if (res.ok) {
        const data = await res.json();
        setDirecciones(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (showModal) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    }
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    };
  }, [showModal]);

  const actualizarCamposDesdeNominatim = (data: NominatimResult) => {
    const addr = data.address || {};
    
    // Nominatim devuelve los campos de forma diferente a Google
    const calle = addr.road || addr.pedestrian || addr.suburb || "";
    let numero = addr.house_number || "";
    
    // Refinamiento para extraer números en formatos comunes (especialmente útil en Colombia como # 12-34)
    if (!numero) {
      const firstPart = data.display_name.split(',')[0];
      // Busca patrones como #12, No. 12, # 12-34, etc.
      const match = firstPart.match(/(?:#|No\.?|Num\.?|N°)\s*([\w\d\s-]+)/i);
      if (match) {
        numero = match[1].trim();
      }
    }

    const ciudad = addr.city || addr.town || addr.village || addr.municipality || "";
    const departamento = addr.state || "";
    const codigo_postal = addr.postcode || "";

    setNuevaDir(prev => ({
      ...prev,
      calle: calle || data.display_name.split(',')[0] || prev.calle,
      numero: numero || prev.numero,
      ciudad: ciudad || prev.ciudad,
      departamento: departamento || prev.departamento,
      codigo_postal: codigo_postal || prev.codigo_postal,
      latitud: parseFloat(data.lat),
      longitud: parseFloat(data.lon)
    }));
  };

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    setIsReverseGeocoding(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
        headers: { 'Accept-Language': 'es' }
      });
      const data = await res.json();
      if (data) {
        actualizarCamposDesdeNominatim(data);
      }
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
    } finally {
      setIsReverseGeocoding(false);
    }
  }, []);

  // Cerrar resultados al hacer clic fuera (Ya no es necesario sin buscador, pero dejamos la estructura si se requiere luego)
  useEffect(() => {
    // Código anterior de click outside removido por simplicidad
  }, []);

  // Eliminar el efecto de inicialización de Google Maps
  useEffect(() => {
    if (showModal) {
      setZoom(5);
      setMapPosition([4.5709, -74.2973]);
    }
  }, [showModal]);

  const detectarUbicacion = () => {
    if (!navigator.geolocation) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Tu navegador no soporta geolocalización.",
        background: "#0F173A", color: "white"
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setMapPosition([lat, lng]);
        setZoom(17);
        reverseGeocode(lat, lng);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        Swal.fire({
          icon: "error",
          title: "Error de ubicación",
          text: "No pudimos obtener tu ubicación actual. Por favor, selecciónala manualmente en el mapa.",
          background: "#0F173A", color: "white"
        });
      },
      { enableHighAccuracy: true }
    );
  };


  const guardarDireccion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaDir.calle || !nuevaDir.ciudad || !nuevaDir.departamento) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, completa los campos requeridos de la dirección.",
        background: "#0F173A", color: "white"
      });
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://treddy-backend.onrender.com";
      const url = isEditing 
        ? `${apiUrl}/api/address/${editId}`
        : `${apiUrl}/api/address`;
      
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...nuevaDir, usuario_id: userId })
      });

      if (!res.ok) throw new Error("Error al guardar");
      
      const data = await res.json();
      
      if (isEditing) {
        setDirecciones(prev => prev.map(d => d.id === editId ? data : (data.principal ? { ...d, principal: false } : d)));
      } else {
        setDirecciones(prev => [data, ...prev.map(d => data.principal ? { ...d, principal: false } : d)]);
      }

      setShowModal(false);
      resetForm();
      
      Swal.fire({
        icon: "success",
        title: isEditing ? "Dirección actualizada" : "Dirección guardada",
        background: "#0F173A", color: "white",
        timer: 1500, showConfirmButton: false
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo procesar la dirección.",
        background: "#0F173A", color: "white"
      });
    }
  };

  const eliminarDireccion = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#06b6d4",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#0F173A", color: "white"
    });

    if (result.isConfirmed) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://treddy-backend.onrender.com";
        const res = await fetch(`${apiUrl}/api/address/${id}`, { method: "DELETE" });
        if (res.ok) {
          setDirecciones(prev => prev.filter(d => d.id !== id));
          Swal.fire({
            icon: "success",
            title: "Eliminado",
            background: "#0F173A", color: "white",
            timer: 1000, showConfirmButton: false
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const editarDireccion = (e: React.MouseEvent, dir: Direccion) => {
    e.stopPropagation();
    setNuevaDir({
      alias: dir.alias || "",
      calle: dir.calle,
      numero: dir.numero,
      ciudad: dir.ciudad,
      departamento: dir.departamento,
      codigo_postal: dir.codigo_postal || "",
      latitud: dir.latitud,
      longitud: dir.longitud,
      principal: dir.principal
    });
    setEditId(dir.id);
    setIsEditing(true);
    if (dir.latitud && dir.longitud) {
      setMapPosition([dir.latitud, dir.longitud]);
      setZoom(17);
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setNuevaDir({
      alias: "",
      calle: "",
      numero: "",
      ciudad: "",
      departamento: "",
      codigo_postal: "",
      latitud: undefined,
      longitud: undefined,
      principal: false
    });
    setIsEditing(false);
    setEditId(null);
  };

  const seleccionarDireccion = (id: string) => {
    // Save to local storage for the summary page
    const dir = direcciones.find(d => d.id === id);
    if (dir) {
      localStorage.setItem("selectedAddressId", id);
      localStorage.setItem("selectedAddressData", JSON.stringify(dir));
      router.push("/checkout/summary");
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0F2C] text-white">
      <Nav />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Dirección de Envío
        </h2>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-cyan-500" size={40} /></div>
        ) : (
          <div className="bg-[#0F173A] rounded-3xl p-6 md:p-10 border border-[#1a1f40]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Mis Direcciones</h3>
              <button 
                onClick={() => { resetForm(); setShowModal(true); }}
                className="flex items-center gap-2 bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-lg hover:bg-cyan-500/20 transition-all"
              >
                <Plus size={20} /> Nueva Dirección
              </button>
            </div>

            {direcciones.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <MapPin className="mx-auto mb-4 opacity-50" size={48} />
                <p>No tienes direcciones guardadas.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {direcciones.map(dir => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    key={dir.id}
                    onClick={() => seleccionarDireccion(dir.id)}
                    className="cursor-pointer border border-[#2a3055] rounded-xl p-5 hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all bg-[#131b40] group relative"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg">{dir.alias || "Dirección"}</h4>
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => editarDireccion(e, dir)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg transition-all border border-cyan-500/20"
                          title="Editar dirección"
                        >
                          <Pencil size={14} />
                          <span className="text-xs font-medium">Editar</span>
                        </button>
                        <button 
                          onClick={(e) => eliminarDireccion(e, dir.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all border border-red-500/20"
                          title="Eliminar dirección"
                        >
                          <Trash2 size={14} />
                          <span className="text-xs font-medium">Eliminar</span>
                        </button>

                      </div>
                    </div>
                    {dir.principal && (
                      <span className="absolute top-16 right-3 bg-cyan-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded shadow-lg">Principal</span>
                    )}
                    <p className="text-gray-400 text-sm mb-1">{dir.calle} {dir.numero}</p>
                    <p className="text-gray-400 text-sm mb-3">{dir.ciudad}, {dir.departamento}</p>
                    <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-cyan-400 flex items-center text-sm font-medium">Usar esta <ArrowRight size={16} className="ml-1" /></span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Nueva Dirección */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-8 sm:px-0">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#0F173A] w-full max-w-lg rounded-2xl border border-[#2a3055] shadow-2xl z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-red-500/80 rounded-full text-white transition-all"
              >
                <Plus size={20} className="rotate-45" />
              </button>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-6 text-white">
                  {isEditing ? "Editar Dirección" : "Agregar Dirección"}
                </h3>
                <form onSubmit={guardarDireccion} className="space-y-4">
                  
                  <div>
                    <div className="relative">
                      <div className="w-full h-64 md:h-80 rounded-xl border border-[#2a3055] overflow-hidden bg-[#0A0F2C]">
                        <LeafletMap 
                          position={mapPosition} 
                          zoom={zoom}
                          onPositionChange={(pos: [number, number]) => {
                            setMapPosition(pos);
                            reverseGeocode(pos[0], pos[1]);
                          }}
                          onZoomChange={(newZoom: number) => setZoom(newZoom)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={detectarUbicacion}
                        disabled={isLocating}
                        className="absolute bottom-12 right-4 bg-cyan-500 text-black p-2.5 rounded-full shadow-lg hover:bg-cyan-400 hover:scale-110 active:scale-95 transition-all flex items-center justify-center z-[1000] border-2 border-[#0F173A]"
                        title="Usar mi ubicación actual"
                      >
                        {isLocating ? <Loader2 size={20} className="animate-spin" /> : <MapPin size={20} />}
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 text-center italic">
                      Toca cualquier punto del mapa o arrastra el marcador para establecer tu dirección automáticamente.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#2a3055]">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-400 mb-1">Calle / Carrera *</label>
                      <input 
                        required 
                        value={nuevaDir.calle} 
                        onChange={e => setNuevaDir({...nuevaDir, calle: e.target.value})} 
                        type="text" 
                        className={`w-full bg-[#131b40] border border-[#2a3055] rounded-lg px-4 py-2 text-white transition-all ${isReverseGeocoding ? 'opacity-50 animate-pulse' : ''}`} 
                      />
                      {isReverseGeocoding && <div className="absolute right-3 top-9"><Loader2 size={14} className="animate-spin text-cyan-500" /></div>}
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-400 mb-1">Número / Detalles *</label>
                      <input 
                        required 
                        value={nuevaDir.numero} 
                        onChange={e => setNuevaDir({...nuevaDir, numero: e.target.value})} 
                        type="text" 
                        className={`w-full bg-[#131b40] border border-[#2a3055] rounded-lg px-4 py-2 text-white transition-all ${isReverseGeocoding ? 'opacity-50 animate-pulse' : ''}`} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-400 mb-1">Ciudad *</label>
                      <input 
                        required 
                        value={nuevaDir.ciudad} 
                        onChange={e => setNuevaDir({...nuevaDir, ciudad: e.target.value})} 
                        type="text" 
                        className={`w-full bg-[#131b40] border border-[#2a3055] rounded-lg px-4 py-2 text-white transition-all ${isReverseGeocoding ? 'opacity-50 animate-pulse' : ''}`} 
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-400 mb-1">Departamento *</label>
                      <input 
                        required 
                        value={nuevaDir.departamento} 
                        onChange={e => setNuevaDir({...nuevaDir, departamento: e.target.value})} 
                        type="text" 
                        className={`w-full bg-[#131b40] border border-[#2a3055] rounded-lg px-4 py-2 text-white transition-all ${isReverseGeocoding ? 'opacity-50 animate-pulse' : ''}`} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Código Postal</label>
                      <input value={nuevaDir.codigo_postal} onChange={e => setNuevaDir({...nuevaDir, codigo_postal: e.target.value})} type="text" className="w-full bg-[#131b40] border border-[#2a3055] rounded-lg px-4 py-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Alias (Ej. Casa)</label>
                      <input value={nuevaDir.alias} onChange={e => setNuevaDir({...nuevaDir, alias: e.target.value})} type="text" className="w-full bg-[#131b40] border border-[#2a3055] rounded-lg px-4 py-2 text-white" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <input type="checkbox" id="principal" checked={nuevaDir.principal} onChange={e => setNuevaDir({...nuevaDir, principal: e.target.checked})} className="rounded text-cyan-500 focus:ring-cyan-500 bg-[#131b40] border-[#2a3055]" />
                    <label htmlFor="principal" className="text-sm text-gray-300">Establecer como dirección principal</label>
                  </div>

                   <div className="flex gap-4 mt-8">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-transparent border border-gray-600 text-white py-3 rounded-xl hover:bg-gray-800 transition">Cancelar</button>
                    <button type="submit" className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold py-3 rounded-xl hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition">
                      {isEditing ? "Actualizar" : "Guardar"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
