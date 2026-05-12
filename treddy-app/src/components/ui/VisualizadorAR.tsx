"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface VisualizadorARProps {
  modelUrl?: string;
  className?: string;
  onSessionChange?: (active: boolean) => void;
}

export default function VisualizadorAR({ 
  modelUrl = "../../public/HORNET.glb", 
  className = "w-full h-full bg-black/20 rounded-xl",
  onSessionChange
}: VisualizadorARProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Limpiar el contenedor antes de montar un nuevo canvas
    containerRef.current.innerHTML = "";

    // Escena
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.01, 20);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.xr.enabled = true;

    // Manejar inicio y fin de sesión AR
    const onSessionStart = () => {
      if (onSessionChange) onSessionChange(true);
      document.body.classList.add("ar-session-active");
    };

    const onSessionEnd = () => {
      if (onSessionChange) onSessionChange(false);
      document.body.classList.remove("ar-session-active");
    };

    renderer.xr.addEventListener("sessionstart", onSessionStart);
    renderer.xr.addEventListener("sessionend", onSessionEnd);

    // Ajustar tamaño dinámico al contenedor
    const { clientWidth, clientHeight } = containerRef.current;
    renderer.setSize(clientWidth, clientHeight);

    containerRef.current.appendChild(renderer.domElement);

    // Botón AR (fuera del contenedor)
    const arButton = ARButton.createButton(renderer, { 
      requiredFeatures: ["local"],
      optionalFeatures: ["hit-test", "dom-overlay"],
      domOverlay: { root: document.body }
    });
    
    // Estilizar un poco el botón de Three.js para que encaje con la estética
    arButton.style.bottom = "20px";
    arButton.style.backgroundColor = "#06b6d4";
    arButton.style.color = "black";
    arButton.style.border = "none";
    arButton.style.borderRadius = "9999px";
    arButton.style.fontWeight = "bold";
    arButton.style.padding = "12px 24px";
    
    document.body.appendChild(arButton);

    // Controles de órbita para PC/Vista 3D
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1;
    controls.maxDistance = 10;
    controls.target.set(0, 0, -2);

    // Posicionar cámara inicialmente
    camera.position.set(0, 1.6, 0);

    // Luz
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(2, 4, 5);
    scene.add(dirLight);

    // Modelo
    const loader = new GLTFLoader();
    loader.load(modelUrl, (gltf) => {
      // Centrar y escalar automáticamente el modelo
      const model = gltf.scene;
      
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 0.8 / maxDim;
      
      model.scale.set(scale, scale, scale);
      model.position.set(0, -0.5, -2);
      scene.add(model);
    }, undefined, (error) => {
      console.error("Error cargando el modelo desde la base de datos:", error);
    });

    // Animación
    renderer.setAnimationLoop(() => {
      controls.update();
      renderer.render(scene, camera);
    });

    return () => {
      renderer.xr.removeEventListener("sessionstart", onSessionStart);
      renderer.xr.removeEventListener("sessionend", onSessionEnd);
      renderer.setAnimationLoop(null);
      renderer.dispose();
      if (containerRef.current) containerRef.current.innerHTML = "";
      if (arButton && arButton.parentNode) arButton.parentNode.removeChild(arButton);
      controls.dispose();
      document.body.classList.remove("ar-session-active");
    };
  }, [modelUrl, onSessionChange]);

  return (
    <div ref={containerRef} className={className} />
  );
}
