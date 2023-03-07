import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './components/AuthProvider';

import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import common_ch from "./translations/ch/common.json";
import common_en from "./translations/en/common.json";


axios.defaults.baseURL = 'http://localhost:8000';

// get lng value from localStorage
const lng = localStorage.getItem('i18nextLng') || 'en';

i18next.init({
    interpolation: { escapeValue: false },
    lng: lng,                              
    resources: {
        en: {
            common: common_en               
        },
        ch: {
            common: common_ch
        },
    },
});
ReactDOM.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </I18nextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
