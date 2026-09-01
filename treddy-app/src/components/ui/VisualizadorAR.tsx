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
  // Dimensiones "base" del modelo (ancho, alto, profundo) en metros, medidas
  // ANTES de aplicar cualquier escala. Sirven para calcular el tamaño real
  // multiplicando por la escala actual, sin que la rotación distorsione la medición
  // (el bounding box world-space cambia con la rotación, por eso NO lo usamos en vivo).
  const baseSizeRef = useRef<THREE.Vector3>(new THREE.Vector3())

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current

    let initialDist = 0
    let initialScale = 0.9
    let lastTouchX = 0
    let lastTouchY = 0
    // Punto medio entre los 2 dedos, usado para mover (pan) el modelo
    let lastMidX = 0
    let lastMidY = 0

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

    // --- Etiqueta de tamaño (cm) ---
    // Vive DENTRO de `container`, que es el root del dom-overlay, así que
    // también se ve superpuesta a la cámara durante la sesión AR.
    const sizeLabel = document.createElement('div')
    sizeLabel.style.position = 'absolute'
    sizeLabel.style.top = '12px'
    sizeLabel.style.left = '50%'
    sizeLabel.style.transform = 'translateX(-50%)'
    sizeLabel.style.background = 'rgba(0,0,0,0.6)'
    sizeLabel.style.color = '#fff'
    sizeLabel.style.padding = '4px 10px'
    sizeLabel.style.borderRadius = '8px'
    sizeLabel.style.fontSize = '12px'
    sizeLabel.style.fontFamily = 'sans-serif'
    sizeLabel.style.pointerEvents = 'none' // no debe interferir con los gestos táctiles
    sizeLabel.style.zIndex = '10'
    sizeLabel.style.whiteSpace = 'nowrap'
    container.appendChild(sizeLabel)

    // Recalcula el texto de tamaño en base a baseSizeRef * escala actual del modelo
    const updateSizeLabel = () => {
      if (!modelRef.current) return
      const scale = modelRef.current.scale.x
      const w = baseSizeRef.current.x * scale * 100
      const h = baseSizeRef.current.y * scale * 100
      const d = baseSizeRef.current.z * scale * 100
      sizeLabel.textContent = `${w.toFixed(1)} × ${h.toFixed(1)} × ${d.toFixed(1)} cm`
    }

    scene.add(new THREE.AmbientLight(0xffffff, 1.5))
    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(2, 4, 5)
    scene.add(dirLight)

    const loader = new GLTFLoader()
    loader.load(modelUrl, (gltf) => {
      modelRef.current = gltf.scene

      // Medimos el modelo ANTES de aplicar nuestra escala inicial (0.9),
      // así baseSizeRef queda en "unidades reales" del .glb (metros).
      const box = new THREE.Box3().setFromObject(modelRef.current)
      box.getSize(baseSizeRef.current)

      modelRef.current.scale.set(0.9, 0.9, 0.9)
      modelRef.current.position.set(0, -0.5, -2)
      scene.add(modelRef.current)

      updateSizeLabel()
    })

    // --- Handlers con detención de propagación ---
    const handleTouchStart = (e: TouchEvent) => {
      e.stopPropagation() // Evita que el modal/scroll reaccione
      if (e.touches.length === 1) {
        lastTouchX = e.touches[0].pageX
        lastTouchY = e.touches[0].pageY
      }
      if (e.touches.length === 2) {
        // Fuerza que el próximo touchmove recalcule la distancia y el punto
        // medio de referencia, evitando saltos al pasar de 1 a 2 dedos.
        initialDist = 0
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

        // Mover (pan) con 1 dedo
        const moveSensitivity = 0.003
        const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0)
        const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1)

        modelRef.current.position.addScaledVector(right, deltaX * moveSensitivity)
        modelRef.current.position.addScaledVector(up, -deltaY * moveSensitivity)

        lastTouchX = touchX
        lastTouchY = touchY
      }

      if (e.touches.length === 2) {
        const t0 = e.touches[0]
        const t1 = e.touches[1]
        const dX = t0.pageX - t1.pageX
        const dY = t0.pageY - t1.pageY
        const currentDist = Math.sqrt(dX * dX + dY * dY)
        const midX = (t0.pageX + t1.pageX) / 2
        const midY = (t0.pageY + t1.pageY) / 2

        if (initialDist === 0) {
          // Primer frame del gesto: solo fijamos referencias, sin mover nada aún
          initialDist = currentDist
          initialScale = modelRef.current.scale.x
          lastMidX = midX
          lastMidY = midY
        } else {
          // Escala (pinch)
          const factor = currentDist / initialDist
          const newScale = Math.max(0.1, initialScale * factor)
          modelRef.current.scale.set(newScale, newScale, newScale)
          updateSizeLabel()

          // Rotación con 2 dedos basada en el movimiento del punto medio
          const deltaMidX = midX - lastMidX
          const deltaMidY = midY - lastMidY

          modelRef.current.rotation.y += deltaMidX * 0.01
          modelRef.current.rotation.x += deltaMidY * 0.01

          lastMidX = midX
          lastMidY = midY
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
      if (sizeLabel.parentNode) sizeLabel.parentNode.removeChild(sizeLabel)
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