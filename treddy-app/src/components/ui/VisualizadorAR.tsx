'use client'
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { ARButton } from "three/examples/jsm/webxr/ARButton.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { motion } from "framer-motion"
import { Camera, Loader2, Maximize2 } from "lucide-react"

interface VisualizadorARProps {
  modelUrl?: string
}

export default function VisualizadorAR({ modelUrl = "/HORNET.glb" }: VisualizadorARProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const modelRef = useRef<THREE.Group | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const [loading, setLoading] = useState(false)
  const [arSupported, setArSupported] = useState<boolean | null>(null)
  
  // Variables de estado para el seguimiento persistente
  const touchState = useRef({
    initialDist: 0,
    initialScale: 0.9,
    lastTouchX: 0,
    lastTouchY: 0
  })

  useEffect(() => {
    // Verificar soporte de AR
    if (typeof navigator !== 'undefined' && 'xr' in navigator) {
      const nav = navigator as unknown as { xr: { isSessionSupported: (mode: string) => Promise<boolean> } };
      nav.xr.isSessionSupported('immersive-ar').then((supported: boolean) => {
        setArSupported(supported)
      })
    } else {
      setArSupported(false)
    }

    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.xr.enabled = true
    renderer.setPixelRatio(window.devicePixelRatio)
    rendererRef.current = renderer

    scene.add(new THREE.AmbientLight(0xffffff, 1.2))
    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(2, 4, 5)
    scene.add(dirLight)

    const loader = new GLTFLoader()
    setLoading(true)
    loader.load(modelUrl, (gltf) => {
      modelRef.current = gltf.scene
      modelRef.current.scale.set(0.9, 0.9, 0.9)
      modelRef.current.position.set(0, -0.5, -1.5) // Un poco más cerca
      scene.add(modelRef.current)
      setLoading(false)
    }, undefined, (error) => {
      console.error("Error cargando modelo AR:", error)
      setLoading(false)
    })

    // --- LÓGICA TÁCTIL MEJORADA PARA AR ---
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchState.current.lastTouchX = e.touches[0].pageX
        touchState.current.lastTouchY = e.touches[0].pageY
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!modelRef.current) return
      const state = touchState.current

      // 1. DESPLAZAMIENTO (1 dedo)
      if (e.touches.length === 1) {
        const touchX = e.touches[0].pageX
        const touchY = e.touches[0].pageY

        const deltaX = touchX - state.lastTouchX
        const deltaY = touchY - state.lastTouchY

        // Factor ajustado para AR
        modelRef.current.position.x += deltaX * 0.003
        modelRef.current.position.y -= deltaY * 0.003

        state.lastTouchX = touchX
        state.lastTouchY = touchY
      } 
      
      // 2. ESCALA (2 dedos / Pinch)
      if (e.touches.length === 2) {
        const dX = e.touches[0].pageX - e.touches[1].pageX
        const dY = e.touches[0].pageY - e.touches[1].pageY
        const currentDist = Math.sqrt(dX * dX + dY * dY)

        if (state.initialDist === 0) {
          state.initialDist = currentDist
          state.initialScale = modelRef.current.scale.x
        } else {
          const factor = currentDist / state.initialDist
          const newScale = Math.max(0.1, state.initialScale * factor)
          modelRef.current.scale.set(newScale, newScale, newScale)
        }
      }
    }

    const handleTouchEnd = () => {
      touchState.current.initialDist = 0
    }

    const canvas = renderer.domElement
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('touchend', handleTouchEnd)

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera)
    })

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
      renderer.dispose()
    }
  }, [modelUrl])

  const startAR = () => {
    if (!rendererRef.current) return

    // Usamos el helper de Three.js pero configurando dom-overlay
    const arButton = ARButton.createButton(rendererRef.current, { 
      requiredFeatures: ["local"],
      optionalFeatures: ["dom-overlay"],
      domOverlay: { root: document.body }
    })
    
    // Disparamos el clic del botón oculto para iniciar la sesión
    arButton.click()
  }

  if (arSupported === false) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center text-white bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10">
        <Maximize2 size={48} className="text-gray-500 mb-4" />
        <p className="font-semibold">AR no soportado</p>
        <p className="text-xs text-gray-400 mt-2">Tu dispositivo o navegador no admite Realidad Aumentada WebXR.</p>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0F173A] to-[#1a214f] overflow-hidden"
    >
      {/* Círculos decorativos de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
      
      <div className="z-10 flex flex-col items-center gap-6 p-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 animate-pulse" />
          <div className="relative bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-md">
            <Camera size={40} className="text-cyan-400" />
          </div>
        </motion.div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Visualizador AR</h3>
          <p className="text-sm text-cyan-100/60 max-w-[200px]">
            Coloca este modelo en tu espacio real usando tu cámara móvil.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startAR}
          disabled={loading}
          className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl text-black font-bold flex items-center gap-3 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all overflow-hidden disabled:opacity-50"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Cargando...</span>
            </>
          ) : (
            <>
              <Maximize2 size={20} />
              <span className="relative">¡Ver en mi espacio!</span>
            </>
          )}
        </motion.button>

        <p className="text-[10px] uppercase tracking-widest text-cyan-500/50 font-bold">
          Tecnología Treddy AR
        </p>
      </div>
    </div>
  )
}