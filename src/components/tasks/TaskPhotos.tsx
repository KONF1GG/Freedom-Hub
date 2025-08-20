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
          <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            {isUploading ? "Загрузка..." : "Добавить фото"}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
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
            <div key={index} className="relative group">
              <img
                src={photo.url}
                alt={photo.description || `Фото ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-slate-600"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-center">
                  <p className="text-sm font-medium">{photo.description}</p>
                  <p className="text-xs text-slate-300">
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
