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
    <div className="d-flex flex-column gap-4">
      <h3 className="text-lg font-semibold">Фотографии</h3>

      {photos.length === 0 ? (
        <div className="photo-upload-container">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="file-input-hidden"
            disabled={isUploading}
            multiple
          />
          <div
            className="photo-upload-area"
            onClick={() => {
              const input = document.querySelector(
                'input[type="file"]'
              ) as HTMLInputElement;
              input?.click();
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add("dragover");
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove("dragover");
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove("dragover");
              const file = e.dataTransfer.files[0];
              if (file && onPhotoUpload) {
                handleFileUpload({ target: { files: [file] } } as any);
              }
            }}
          >
            {isUploading ? (
              <div className="upload-loading">
                <div className="loading-spinner"></div>
                <div className="upload-text">Загрузка...</div>
              </div>
            ) : (
              <>
                <svg
                  className="upload-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
                <div className="upload-text">
                  Перетащите фото сюда или нажмите для выбора
                </div>
                <div className="upload-hint">
                  Поддерживаются форматы: JPG, PNG, GIF
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="d-flex flex-wrap gap-4">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="card"
              style={{
                width: "200px",
                height: "200px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <img
                src={photo.url}
                alt={photo.description || `Фото ${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
              <div
                className="position-absolute"
                style={{
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                  color: "white",
                  padding: "var(--spacing-3)",
                  transform: "translateY(100%)",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(100%)")
                }
              >
                <div className="text-sm font-medium">
                  {photo.description || `Фото ${index + 1}`}
                </div>
                <div className="text-xs opacity-75">
                  {new Date(photo.timestamp).toLocaleDateString("ru-RU")}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
