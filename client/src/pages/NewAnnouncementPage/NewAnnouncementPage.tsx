import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../app/store/auth";
import { RouteNames } from "../../app/router";
import PropertyService from "../../app/api/service/PropertyService";

function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

const NewAnnouncementPage = () => {
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    title: "",
    price: 0,
    address: "",
    city: "",
    listingType: "sale",
    propertyType: "",
    bedrooms: 0,
    bathrooms: 0,
    yearBuilt: 0,
    description: "",
    agentId: 0,
  });

  useEffect(() => {
    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.userId) {
        setFormData((prev) => ({ ...prev, agentId: decoded.userId }));
      }
    }
  }, [token]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const role = useAuthStore((store) => store.role);

  useEffect(() => {
    if (role === "admin" || role === "user") {
      navigate(RouteNames.NEW);
    }
  }, [role]);
  const scrollToIndex = (index: number) => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    const thumbnailWidth = 120 + 8; // width + gap
    scrollContainer.scrollTo({
      left:
        index * thumbnailWidth -
        (scrollContainer.clientWidth - thumbnailWidth) / 2,
      behavior: "smooth",
    });
  };

  // При клике стрелки:
  const handlePrev = () => {
    const newIndex =
      selectedImageIndex > 0 ? selectedImageIndex - 1 : images.length - 1;
    setSelectedImageIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex =
      selectedImageIndex < images.length - 1 ? selectedImageIndex + 1 : 0;
    setSelectedImageIndex(newIndex);
    scrollToIndex(newIndex);
  };

  // Прокручиваем при смене
  useEffect(() => {
    scrollToIndex(selectedImageIndex);
  }, [selectedImageIndex]);
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" ||
        name === "bedrooms" ||
        name === "bathrooms" ||
        name === "yearBuilt"
          ? Number(value)
          : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    try {
      await PropertyService.createProperty(formData, images);
      alert("Оголошення створено!");
    } catch (err) {
      console.error(err);
      alert("Помилка під час створення оголошення");
    }
  };

  return (
    <div className="container py-4">
      <h1 className="display-4 fw-bold mb-3">Нове оголошення</h1>

      <div
        className="d-flex flex-nowrap gap-3 align-items-stretch"
        style={{ minHeight: "100%" }}
      >
        <div className="flex-grow-2 d-flex flex-column gap-3">
          <input
            name="title"
            onChange={handleInputChange}
            type="text"
            className="form-control form-control-lg"
            placeholder="Назва"
          />
          <input
            name="price"
            onChange={handleInputChange}
            type="number"
            className="form-control form-control-lg"
            placeholder="Ціна у €"
          />
          <input
            name="address"
            onChange={handleInputChange}
            type="text"
            className="form-control form-control-lg"
            placeholder="Адреса"
          />
          <input
            name="city"
            onChange={handleInputChange}
            type="text"
            className="form-control form-control-lg"
            placeholder="Місто"
          />
          <select
            name="listingType"
            onChange={handleInputChange}
            className="form-control form-control-lg"
            value={formData.listingType}
          >
            <option value="sale">sale</option>
            <option value="rent">rent</option>
          </select>

          <input
            name="propertyType"
            onChange={handleInputChange}
            type="text"
            className="form-control form-control-lg"
            placeholder="Тип нерухомості"
          />
          <input
            name="bedrooms"
            onChange={handleInputChange}
            type="number"
            className="form-control form-control-lg"
            placeholder="Кількість спалень"
          />
          <input
            name="bathrooms"
            onChange={handleInputChange}
            type="number"
            className="form-control form-control-lg"
            placeholder="Кількість ванних кімнат"
          />
          <input
            name="yearBuilt"
            onChange={handleInputChange}
            type="number"
            className="form-control form-control-lg"
            placeholder="Рік побудови"
          />
        </div>

        <div className="flex-grow-1 d-flex flex-column">
          {images.length > 0 && (
            <img
              src={URL.createObjectURL(images[selectedImageIndex])}
              alt="Вибране зображення"
              className="img-fluid rounded border w-100"
              style={{ height: 400, objectFit: "cover" }}
            />
          )}

          <div
            className="d-flex align-items-center gap-3 mt-auto"
            style={{ minWidth: 0 }}
          >
            <button
              onClick={handlePrev}
              className="btn btn-link p-0 text-decoration-none"
              style={{ fontSize: "2rem", color: "#333" }}
            >
              ❮
            </button>

            <div
              ref={scrollContainerRef}
              style={{
                display: "flex",
                gap: "0.5rem",
                overflowX: "auto",
                overflowY: "hidden",
                maxWidth: "100%",
                flexShrink: 1,
                flexWrap: "nowrap",
              }}
            >
              {images.map((file, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(file)}
                  alt={`перегляд-${idx}`}
                  className={`rounded border ${
                    selectedImageIndex === idx ? "border-primary border-3" : ""
                  }`}
                  style={{
                    height: 80,
                    width: 120,
                    objectFit: "cover",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                  onClick={() => setSelectedImageIndex(idx)}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="btn btn-link p-0 text-decoration-none"
              style={{ fontSize: "2rem", color: "#333" }}
            >
              ❯
            </button>

            <button
              className="custom-button"
              onClick={handleUploadClick}
              style={{ whiteSpace: "nowrap", flexShrink: 0 }}
            >
              Додати зображення
            </button>
          </div>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
        </div>
      </div>

      <div className="mt-5 d-flex flex-column gap-3 flex-grow-1">
        <label htmlFor="description" className="h5 fw-semibold">
          Опис
        </label>
        <textarea
          name="description"
          id="description"
          className="form-control p-3"
          rows={6}
          placeholder="Опис"
          onChange={handleInputChange}
        />
        <div className="d-flex justify-content-end">
          <button className="custom-button" onClick={handleSubmit}>
            Створити заявку
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewAnnouncementPage;
