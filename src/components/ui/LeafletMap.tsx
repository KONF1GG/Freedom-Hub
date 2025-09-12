import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Исправляем иконки маркеров для Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LeafletMapProps {
  lat: number;
  lng: number;
  onCoordsChange: (lat: number, lng: number) => void;
  className?: string;
}

export default function LeafletMap({
  lat,
  lng,
  onCoordsChange,
  className = "",
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Создаем карту
    const map = L.map(mapRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: true,
      dragging: true,
      touchZoom: true,
      doubleClickZoom: true,
      scrollWheelZoom: true,
      boxZoom: true,
      keyboard: true,
    });

    // Добавляем слой карты OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Создаем маркер
    const marker = L.marker([lat, lng], {
      draggable: true,
    }).addTo(map);

    // Обработчик перетаскивания маркера
    marker.on("dragend", (e) => {
      const position = e.target.getLatLng();
      onCoordsChange(position.lat, position.lng);
    });

    // Обработчик клика по карте
    map.on("click", (e) => {
      const { lat: newLat, lng: newLng } = e.latlng;
      marker.setLatLng([newLat, newLng]);
      onCoordsChange(newLat, newLng);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;
    setIsMapReady(true);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Обновляем позицию маркера при изменении координат
  useEffect(() => {
    if (markerRef.current && isMapReady) {
      markerRef.current.setLatLng([lat, lng]);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView(
          [lat, lng],
          mapInstanceRef.current.getZoom()
        );
      }
    }
  }, [lat, lng, isMapReady]);

  return (
    <div className={`leaflet-map-container ${className}`}>
      <div ref={mapRef} className="leaflet-map" />
      {!isMapReady && (
        <div className="map-loading">
          <div className="spinner"></div>
          <p>Загрузка карты...</p>
        </div>
      )}
    </div>
  );
}

