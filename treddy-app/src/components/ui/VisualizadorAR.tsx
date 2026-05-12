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
  className = "w-full h-full bg-black/20 rounded-xl touch-none",
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

    // Renderer con fondo transparente
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // Totalmente transparente
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

    // Botón AR (ahora dentro del contenedor para mejor control de eventos)
    const arButton = ARButton.createButton(renderer, {
      requiredFeatures: ["local"],
      optionalFeatures: ["hit-test", "dom-overlay"],
      domOverlay: { root: containerRef.current }
    });

    // Estilizar un poco el botón de Three.js para que encaje con la estética
    arButton.style.bottom = "20px";
    arButton.style.backgroundColor = "#06b6d4";
    arButton.style.color = "black";
    arButton.style.border = "none";
    arButton.style.borderRadius = "9999px";
    arButton.style.fontWeight = "bold";
    arButton.style.padding = "12px 24px";
    arButton.style.zIndex = "1000"; // Asegurar que esté por encima de todo

    containerRef.current.appendChild(arButton);

    // Controles de órbita para PC/Vista 3D
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 0.5; // Permitir acercarse un poco más
    controls.maxDistance = 10;
    controls.target.set(0, 0, -1.5);

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
      const model = gltf.scene;

      // Centrar el modelo en su propio origen
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);

      // Escalar para que quepa en un cubo de ~0.7m
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 0.7 / maxDim;
      model.scale.set(scale, scale, scale);

      // Posición final: 1.5 metros enfrente y en el "suelo" relativo
      // En AR 'local', el origen es donde empezó la sesión
      const container = new THREE.Group();
      container.add(model);
      container.position.set(0, 0, -1.5);
      scene.add(container);

    }, undefined, (error) => {
      console.error("Error cargando el modelo desde la base de datos:", error);
    });

    // Manejar redimensionamiento
    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current || renderer.xr.isPresenting) return;
      const { clientWidth, clientHeight } = containerRef.current;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    // Animación
    renderer.setAnimationLoop(() => {
      // No actualizar controles si estamos en AR, Three.js maneja la cámara
      if (!renderer.xr.isPresenting) {
        controls.update();
      }
      renderer.render(scene, camera);
    });

    return () => {
      resizeObserver.disconnect();
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
