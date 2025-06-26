import { create } from 'zustand';

export type Locale = 'en' | 'uk';

const translationsMap = {
  en: {
    announcement: 'Announcement',
    applications: 'Applications',
    employees: 'Employees',
    clientApplications: 'Client Applications'
  },
  uk: {
    announcement: 'Оголошення',
    applications: 'Заявки',
    employees: 'Співробітники',
    clientApplications: 'Заявки клієнтів'
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
