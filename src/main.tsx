import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App';
import { ChakraProvider, ColorModeScript, Button } from '@chakra-ui/react';
import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import './styles/main.scss';
import { store } from './store/store';
import { Provider } from 'react-redux';

const config: ThemeConfig = {
  initialColorMode: 'dark', // 'dark' | 'light'
  useSystemColorMode: false,
};
const theme = extendTheme({ config });

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    supportedLngs: ['en', 'es', 'ja', 'zh'],
    fallbackLng: 'en',
    detection: {
      order: ['htmlTag', 'querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'path', 'subdomain'],
      caches: ['cookie'],
    },
    backend: {
      loadPath: '/assests/locales/{{lng}}/translation.json',
    },

    interpolation: {
      escapeValue: false,
    },
  });

const loadingMarkup = <div></div>;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Suspense fallback={loadingMarkup}>
    <ChakraProvider>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Provider store={store}>
        <App />
      </Provider>
    </ChakraProvider>
  </Suspense>,
);
