interface MapPreviewProps {
  lat: number;
  lng: number;
  address?: string;
  className?: string;
}

export default function MapPreview({
  lat,
  lng,
  address,
  className = "",
}: MapPreviewProps) {
  // Проверяем, что координаты валидны
  if (!lat || !lng || lat === 0 || lng === 0) {
    return (
      <div className={`map-preview map-preview-empty ${className}`}>
        <div className="map-placeholder">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Нет координат</span>
        </div>
      </div>
    );
  }

  // Используем iframe с увеличенным зумом для большей детализации
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    lng - 0.01
  },${lat - 0.005},${lng + 0.01},${
    lat + 0.005
  }&layer=mapnik&marker=${lat},${lng}&zoom=15`;

  return (
    <div className={`map-preview ${className}`}>
      <div className="map-container">
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{
            border: 0,
            borderRadius: "var(--radius-md)",
            minHeight: "300px",
          }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Карта"
        />
        <div className="map-overlay">
          <div className="map-marker">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
