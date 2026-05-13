"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for Leaflet default marker icons in Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface LeafletMapProps {
  position: [number, number];
  onPositionChange: (pos: [number, number]) => void;
  onZoomChange?: (zoom: number) => void;
  zoom?: number;
}

// Component to handle map centering and zoom independently
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  const lastProps = useRef({ center, zoom });
  
  useEffect(() => {
    const centerChanged = center[0] !== lastProps.current.center[0] || center[1] !== lastProps.current.center[1];
    const zoomChanged = zoom !== lastProps.current.zoom;

    if (centerChanged && zoomChanged) {
      map.setView(center, zoom, { animate: true });
    } else if (centerChanged) {
      map.setView(center, map.getZoom(), { animate: true });
    } else if (zoomChanged) {
      map.setZoom(zoom);
    }

    lastProps.current = { center, zoom };
  }, [center, zoom, map]);

  return null;
}

// Component to handle map events
function MapEvents({ 
  onMapClick, 
  onZoomChange 
}: { 
  onMapClick: (latlng: L.LatLng) => void;
  onZoomChange?: (zoom: number) => void;
}) {
  const map = useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
    zoomend() {
      if (onZoomChange) {
        onZoomChange(map.getZoom());
      }
    }
  });
  return null;
}

export default function LeafletMap({ position, onPositionChange, onZoomChange, zoom = 13 }: LeafletMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="w-full h-full bg-[#0A0F2C] animate-pulse rounded-xl" />;

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full rounded-xl"
        style={{ background: "#0A0F2C" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <ChangeView center={position} zoom={zoom} />
        
        <MapEvents 
          onMapClick={(latlng) => onPositionChange([latlng.lat, latlng.lng])} 
          onZoomChange={onZoomChange}
        />
        
        <Marker
          position={position}
          icon={defaultIcon}
          draggable={true}
          eventHandlers={{
            dragend: (e) => {
              const marker = e.target;
              const pos = marker.getLatLng();
              onPositionChange([pos.lat, pos.lng]);
            },
          }}
        />
      </MapContainer>
    </div>
  );
}
