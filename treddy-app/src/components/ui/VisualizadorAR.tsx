'use client'
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { ARButton } from "three/examples/jsm/webxr/ARButton.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

interface VisualizadorARProps {
  modelUrl?: string;
}

export default function ARViewer({ modelUrl = "/HORNET.glb" }: VisualizadorARProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const modelRef = useRef<THREE.Group | null>(null)
  
  useEffect(() => {
    // Variables de estado para el seguimiento (fuera del ciclo de renderizado de React)
    let initialDist = 0
    let initialScale = 0.9
    let lastTouchX = 0
    let lastTouchY = 0

    if (!containerRef.current) return
    containerRef.current.innerHTML = ""

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.xr.enabled = true
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    containerRef.current.appendChild(renderer.domElement)

    const arButton = ARButton.createButton(renderer, { requiredFeatures: ["local"] })
    document.body.appendChild(arButton)

    scene.add(new THREE.AmbientLight(0xffffff, 1.2))
    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(2, 4, 5)
    scene.add(dirLight)

    const loader = new GLTFLoader()
    loader.load(modelUrl, (gltf) => {
      modelRef.current = gltf.scene
      modelRef.current.scale.set(0.9, 0.9, 0.9)
      modelRef.current.position.set(0, -0.5, -2)
      scene.add(modelRef.current)
    })

    // --- LÓGICA TÁCTIL AVANZADA ---
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        lastTouchX = e.touches[0].pageX
        lastTouchY = e.touches[0].pageY
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!modelRef.current) return

      // 1. DESPLAZAMIENTO (1 dedo)
      if (e.touches.length === 1) {
        const touchX = e.touches[0].pageX
        const touchY = e.touches[0].pageY

        const deltaX = touchX - lastTouchX
        const deltaY = touchY - lastTouchY

        // Movemos el modelo en los ejes X (lateral) e Y (vertical)
        // El factor 0.005 ajusta la velocidad del movimiento
        modelRef.current.position.x += deltaX * 0.005
        modelRef.current.position.y -= deltaY * 0.005 // Invertido para que siga el dedo

        lastTouchX = touchX
        lastTouchY = touchY
      } 
      
      // 2. ESCALA (2 dedos / Pinch)
      if (e.touches.length === 2) {
        const dX = e.touches[0].pageX - e.touches[1].pageX
        const dY = e.touches[0].pageY - e.touches[1].pageY
        const currentDist = Math.sqrt(dX * dX + dY * dY)

        if (initialDist === 0) {
          initialDist = currentDist
          initialScale = modelRef.current.scale.x
        } else {
          const factor = currentDist / initialDist
          const newScale = Math.max(0.1, initialScale * factor) // Evita escala negativa
          modelRef.current.scale.set(newScale, newScale, newScale)
        }
      }
    }

    const handleTouchEnd = () => {
      initialDist = 0 // Reset de escala
    }

    const canvas = renderer.domElement
    canvas.addEventListener('touchstart', handleTouchStart)
    canvas.addEventListener('touchmove', handleTouchMove)
    canvas.addEventListener('touchend', handleTouchEnd)

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera)
    })

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
      renderer.dispose()
      if (arButton.parentNode) arButton.parentNode.removeChild(arButton)
    }
  }, [modelUrl])

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full bg-black rounded-xl touch-none" 
      style={{ overflow: 'hidden' }}
    />
  )
}