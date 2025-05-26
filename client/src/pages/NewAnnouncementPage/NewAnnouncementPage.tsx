import React, { useState, useRef, useEffect } from "react";
import "./NewAnnouncementPage.css";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../app/store/auth";
import { RouteNames } from "../../app/router";

const NewAnnouncementPage = () => {
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const role = useAuthStore((store) => store.role);
  useEffect(() => {
    if (role == "admin" || role == "user") {
      navigate(RouteNames.NEW);
    }
  }, [role]);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="main-page">
      <h1 className="page-title">Нове оголошення</h1>

      <div className="form-container">
        {/* Форма */}
        <div className="form-fields">
          <input type="text" placeholder="Ім’я власника" />
          <input type="text" placeholder="Номер власника" />
          <input type="email" placeholder="Email" />
          <input type="text" placeholder="Назва" />
          <input type="number" placeholder="Ціна покупки" />
          <input type="number" placeholder="Ціна оренди" />
          <input type="text" placeholder="Площа (м²)" />
          <input type="text" placeholder="Адреса" />
          <input type="number" placeholder="Кількість кімнат" />
        </div>

        {/* Завантаження зображень */}
        <div className="image-upload">
          <button
            type="button"
            className="upload-button"
            onClick={handleUploadClick}
          >
            Додати зображення
          </button>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <div className="image-preview">
            {images.map((img, idx) => (
              <img key={idx} src={img} alt={`перегляд-${idx}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="description-section">
        <label htmlFor="description" className="description-label">
          Опис
        </label>
        <textarea
          id="description"
          className="description-textarea"
          rows={6}
          placeholder="Опис "
        ></textarea>
        <div className="button-wrapper">
          <button className="upload-button create-request-button">
            Створити заявку
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewAnnouncementPage;
