import React, { useState, useEffect, useContext } from 'react';
import ActionBar from '../components/ActionBar';
import { useTranslation } from "react-i18next";
import AppContext from '../context';

const Settings = () => {
    const { settings, setSettings } = useContext(AppContext);
    const { t, i18n } = useTranslation('common');
    const [lang, setLang] = useState('en');


    useEffect(() => {
        setLang(i18n.language);
    }, [i18n.language]);

    const handleLangChange = (e) => {
        setLang(e.target.value);
        localStorage.setItem('i18nextLng', e.target.value);
        i18n.changeLanguage(e.target.value);
    }

    const changeTheme = (e) => {
        setSettings({
            ...settings,
            theme: e.target.value
        });
        localStorage.setItem('settings', JSON.stringify({
            ...settings,
            theme: e.target.value
        }));
    }

    const fontIncrease = (e) => {
        setSettings({
            ...settings,
            zoom: settings.zoom + 0.1
        });
        localStorage.setItem('settings', JSON.stringify({
            ...settings,
            zoom: settings.zoom + 0.1
        }));
    }

    const fontDecrease = (e) => {
        setSettings({
            ...settings,
            zoom: settings.zoom - 0.1
        });
        localStorage.setItem('settings', JSON.stringify({
            ...settings,
            zoom: settings.zoom - 0.1
        }));


        // workaround for body color tearing during font size decrease
         // get body id element
         const body = document.getElementById('body');
        if (settings.theme === 'dark') {
       
        // set background
        body.style.backgroundColor = '#000'
        } else {
            body.style.backgroundColor = '#e7ead7'
        }
    }

    return (
        <div className="settings">
            <ActionBar back='/app/dashboard' title={t('settings')} />
            <div className="settings-content container">
                <div className="settings-item">
                    Language:
                    <div className="form-field" style={{ paddingLeft: '200px' }}>
                        <select name="lang" value={lang} onChange={handleLangChange}>
                            <option value="en">English</option>
                            <option value="ch">Chinese</option>
                        </select>
                    </div>
                </div>
                <div className="settings-item">
                    Theme:
                    <div className="form-field" style={{ paddingLeft: '200px' }}>
                        <select name="theme" id="theme" value={settings.theme} onChange={changeTheme}>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </div>
                </div>
                <div className='settings-item'>
                    Font Size:
                    <div className="form-field" style={{ paddingLeft: '200px' }}>
                        <button style={{width:'80px'}} onClick={fontIncrease}>+</button>
                        <button style={{width:'80px'}} onClick={fontDecrease}>-</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
