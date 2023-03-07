import React, { useContext, useEffect } from 'react';
import info from '../assets/images/information.png';
import booking from '../assets/images/booking.png';
import mailbox from '../assets/images/mailbox.png';
import reward from '../assets/images/reward.png';
import search from '../assets/images/search.png';
import settings from '../assets/images/settings.png';
import { Link, useNavigate } from 'react-router-dom';
import AppContext from '../context';
import { useTranslation } from "react-i18next";

function Dashboard() {
    const { t } = useTranslation('common');
    const { user, setUser } = useContext(AppContext);
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        setUser(null);
        localStorage.removeItem('user');
        navigate('/');
    }

    if (user.is_doctor) {
        return (
            <div className="dashboard">
                <div className="user-info">
                    <div style={{ textAlign: 'right' }}>
                        <a href="#" onClick={handleLogout}>{t('logout')}</a>
                    </div>
                    <h2 style={{ marginBottom: '0' }}>{t('hi')}</h2>
                    <h2 style={{ marginTop: '0' }}>{user.name}</h2>
                </div>
                <div className="items container">
                    <Link to="/app/dashboard/information" className="item">
                        <div>
                            <picture>
                                <img src={info} alt="" />
                            </picture>
                            <div className="title">
                                {t('information')}
                            </div>
                        </div>
                    </Link>
                    <Link to="/app/dashboard/Mailbox" className="item">
                        <div>
                            <picture>
                                <img src={mailbox} alt="" />
                            </picture>
                            <div className="title">
                                {t('mailbox')}
                            </div>
                        </div>
                    </Link>
                    <Link to="/app/dashboard/reward" className="item">
                        <div className="item">
                            <picture>
                                <img src={reward} alt="" />
                            </picture>
                            <div className="title">
                            {t('reward')}
                            </div>
                        </div>
                    </Link>
                    <Link to="/app/dashboard/settings" className="item">
                        <div className="item">
                            <picture>
                                <img src={settings} alt="" />
                            </picture>
                            <div className="title">
                            {t('settings')}
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        )
    } else{
        return (
            <div className="dashboard">
                <div className="user-info">
                    <div style={{ textAlign: 'right' }}>
                        <a href="#" onClick={handleLogout}>{t('logout')}</a>
                    </div>
                    <h2 style={{ marginBottom: '0' }}>{t('hi')}</h2>
                    <h2 style={{ marginTop: '0' }}>{user.name}</h2>
                </div>
                <div className="db-header">
                    <h3>What's New</h3>
                    <p>You can claim daily reward to get your EMED token ! </p>
                </div>
                <div className="items container">
                    <Link to="/app/dashboard/information" className="item">
                        <div>
                            <picture>
                                <img src={info} alt="" />
                            </picture>
                            <div className="title">
                            {t('information')}
                            </div>
                        </div>
                    </Link>
                    <Link to="/app/dashboard/hospitals" className="item">
                        <div>
                            <picture>
                                <img src={search} alt="" />
                            </picture>
                            <div className="title">
                            {t('find_doctor')}
                            </div>
                        </div>
                    </Link>
                    <Link to="/app/dashboard/booking" className="item">
                        <div className="item">
                            <picture>
                                <img src={booking} alt="" />
                            </picture>
                            <div className="title">
                            {t('booking')}
                            </div>
                        </div>
                    </Link>
                    <Link to="/app/dashboard/reward" className="item">
                        <div className="item">
                            <picture>
                                <img src={reward} alt="" />
                            </picture>
                            <div className="title">
                            {t('reward')}
                            </div>
                        </div>
                    </Link>
                    <Link to="/app/dashboard/settings" className="item">
                        <div className="item">
                            <picture>
                                <img src={settings} alt="" />
                            </picture>
                            <div className="title">
                               {t('settings')}
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        )
    }

}

export default Dashboard;
