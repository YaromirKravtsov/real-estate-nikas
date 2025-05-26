import "./DetailAnnouncementPage.css";

const DetailAnnouncementPage = () => {
  // Пример данных
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
    <div className="main-page">
      <h1 className="page-title">Нове оголошення</h1>

      <div className="form-container">
        <div className="form-fields">
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
            <strong>Ціна покупки:</strong> {announcementData.purchasePrice} грн
          </div>
          <div>
            <strong>Ціна оренди:</strong> {announcementData.rentPrice} грн/міс
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

      <div className="description-section">
        <label className="description-label">Опис</label>
        <p className="description-textarea" style={{ whiteSpace: "pre-wrap" }}>
          {announcementData.description}
        </p>
        <div className="button-wrapper">
          <button className="upload-danger dan me-2">Відхилити</button>{" "}
          <button className="upload-button create-request-button">
            Опублікувати
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailAnnouncementPage;
