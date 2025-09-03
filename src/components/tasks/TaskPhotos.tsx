import { useState } from "react";
import { RequestPhoto } from "../../types/request";

interface TaskPhotosProps {
  photos: RequestPhoto[];
  onPhotoUpload?: (file: File) => void;
}

export default function TaskPhotos({ photos, onPhotoUpload }: TaskPhotosProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !onPhotoUpload) return;

    setIsUploading(true);
    try {
      await onPhotoUpload(file);
    } catch (error) {
      console.error("Ошибка загрузки фото:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Фотографии</h3>
        {onPhotoUpload && (
          <label className="btn-upload">
            {isUploading ? "Загрузка..." : "Добавить фото"}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="input-hidden"
              disabled={isUploading}
            />
          </label>
        )}
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          Фотографии не загружены
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="card-photo group">
              <img
                src={photo.url}
                alt={photo.description || `Фото ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-slate-600"
              />
              <div className="card-photo-overlay">
                <div className="card-photo-content">
                  <p className="card-photo-title">{photo.description}</p>
                  <p className="card-photo-time">
                    {new Date(photo.timestamp).toLocaleDateString("ru-RU")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
