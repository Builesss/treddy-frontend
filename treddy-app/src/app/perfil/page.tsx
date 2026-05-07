/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Edit3, LogOut, Settings, User, Lock, ShoppingBag, Mail, Phone, Calendar, Shield, XCircle, AlertTriangle } from 'lucide-react';
import Swal from 'sweetalert2';
import { getUserProfile, updateUserProfile, getUserOrders, cancelOrder } from '@/services/user.service';
import { AnimatePresence, motion } from 'framer-motion';

const MOTIVOS_CANCELACION = [
  'Error en dirección',
  'Producto equivocado',
  'Cambié de opinión',
  'Demora excesiva',
  'Otro',
];

const ESTADOS_CANCELABLES = ['pendiente', 'en_producción'];

function getEstadoBadge(estado: string) {
  switch (estado) {
    case 'entregado':
      return 'bg-green-500/20 text-green-400';
    case 'en_producción':
      return 'bg-blue-500/20 text-blue-400';
    case 'pendiente':
      return 'bg-yellow-500/20 text-yellow-400';
    case 'cancelado':
      return 'bg-red-500/20 text-red-400';
    case 'enviado':
      return 'bg-purple-500/20 text-purple-400';
    default:
      return 'bg-gray-500/20 text-gray-400';
  }
}

export default function Perfil() {
  const router = useRouter();
  const [usuario, setUsuario] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    rol: '',
    fechaRegistro: '',
  });
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [loading, setLoading] = useState(true);

  // Estado para modal de cancelación
  const [cancelModal, setCancelModal] = useState<{ open: boolean; pedidoId: number | null }>({ open: false, pedidoId: null });
  const [motivoSeleccionado, setMotivoSeleccionado] = useState('');
  const [cancelando, setCancelando] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    const fetchData = async () => {
      try {
        const profileRes = await getUserProfile();
        const userData = profileRes.usuario || profileRes;
        setUsuario({
          nombre: userData.nombre || '',
          apellido: userData.apellido || '',
          email: userData.email || '',
          telefono: userData.telefono || '',
          rol: userData.rol || 'Cliente',
          fechaRegistro: userData.fechaRegistro || '',
        });
        const ordersRes = await getUserOrders();
        let pedidosArray: any[] = [];
        if (Array.isArray(ordersRes)) {
          pedidosArray = ordersRes;
        } else if (ordersRes && Array.isArray(ordersRes.pedidos)) {
          pedidosArray = ordersRes.pedidos;
        } else if (ordersRes && Array.isArray(ordersRes.data)) {
          pedidosArray = ordersRes.data;
        }
        setPedidos(pedidosArray);
      } catch (error) {
        console.error('Error al cargar perfil:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar datos',
          text: 'No se pudieron obtener los datos del perfil.',
          background: '#0F173A',
          color: '#E0EAFD',
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: 'rounded-2xl border border-red-500/30 shadow-2xl shadow-red-500/20' },
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  const handleSave = async () => {
    try {
      await updateUserProfile({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        telefono: usuario.telefono,
      });
      setModoEdicion(false);
      Swal.fire({
        icon: 'success',
        title: 'Cambios guardados exitosamente',
        background: '#0F173A',
        color: '#E0EAFD',
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: 'rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20' },
      });
    } catch (error) {
      console.error('Error al actualizar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar los cambios',
        background: '#0F173A',
        color: '#E0EAFD',
        timer: 2000,
        showConfirmButton: false,
        customClass: { popup: 'rounded-2xl border border-red-500/30 shadow-2xl shadow-red-500/20' },
      });
    }
  };


  const handleCancelOrder = async () => {
    if (!cancelModal.pedidoId || !motivoSeleccionado) return;

    setCancelando(true);
    try {
      await cancelOrder(cancelModal.pedidoId, motivoSeleccionado);
      setCancelModal({ open: false, pedidoId: null });
      setMotivoSeleccionado('');

      Swal.fire({
        icon: 'success',
        title: 'Pedido cancelado',
        text: 'Tu pedido ha sido cancelado exitosamente. Recibirás un email de confirmación.',
        background: '#0F173A',
        color: '#E0EAFD',
        timer: 3000,
        showConfirmButton: false,
        customClass: { popup: 'rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20' },
      });

      // Refrescar pedidos
      const ordersRes = await getUserOrders();
      let pedidosArray: any[] = [];
      if (Array.isArray(ordersRes)) pedidosArray = ordersRes;
      else if (ordersRes && Array.isArray(ordersRes.pedidos)) pedidosArray = ordersRes.pedidos;
      else if (ordersRes && Array.isArray(ordersRes.data)) pedidosArray = ordersRes.data;
      setPedidos(pedidosArray);
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo cancelar',
        text: error.message || 'Ocurrió un error al cancelar el pedido.',
        background: '#0F173A',
        color: '#E0EAFD',
        customClass: { popup: 'rounded-2xl border border-red-500/30 shadow-2xl shadow-red-500/20' },
      });
    } finally {
      setCancelando(false);
    }
  };

  const iniciales = `${usuario.nombre.charAt(0)}${usuario.apellido.charAt(0)}`.toUpperCase() || 'U';

  if (loading) {
    return (
      <main className="flex flex-col min-h-screen bg-[#0A0F2C] text-white">
        <Nav />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0F2C] text-white overflow-hidden relative">

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>
      <Nav />


      <section className="mx-8 mt-10 px-8 py-12 bg-[#0F173A]/20 rounded-2xl shadow-2xl backdrop-blur-md">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Mi Perfil
          </h1>
          <p className="text-[#B5B8C5] mt-3 text-lg">Administra tu información personal y preferencias de cuenta</p>
        </div>
      </section>


      <section className="max-w-6xl mx-auto my-10 px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="bg-[#10193F] rounded-2xl p-8 shadow-lg border border-cyan-500/10 flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                <span className="text-4xl font-bold text-black">{iniciales}</span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#00E6F6] rounded-full p-2 shadow-lg">
                <User className="text-black" size={20} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">{usuario.nombre} {usuario.apellido}</h2>
            <div className="flex items-center gap-2 mt-2 text-[#B5B8C5]">
              <Shield size={16} />
              <span className="text-sm capitalize">{usuario.rol}</span>
            </div>
            <div className="w-full pt-4 border-t border-cyan-500/20 space-y-3">
              <div className="flex items-center gap-3 text-[#B5B8C5] text-sm">
                <Mail size={18} className="text-cyan-400" />
                <span className="truncate">{usuario.email}</span>
              </div>
              <div className="flex items-center gap-3 text-[#B5B8C5] text-sm">
                <Phone size={18} className="text-cyan-400" />
                <span>{usuario.telefono || 'Sin teléfono'}</span>
              </div>
              <div className="flex items-center gap-3 text-[#B5B8C5] text-sm">
                <Calendar size={18} className="text-cyan-400" />
                <span>Desde {usuario.fechaRegistro}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition shadow-lg"
            >
              <LogOut size={18} /> Cerrar sesión
            </button>
          </div>


          <div className="lg:col-span-2 space-y-6">

            <div className="bg-[#10193F] rounded-2xl p-8 shadow-lg border border-cyan-500/10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <User className="text-cyan-400" /> Información Personal
                </h3>
                <button
                  onClick={() => (modoEdicion ? handleSave() : setModoEdicion(true))}
                  className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-5 py-2 rounded-full font-semibold hover:opacity-90 transition shadow-md"
                >
                  <Edit3 size={16} /> {modoEdicion ? 'Guardar' : 'Editar'}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-[#B5B8C5] mb-2 block">Nombre</label>
                  {modoEdicion ? (
                    <input
                      type="text"
                      className="w-full bg-[#0A0F2C] border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                      value={usuario.nombre}
                      onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
                    />
                  ) : (
                    <p className="text-white font-medium bg-[#0A0F2C] rounded-lg px-4 py-3">{usuario.nombre}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-[#B5B8C5] mb-2 block">Apellido</label>
                  {modoEdicion ? (
                    <input
                      type="text"
                      className="w-full bg-[#0A0F2C] border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                      value={usuario.apellido}
                      onChange={(e) => setUsuario({ ...usuario, apellido: e.target.value })}
                    />
                  ) : (
                    <p className="text-white font-medium bg-[#0A0F2C] rounded-lg px-4 py-3">{usuario.apellido}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-[#B5B8C5] mb-2 block">Correo electrónico</label>
                  <p className="text-white font-medium bg-[#0A0F2C] rounded-lg px-4 py-3 opacity-60">{usuario.email}</p>
                  <span className="text-xs text-[#B5B8C5] mt-1 block">El email no se puede modificar</span>
                </div>
                <div>
                  <label className="text-sm text-[#B5C8C5] mb-2 block">Teléfono</label>
                  {modoEdicion ? (
                    <input
                      type="text"
                      className="w-full bg-[#0A0F2C] border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                      value={usuario.telefono}
                      onChange={(e) => setUsuario({ ...usuario, telefono: e.target.value })}
                    />
                  ) : (
                    <p className="text-white font-medium bg-[#0A0F2C] rounded-lg px-4 py-3">{usuario.telefono || 'No registrado'}</p>
                  )}
                </div>
              </div>
            </div>


            <div className="bg-[#10193F] rounded-2xl p-8 shadow-lg border border-cyan-500/10">
              <h3 className="text-2xl font-bold flex items-center gap-3 mb-6">
                <Settings className="text-cyan-400" /> Seguridad y Configuración
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => alert('Funcionalidad pendiente: cambiar contraseña')}
                  className="group flex items-center gap-3 bg-[#0A0F2C] hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 transition-all px-5 py-4 rounded-xl border border-cyan-500/20 hover:border-transparent"
                >
                  <Lock size={20} className="text-cyan-400 group-hover:text-black" />
                  <div className="text-left">
                    <p className="font-semibold group-hover:text-black">Cambiar contraseña</p>
                    <p className="text-xs text-[#B5B8C5] group-hover:text-black/70">Actualiza tu contraseña</p>
                  </div>
                </button>
                <button
                  onClick={() => alert('Funcionalidad pendiente: preferencias')}
                  className="group flex items-center gap-3 bg-[#0A0F2C] hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 transition-all px-5 py-4 rounded-xl border border-cyan-500/20 hover:border-transparent"
                >
                  <Settings size={20} className="text-cyan-400 group-hover:text-black" />
                  <div className="text-left">
                    <p className="font-semibold group-hover:text-black">Preferencias</p>
                    <p className="text-xs text-[#B5B8C5] group-hover:text-black/70">Configura tu cuenta</p>
                  </div>
                </button>
              </div>
            </div>


            <div className="bg-[#10193F] rounded-2xl p-8 shadow-lg border border-cyan-500/10">
              <h3 className="text-2xl font-bold flex items-center gap-3 mb-6">
                <ShoppingBag className="text-cyan-400" /> Historial de Compras
              </h3>
              {pedidos.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#0A0F2C] text-[#B5B8C5]">
                      <tr>
                        <th className="px-4 py-3 text-left rounded-tl-lg"># Pedido</th>
                        <th className="px-4 py-3 text-left">Fecha</th>
                        <th className="px-4 py-3 text-left">Estado</th>
                        <th className="px-4 py-3 text-right">Total</th>
                        <th className="px-4 py-3 text-center rounded-tr-lg">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="text-white">
                      {pedidos.map((pedido, index) => (
                        <tr key={`${pedido.id}-${index}`} className="border-t border-cyan-500/10 hover:bg-[#0A0F2C] transition">
                          <td className="px-4 py-4 font-mono text-cyan-400">ORD-{pedido.id}</td>
                          <td className="px-4 py-4 text-[#B5B8C5]">{new Date(pedido.fecha).toLocaleDateString()}</td>
                          <td className="px-4 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getEstadoBadge(pedido.estado)}`}>
                              {pedido.estado}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right font-semibold">${Number(pedido.total).toLocaleString()}</td>
                          <td className="px-4 py-4 text-center">
                            {ESTADOS_CANCELABLES.includes(pedido.estado) ? (
                              <button
                                onClick={() => setCancelModal({ open: true, pedidoId: pedido.id })}
                                className="flex items-center gap-1 mx-auto text-red-400 hover:text-red-300 text-xs font-medium bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-all"
                              >
                                <XCircle size={14} /> Cancelar
                              </button>
                            ) : (
                              <span className="text-gray-600 text-xs">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingBag size={48} className="mx-auto text-[#B5B8C5] mb-4" />
                  <p className="text-[#B5B8C5] text-lg">No tienes compras aún</p>
                  <button
                    onClick={() => router.push('/catalogo')}
                    className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-6 py-2 rounded-full font-semibold hover:opacity-90"
                  >
                    Explorar catálogo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Cancelación */}
      <AnimatePresence>
        {cancelModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#10193F] w-full max-w-md rounded-2xl border border-[#2a3055] overflow-hidden shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                    <AlertTriangle className="text-red-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Cancelar Pedido</h3>
                    <p className="text-sm text-gray-400">Pedido #{cancelModal.pedidoId}</p>
                  </div>
                </div>

                <p className="text-gray-300 mb-4 text-sm">
                  ¿Estás seguro de que deseas cancelar este pedido? Esta acción no se puede deshacer.
                </p>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-3">Motivo de cancelación *</label>
                  <div className="space-y-2">
                    {MOTIVOS_CANCELACION.map((motivo) => (
                      <label
                        key={motivo}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          motivoSeleccionado === motivo
                            ? 'border-red-500 bg-red-500/10'
                            : 'border-[#2a3055] hover:border-red-500/50 bg-[#0A0F2C]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="motivo"
                          value={motivo}
                          checked={motivoSeleccionado === motivo}
                          onChange={() => setMotivoSeleccionado(motivo)}
                          className="accent-red-500"
                        />
                        <span className="text-white text-sm">{motivo}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setCancelModal({ open: false, pedidoId: null });
                      setMotivoSeleccionado('');
                    }}
                    className="flex-1 bg-[#0A0F2C] border border-cyan-500/30 text-cyan-400 py-3 rounded-xl hover:bg-cyan-500/10 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all font-medium"
                  >
                    Volver
                  </button>
                  <button
                    onClick={handleCancelOrder}
                    disabled={!motivoSeleccionado || cancelando}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {cancelando ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <XCircle size={18} />
                    )}
                    {cancelando ? 'Cancelando...' : 'Confirmar Cancelación'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
