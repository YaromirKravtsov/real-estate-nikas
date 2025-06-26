import { create } from 'zustand';

export type Locale = 'en' | 'uk';

const translationsMap = {
  en: {
    announcement: 'Announcement',
    applications: 'Applications',
    employees: 'Employees',
    clientApplications: 'Client Applications',
    searchProperty: 'Search property',
    postAd: 'Post an ad',
    changeLanguage: 'Change language',

    heroTitle: 'Wonderful homes, made for you',
    heroDescription:
      'At first glance, it seems like everything matters, because the greatest joy lies in the ability to create. We are capable of doing what is needed through effort and precision, and that is what forms the real foundation of our actions.',

    trustTitle: 'You’re in good hands',
    trustDescription:
      'Our approach is more than just words. We take care of every aspect to protect you from risks and ensure maximum comfort. As experienced guides in the world of real estate, we reveal what was previously hidden — from real value to genuine satisfaction.',

    learnMore: 'Learn more',

    listingsTitle: 'Find your new place to live',
    nothingFound: 'Nothing found',

    filterLocation: 'Location',
    filterType: 'Property type',
    filterPurpose: 'Looking for',
    filterPrice: 'Price',

    loading: 'Loading...',
    title: 'Title',
    priceEuro: 'Price in €',
    address: 'Address',
    city: 'City',
    listingType: 'Listing type',
    propertyType: 'Property type',
    bedrooms: 'Bedrooms',
    bathrooms: 'Bathrooms',
    yearBuilt: 'Year built',
    noDescription: 'No description available',
    description: 'Description',
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone',
    wantToView: 'I want to view',
    imagesNotAvailable: 'Images not available',

    addAnnouncement: 'Add Announcement',
    name: 'Name',
    sale: 'Sale',
    rent: 'Rent',
    addImage: 'Add Image',
    submitSuccess: 'Thank you! Your application has been submitted. Our agent will contact you after verification.',
    submitError: 'Error occurred while creating the announcement',
  },
  uk: {
    announcement: 'Оголошення',
    applications: 'Заявки',
    employees: 'Співробітники',
    clientApplications: 'Заявки клієнтів',
    searchProperty: 'Шукати нерухомість',
    postAd: 'Подати оголошення',
    changeLanguage: 'Змінити мову',

    heroTitle: 'Чудові оселі, створені для вас',
    heroDescription:
      'На перший погляд здається, що все це має значення, адже найбільше задоволення приносить можливість творити. Ми здатні зробити все, що потрібно, докладаючи зусиль і точності, і саме це формує справжню основу наших дій.',

    trustTitle: 'Ви в надійних руках',
    trustDescription:
      'Наш підхід — це більше, ніж просто слова. Ми дбаємо про кожен аспект, щоб захистити вас від ризиків і забезпечити максимальний комфорт. Як досвідчені провідники у світі нерухомості, ми відкриваємо те, що раніше залишалося прихованим — від реальної цінності до справжнього задоволення.',

    learnMore: 'Дізнатись більше',

    listingsTitle: 'Знайдіть своє нове місце для життя',
    nothingFound: 'Нічого не знайдено',

    filterLocation: 'Місце розташування',
    filterType: 'Тип нерухомості',
    filterPurpose: 'Шукаєте',
    filterPrice: 'Ціна',

    loading: 'Завантаження...',
    title: 'Назва',
    priceEuro: 'Ціна у €',
    address: 'Адреса',
    city: 'Місто',
    listingType: 'Тип оголошення',
    propertyType: 'Тип нерухомості',
    bedrooms: 'Кількість спалень',
    bathrooms: 'Кількість ванних кімнат',
    yearBuilt: 'Рік побудови',
    noDescription: 'Опис відсутній',
    description: 'Опис',
    fullName: 'ФІО',
    email: 'Email',
    phone: 'Телефон',
    wantToView: 'Хочу перегляд',
    imagesNotAvailable: 'Зображення відсутнє',

    addAnnouncement: 'Додати оголошення',
    name: 'Ім\'я',
    sale: 'Продаж',
    rent: 'Оренда',
    addImage: 'Додати зображення',
    submitSuccess: 'Дякуємо! Ваша заявка подана. Наш агент зв’яжеться з вами після перевірки.',
    submitError: 'Помилка під час створення оголошення',
  }
};


interface TranslationsStore {
  locale: Locale;
  setLocale: (val: Locale) => void;
  translations: () => Record<string, string>;
}

export const useTranslations = create<TranslationsStore>((set, get) => ({
  locale: 'uk',
  setLocale: (val) => set({ locale: val }),
  translations: () => translationsMap[get().locale],
}));
