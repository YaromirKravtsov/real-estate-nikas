import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../app/store/auth";
import { RouteNames } from "../../app/router";

const NewAnnouncementPage = () => {
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const role = useAuthStore((store) => store.role);

  useEffect(() => {
    if (role === "admin" || role === "user") {
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
    <div
      className="min-vh-100 bg-light p-4"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      <h1 className="display-4 fw-bold mb-3">Нове оголошення</h1>

      <div className="d-flex flex-wrap gap-3">
        <div className="flex-grow-2 d-flex flex-column gap-3">
          <input
            type="text"
            className="form-control form-control-lg w-100"
            placeholder="Ім’я власника"
          />
          <input
            type="text"
            className="form-control form-control-lg w-100"
            placeholder="Номер власника"
          />
          <input
            type="email"
            className="form-control form-control-lg w-100"
            placeholder="Email"
          />
          <input
            type="text"
            className="form-control form-control-lg w-100"
            placeholder="Назва"
          />
          <input
            type="number"
            className="form-control form-control-lg w-100"
            placeholder="Ціна покупки"
          />
          <input
            type="number"
            className="form-control form-control-lg w-100"
            placeholder="Ціна оренди"
          />
          <input
            type="text"
            className="form-control form-control-lg w-100"
            placeholder="Площа (м²)"
          />
          <input
            type="text"
            className="form-control form-control-lg w-100"
            placeholder="Адреса"
          />
          <input
            type="number"
            className="form-control form-control-lg w-100"
            placeholder="Кількість кімнат"
          />
        </div>

        <div className="flex-grow-1 d-flex flex-column gap-3">
          <button className="custom-button" onClick={handleUploadClick}>
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
          <div className="row row-cols-2 g-2">
            {images.map((img, idx) => (
              <div key={idx} className="col">
                <img
                  src={img}
                  alt={`перегляд-${idx}`}
                  className="img-fluid rounded border"
                  style={{ height: 128, objectFit: "cover", width: "100%" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 d-flex flex-column gap-3 w-100">
        <label htmlFor="description" className="h5 fw-semibold">
          Опис
        </label>
        <textarea
          id="description"
          className="form-control"
          rows={6}
          placeholder="Опис "
          style={{ padding: "1rem" }}
        ></textarea>
        <div className="d-flex justify-content-end">
          <button className="custom-button">Створити заявку</button>
        </div>
      </div>
    </div>
  );
};

export default NewAnnouncementPage;
