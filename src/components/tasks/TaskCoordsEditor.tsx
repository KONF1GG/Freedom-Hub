import { useState } from "react";

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

  const handleSave = () => {
    if (onSave) {
      onSave(lat, lng);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLat(initialLat || 0);
    setLng(initialLng || 0);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="label">Координаты</label>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Изменить
          </button>
        </div>
        <div className="coords-display">
          <div className="coords-display-item">Широта: {lat.toFixed(6)}</div>
          <div className="coords-display-item">Долгота: {lng.toFixed(6)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex flex-column gap-3">
        <div className="form-group">
          <label className="form-label">Широта</label>
          <input
            type="number"
            step="any"
            value={lat || ""}
            onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
            className="form-input"
            placeholder="0.000000"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Долгота</label>
          <input
            type="number"
            step="any"
            value={lng || ""}
            onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
            className="form-input"
            placeholder="0.000000"
          />
        </div>
      </div>
      <div className="d-flex gap-3">
        <button
          onClick={handleSave}
          disabled={!lat || !lng}
          className="btn btn-primary"
        >
          Сохранить координаты
        </button>
        <button onClick={handleCancel} className="btn btn-secondary">
          Отмена
        </button>
      </div>
    </div>
  );
}
