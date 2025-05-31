import "bootstrap/dist/css/bootstrap.min.css";

const DetailAnnouncementPage = () => {
  const announcementData = {
    ownerName: "Іван Іванов",
    ownerPhone: "+380123456789",
    ownerEmail: "ivan@example.com",
    title: "Квартира в центрі",
    purchasePrice: 120000,
    rentPrice: 8000,
    area: "75 м²",
    address: "Київ, вул. Хрещатик, 10",
    rooms: 3,
    description: `Продаж 2-кімнатної квартири в центрі міста.
Пропонується до продажу простора 2-кімнатна квартира загальною площею 65 м², розташована на 4-му поверсі 9-поверхового цегляного будинку по вул. Шевченка, 23.
Локація: центр міста, зручна транспортна розв’язка, поряд магазини, парк, школа та дитячий садок.
Квартира: світла та затишна, кімнати роздільні, велика кухня — 12 м², засклений балкон, санвузол роздільний.
Стан: житловий, після косметичного ремонту, встановлені металопластикові вікна, лічильники на воду та газ, інтернет, домофон.
Інфраструктура: тихий двір, є місце для паркування, поруч зупинка громадського транспорту.
Ціна: 58 000 $ (можливий торг)
Контакт: Олександр, власник — +38 (067) 123-45-67`,
  };

  return (
    <div className="container py-4">
      <h1 className="display-4 fw-bold mb-3">Нове оголошення</h1>

      <div className="d-flex flex-wrap gap-4">
        <div
          className="flex-grow-2 d-flex flex-column gap-3"
          style={{ minWidth: 300 }}
        >
          <div>
            <strong>Ім’я власника:</strong> {announcementData.ownerName}
          </div>
          <div>
            <strong>Номер власника:</strong> {announcementData.ownerPhone}
          </div>
          <div>
            <strong>Email:</strong> {announcementData.ownerEmail}
          </div>
          <div>
            <strong>Назва:</strong> {announcementData.title}
          </div>
          <div>
            <strong>Ціна покупки:</strong>{" "}
            {announcementData.purchasePrice.toLocaleString()} грн
          </div>
          <div>
            <strong>Ціна оренди:</strong>{" "}
            {announcementData.rentPrice.toLocaleString()} грн/міс
          </div>
          <div>
            <strong>Площа:</strong> {announcementData.area}
          </div>
          <div>
            <strong>Адреса:</strong> {announcementData.address}
          </div>
          <div>
            <strong>Кількість кімнат:</strong> {announcementData.rooms}
          </div>
        </div>
      </div>

      <div className="mt-5 w-100 d-flex flex-column gap-3">
        <label className="fw-semibold fs-5">Опис</label>
        <p
          className="border rounded p-3 shadow-sm"
          style={{ whiteSpace: "pre-wrap", minHeight: 150 }}
        >
          {announcementData.description}
        </p>
        <div className="d-flex justify-content-end gap-2">
          <button className="custom-button red">Відхилити</button>
          <button className="custom-button">Опублікувати</button>
        </div>
      </div>
    </div>
  );
};

export default DetailAnnouncementPage;
