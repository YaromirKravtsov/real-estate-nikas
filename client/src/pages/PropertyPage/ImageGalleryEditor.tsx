import React, { FC, useRef, useState } from 'react';
import styles from './PropertyPage.module.css';
import { PropertyImage } from '../../models/IProperty';
import { useTranslations } from '../../store/translations';

interface Props {
  existingUrls: PropertyImage[];
  onAdd: (files: File[]) => void;
  onDeleteUrl: (url: string) => void;
}

const ImageGalleryEditor: FC<Props> = ({ existingUrls, onAdd, onDeleteUrl }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const { translations } = useTranslations();
  const t = translations();

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onAdd(files);

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

      {previews.map(url => (
        <div key={url} className={styles.item}>
          <img src={url} alt="" />
        </div>
      ))}

      <div className={styles.add}>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFiles}
        />
        <button onClick={() => fileRef.current?.click()}>+ {t.addImage}</button>
      </div>
    </div>
  );
};

export default ImageGalleryEditor;
