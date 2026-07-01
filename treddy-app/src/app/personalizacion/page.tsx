/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Nav from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Swal from 'sweetalert2'

// ─── Constantes de precio ───────────────────────────────────────────────────
const PRECIO_POR_COLOR = 2_000   // +$2.000 por cada parte con color modificado
const PRECIO_POR_TAMAÑO = 10_000  // +$10.000 si se elige un tamaño diferente al base

type ParteConfig = {
  color: string
  colorOriginal: string  // para detectar si fue modificado
  modo: 'original' | 'teñir' | 'forzar'
}

type Tamano = 'pequeño' | 'mediano' | 'grande'

const TAMANOS: { value: Tamano; label: string; desc: string }[] = [
  { value: 'pequeño', label: 'Pequeño', desc: '~10 cm' },
  { value: 'mediano', label: 'Mediano', desc: '~20 cm (base)' },
  { value: 'grande',  label: 'Grande',  desc: '~30 cm+' },
]

function ensureSessionId() {
  let sid = localStorage.getItem('sessionId')
  if (!sid) {
    sid = crypto.randomUUID()
    localStorage.setItem('sessionId', sid)
  }
  return sid
}

export default function Personalizador3DIndependiente() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0F2C] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-cyan-400 font-medium animate-pulse">Cargando personalizador...</p>
        </div>
      </div>
    }>
      <CustomizerContent />
    </Suspense>
  )
}

function CustomizerContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // ─── Params desde la URL ─────────────────────────────────────────────────
  const initialModelUrl  = searchParams.get('modelUrl')
  const productoId       = searchParams.get('productoId')
  const precioBaseParam  = searchParams.get('precioBase')
  const nombreProducto   = searchParams.get('nombreProducto') || 'Producto'
  const precioBase       = precioBaseParam ? Number(precioBaseParam) : 0

  // ─── Estado ─────────────────────────────────────────────────────────────
  const [mostrar3D, setMostrar3D] = useState(false)
  const [animation, setAnimation] = useState<'none' | 'rotate'>('none')
  const [modelUrl, setModelUrl] = useState<string | null>(null)
  const [partes, setPartes] = useState<Record<string, ParteConfig>>({})
  const [tamano, setTamano] = useState<Tamano>('mediano')
  const [agregando, setAgregando] = useState(false)

  const canvasRef    = useRef<HTMLDivElement | null>(null)
  const modelRef     = useRef<THREE.Object3D | null>(null)
  const rendererRef  = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef     = useRef<THREE.Scene | null>(null)
  const cameraRef    = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef  = useRef<OrbitControls | null>(null)

  // ─── Cálculo dinámico de precio ─────────────────────────────────────────
  const partesModificadas = Object.values(partes).filter(
    (p) => p.color !== p.colorOriginal
  ).length

  const recargoPorColores = partesModificadas * PRECIO_POR_COLOR
  const recargoPorTamano  = tamano !== 'mediano' ? PRECIO_POR_TAMAÑO : 0
  const precioFinal       = precioBase + recargoPorColores + recargoPorTamano

  // ─── Cargar modelo desde URL inicial ────────────────────────────────────
  useEffect(() => {
    if (initialModelUrl) {
      setModelUrl(decodeURIComponent(initialModelUrl))
      setMostrar3D(true)
    }
  }, [initialModelUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setModelUrl(url)
    setMostrar3D(true)
  }

  // ─── Inicializar Three.js ────────────────────────────────────────────────
  useEffect(() => {
    if (!mostrar3D || !canvasRef.current) return

    const width  = canvasRef.current.clientWidth
    const height = canvasRef.current.clientHeight

    if (rendererRef.current) {
      rendererRef.current.dispose()
      if (rendererRef.current.domElement.parentElement) {
        rendererRef.current.domElement.parentElement.removeChild(rendererRef.current.domElement)
      }
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    canvasRef.current.innerHTML = ''
    canvasRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a1522)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 100)
    camera.position.set(0, 1, 5)
    cameraRef.current = camera

    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.5))
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
    dirLight.position.set(5, 10, 7.5)
    scene.add(dirLight)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping  = true
    controls.dampingFactor  = 0.05
    controls.enablePan      = true
    controlsRef.current = controls

    const loader = new GLTFLoader()
    if (modelUrl) {
      loader.load(
        modelUrl,
        (gltf) => {
          if (modelRef.current) scene.remove(modelRef.current)
          modelRef.current = gltf.scene

          const box        = new THREE.Box3().setFromObject(modelRef.current)
          const size       = box.getSize(new THREE.Vector3()).length()
          const scaleFactor = 2 / size
          modelRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor)
          modelRef.current.position.set(0, -0.5, 0)

          const nuevasPartes: Record<string, ParteConfig> = {}
          let idx = 0
          modelRef.current.traverse((child: any) => {
            if (child.isMesh) {
              const baseName = child.name || `Parte_${++idx}`
              if (!Array.isArray(child.material)) {
                const colorHex = '#' + child.material.color.getHexString()
                nuevasPartes[baseName] = { color: colorHex, colorOriginal: colorHex, modo: 'original' }
              } else {
                child.material.forEach((mat: any, i: number) => {
                  if (mat.color) {
                    const colorHex = '#' + mat.color.getHexString()
                    nuevasPartes[`${baseName}_Mat${i}`] = { color: colorHex, colorOriginal: colorHex, modo: 'original' }
                  }
                })
              }
            }
          })
          setPartes(nuevasPartes)
          scene.add(modelRef.current)
        },
        undefined,
        (err) => console.error('Error cargando GLB:', err)
      )
    }

    const animate = () => {
      renderer.setAnimationLoop(() => {
        if (modelRef.current && animation === 'rotate') {
          modelRef.current.rotation.y += 0.01
        }
        controls.update()
        renderer.render(scene, camera)
      })
    }
    animate()

    return () => {
      renderer.setAnimationLoop(null)
      renderer.dispose()
      controls.dispose()
      if (modelRef.current) {
        scene.remove(modelRef.current)
        modelRef.current = null
      }
    }
  }, [mostrar3D, animation, modelUrl])

  // ─── Actualizar parte y aplicar color en Three.js ───────────────────────
  const updateParte = (parte: string, config: Partial<ParteConfig>) => {
    setPartes((prev) => {
      const updated = { ...prev, [parte]: { ...prev[parte], ...config } }

      if (modelRef.current) {
        let idx = 0
        modelRef.current.traverse((child: any) => {
          if (child.isMesh) {
            const baseName = child.name || `Parte_${++idx}`
            if (!Array.isArray(child.material)) {
              if (parte === baseName) aplicarModo(child, updated[parte])
            } else {
              child.material.forEach((mat: any, i: number) => {
                if (parte === `${baseName}_Mat${i}`) {
                  aplicarModo({ material: mat }, updated[parte])
                }
              })
            }
          }
        })
      }
      return updated
    })
  }

  const aplicarModo = (mesh: any, config: ParteConfig) => {
    if (!mesh.material) return
    if (config.modo === 'forzar') {
      mesh.material = new THREE.MeshStandardMaterial({
        color: config.color,
        metalness: 0.2,
        roughness: 0.8,
      })
    } else {
      mesh.material.color.set(config.color)
    }
  }

  // ─── Exportar modelo ─────────────────────────────────────────────────────
  const handleExport = () => {
    if (!modelRef.current) return
    const exporter = new GLTFExporter()
    exporter.parse(
      modelRef.current,
      (result) => {
        const output = result instanceof ArrayBuffer
          ? new Blob([result], { type: 'model/gltf-binary' })
          : new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(output)
        link.download = 'modelo_modificado.glb'
        link.click()
      },
      { binary: true } as any
    )
  }

  // ─── Agregar al carrito con precio personalizado ─────────────────────────
  const handleComprar = async () => {
    if (!productoId) {
      Swal.fire({
        title: 'Producto no identificado',
        text: 'Accede al personalizador desde el catálogo.',
        icon: 'warning',
        confirmButtonColor: '#00E6F6',
        background: '#0F173A',
        color: 'white',
      })
      return
    }

    try {
      setAgregando(true)
      const sessionId = ensureSessionId()
      const apiUrl    = process.env.NEXT_PUBLIC_API_URL || 'https://treddy-backend.onrender.com'

      const res = await fetch(`${apiUrl}/api/cart/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          productoId: Number(productoId),
          cantidad: 1,
          precioPersonalizado: precioFinal,
        }),
      })

      if (!res.ok) throw new Error('No se pudo agregar al carrito')

      await Swal.fire({
        icon: 'success',
        title: '¡Agregado al carrito!',
        html: `
          <p style="color:#B5B8C5;margin-bottom:8px">${nombreProducto}</p>
          <p style="color:#00E6F6;font-size:1.4rem;font-weight:bold">$${precioFinal.toLocaleString('es-CO')}</p>
          ${partesModificadas > 0 ? `<p style="color:#6b7280;font-size:0.8rem">+${partesModificadas} color${partesModificadas > 1 ? 'es' : ''} personalizado${partesModificadas > 1 ? 's' : ''}</p>` : ''}
          ${tamano !== 'mediano' ? `<p style="color:#6b7280;font-size:0.8rem">Tamaño: ${tamano}</p>` : ''}
        `,
        showCancelButton: true,
        confirmButtonText: 'Ir al carrito',
        cancelButtonText: 'Seguir comprando',
        confirmButtonColor: '#00E6F6',
        background: '#0F173A',
        color: 'white',
        customClass: { popup: 'rounded-2xl border border-cyan-500/30' },
      }).then((result) => {
        if (result.isConfirmed) router.push('/carrito-compras')
      })
    } catch (e) {
      console.error('Error agregando al carrito:', e)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo agregar al carrito. Intenta de nuevo.',
        confirmButtonColor: '#00E6F6',
        background: '#0F173A',
        color: 'white',
      })
    } finally {
      setAgregando(false)
    }
  }

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <>
      <Nav />
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#0A0F2C] relative overflow-hidden py-20 -mb-20">

        <div className="z-10 w-full max-w-7xl px-4 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-5 tracking-tight text-center">
            Personalizador 3D
          </h1>
          <p className="text-[#B5B8C5] mb-15 text-center max-w-2xl text-lg">
            Diseña y visualiza tu estilo único. El precio se actualiza en tiempo real según tus personalizaciones.
          </p>

          {/* Banner de precio dinámico */}
          {precioBase > 0 && (
            <div className="mb-8 w-full max-w-2xl bg-[#10193F]/80 border border-cyan-500/30 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-[#B5B8C5] uppercase tracking-wider mb-1">Precio actual</p>
                  <p className="text-3xl font-black text-cyan-400">
                    ${precioFinal.toLocaleString('es-CO')}
                  </p>
                  {precioFinal !== precioBase && (
                    <p className="text-xs text-gray-500 line-through">${precioBase.toLocaleString('es-CO')} precio base</p>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-right text-xs">
                  {partesModificadas > 0 && (
                    <span className="text-cyan-400/80">
                      +${recargoPorColores.toLocaleString('es-CO')} ({partesModificadas} color{partesModificadas > 1 ? 'es' : ''})
                    </span>
                  )}
                  {tamano !== 'mediano' && (
                    <span className="text-blue-400/80">
                      +${recargoPorTamano.toLocaleString('es-CO')} (tamaño {tamano})
                    </span>
                  )}
                  {partesModificadas === 0 && tamano === 'mediano' && (
                    <span className="text-gray-500">Sin personalizaciones aún</span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row w-full gap-8">

            {/* Panel de controles */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6">
              <div className="bg-[#10193F] border border-cyan-500/10 p-6 rounded-3xl shadow-2xl flex flex-col gap-6 h-full max-h-[750px] overflow-y-auto custom-scrollbar">

                {/* Animación */}
                <div className="space-y-3">
                  <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    Animación
                  </h2>
                  <div className="relative">
                    <select
                      className="w-full p-4 rounded-xl bg-[#0A0F2C] text-white border border-cyan-500/30 focus:border-cyan-500 outline-none appearance-none cursor-pointer hover:bg-[#0F173A] transition-all"
                      value={animation}
                      onChange={(e) => setAnimation(e.target.value as 'none' | 'rotate')}
                    >
                      <option value="none">Estática</option>
                      <option value="rotate">Rotación 360°</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Selector de tamaño */}
                <div className="space-y-3">
                  <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    Tamaño
                    {tamano !== 'mediano' && (
                      <span className="ml-auto text-xs font-normal text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">
                        +${PRECIO_POR_TAMAÑO.toLocaleString('es-CO')}
                      </span>
                    )}
                  </h2>
                  <div className="grid grid-cols-3 gap-2">
                    {TAMANOS.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setTamano(t.value)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                          tamano === t.value
                            ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                            : 'border-cyan-500/20 bg-[#0A0F2C] text-[#B5B8C5] hover:border-cyan-500/50'
                        }`}
                      >
                        <span className="font-bold text-sm">{t.label}</span>
                        <span className="text-[10px] opacity-70 mt-0.5">{t.desc}</span>
                        {t.value === 'mediano' && (
                          <span className="text-[9px] text-gray-500 mt-0.5">Base</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Personalización de colores */}
                <div className="space-y-4 flex-1">
                  <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2 bg-[#10193F]/95 backdrop-blur-sm py-2 z-10">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    Colores por pieza
                    {partesModificadas > 0 && (
                      <span className="ml-auto text-xs font-normal text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full">
                        +${recargoPorColores.toLocaleString('es-CO')}
                      </span>
                    )}
                  </h2>

                  <div className="flex flex-col gap-3">
                    {Object.keys(partes).length === 0 && (
                      <div className="text-center py-10 text-[#B5B8C5] italic border-2 border-dashed border-cyan-500/20 rounded-xl">
                        Carga un modelo para ver sus partes
                      </div>
                    )}
                    {Object.entries(partes).map(([parte, { color, colorOriginal, modo }]) => {
                      const estaModificado = color !== colorOriginal
                      return (
                        <div key={parte} className={`group bg-[#0A0F2C] hover:bg-[#0F173A] border p-4 rounded-2xl transition-all duration-300 shadow-sm ${estaModificado ? 'border-cyan-500/40' : 'border-cyan-500/10 hover:border-cyan-500/30'}`}>
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-[#B5B8C5] truncate max-w-[120px]" title={parte}>{parte}</span>
                              {estaModificado && (
                                <span className="text-[10px] text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded-full">
                                  +$15.000
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white/20 shadow-inner cursor-pointer hover:scale-110 transition-transform">
                                <input
                                  type="color"
                                  value={color}
                                  onChange={(e) => updateParte(parte, { color: e.target.value })}
                                  className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 border-0"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="relative">
                            <select
                              value={modo}
                              onChange={(e) => updateParte(parte, { modo: e.target.value as ParteConfig['modo'] })}
                              className="w-full text-xs p-2 pl-3 rounded-lg bg-[#10193F] text-[#B5B8C5] border border-cyan-500/20 focus:border-cyan-500 outline-none appearance-none cursor-pointer"
                            >
                              <option value="original">Original</option>
                              <option value="teñir">Teñir</option>
                              <option value="forzar">Forzar color</option>
                            </select>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#B5B8C5]">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Acciones */}
                <div className="pt-4 border-t border-cyan-500/20 space-y-4">
                  <label className="block w-full group cursor-pointer">
                    <div className="flex items-center justify-center w-full h-14 px-4 transition bg-[#0A0F2C] border-2 border-dashed border-cyan-500/30 rounded-xl group-hover:border-cyan-500 group-hover:bg-[#0F173A]">
                      <div className="flex items-center space-x-2 text-[#B5B8C5] group-hover:text-cyan-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="font-medium text-sm">Cargar modelo GLB</span>
                      </div>
                      <input type="file" accept=".glb" onChange={handleFileChange} className="hidden" />
                    </div>
                  </label>

                  {modelUrl && (
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={handleExport}
                        className="w-full py-3 bg-[#0A0F2C] border border-cyan-500/30 hover:border-cyan-500 text-white hover:text-cyan-400 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Exportar diseño
                      </button>

                      <button
                        onClick={handleComprar}
                        disabled={agregando || !productoId}
                        className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-xl transform hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        {agregando ? (
                          <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            Agregando...
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                              <path d="M16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                            </svg>
                            Agregar al carrito · ${precioFinal.toLocaleString('es-CO')}
                          </>
                        )}
                      </button>

                      {!productoId && (
                        <p className="text-xs text-yellow-400/70 text-center">
                          Accede desde el catálogo para poder comprar.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Visor 3D */}
            <div className="w-full lg:w-2/3 flex flex-col">
              <div className="relative w-full h-[500px] lg:h-[750px] bg-[#10193F] rounded-3xl border border-cyan-500/10 shadow-2xl overflow-hidden">

                {!mostrar3D ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#0A0F2C] backdrop-blur-sm transition-opacity duration-500">
                    <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 flex items-center justify-center animate-pulse">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                      </svg>
                    </div>
                    <button
                      onClick={() => setMostrar3D(true)}
                      className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                    >
                      Iniciar Visualizador 3D
                    </button>
                  </div>
                ) : (
                  <div className="absolute top-4 right-4 z-20">
                    <button
                      onClick={() => setMostrar3D(false)}
                      className="p-2 bg-black/50 hover:bg-red-500/80 text-white rounded-full backdrop-blur-md transition-colors"
                      title="Cerrar visualizador"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}

                <div
                  ref={canvasRef}
                  className={`w-full h-full transition-opacity duration-700 ${mostrar3D ? 'opacity-100' : 'opacity-0'}`}
                />

                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0A0F2C] via-transparent to-transparent opacity-60" />
              </div>

              <div className="mt-4 flex justify-center gap-4 text-[#B5B8C5] text-sm">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Click + Arrastrar para rotar</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Scroll para zoom</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
