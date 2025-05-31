import React from "react";
import { FaBed, FaBath, FaRuler } from "react-icons/fa";

const BedIcon = FaBed as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const BathIcon = FaBath as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const RulerIcon = FaRuler as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

const SubmittedApplicationsPage = () => {
  return (
    <div className="container py-4">
      <h1 className="mb-4 text-start fw-semibold">Подані заявки</h1>
      <div className="card shadow-lg rounded-4 p-4 mx-auto">
        <div className="row g-4 align-items-center">
          <div className="col-md">
            <div className="fw-bold fs-5">example@email.com</div>
            <div className="text-muted">м. Київ, вул. Хрещатик, 1</div>
            <div className="text-secondary small d-flex align-items-center gap-3">
              <span>
                <BedIcon color="orange" /> 2
              </span>
              <span>
                <BathIcon color="orange" /> 1
              </span>
              <span>
                <RulerIcon color="orange" /> 60 м²
              </span>
            </div>
          </div>
          <div className="col-md-auto d-flex align-items-center gap-3">
            <div>
              <div className="fw-bold">Іван Петренко</div>
              <div className="fw-bold text-dark">+38 (098) 123-45-67</div>
            </div>
            <button className="custom-button">Оброблена</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmittedApplicationsPage;
