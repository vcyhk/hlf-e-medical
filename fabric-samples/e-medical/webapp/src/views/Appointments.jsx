import React, { useState, useEffect, useContext } from 'react';
import ActionBar from '../components/ActionBar';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import AppContext from '../context';
import { Link } from 'react-router-dom';

function Appointmens() {
    const { user } = useContext(AppContext);
    const { t } = useTranslation('common');
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('/appointments', {
            headers: {
                Authorization: `${user.token}`,
            }
        })
            .then(res => {
                if (res.data.error) {
                    setError(res.data.error);
                } else {
                    setAppointments(res.data);
                }
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return (
        <div className="appointmens">
            <ActionBar back="/app/dashboard/booking" title={t("appointments")} />
            {error && <div className="alert alert-danger">{error}</div>}
            {loading && <div className="alert alert-info">{t('loading..')}</div>}
            <div className="rows">
                {appointments.map((appointment, index) => {
                    return (
                        <Link to={`/app/dashboard/booking/appointments/${appointment.id}`} key={index}>
                            <div className="row">
                                <div className="row-contain">
                                    <div>
                                        {appointment.hospital} 
                                        <small>
                                        ({appointment.department} department)
                                        </small>
                                     </div>
                                    <div className="appointmens-item">
                                        <small>
                                        {new Date(appointment.date).toLocaleDateString()}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default Appointmens;
