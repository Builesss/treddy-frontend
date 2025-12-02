/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Nav from '@/pages/nav'
import Footer from '@/pages/footer'

type ParteConfig = {
  color: string
  modo: 'original' | 'teñir' | 'forzar'
}

export default function Personalizador3DIndependiente() {
  const [mostrar3D, setMostrar3D] = useState(false)
  const [animation, setAnimation] = useState<'none' | 'rotate'>('none')
  const [modelUrl, setModelUrl] = useState<string | null>(null)
  const [partes, setPartes] = useState<Record<string, ParteConfig>>({})
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const modelRef = useRef<THREE.Object3D | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setModelUrl(url)
    setMostrar3D(true)
  }

  useEffect(() => {
    if (!mostrar3D || !canvasRef.current) return

    const width = canvasRef.current.clientWidth
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

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5)
    scene.add(hemiLight)
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
    dirLight.position.set(5, 10, 7.5)
    scene.add(dirLight)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enablePan = true
    controlsRef.current = controls

    const loader = new GLTFLoader()
    if (modelUrl) {
      loader.load(
        modelUrl,
        (gltf) => {
          if (modelRef.current) scene.remove(modelRef.current)
          modelRef.current = gltf.scene

          const box = new THREE.Box3().setFromObject(modelRef.current)
          const size = box.getSize(new THREE.Vector3()).length()
          const scaleFactor = 2 / size
          modelRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor)
          modelRef.current.position.set(0, -0.5, 0)

          const nuevasPartes: Record<string, ParteConfig> = {}
          let idx = 0
          modelRef.current.traverse((child: any) => {
            if (child.isMesh) {
              const baseName = child.name || `Parte_${++idx}`

              if (!Array.isArray(child.material)) {
                const colorHex = "#" + child.material.color.getHexString()
                nuevasPartes[baseName] = { color: colorHex, modo: 'original' }
              } else {
                child.material.forEach((mat: any, i: number) => {
                  if (mat.color) {
                    const colorHex = "#" + mat.color.getHexString()
                    nuevasPartes[`${baseName}_Mat${i}`] = { color: colorHex, modo: 'original' }
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

  const updateParte = (parte: string, config: Partial<ParteConfig>) => {
    setPartes((prev) => {
      const updated = { ...prev, [parte]: { ...prev[parte], ...config } }

      if (modelRef.current) {
        let idx = 0
        modelRef.current.traverse((child: any) => {
          if (child.isMesh) {
            const baseName = child.name || `Parte_${++idx}`

            if (!Array.isArray(child.material)) {
              if (parte === baseName) {
                aplicarModo(child, updated[parte])
              }
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

    if (config.modo === 'original') {
      mesh.material.color.set(config.color)
    } else if (config.modo === 'teñir') {
      if (mesh.material.map) {
        mesh.material.color.set(config.color)
      } else {
        mesh.material.color.set(config.color)
      }
    } else if (config.modo === 'forzar') {
      mesh.material = new THREE.MeshStandardMaterial({
        color: config.color,
        metalness: 0.2,
        roughness: 0.8,
      })
    }
  }

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

  return (
    <>
      <Nav />
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#0A0F2C] relative overflow-hidden py-20 -mb-20">


        <div className="z-10 w-full max-w-7xl px-4 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2 tracking-tight text-center">
            Personalizador 3D
          </h1>
          <p className="text-[#B5B8C5] mb-10 text-center max-w-2xl text-lg">
            Diseña y visualiza tu estilo único con nuestra herramienta de personalización en tiempo real.
          </p>

          <div className="flex flex-col lg:flex-row w-full gap-8">

            <div className="w-full lg:w-1/3 flex flex-col gap-6">
              <div className="bg-[#10193F] border border-cyan-500/10 p-6 rounded-3xl shadow-2xl flex flex-col gap-6 h-full max-h-[750px] overflow-y-auto custom-scrollbar">


                <div className="space-y-3">
                  <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    Animación
                  </h2>
                  <div className="relative">
                    <select
                      className="w-full p-4 rounded-xl bg-[#0A0F2C] text-white border border-cyan-500/30 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 outline-none appearance-none transition-all cursor-pointer hover:bg-[#0F173A]"
                      value={animation}
                      onChange={(e) => setAnimation(e.target.value as 'none' | 'rotate')}
                    >
                      <option value="none">Estatica</option>
                      <option value="rotate">Rotación 360°</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>


                <div className="space-y-4 flex-1">
                  <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2 top-0 bg-[#10193F]/95 backdrop-blur-sm py-2 z-10">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    Personalización
                  </h2>

                  <div className="flex flex-col gap-3">
                    {Object.keys(partes).length === 0 && (
                      <div className="text-center py-10 text-[#B5B8C5] italic border-2 border-dashed border-cyan-500/20 rounded-xl">
                        Carga un modelo para ver sus partes
                      </div>
                    )}
                    {Object.entries(partes).map(([parte, { color, modo }]) => (
                      <div key={parte} className="group bg-[#0A0F2C] hover:bg-[#0F173A] border border-cyan-500/10 hover:border-cyan-500/30 p-4 rounded-2xl transition-all duration-300 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-medium text-[#B5B8C5] truncate max-w-[150px]" title={parte}>{parte}</span>
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
                            <option value="forzar">Forzar</option>
                          </select>
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#B5B8C5]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>


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
                        className="w-full py-4 bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white hover:bg-gradient-to-r from-cyan-500 to-blue-500 hover:text-black font-bold rounded-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Exportar Diseño
                      </button>
                      <button
                        onClick={() => alert("¡Gracias por tu interés! La función de compra estará disponible pronto.")}
                        className="w-full py-4 bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white hover:bg-gradient-to-r from-cyan-500 to-blue-500 hover:text-black font-bold rounded-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 001-1l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                        </svg>
                        Comprar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>


            <div className="w-full lg:w-2/3 flex flex-col">
              <div className="relative w-full h-[500px] lg:h-[750px] bg-[#10193F] rounded-3xl border border-cyan-500/10 shadow-2xl overflow-hidden group">

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
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span> Click + Arrastrar para rotar</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Scroll para zoom</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
