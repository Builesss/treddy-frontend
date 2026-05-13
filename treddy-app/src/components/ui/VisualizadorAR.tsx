'use client'

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { ARButton } from "three/examples/jsm/webxr/ARButton.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

// --- Interfaces ---
interface VisualizadorARProps {
  modelUrl?: string;
}

/**
 * Componente ARViewer
 * Visualiza un modelo 3D (GLB) en Realidad Aumentada con soporte para gestos.
 */
export default function ARViewer({ modelUrl = "/HORNET.glb" }: VisualizadorARProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const modelRef = useRef<THREE.Group | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // --- 1. Variables de estado para gestos ---
    let initialDist = 0
    let initialScale = 0.9
    let lastTouchX = 0
    let lastTouchY = 0

    // Limpiar contenedor previo
    containerRef.current.innerHTML = ""

    // --- 2. Configuración Base de Three.js ---
    const scene = new THREE.Scene()
    
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    )

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    })
    
    renderer.xr.enabled = true
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    containerRef.current.appendChild(renderer.domElement)

    // Botón de AR
    const arButton = ARButton.createButton(renderer, { 
      requiredFeatures: ["local"] 
    })
    document.body.appendChild(arButton)

    // --- 3. Iluminación ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(2, 4, 5)
    scene.add(dirLight)

    // --- 4. Carga del Modelo ---
    const loader = new GLTFLoader()
    loader.load(modelUrl, (gltf) => {
      modelRef.current = gltf.scene
      modelRef.current.scale.set(0.9, 0.9, 0.9)
      modelRef.current.position.set(0, -0.5, -2) // Posición inicial frente al usuario
      scene.add(modelRef.current)
    })

    // --- 5. Lógica Táctil Avanzada ---
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        lastTouchX = e.touches[0].pageX
        lastTouchY = e.touches[0].pageY
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!modelRef.current) return

      // A. DESPLAZAMIENTO (1 dedo)
      if (e.touches.length === 1) {
        const touchX = e.touches[0].pageX
        const touchY = e.touches[0].pageY

        const deltaX = touchX - lastTouchX
        const deltaY = touchY - lastTouchY

        modelRef.current.position.x += deltaX * 0.005
        modelRef.current.position.y -= deltaY * 0.005 // Sigue el dedo
        
        lastTouchX = touchX
        lastTouchY = touchY
      }

      // B. ESCALA / PINCH (2 dedos)
      if (e.touches.length === 2) {
        const dX = e.touches[0].pageX - e.touches[1].pageX
        const dY = e.touches[0].pageY - e.touches[1].pageY
        const currentDist = Math.sqrt(dX * dX + dY * dY)

        if (initialDist === 0) {
          initialDist = currentDist
          initialScale = modelRef.current.scale.x
        } else {
          const factor = currentDist / initialDist
          const newScale = Math.max(0.1, initialScale * factor)
          modelRef.current.scale.set(newScale, newScale, newScale)
        }
      }
    }

    const handleTouchEnd = () => {
      initialDist = 0 // Resetear factor de escala para el siguiente pinch
    }

    // --- 6. Event Listeners y Loop ---
    const canvas = renderer.domElement
    canvas.addEventListener('touchstart', handleTouchStart)
    canvas.addEventListener('touchmove', handleTouchMove)
    canvas.addEventListener('touchend', handleTouchEnd)

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera)
    })

    // --- 7. Cleanup (Limpieza al desmontar) ---
    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
      
      renderer.dispose()
      if (arButton.parentNode) {
        arButton.parentNode.removeChild(arButton)
      }
    }
  }, [modelUrl])

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-black rounded-xl touch-none"
      style={{ overflow: 'hidden', position: 'relative' }}
    />
  )
}