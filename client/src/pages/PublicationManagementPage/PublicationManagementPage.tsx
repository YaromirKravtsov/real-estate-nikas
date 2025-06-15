import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { FaBed, FaBath, FaRuler } from "react-icons/fa";
import PropertyService, {
  PropertyResponse,
} from "../../app/api/service/PropertyService";
import { useNavigate } from "react-router-dom";

const BedIcon = FaBed as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const BathIcon = FaBath as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const RulerIcon = FaRuler as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

const DetailAnnouncementPage = () => {
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const navigate = useNavigate(); // ← Хук для навигации\
  const handleCardClick = (property: PropertyResponse) => {
    navigate(`/DetailAnnouncementPage/${property.id}`); // ← Навигация с id
  };
  useEffect(() => {
    PropertyService.getAllProperties()
      .then((res) => setProperties(res.data))
      .catch((err) => console.error("Failed to load properties:", err));
  }, []);

  return (
    <div className="container py-4">
      <h1 className="display-4 fw-bold mb-3">Управління публікаціями</h1>

      {properties.map((property, i) => (
        <div
          key={i}
          className="card shadow-lg rounded-4 p-4 mx-auto mb-4"
          style={{ cursor: "pointer" }}
          onClick={() => handleCardClick(property)}
        >
          <div className="row g-4 align-items-center">
            <div className="col-md">
              <div className="d-flex align-items-baseline fw-bold fs-5">
                <span className="text-warning">${property.price}</span>
                <span className="text-muted ms-1 small">/month</span>
              </div>

              <div className="text-muted">
                {property.address}, {property.city}
              </div>

              <div className="text-secondary small d-flex align-items-center gap-3">
                <span>
                  <BedIcon color="orange" /> {property.bedrooms} спалень
                </span>
                <span>
                  <BathIcon color="orange" /> {property.bathrooms} ванн
                </span>
                {property.yearBuilt && (
                  <span>
                    <RulerIcon color="orange" /> {property.yearBuilt} р.
                    побудови
                  </span>
                )}
              </div>
            </div>

            <div className="col-md-auto d-flex align-items-center gap-3">
              <div className="fw-bold">?????: </div>
              <button className="custom-button">Опублікувати</button>
              <button className="custom-button red">Відмовити</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DetailAnnouncementPage;
