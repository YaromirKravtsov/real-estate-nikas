import { useEffect, useRef, useState } from "react";
import styles from './ImagePicker.module.css';
import { useTranslations } from '../../store/translations';

export interface ImagePickerProps {
  initialImageUrl?: string | null;
  onFileChange: (file: File, previewUrl: string) => void;
  containerClassName?: string;
  imageClassName?: string;
  buttonClassName?: string;
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  initialImageUrl,
  onFileChange,
  containerClassName = '',
  imageClassName = '',
  buttonClassName = '',
}) => {
  const [preview, setPreview] = useState<string | undefined>(initialImageUrl ?? undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { translations } = useTranslations();
  const t = translations();

  // 1) Слід оновлювати preview кожного разу, коли initialImageUrl змінюється:
  useEffect(() => {
    setPreview(initialImageUrl ?? undefined);
  }, [initialImageUrl]);

  // 2) При відмонтовані чи зміні preview відміняти старі object URLs:
  useEffect(() => {
    return () => {
      if (preview && preview !== initialImageUrl) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, initialImageUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onFileChange(file, url);
  };

  return (
    <>
      <div className={containerClassName || styles.profileImageContainer}>
        {preview && (
          <img
            src={preview}
            alt={t.previewAlt || "Preview"}
            className={imageClassName}
          />
        )}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleChange}
        />
      </div>
      <button
        type="button"
        className={buttonClassName || styles.uploadButton}
        onClick={() => fileInputRef.current?.click()}
      >
        {t.uploadPhoto || "Upload photo"}
      </button>
    </>
  );
};

export default ImagePicker;
