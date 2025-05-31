import "bootstrap/dist/css/bootstrap.min.css";
import { FaBed, FaBath, FaRuler } from "react-icons/fa";

const BedIcon = FaBed as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const BathIcon = FaBath as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const RulerIcon = FaRuler as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

// Массив из 3-х объявлений
const announcements = [
  {
    price: 2400,
    period: "/month",
    address: "м. Київ, вул. Хрещатик, 1",
    owner: "Іван Петренко",
    details: [
      { icon: BedIcon, value: "2" },
      { icon: BathIcon, value: "1" },
      { icon: RulerIcon, value: "60 м²" },
    ],
    actions: [
      { text: "Опублікувати", className: "custom-button" },
      { text: "Відмовити", className: "custom-button red" },
    ],
  },
  {
    price: 1800,
    period: "/month",
    address: "м. Львів, вул. Дорошенка, 15",
    owner: "Олена Ковальчук",
    details: [
      { icon: BedIcon, value: "1" },
      { icon: BathIcon, value: "1" },
      { icon: RulerIcon, value: "45 м²" },
    ],
    actions: [
      { text: "Опублікувати", className: "custom-button" },
      { text: "Відмовити", className: "custom-button red" },
    ],
  },
  {
    price: 3200,
    period: "/month",
    address: "м. Одеса, вул. Дерибасівська, 10",
    owner: "Артем Сидоренко",
    details: [
      { icon: BedIcon, value: "3" },
      { icon: BathIcon, value: "2" },
      { icon: RulerIcon, value: "75 м²" },
    ],
    actions: [
      { text: "Опублікувати", className: "custom-button" },
      { text: "Відмовити", className: "custom-button red" },
    ],
  },
  {
    price: 2100,
    period: "/month",
    address: "м. Харків, вул. Сумська, 50",
    owner: "Марина Литвин",
    details: [
      { icon: BedIcon, value: "2" },
      { icon: BathIcon, value: "1" },
      { icon: RulerIcon, value: "58 м²" },
    ],
    actions: [
      { text: "Опублікувати", className: "custom-button" },
      { text: "Відмовити", className: "custom-button red" },
    ],
  },
  {
    price: 2700,
    period: "/month",
    address: "м. Дніпро, вул. Поля, 7",
    owner: "Олександр Нікітін",
    details: [
      { icon: BedIcon, value: "2" },
      { icon: BathIcon, value: "2" },
      { icon: RulerIcon, value: "70 м²" },
    ],
    actions: [
      { text: "Опублікувати", className: "custom-button" },
      { text: "Відмовити", className: "custom-button red" },
    ],
  },
  {
    price: 1500,
    period: "/month",
    address: "м. Чернівці, вул. Головна, 12",
    owner: "Наталія Іваненко",
    details: [
      { icon: BedIcon, value: "1" },
      { icon: BathIcon, value: "1" },
      { icon: RulerIcon, value: "40 м²" },
    ],
    actions: [
      { text: "Опублікувати", className: "custom-button" },
      { text: "Відмовити", className: "custom-button red" },
    ],
  },
];

const DetailAnnouncementPage = () => {
  return (
    <div className="container py-4">
      <h1 className="display-4 fw-bold mb-3">Управління публікаціями</h1>

      {announcements.map((announcement, i) => (
        <div key={i} className="card shadow-lg rounded-4 p-4 mx-auto mb-4">
          <div className="row g-4 align-items-center">
            <div className="col-md">
              <div className="d-flex align-items-baseline fw-bold fs-5">
                <span className="text-warning">${announcement.price}</span>
                <span className="text-muted ms-1 small">
                  {announcement.period}
                </span>
              </div>

              <div className="text-muted">{announcement.address}</div>

              <div className="text-secondary small d-flex align-items-center gap-3">
                {announcement.details.map(({ icon: Icon, value }, index) => (
                  <span key={index}>
                    <Icon color="orange" /> {value}
                  </span>
                ))}
              </div>
            </div>

            <div className="col-md-auto d-flex align-items-center gap-3">
              <div className="fw-bold">{announcement.owner}</div>
              {announcement.actions.map((action, index) => (
                <button key={index} className={action.className}>
                  {action.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DetailAnnouncementPage;
