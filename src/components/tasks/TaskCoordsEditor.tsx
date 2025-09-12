import { useState } from "react";
import MapPreview from "../ui/MapPreview";
import LeafletMap from "../ui/LeafletMap";

interface TaskCoordsEditorProps {
  lat?: number;
  lng?: number;
  onSave?: (lat: number, lng: number) => void;
}

export default function TaskCoordsEditor({
  lat: initialLat,
  lng: initialLng,
  onSave,
}: TaskCoordsEditorProps) {
  const [lat, setLat] = useState(initialLat || 0);
  const [lng, setLng] = useState(initialLng || 0);
  const [isEditing, setIsEditing] = useState(false);
  const [selectionMode, setSelectionMode] = useState<
    "current" | "map" | "manual" | null
  >(null);
  const [tempLat, setTempLat] = useState(initialLat || 55.7558);
  const [tempLng, setTempLng] = useState(initialLng || 37.6176);

  const handleSave = () => {
    if (onSave) {
      onSave(lat, lng);
    }
    setIsEditing(false);
    setSelectionMode(null);
  };

  const handleCancel = () => {
    setLat(initialLat || 0);
    setLng(initialLng || 0);
    setIsEditing(false);
    setSelectionMode(null);
  };

  const handleCurrentLocation = () => {
    setSelectionMode("current");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
          setSelectionMode(null);
          handleSave();
        },
        (error) => {
          console.error("Ошибка получения местоположения:", error);
          alert("Не удалось получить текущее местоположение");
          setSelectionMode(null);
        }
      );
    } else {
      alert("Геолокация не поддерживается вашим браузером");
      setSelectionMode(null);
    }
  };

  const handleMapClick = () => {
    if (selectionMode === "map") {
      setLat(tempLat);
      setLng(tempLng);
      setSelectionMode(null);
      handleSave();
    }
  };

  const handleManualCoords = () => {
    setSelectionMode("manual");
  };

  const handleMapSelection = () => {
    setTempLat(lat || 55.7558);
    setTempLng(lng || 37.6176);
    setSelectionMode("map");
  };

  // Если не редактируем - показываем просмотр
  if (!isEditing) {
    return (
      <div className="coords-view-simple">
        <div className="coords-header-simple">
          <h3>Координаты</h3>
          <button
            onClick={() => setIsEditing(true)}
            className="btn-simple btn-edit"
          >
            Изменить
          </button>
        </div>

        {lat && lng ? (
          <div className="coords-display-simple">
            <div className="coords-values-simple">
              <span>Широта: {lat.toFixed(6)}</span>
              <span>Долгота: {lng.toFixed(6)}</span>
            </div>
            <MapPreview lat={lat} lng={lng} />
          </div>
        ) : (
          <div className="coords-empty-simple">
            <p>Координаты не заданы</p>
          </div>
        )}
      </div>
    );
  }

  // Если не выбрано никакого режима - показываем меню выбора
  if (!selectionMode) {
    return (
      <div className="coords-menu-simple">
        <div className="coords-header-simple">
          <h3>Выберите способ</h3>
          <button onClick={handleCancel} className="btn-simple btn-cancel">
            ✕
          </button>
        </div>

        <div className="selection-buttons-simple">
          <button
            onClick={handleCurrentLocation}
            className="btn-simple btn-location"
          >
            📍 Текущее местоположение
          </button>
          <button
            onClick={handleManualCoords}
            className="btn-simple btn-manual"
          >
            ✏️ Ввести вручную
          </button>
          <button onClick={handleMapSelection} className="btn-simple btn-map">
            🗺️ Выбрать на карте
          </button>
        </div>
      </div>
    );
  }

  // Режим ввода вручную
  if (selectionMode === "manual") {
    return (
      <div className="manual-coords-simple">
        <div className="coords-header-simple">
          <h3>Ввод координат</h3>
          <button
            onClick={() => setSelectionMode(null)}
            className="btn-simple btn-back"
          >
            ← Назад
          </button>
        </div>

        <div className="coords-inputs-simple">
          <input
            type="number"
            step="0.000001"
            value={lat || ""}
            onChange={(e) => setLat(Number(e.target.value))}
            className="form-input-simple"
            placeholder="Широта (55.7558)"
            min="-90"
            max="90"
          />
          <input
            type="number"
            step="0.000001"
            value={lng || ""}
            onChange={(e) => setLng(Number(e.target.value))}
            className="form-input-simple"
            placeholder="Долгота (37.6176)"
            min="-180"
            max="180"
          />
        </div>

        <div className="coords-buttons-simple">
          <button
            onClick={handleSave}
            className="btn-simple btn-save"
            disabled={!lat || !lng}
          >
            ✓ Сохранить
          </button>
        </div>
      </div>
    );
  }

  // Режим выбора на карте
  if (selectionMode === "map") {
    return (
      <div className="map-selection-simple">
        <div className="coords-header-simple">
          <h3>Выбор на карте</h3>
          <button
            onClick={() => setSelectionMode(null)}
            className="btn-simple btn-back"
          >
            ← Назад
          </button>
        </div>

        <div className="map-container-simple">
          <LeafletMap
            lat={tempLat}
            lng={tempLng}
            onCoordsChange={(lat, lng) => {
              setTempLat(lat);
              setTempLng(lng);
            }}
          />
        </div>

        <div className="map-coords-display-simple">
          <div className="coords-display-simple">
            <span>Широта: {tempLat.toFixed(6)}</span>
            <span>Долгота: {tempLng.toFixed(6)}</span>
          </div>
        </div>

        <div className="map-buttons-simple">
          <button onClick={handleMapClick} className="btn-simple btn-save">
            ✓ Выбрать эти координаты
          </button>
        </div>
      </div>
    );
  }

  // Режим получения текущего местоположения
  if (selectionMode === "current") {
    return (
      <div className="current-location-simple">
        <div className="coords-header-simple">
          <h3>Получение местоположения</h3>
          <button
            onClick={() => setSelectionMode(null)}
            className="btn-simple btn-back"
          >
            ← Назад
          </button>
        </div>

        <div className="loading-simple">
          <div className="spinner-simple"></div>
          <p>Получение текущего местоположения...</p>
        </div>
      </div>
    );
  }

  return null;
}
