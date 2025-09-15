/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import Nav from '@/pages/nav'
import Footer from '@/pages/footer'

export default function Personalizador3DIndependiente() {
  const [mostrar3D, setMostrar3D] = useState(false)
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 })
  const [animation, setAnimation] = useState<'none' | 'rotate'>('none')
  const [modelUrl, setModelUrl] = useState<string | null>(null)
  const [color, setColor] = useState('#ffffff')
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const modelRef = useRef<THREE.Object3D | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)

  // Cargar modelo local
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setModelUrl(url)
    setMostrar3D(true)
  }

  // Inicializar Three.js
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
    scene.background = new THREE.Color(0x1f2a38) 
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 100)
    camera.position.set(0, 0, 1)
    cameraRef.current = camera

    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5)
    scene.add(light)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 10, 7.5)
    scene.add(directionalLight)

    const loader = new GLTFLoader()
    if (modelUrl) {
      loader.load(
        modelUrl,
        (gltf) => {
          if (modelRef.current) scene.remove(modelRef.current)
          modelRef.current = gltf.scene

          // Escalar para que se vea completo
          const box = new THREE.Box3().setFromObject(modelRef.current)
          const size = box.getSize(new THREE.Vector3()).length()
          const scaleFactor = 2 / size
          modelRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor)

          modelRef.current.position.set(0, 0, -2)
          applyColor(modelRef.current, color)
          scene.add(modelRef.current)
        },
        undefined,
        (err) => console.error('Error cargando GLB:', err)
      )
    }

    const animate = () => {
      renderer.setAnimationLoop(() => {
        if (modelRef.current) {
          modelRef.current.rotation.x = rotation.x
          modelRef.current.rotation.y = rotation.y
          modelRef.current.rotation.z = rotation.z
          if (animation === 'rotate') modelRef.current.rotation.y += 0.01
        }
        renderer.render(scene, camera)
      })
    }
    animate()

    return () => {
      renderer.setAnimationLoop(null)
      renderer.dispose()
      if (modelRef.current) {
        scene.remove(modelRef.current)
        modelRef.current = null
      }
    }
  }, [mostrar3D, rotation, animation, modelUrl, color])

  // Aplicar color al modelo
  const applyColor = (object: THREE.Object3D, color: string) => {
    object.traverse((child: any) => {
      if (child.isMesh) {
        if (child.material) child.material.color = new THREE.Color(color)
      }
    })
  }

  // Exportar modelo
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

      <main className="min-h-screen flex flex-col items-center justify-start bg-[#0A0F2C] py-10">
        <h1 className="text-3xl font-bold mb-6 text-white-800">Personalizador 3D</h1>

        <div className="flex w-full max-w-6xl gap-6 bg-white p-6 rounded-2xl shadow-lg">
          {/* Controles */}
          <div className="w-1/3 bg-gray-100 p-6 rounded-xl flex flex-col gap-4 shadow-inner">
            <h2 className="font-bold mb-2 text-black">Animación</h2>
            <select
              className="w-full mb-4 p-2 rounded border border-gray-300 text-black"
              value={animation}
              onChange={(e) => setAnimation(e.target.value as 'none' | 'rotate')}
            >
              <option value="none">Ninguna</option>
              <option value="rotate">Rotar</option>
            </select>

            <label className="text-gray-700">Rotación X</label>
            <input
              type="range"
              min={0}
              max={Math.PI * 2}
              step={0.01}
              value={rotation.x}
              onChange={(e) => setRotation({ ...rotation, x: parseFloat(e.target.value) })}
              className="w-full"
            />
            <label className="text-gray-700">Rotación Y</label>
            <input
              type="range"
              min={0}
              max={Math.PI * 2}
              step={0.01}
              value={rotation.y}
              onChange={(e) => setRotation({ ...rotation, y: parseFloat(e.target.value) })}
              className="w-full"
            />
            <label className="text-gray-700">Rotación Z</label>
            <input
              type="range"
              min={0}
              max={Math.PI * 2}
              step={0.01}
              value={rotation.z}
              onChange={(e) => setRotation({ ...rotation, z: parseFloat(e.target.value) })}
              className="w-full"
            />

            <label className="mt-4 font-bold text-gray-700">Color del modelo</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-10 rounded border border-gray-300"
            />

            <label className="mt-4 font-bold text-gray-700">Cargar GLB</label>
            <input type="file" accept=".glb" onChange={handleFileChange} className="text-gray-700" />

            {modelUrl && (
              <button
                onClick={handleExport}
                className="mt-4 bg-[#00E6F6] text-black px-4 py-2 rounded-lg hover:bg-black hover:text-[#00E6F6] transition"
              >
                Exportar modelo
              </button>
            )}
          </div>

          {/* Canvas 3D */}
          <div className="w-2/3 flex flex-col items-center justify-center">
            <button
              onClick={() => setMostrar3D(!mostrar3D)}
              className="mb-2 bg-[#00E6F6] text-black px-4 py-2 rounded-lg hover:bg-black hover:text-[#00E6F6] transition"
            >
              {mostrar3D ? 'Ocultar 3D' : 'Mostrar 3D'}
            </button>
            {mostrar3D && (
              <div
                ref={canvasRef}
                className="w-full h-[500px] bg-[#1f2a38] rounded-xl shadow-lg flex items-center justify-center"
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
