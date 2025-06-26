import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import PropertyService, {
  PropertyResponse,
} from "../../app/api/service/PropertyService";
import { PropertyRequestsService, ViewReq } from "../../app/api/service/PropertyRequestsService";
import styles from './DetailAnnouncementPage.module.css'
import InputRow from "../../UI/InputRow/InputRow";
import MyInput from "../../UI/MyInput/MyInput";
import MyButton from "../../UI/MyButton/MyButton";
import { useTranslations } from '../../store/translations';

const DetailAnnouncementPage = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyResponse | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [requestData, setRequestData] = useState<ViewReq>({
    name: '',
    email: '',
    phone: ''
  })
  const { translations } = useTranslations();
  const t = translations();
  

  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      try {
        const response = await PropertyService.getPropertyById(Number(id));
        setProperty(response.data);
      } catch (error) {
        console.error("Помилка при завантаженні оголошення", error);
      }
    };

    fetchProperty();
  }, [id]);

  const scrollToIndex = (index: number) => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    const thumbnailWidth = 120 + 8;
    scrollContainer.scrollTo({
      left:
        index * thumbnailWidth -
        (scrollContainer.clientWidth - thumbnailWidth) / 2,
      behavior: "smooth",
    });
  };

  const handlePrev = () => {
    const newIndex =
      selectedImageIndex > 0
        ? selectedImageIndex - 1
        : (property?.images.length || 1) - 1;
    setSelectedImageIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex =
      selectedImageIndex < (property?.images.length || 1) - 1
        ? selectedImageIndex + 1
        : 0;
    setSelectedImageIndex(newIndex);
    scrollToIndex(newIndex);
  };

  if (!property) {
    return <div className="container py-4">Завантаження...</div>;
  }

  const handleViewRequest = async() => {
    await PropertyRequestsService.viewRequest({...requestData, propertyId: property.id})
    alert('Заявка подана!');
  }

  const images = [...property.images]
    .sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0))
    .map((img) => img.fullUrl);

  return (
    <div className="container py-4">
      <h1 className="display-4 fw-bold mb-3">{property.title}</h1>

      <div
        className="d-flex flex-nowrap gap-3 align-items-stretch"
        style={{ minHeight: "100%" }}
      >
        <div className="flex-grow-2 d-flex flex-column gap-3">
          <div className="form-control form-control-lg">
            <strong>{t.title}:</strong> {property.title}
          </div>
          <div className="form-control form-control-lg">
            <strong>{t.priceEuro}:</strong> {property.price}
          </div>
          <div className="form-control form-control-lg">
            <strong>{t.address}:</strong> {property.address}
          </div>
          <div className="form-control form-control-lg">
            <strong>{t.city}:</strong> {property.city}
          </div>
          <div className="form-control form-control-lg">
            <strong>{t.listingType}:</strong> {property.listingType}
          </div>
          <div className="form-control form-control-lg">
            <strong>{t.propertyType}:</strong> {property.propertyType}
          </div>
          <div className="form-control form-control-lg">
            <strong>{t.bedrooms}:</strong> {property.bedrooms}
          </div>
          <div className="form-control form-control-lg">
            <strong>{t.bathrooms}:</strong> {property.bathrooms}
          </div>
          <div className="form-control form-control-lg">
            <strong>{t.yearBuilt}:</strong> {property.yearBuilt || "—"}
          </div>
        </div>

        <div className="flex-grow-1 d-flex flex-column">
          {images.length > 0 ? (
            <img
              src={images[selectedImageIndex]}
              alt="Selected"
              className="img-fluid rounded border w-100"
              style={{ height: 400, objectFit: "cover" }}
            />
          ) : (
            <div
              className="d-flex justify-content-center align-items-center bg-light border rounded"
              style={{ height: 400 }}
            >
              <span className="text-muted">{t.imagesNotAvailable}</span>
            </div>
          )}

          <div
            className="d-flex align-items-center gap-3 mt-auto"
            style={{ justifyContent: "center" }}
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
                maxWidth: "100%",
                justifyContent: "center",
              }}
            >
              {images.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`перегляд-${idx}`}
                  className={`rounded border ${
                    selectedImageIndex === idx ? "border-primary border-3" : ""
                  }`}
                  style={{
                    height: 80,
                    width: 120,
                    objectFit: "cover",
                    cursor: "pointer",
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
          </div>
        </div>
      </div>

      <div className="mt-5 d-flex flex-column gap-3 flex-grow-1">
        <label htmlFor="description" className="h5 fw-semibold">
          {t.description}
        </label>
        <div
          id="description"
          className="form-control p-3"
          style={{ height: 150, whiteSpace: "pre-wrap" }}
        >
          {property.description || t.noDescription}
        </div>
      </div>

      <div className={styles.reqestRow}>
        <InputRow title={t.fullName}>
          <MyInput 
            value={requestData.name}
            setValue={e => setRequestData(prev => ({ ...prev, name: e }))}
          />
        </InputRow>

        <InputRow title={t.email}>
          <MyInput 
            name="email"
            value={requestData.email}
            setValue={e => setRequestData(prev => ({ ...prev, email: e }))}
          />
        </InputRow>

        <InputRow title={t.phone}>
          <MyInput 
            value={requestData.phone}
            setValue={e => setRequestData(prev => ({ ...prev, phone: e }))}
          />
        </InputRow>

        <MyButton onClick={handleViewRequest}>
          {t.wantToView}
        </MyButton>
      </div>
    </div>
  );
};

export default DetailAnnouncementPage;
