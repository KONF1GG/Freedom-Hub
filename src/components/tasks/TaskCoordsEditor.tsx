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
          <label className="block text-sm font-medium text-slate-300">
            Координаты
          </label>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Изменить
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="px-3 py-2 bg-slate-700 rounded-lg text-white text-sm">
            Широта: {lat.toFixed(6)}
          </div>
          <div className="px-3 py-2 bg-slate-700 rounded-lg text-white text-sm">
            Долгота: {lng.toFixed(6)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-300">
        Координаты
      </label>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          step="any"
          value={lat}
          onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
          placeholder="Широта"
          className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          step="any"
          value={lng}
          onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
          placeholder="Долгота"
          className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
        >
          Сохранить
        </button>
        <button
          onClick={handleCancel}
          className="px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}
