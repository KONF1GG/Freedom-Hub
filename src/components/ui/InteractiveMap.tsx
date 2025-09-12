import { useState, useRef, useEffect, useCallback } from "react";

interface InteractiveMapProps {
  lat: number;
  lng: number;
  onCoordsChange: (lat: number, lng: number) => void;
  className?: string;
}

export default function InteractiveMap({
  lat,
  lng,
  onCoordsChange,
  className = "",
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [markerPosition, setMarkerPosition] = useState({ x: 50, y: 50 });

  // Вычисляем позицию маркера на основе координат
  const updateMarkerPosition = () => {
    if (!mapRef.current) return;

    // Используем переданные координаты как центр карты

    // Маркер всегда в центре карты
    setMarkerPosition({
      x: 50,
      y: 50,
    });
  };

  // Обновляем позицию маркера при изменении координат
  useEffect(() => {
    updateMarkerPosition();
  }, [lat, lng]);

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Вычисляем процентные координаты
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    // Преобразуем в географические координаты относительно текущего центра
    const latOffset = (50 - percentY) / 2; // инвертируем Y
    const lngOffset = (percentX - 50) / 2;

    const newLat = lat + latOffset / 1000;
    const newLng = lng + lngOffset / 1000;

    // Обновляем координаты
    onCoordsChange(newLat, newLng);
  };

  const handleMarkerDrag = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isDragging || !mapRef.current) return;

      const rect = mapRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;

      // Ограничиваем маркер в пределах карты
      const clampedX = Math.max(5, Math.min(95, percentX));
      const clampedY = Math.max(5, Math.min(95, percentY));

      // Только обновляем позицию маркера, НЕ координаты
      setMarkerPosition({ x: clampedX, y: clampedY });
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      // Обновляем координаты только при отпускании маркера
      const latOffset = (50 - markerPosition.y) / 2;
      const lngOffset = (markerPosition.x - 50) / 2;

      const newLat = lat + latOffset / 1000;
      const newLng = lng + lngOffset / 1000;

      onCoordsChange(newLat, newLng);
    }
    setIsDragging(false);
  }, [isDragging, lat, lng, markerPosition, onCoordsChange]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Создаем URL для OpenStreetMap с более широким обзором
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    lng - 0.02
  },${lat - 0.01},${lng + 0.02},${
    lat + 0.01
  }&layer=mapnik&marker=${lat},${lng}&zoom=13`;

  return (
    <div
      className={`interactive-map ${className}`}
      ref={mapRef}
      onClick={handleMapClick}
    >
      <div className="map-background">
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{
            border: 0,
            borderRadius: "var(--radius-sm)",
            pointerEvents: "none",
          }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Интерактивная карта"
        />
      </div>

      <div
        className={`map-marker ${isDragging ? "dragging" : ""}`}
        style={{
          left: `${markerPosition.x}%`,
          top: `${markerPosition.y}%`,
        }}
        onMouseDown={handleMarkerDrag}
      >
        <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
      </div>

      <div className="map-instructions">
        <div className="instruction-text">
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span>Кликните на карте или перетащите маркер</span>
        </div>
      </div>
    </div>
  );
}
