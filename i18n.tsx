import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './src/locales/en/translation.json';
import translationJA from './src/locales/ja/translation.json';
import backend from "i18next-http-backend";
import detector from "i18next-browser-languagedetector";

// Translation resources
const resources = {
    en: {
        translation: translationEN,
    },
    ja: {
        translation: translationJA,
    },
};

i18n
    .use(detector)
    .use(backend)
    .use(initReactI18next)
    .init({
    resources,
    lng: 'en',
    fallbackLng: 'en'
});

export default i18n;
