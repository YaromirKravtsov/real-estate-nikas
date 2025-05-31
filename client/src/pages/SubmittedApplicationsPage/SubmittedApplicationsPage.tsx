import React from "react";
import { FaBed, FaBath, FaRuler } from "react-icons/fa";

const BedIcon = FaBed as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const BathIcon = FaBath as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const RulerIcon = FaRuler as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

// Массив заявок
const applications = [
  {
    email: "example@email.com",
    address: "м. Київ, вул. Хрещатик, 1",
    details: [
      { icon: BedIcon, value: "2" },
      { icon: BathIcon, value: "1" },
      { icon: RulerIcon, value: "60 м²" },
    ],
    contact: {
      name: "Іван Петренко",
      phone: "+38 (098) 123-45-67",
    },
    status: {
      text: "Оброблена",
      className: "custom-button",
    },
  },
  {
    email: "olena@example.com",
    address: "м. Львів, вул. Зелена, 12",
    details: [
      { icon: BedIcon, value: "1" },
      { icon: BathIcon, value: "1" },
      { icon: RulerIcon, value: "48 м²" },
    ],
    contact: {
      name: "Олена Іванчук",
      phone: "+38 (097) 456-78-90",
    },
    status: {
      text: "Оброблена",
      className: "custom-button",
    },
  },
  {
    email: "artem.s@example.com",
    address: "м. Харків, вул. Наукова, 22",
    details: [
      { icon: BedIcon, value: "3" },
      { icon: BathIcon, value: "2" },
      { icon: RulerIcon, value: "72 м²" },
    ],
    contact: {
      name: "Артем Сидоренко",
      phone: "+38 (093) 777-66-55",
    },
    status: {
      text: "Оброблена",
      className: "custom-button",
    },
  },
  {
    email: "viktor.bond@example.com",
    address: "м. Дніпро, вул. Центральна, 5",
    details: [
      { icon: BedIcon, value: "2" },
      { icon: BathIcon, value: "1" },
      { icon: RulerIcon, value: "58 м²" },
    ],
    contact: {
      name: "Віктор Бондар",
      phone: "+38 (095) 123-45-00",
    },
    status: {
      text: "Оброблена",
      className: "custom-button",
    },
  },
  {
    email: "nata.kh@example.com",
    address: "м. Запоріжжя, вул. Перемоги, 17",
    details: [
      { icon: BedIcon, value: "1" },
      { icon: BathIcon, value: "1" },
      { icon: RulerIcon, value: "40 м²" },
    ],
    contact: {
      name: "Наталя Хоменко",
      phone: "+38 (050) 654-32-10",
    },
    status: {
      text: "Оброблена",
      className: "custom-button",
    },
  },
  {
    email: "andrii.m@example.com",
    address: "м. Вінниця, вул. Пирогова, 8",
    details: [
      { icon: BedIcon, value: "2" },
      { icon: BathIcon, value: "1" },
      { icon: RulerIcon, value: "63 м²" },
    ],
    contact: {
      name: "Андрій Мельник",
      phone: "+38 (096) 888-77-66",
    },
    status: {
      text: "Оброблена",
      className: "custom-button",
    },
  },
];

const SubmittedApplicationsPage = () => {
  return (
    <div className="container py-4">
      <h1 className="display-4 fw-bold mb-3">Подані заявки</h1>

      {applications.map((app, i) => (
        <div key={i} className="card shadow-lg rounded-4 p-4 mx-auto mb-4">
          <div className="row g-4 align-items-center">
            <div className="col-md">
              <div className="fw-bold fs-5">{app.email}</div>
              <div className="text-muted">{app.address}</div>
              <div className="text-secondary small d-flex align-items-center gap-3">
                {app.details.map(({ icon: Icon, value }, index) => (
                  <span key={index}>
                    <Icon color="orange" /> {value}
                  </span>
                ))}
              </div>
            </div>
            <div className="col-md-auto d-flex align-items-center gap-3">
              <div>
                <div className="fw-bold">{app.contact.name}</div>
                <div className="fw-bold text-dark">{app.contact.phone}</div>
              </div>
              <button className={app.status.className}>
                {app.status.text}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubmittedApplicationsPage;
