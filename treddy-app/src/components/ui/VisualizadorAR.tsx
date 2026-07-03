'use client'

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { ARButton } from "three/examples/jsm/webxr/ARButton.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import Swal from "sweetalert2"

interface VisualizadorARProps {
  modelUrl?: string;
}

export default function ARViewer({ modelUrl = "/HORNET.glb" }: VisualizadorARProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Referencias mutables para mantener el estado sin re-renders
  const modelRef = useRef<THREE.Group | null>(null)
  const reticleRef = useRef<THREE.Mesh | null>(null)
  const isPlacedRef = useRef(false)

  useEffect(() => {
    // --------------------------------------------------------
    // 1. VERIFICACIÓN DE SOPORTE IOS
    // --------------------------------------------------------
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    
    if (isIOS) {
      Swal.fire({
        title: 'Dispositivo iOS detectado',
        html: `Apple Safari <b>no soporta WebXR</b> nativamente.<br/><br/>Para ver AR en iPhone se requiere que el modelo esté en formato <code>.usdz</code> y usar AR Quick Look. Esta versión está optimizada para Android.`,
        icon: 'info',
        confirmButtonColor: '#00E6F6',
        background: '#0F173A',
        color: 'white'
      })
    }

    if (!containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ""

    // --------------------------------------------------------
    // 2. CONFIGURACIÓN BÁSICA DE THREE.JS
    // --------------------------------------------------------
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 20)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.xr.enabled = true
    container.appendChild(renderer.domElement)

    // Luces
    scene.add(new THREE.AmbientLight(0xffffff, 1))
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5)
    dirLight.position.set(2, 4, 5)
    scene.add(dirLight)

    // --------------------------------------------------------
    // 3. CARGAR MODELO
    // --------------------------------------------------------
    const loader = new GLTFLoader()
    loader.load(modelUrl, (gltf) => {
      const model = gltf.scene
      // Normalizar tamaño
      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3()).length()
      const scaleFactor = 0.5 / size // Escalar para que mida aprox 50cm
      model.scale.set(scaleFactor, scaleFactor, scaleFactor)
      
      model.visible = false // Oculto hasta que se coloque
      modelRef.current = model
      scene.add(model)
    })

    // --------------------------------------------------------
    // 4. RETÍCULA (Indicador de superficie)
    // --------------------------------------------------------
    const ringGeo = new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2)
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00E6F6, transparent: true, opacity: 0.8 })
    const reticle = new THREE.Mesh(ringGeo, ringMat)
    reticle.matrixAutoUpdate = false
    reticle.visible = false
    reticleRef.current = reticle
    scene.add(reticle)

    // --------------------------------------------------------
    // 5. EVENTOS WEBXR (Controlador)
    // --------------------------------------------------------
    const controller = renderer.xr.getController(0)
    controller.addEventListener('select', () => {
      if (reticleRef.current && reticleRef.current.visible && modelRef.current) {
        // Colocar o mover el modelo a la posición de la retícula
        modelRef.current.position.setFromMatrixPosition(reticleRef.current.matrix)
        modelRef.current.quaternion.setFromRotationMatrix(reticleRef.current.matrix)
        
        // Ajustar la rotación base para que mire hacia el usuario (opcional)
        modelRef.current.visible = true
        isPlacedRef.current = true
      }
    })
    scene.add(controller)

    // --------------------------------------------------------
    // 6. BOTÓN AR CON HIT-TEST
    // --------------------------------------------------------
    const arButton = ARButton.createButton(renderer, {
      requiredFeatures: ['hit-test'],
      optionalFeatures: ['dom-overlay'],
      domOverlay: { root: container }
    })
    document.body.appendChild(arButton)

    // --------------------------------------------------------
    // 7. GESTOS TÁCTILES (DOM OVERLAY)
    // --------------------------------------------------------
    let initialDist = 0
    let initialScale = 1
    let lastTouchX = 0

    const handleTouchStart = (e: TouchEvent) => {
      e.stopPropagation()
      if (e.touches.length === 1) {
        lastTouchX = e.touches[0].pageX
      } else if (e.touches.length === 2 && modelRef.current) {
        const dx = e.touches[0].pageX - e.touches[1].pageX
        const dy = e.touches[0].pageY - e.touches[1].pageY
        initialDist = Math.hypot(dx, dy)
        initialScale = modelRef.current.scale.x
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.stopPropagation()
      
      // Si el usuario toca con 1 dedo fuera del botón, el navegador intenta hacer scroll.
      // preventDefault lo evita para que el gesto se use solo para AR.
      if (e.cancelable) e.preventDefault()

      if (!modelRef.current || !isPlacedRef.current) return

      if (e.touches.length === 1) {
        // Rotación con 1 dedo
        const touchX = e.touches[0].pageX
        const deltaX = touchX - lastTouchX

        modelRef.current.rotation.y += deltaX * 0.01

        lastTouchX = touchX
      } else if (e.touches.length === 2 && initialDist > 0) {
        // Escala con 2 dedos (Pinch)
        const dx = e.touches[0].pageX - e.touches[1].pageX
        const dy = e.touches[0].pageY - e.touches[1].pageY
        const currentDist = Math.hypot(dx, dy)
        
        const factor = currentDist / initialDist
        const newScale = Math.max(0.01, initialScale * factor) // Limite mínimo
        modelRef.current.scale.set(newScale, newScale, newScale)
      }
    }

    const handleTouchEnd = () => {
      initialDist = 0
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd)
    container.addEventListener('touchcancel', handleTouchEnd)

    // --------------------------------------------------------
    // 8. RENDER LOOP Y HIT TEST
    // --------------------------------------------------------
    let hitTestSource: XRHitTestSource | null = null
    let hitTestSourceRequested = false

    renderer.setAnimationLoop((timestamp, frame) => {
      if (frame) {
        const referenceSpace = renderer.xr.getReferenceSpace()
        const session = renderer.xr.getSession()
        
        if (session && referenceSpace) {
          if (hitTestSourceRequested === false) {
            session.requestReferenceSpace('viewer').then((viewerSpace) => {
              session.requestHitTestSource?.({ space: viewerSpace })?.then((source) => {
                hitTestSource = source
              })
            })
            hitTestSourceRequested = true
            // Limpiar al terminar sesión
            session.addEventListener('end', () => {
              hitTestSourceRequested = false
              hitTestSource = null
              isPlacedRef.current = false
              if (modelRef.current) modelRef.current.visible = false
            })
          }

          if (hitTestSource && reticleRef.current) {
            const hitTestResults = frame.getHitTestResults(hitTestSource)
            if (hitTestResults.length > 0) {
              const hit = hitTestResults[0]
              const pose = hit.getPose(referenceSpace)
              if (pose) {
                reticleRef.current.visible = true
                reticleRef.current.matrix.fromArray(pose.transform.matrix)
              }
            } else {
              reticleRef.current.visible = false
            }
          }
        }
      }
      
      renderer.render(scene, camera)
    })

    const handleResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
      container.removeEventListener('touchcancel', handleTouchEnd)
      renderer.dispose()
      if (arButton.parentNode) document.body.removeChild(arButton)
    }
  }, [modelUrl])

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-black/20 rounded-xl"
      style={{
        touchAction: 'none',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 100
      }}
    >
      <div className="absolute top-4 left-0 right-0 text-center z-10 pointer-events-none">
        <p className="bg-[#0F173A]/80 text-cyan-400 text-xs px-4 py-2 rounded-full inline-block backdrop-blur-md border border-cyan-500/30">
          Apunta al suelo y toca para colocar el modelo
        </p>
      </div>
    </div>
  )
}