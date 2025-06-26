import React, { useEffect, useState } from "react";
import { FaBed, FaBath, FaRuler } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { PropertyRequestsService, UserPropertyRequest } from "../../app/api/service/PropertyRequestsService";
import { RouteNames } from "../../app/router";
import MyButton from "../../UI/MyButton/MyButton";
import $api from "../../app/api/http";
import { useTranslations } from "../../store/translations";

const BedIcon = FaBed as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const BathIcon = FaBath as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const RulerIcon = FaRuler as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

const SubmittedApplicationsPage = () => {
  const navigate = useNavigate();
  const { translations } = useTranslations();
  const t = translations();

  const [applications, setApplications] = useState<UserPropertyRequest[]>([]);

  const fetchApplication = async () => {
    const { data } = await PropertyRequestsService.getSubmitPorperty(1);
    setApplications(data);
  };

  useEffect(() => {
    fetchApplication();
  }, []);

  const handleCardClick = (property: UserPropertyRequest) => {
    navigate(RouteNames.PROPERTY_DETEIL + `/${property.property.id}`);
  };

  const handleRemove = async (id: number) => {
    await $api.delete("property-views/" + id);
    alert(t.applicationProcessedAlert);
    fetchApplication();
  };

  return (
    <div className="container py-4">
      <h1 className="display-4 fw-bold mb-3">{t.submittedApplicationsTitle}</h1>

      {applications.map((property, i) => (
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
                <span className="text-muted ms-1 small">{t.perMonth}</span>
              </div>

              <div className="text-muted">
                {property.property.address}, {property.property.city}
              </div>

              <div className="text-secondary small d-flex align-items-center gap-3">
                <span>
                  <BedIcon color="orange" /> {property.property.bedrooms} {t.beds}
                </span>
                <span>
                  <BathIcon color="orange" /> {property.property.bathrooms} {t.baths}
                </span>
                {property.property.yearBuilt && (
                  <span>
                    <RulerIcon color="orange" /> {property.property.yearBuilt} {t.yearBuiltSuffix}
                  </span>
                )}
              </div>
            </div>

            <div className="col-md-auto d-flex align-items-center gap-3 flex-column">
              <div className="fw-bold">
                {property.name} <br />
                {property.phone} <br />
                {property.email}
              </div>
            </div>
              <MyButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(property.id);
                }}
              >
                {t.processed}
              </MyButton>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubmittedApplicationsPage;
