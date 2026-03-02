import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import translationEN from './locales/en/translation.json';
import translationAM from './locales/am/translation.json';
import translationFR from './locales/fr/translation.json';
import translationES from './locales/es/translation.json';

const resources = {
    en: { translation: translationEN },
    am: { translation: translationAM },
    fr: { translation: translationFR },
    es: { translation: translationES }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false // React already escapes by default
        }
    });

export default i18n;
