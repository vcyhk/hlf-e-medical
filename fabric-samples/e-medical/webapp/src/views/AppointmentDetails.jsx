import React, { useState, useEffect, useContext } from 'react';
import ActionBar from '../components/ActionBar';
import axios from 'axios';
import AppContext from '../context';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AppointmentDetails = () => {
    const { t } = useTranslation('common');
    const { user } = useContext(AppContext);
    const { id } = useParams();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`/appointments/${id}`, {
            headers: {
                Authorization: `${user.token}`,
            }
        })
            .then(res => {
                if (res.data.error) {
                    setError(res.data.error);
                } else {
                    setAppointment(res.data);
                }
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);
 
    return (
        <div className="appointment-details">
            <ActionBar back="/app/dashboard/booking/appointments" title={t("appointment_details")} />
            {error && <div className="alert alert-danger">{error}</div>}
            {loading && <div className="alert alert-info">Loading...</div>}
            {appointment &&
                <div className="rows">
                    <div className="row">
                        <div className="row-contain row-col">
                            <div>
                                Date:
                            </div>
                            <div>
                                {new Date(appointment.date).toLocaleDateString()}
                            </div>
                        </div>
                        <div className="row-contain row-col">
                            <div>
                                Department:
                            </div>
                            <div>
                                {appointment.department}
                            </div>
                        </div>
                        <div className="row-contain row-col">
                            <div>
                                Hospital:
                            </div>
                            <div>
                                {appointment.hospital}
                            </div>
                        </div>
                        <div className="row-contain row-col">
                            <div>
                                Doctor:
                            </div>
                            <div>
                                {appointment.doctor}
                            </div>
                        </div>
                        <div className="row-contain row-col">
                            <div>
                                Status
                            </div>
                            <div>
                                {appointment.status}
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>

    );
};

export default AppointmentDetails;
