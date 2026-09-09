"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface Visualizador3DProps {
  modelUrl?: string;
  className?: string;
}

export default function Visualizador3D({ 
  modelUrl = "/HORNET.glb", 
  className = "w-full h-full" 
}: Visualizador3DProps) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight;

    // Cleanup previous renderer
    if (rendererRef.current) {
      rendererRef.current.dispose();
      if (rendererRef.current.domElement.parentElement) {
        rendererRef.current.domElement.parentElement.removeChild(rendererRef.current.domElement);
      }
    }

    // Initialize Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasRef.current.innerHTML = "";
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Initialize Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Initialize Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1, 3);
    cameraRef.current = camera;

    // Lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
    scene.add(hemiLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controlsRef.current = controls;

    // Loader
    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        if (modelRef.current) scene.remove(modelRef.current);
        modelRef.current = gltf.scene;

        const box = new THREE.Box3().setFromObject(modelRef.current);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());

        const scaleFactor = 1.5 / size;
        modelRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);

        modelRef.current.position.x = -center.x * scaleFactor;
        modelRef.current.position.y = -center.y * scaleFactor;
        modelRef.current.position.z = -center.z * scaleFactor;

        scene.add(modelRef.current);
      },
      undefined,
      (err) => console.error("Error loading GLB in Visualizador3D:", err)
    );

    const animate = () => {
      requestRef.current = requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
      }
      if (controlsRef.current) controlsRef.current.dispose();
      if (modelRef.current && sceneRef.current) {
        sceneRef.current.remove(modelRef.current);
      }
    };
  }, [modelUrl]);

  return <div ref={canvasRef} className={className} />;
}
