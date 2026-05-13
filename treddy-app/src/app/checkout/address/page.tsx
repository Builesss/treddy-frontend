"use client";
import { useEffect, useState, useRef } from "react";
import Nav from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Swal from "sweetalert2";
import { Loader2, MapPin, Plus, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function CheckoutAddress() {
  const router = useRouter();
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Estado para nueva dirección
  const [showModal, setShowModal] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [nuevaDir, setNuevaDir] = useState({
    alias: "",
    calle: "",
    numero: "",
    ciudad: "",
    departamento: "",
    codigo_postal: "",
    latitud: undefined as number | undefined,
    longitud: undefined as number | undefined,
    principal: true
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const autocompleteRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);

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

  // Inicializar Autocomplete y Mapa cuando el modal se abre
  useEffect(() => {
    if (!showModal || !window.google) return;

    const initMapAndAutocomplete = () => {
      if (!inputRef.current || !mapContainerRef.current) return;

      // Estilo oscuro para el mapa
      const darkMapStyle = [
        { elementType: "geometry", stylers: [{ color: "#0F173A" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#0F173A" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#263c3f" }],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#6b9a76" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#38414e" }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#212a37" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9ca5b3" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#746855" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#1f2835" }],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: "#f3d19c" }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#2f3948" }],
        },
        {
          featureType: "transit.station",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#17263c" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#515c6d" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#17263c" }],
        },
      ];

      // Inicializar Mapa
      const defaultPos = { lat: 4.5709, lng: -74.2973 }; // Colombia
      mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
        center: defaultPos,
        zoom: 5,
        styles: darkMapStyle,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "greedy",
        clickableIcons: true,
      });

      // Inicializar Marcador
      markerRef.current = new window.google.maps.Marker({
        map: mapRef.current,
        draggable: true,
        animation: window.google.maps.Animation.DROP,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#06B6D4",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#FFFFFF",
        }
      });

      // Inicializar Autocomplete
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["address"],
        componentRestrictions: { country: "co" }
      });

      // Listener para Autocomplete
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (!place.geometry || !place.geometry.location) return;

        // Actualizar Mapa y Marcador
        mapRef.current.setCenter(place.geometry.location);
        mapRef.current.setZoom(17);
        markerRef.current.setPosition(place.geometry.location);
        markerRef.current.setVisible(true);

        actualizarCamposDesdePlace(place);
      });

      // Listener para arrastre de marcador (Geocodificación Inversa)
      markerRef.current.addListener("dragend", () => {
        const pos = markerRef.current.getPosition();
        if (pos) {
          reverseGeocode(pos);
        }
      });

      // Listener para clic en el mapa (Nuevo: Permite seleccionar cualquier punto o POI)
      mapRef.current.addListener("click", (e: any) => {
        // Si se hace clic en un POI (punto de interés), e.stop() previene el popup de Google
        if (e.placeId) {
          e.stop();
          const service = new window.google.maps.places.PlacesService(mapRef.current);
          service.getDetails({ placeId: e.placeId }, (place: any, status: any) => {
            if (status === "OK" && place.geometry && place.geometry.location) {
              markerRef.current.setPosition(place.geometry.location);
              markerRef.current.setVisible(true);
              actualizarCamposDesdePlace(place);
              if (inputRef.current) {
                inputRef.current.value = place.formatted_address || "";
              }
            }
          });
        } else if (e.latLng) {
          markerRef.current.setPosition(e.latLng);
          markerRef.current.setVisible(true);
          reverseGeocode(e.latLng);
        }
      });
    };

    // Pequeño delay para asegurar que el DOM esté listo
    const timeout = setTimeout(initMapAndAutocomplete, 200);
    return () => clearTimeout(timeout);
  }, [showModal, mapLoaded]);

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
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        if (mapRef.current) {
          mapRef.current.setCenter(pos);
          mapRef.current.setZoom(17);
        }
        if (markerRef.current) {
          markerRef.current.setPosition(pos);
          markerRef.current.setVisible(true);
        }
        
        reverseGeocode(pos);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reverseGeocode = (latlng: any) => {
    const geocoder = new window.google.maps.Geocoder();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    geocoder.geocode({ location: latlng }, (results: any, status: any) => {
      if (status === "OK" && results[0]) {
        actualizarCamposDesdePlace(results[0]);
        if (inputRef.current) {
          inputRef.current.value = results[0].formatted_address;
        }
      }
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actualizarCamposDesdePlace = (place: any) => {
    let calle = "";
    let numero = "";
    let ciudad = "";
    let departamento = "";
    let codigo_postal = "";

    if (place.address_components) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      place.address_components.forEach((component: any) => {
        const types = component.types;
        if (types.includes("route")) calle = component.long_name;
        if (types.includes("street_number")) numero = component.long_name;
        if (types.includes("locality")) ciudad = component.long_name;
        if (types.includes("administrative_area_level_1")) departamento = component.long_name;
        if (types.includes("postal_code")) codigo_postal = component.long_name;
      });
    }

    setNuevaDir(prev => ({
      ...prev,
      calle: calle || place.name || prev.calle,
      numero: numero || prev.numero,
      ciudad: ciudad || prev.ciudad,
      departamento: departamento || prev.departamento,
      codigo_postal: codigo_postal || prev.codigo_postal,
      latitud: place.geometry?.location?.lat() || prev.latitud,
      longitud: place.geometry?.location?.lng() || prev.longitud
    }));
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
      const res = await fetch(`${apiUrl}/api/address`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...nuevaDir, usuario_id: userId })
      });

      if (!res.ok) throw new Error("Error al guardar");
      
      const data = await res.json();
      setDirecciones([data, ...direcciones.filter(d => !data.principal || !d.principal)]);
      if (data.principal) {
        setDirecciones(prev => prev.map(d => d.id === data.id ? data : { ...d, principal: false }));
      }
      setShowModal(false);
      
      Swal.fire({
        icon: "success",
        title: "Dirección guardada",
        background: "#0F173A", color: "white",
        timer: 1500, showConfirmButton: false
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar la dirección.",
        background: "#0F173A", color: "white"
      });
    }
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
                onClick={() => setShowModal(true)}
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
                    {dir.principal && (
                      <span className="absolute top-3 right-3 bg-cyan-500 text-black text-xs font-bold px-2 py-1 rounded">Principal</span>
                    )}
                    <h4 className="font-bold text-lg mb-1">{dir.alias || "Dirección"}</h4>
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
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <div className="flex min-h-full items-start justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-[#0F173A] w-full max-w-lg rounded-2xl border border-[#2a3055] overflow-hidden my-8 shadow-2xl"
              >
                <button 
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-red-500/80 rounded-full text-white transition-all"
                >
                  <Plus size={20} className="rotate-45" />
                </button>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-6 text-white">Agregar Dirección</h3>
                <form onSubmit={guardarDireccion} className="space-y-4">
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Buscar dirección (Google Maps)</label>
                    <input 
                      ref={inputRef}
                      type="text" 
                      placeholder="Empieza a escribir..."
                      className="w-full bg-[#131b40] border border-[#2a3055] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 mb-4"
                    />
                    <div className="relative">
                      <div 
                        ref={mapContainerRef} 
                        className="w-full h-48 md:h-64 rounded-xl border border-[#2a3055] overflow-hidden bg-[#0A0F2C]"
                      />
                      <button
                        type="button"
                        onClick={detectarUbicacion}
                        disabled={isLocating}
                        className="absolute bottom-4 right-4 bg-cyan-500 text-black p-2 rounded-full shadow-lg hover:bg-cyan-400 transition-all flex items-center justify-center"
                        title="Usar mi ubicación actual"
                      >
                        {isLocating ? <Loader2 size={20} className="animate-spin" /> : <MapPin size={20} />}
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2 text-center italic">
                      Puedes hacer clic en cualquier lugar del mapa o arrastrar el marcador para seleccionar tu ubicación.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#2a3055]">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Calle / Carrera *</label>
                      <input required value={nuevaDir.calle} onChange={e => setNuevaDir({...nuevaDir, calle: e.target.value})} type="text" className="w-full bg-[#131b40] border border-[#2a3055] rounded-lg px-4 py-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Número / Detalles *</label>
                      <input required value={nuevaDir.numero} onChange={e => setNuevaDir({...nuevaDir, numero: e.target.value})} type="text" className="w-full bg-[#131b40] border border-[#2a3055] rounded-lg px-4 py-2 text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Ciudad *</label>
                      <input required value={nuevaDir.ciudad} onChange={e => setNuevaDir({...nuevaDir, ciudad: e.target.value})} type="text" className="w-full bg-[#131b40] border border-[#2a3055] rounded-lg px-4 py-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Departamento *</label>
                      <input required value={nuevaDir.departamento} onChange={e => setNuevaDir({...nuevaDir, departamento: e.target.value})} type="text" className="w-full bg-[#131b40] border border-[#2a3055] rounded-lg px-4 py-2 text-white" />
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
                    <button type="submit" className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold py-3 rounded-xl hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition">Guardar</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>

      <Footer />
      
      {/* Script de Google Maps cargado de forma optimizada */}
      <Script 
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places`}
        strategy="afterInteractive"
        onLoad={() => setMapLoaded(true)}
      />
    </main>
  );
}
