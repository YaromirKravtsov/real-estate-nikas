import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../app/store/auth";
import { RouteNames } from "../../app/router";
import PropertyService from "../../app/api/service/PropertyService";
import PageLayout from "../../layouts/PageLayout/PageLayout";
import styles from './NewAnnouncementPage.module.css'
import MyInput from "../../UI/MyInput/MyInput";
import MySelect from "../../UI/MySelect/MySelect";
import MyEditor from "../../UI/MyEditor/MyEditor";
import { ListingType, PropertyRequestsService, SubmitPropertyDto } from "../../app/api/service/PropertyRequestsService";
import { buildFormData } from "./helpers/buildFormData";
import InputRow from "../../UI/InputRow/InputRow";
import { useTranslations } from '../../store/translations';

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
  const [formData, setFormData] = useState<SubmitPropertyDto>({
    // — Property fields —
    title: "",
    price: 0,
    address: "",
    city: "",
    listingType: "sale",         // відразу правильний юніон
    propertyType: "",
    bedrooms: 0,
    bathrooms: 0,
    yearBuilt: undefined,
    description: "",
    agentId: 0,
    is_submission: false,        // обов’язкове поле

    // — Contact fields —
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const { translations } = useTranslations();
  const t = translations();

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


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    try {
      await PropertyRequestsService.submitPorperty(buildFormData(formData, images));
      alert("Дякуємо! Ваша заявка подана. Наш агент зв’яжеться з вами після перевірки.")
      navigate(RouteNames.SEARCH)

    } catch (err) {
      console.error(err);
      alert("Помилка під час створення оголошення");
    }
  };

  return (
    <PageLayout actionTitle={t.addAnnouncement} pageTitle={t.addAnnouncement} action={handleSubmit}>
      <div className={styles.formContainer}>
        <div className={styles.fields}>
          <InputRow title={t.name}>
            <MyInput
              name="name"
              value={formData.name}
              setValue={val => setFormData({ ...formData, name: val })}
              placeholder={t.name}
            />
          </InputRow>

          <InputRow title={t.email}>
            <MyInput
              name="email"
              value={formData.email}
              setValue={val => setFormData({ ...formData, email: val })}
              placeholder={t.email}
            />
          </InputRow>

          <InputRow title={t.title}>
            <MyInput
              name="title"
              value={formData.title}
              setValue={val => setFormData({ ...formData, title: val })}
              placeholder={t.title}
            />
          </InputRow>

          <InputRow title={t.priceEuro}>
            <MyInput
              name="price"
              type="number"
              value={String(formData.price)}
              setValue={val => setFormData({ ...formData, price: Number(val) })}
              placeholder={t.priceEuro}
            />
          </InputRow>

          <InputRow title={t.address}>
            <MyInput
              name="address"
              value={formData.address}
              setValue={val => setFormData({ ...formData, address: val })}
              placeholder={t.address}
            />
          </InputRow>

          <InputRow title={t.city}>
            <MyInput
              name="city"
              value={formData.city}
              setValue={val => setFormData({ ...formData, city: val })}
              placeholder={t.city}
            />
          </InputRow>

          <InputRow title={t.listingType}>
            <MySelect
              options={[
                { value: 'sale', label: t.sale },
                { value: 'rent', label: t.rent }
              ]}
              value={formData.listingType}
              onChange={val => setFormData({ ...formData, listingType: val as ListingType })}
              placeholder={t.listingType}
              className={styles.input}
            />
          </InputRow>

          <InputRow title={t.propertyType}>
            <MyInput
              name="propertyType"
              value={formData.propertyType}
              setValue={val => setFormData({ ...formData, propertyType: val })}
              placeholder={t.propertyType}
            />
          </InputRow>

          <InputRow title={t.bedrooms}>
            <MyInput
              name="bedrooms"
              type="number"
              value={String(formData.bedrooms)}
              setValue={val => setFormData({ ...formData, bedrooms: Number(val) })}
              placeholder={t.bedrooms}
            />
          </InputRow>

          <InputRow title={t.bathrooms}>
            <MyInput
              name="bathrooms"
              type="number"
              value={String(formData.bathrooms)}
              setValue={val => setFormData({ ...formData, bathrooms: Number(val) })}
              placeholder={t.bathrooms}
            />
          </InputRow>

          <InputRow title={t.yearBuilt}>
            <MyInput
              name="yearBuilt"
              type="number"
              value={String(formData.yearBuilt)}
              setValue={val => setFormData({ ...formData, yearBuilt: Number(val) })}
              placeholder={t.yearBuilt}
            />
          </InputRow>
        </div>

        <div className={styles.imagePanel}>
          {images.length > 0 && (
            <img
              src={URL.createObjectURL(images[selectedImageIndex])}
              alt={t.addImage}
              className={styles.mainImage}
            />
          )}

          <div className={styles.navContainer}>
            <button onClick={handlePrev} className={styles.navButton}>❮</button>

            <div ref={scrollContainerRef} className={styles.thumbnails}>
              {images.map((file, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(file)}
                  alt={`preview-${idx}`}
                  className={`${styles.thumbnail} ${selectedImageIndex === idx ? styles.selected : ''}`}
                  onClick={() => setSelectedImageIndex(idx)}
                />
              ))}
            </div>

            <button onClick={handleNext} className={styles.navButton}>❯</button>

            <button className={styles.uploadBtn} onClick={handleUploadClick}>
              {t.addImage}
            </button>
          </div>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
        </div>

      </div>

      <div className={styles.descriptionSection}>
        <label htmlFor="description" className={styles.descriptionLabel}>
          {t.description}
        </label>
        <MyEditor
          className={styles.descriptionTextarea}
          value={formData.description}
          setValue={val => setFormData(prev => ({ ...prev, description: val }))}
        />
      </div>
    </PageLayout>
  );
};

export default NewAnnouncementPage;
