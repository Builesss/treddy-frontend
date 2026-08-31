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
    if (!containerRef.current) return
    const container = containerRef.current

    let initialDist = 0
    let initialScale = 0.9
    let lastTouchX = 0
    let lastTouchY = 0

    // Limpieza
    container.innerHTML = ""

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.xr.enabled = true
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)


    // dom-overlay es la feature que le permite al navegador mantener
    // `container` como una capa del DOM visible e interactiva por encima
    // del feed de cámara durante la sesión immersive-ar. Sin esto, el
    // navegador deja de despachar touchstart/touchmove/touchend al DOM
    // en cuanto arranca AR, y por eso los handlers de rotación/escala
    // dejaban de funcionar.
    const arButton = ARButton.createButton(renderer, {
      requiredFeatures: ["local"],
      optionalFeatures: ["dom-overlay"],
      domOverlay: { root: container },
    })

    // Fija el botón AR a una posición constante del VIEWPORT (no de la
    // página). Por defecto Three.js lo crea con `position: absolute`,
    // que se ancla al documento y se desplaza si el fondo detrás del
    // modal hace scroll. Con `position: fixed` queda siempre en el
    // mismo lugar en pantalla, sin importar el scroll, y totalmente
    // funcional (no se toca pointer-events ni opacidad).
    arButton.style.position = 'fixed'
    arButton.style.bottom = '24px'
    arButton.style.left = '50%'
    arButton.style.transform = 'translateX(-50%)'
    arButton.style.zIndex = '99999'

    document.body.appendChild(arButton)

    scene.add(new THREE.AmbientLight(0xffffff, 1.5))
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

    // --- Handlers con detención de propagación ---
    const handleTouchStart = (e: TouchEvent) => {
      e.stopPropagation() // Evita que el modal/scroll reaccione
      if (e.touches.length === 1) {
        lastTouchX = e.touches[0].pageX
        lastTouchY = e.touches[0].pageY
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault() // Bloquea el scroll del móvil
      e.stopPropagation()

      if (!modelRef.current) return

      if (e.touches.length === 1) {
        const touchX = e.touches[0].pageX
        const touchY = e.touches[0].pageY
        const deltaX = touchX - lastTouchX
        const deltaY = touchY - lastTouchY

        // Rotación en lugar de posición para mejor experiencia 3D
        modelRef.current.rotation.y += deltaX * 0.01
        modelRef.current.rotation.x += deltaY * 0.01

        lastTouchX = touchX
        lastTouchY = touchY
      }

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
      initialDist = 0
    }

    // Registrar en el canvas (renderer.domElement) y en el contenedor
    // El canvas queda por encima en modo AR y captura todos los eventos primero
    const canvas = renderer.domElement
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('touchend', handleTouchEnd)
    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd)

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera)
    })

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
      renderer.dispose()
      if (arButton.parentNode) document.body.removeChild(arButton)
    }
  }, [modelUrl])

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-black/20 rounded-xl"
      style={{
        touchAction: 'none', // ESTO ES VITAL
        position: 'relative',
        overflow: 'hidden',
        zIndex: 100 // Asegura que esté por encima de cualquier scroll del modal
      }}
    />
  )
}