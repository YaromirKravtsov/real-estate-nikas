import React, { FC, useRef, useState } from 'react';
import styles from './PropertyPage.module.css';
import { PropertyImage } from '../../models/IProperty';

interface Props {
  existingUrls: PropertyImage[];             // URL-адреси фото, що вже є на сервері
  onAdd: (files: File[]) => void;     // додаємо нові файли
  onDeleteUrl: (url: string) => void; // видаляємо існуючі
}

const ImageGalleryEditor: FC<Props> = ({ existingUrls, onAdd, onDeleteUrl }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onAdd(files);

    // локальні прев’ю
    const urls = files.map(f => URL.createObjectURL(f));
    setPreviews(p => [...p, ...urls]);
  };

  return (
    <div className={styles.gallery}>
      
      {existingUrls.map(url => (
        <div key={url.fullUrl} className={styles.item}>
          <img src={url.fullUrl} alt="" />
          <button onClick={() => onDeleteUrl(url.fullUrl)}>×</button>
        </div>
      ))}

      {/* Нові прев’ю */}
      {previews.map(url => (
        <div key={url} className={styles.item}>
          <img src={url} alt="" />
        </div>
      ))}

      {/* Кнопка додавання */}
      <div className={styles.add}>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFiles}
        />
        <button onClick={() => fileRef.current?.click()}>+ Додати фото</button>
      </div>
    </div>
  );
};

export default ImageGalleryEditor;
