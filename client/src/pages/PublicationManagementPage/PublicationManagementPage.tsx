import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { FaBed, FaBath, FaRuler } from "react-icons/fa";
import PropertyService, {
  PropertyResponse,
} from "../../app/api/service/PropertyService";
import { useNavigate } from "react-router-dom";
import { PropertyRequestsService, UserPropertyRequest } from "../../app/api/service/PropertyRequestsService";
import { RouteNames } from "../../app/router";

const BedIcon = FaBed as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const BathIcon = FaBath as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const RulerIcon = FaRuler as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

const PublicationManagementPage = () => {
  const [properties, setProperties] = useState<UserPropertyRequest[]>([]);
  const navigate = useNavigate(); // ← Хук для навигации\
  const handleCardClick = (property: UserPropertyRequest) => {
    navigate(RouteNames.PROPERTY_DETEIL + `/${property.property.id}`); // ← Навигация с id
  };

  const fetchReqProperty = async () =>{
    const {data} = await PropertyRequestsService.getSubmitPorperty()
    setProperties(data)
  }
  useEffect(() => {
      fetchReqProperty()
  }, []);

  const publishProperty = async(id: number) => {
    await PropertyRequestsService.approveSubmitProperty(id)
    fetchReqProperty()
  }

    const rejectSubmitProperty = async(id: number) => {
    await PropertyRequestsService.rejectSubmitProperty(id)
    fetchReqProperty()
  }

  

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
                <span className="text-warning">${property.property.price}</span>
                <span className="text-muted ms-1 small">/month</span>
              </div>

              <div className="text-muted">
                {property.property.address}, {property.property.city}
              </div>

              <div className="text-secondary small d-flex align-items-center gap-3">
                <span>
                  <BedIcon color="orange" /> {property.property.bedrooms} спалень
                </span>
                <span>
                  <BathIcon color="orange" /> {property.property.bathrooms} ванн
                </span>
                {property.property.yearBuilt && (
                  <span>
                    <RulerIcon color="orange" /> {property.property.yearBuilt} р.
                    побудови
                  </span>
                )}
              </div>
            </div>

            <div className="col-md-auto d-flex align-items-center gap-3">
              <div className="fw-bold">
                {property.name} 
              </div>
              <button
  className="custom-button"
  onClick={e => {
    e.stopPropagation();
    publishProperty(property.property.id);
  }}
>
  Опублікувати
</button>

<button
  className="custom-button red"
  onClick={e => {
    e.stopPropagation();
    rejectSubmitProperty(property.property.id);
  }}
>
  Відмовити
</button>

            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PublicationManagementPage;
