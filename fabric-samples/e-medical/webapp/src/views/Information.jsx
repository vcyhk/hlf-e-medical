import React, { useState, useEffect, useContext } from 'react';
import ActionBar from '../components/ActionBar';
import axios from 'axios';
import AppContext from '../context';
import {useTranslation} from 'react-i18next'
import Collapsible from 'react-collapsible';

const Information = () => {
    const { t } = useTranslation('common');
    const { user } = useContext(AppContext);
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [submiting, setSubmiting] = useState(false);
    const [error, setError] = useState('');


    useEffect(() => {
        setLoading(true);
        axios.get(`/${user.is_doctor ? 'doctor' : 'patient'}/profile/${user.id}`, {
            headers: {
                Authorization: `${user.token}`,
            }
        })
            .then(res => {
                if (res.data.error) {
                    setError(res.data.error);
                } else {
                    if (res.data.birthday) {
                        res.data.birthday = changeToLocal(res.data.birthday);
                    }
                    setData(res.data);
                }
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const changeToISO = (local_string) => {
        return new Date(local_string).toISOString()
    }

    const changeToLocal = (iso_string) => {
        return new Date(iso_string).toLocaleDateString();
    }

    const handleDoctorFormSubmit = (e) => {
        e.preventDefault();
        setSubmiting(true);
        setError('');
        let body = JSON.stringify({
            ...data
        });
        axios.post(`/doctor/update`, body, {
            headers: {
                'Authorization': `${user.token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.data.error) {
                    setError(res.data.error);
                } else {
                    alert('Successfully updated');
                }
                setSubmiting(false);
            })
            .catch(err => {
                setError(err);
                setSubmiting(false);
            });
    }

    const handlePatientFormSubmit = (e) => {
        e.preventDefault();
        setSubmiting(true);
        setError('');
        let body = JSON.stringify({
            ...data,
            birthday: changeToISO(data.birthday)
        });
        axios.post(`/patient/update`, body, {
            headers: {
                'Authorization': `${user.token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.data.error) {
                    setError(res.data.error);
                } else {
                    alert('Successfully updated');
                }
                setSubmiting(false);
            })
            .catch(err => {
                setError(err);
                setSubmiting(false);
            });
    }


    const patientForm = (
        <div className="form">
            <form onSubmit={handlePatientFormSubmit}>
                <div className="form-field">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" name="email" id="email" onChange={handleChange} value={data.email} required />
                </div>
                <div className="form-field">
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="name" onChange={handleChange} value={data.name} required />
                </div>
                <div className="form-field">
                    <label htmlFor="birhday">Birthday</label>
                    <input type="text" name="birthday" id="birthday" onChange={handleChange} value={data.birthday} required />
                </div>
                <div className="form-field">
                    <label htmlFor="hkid">HKID</label>
                    <input type="text" name="hkid" id="hkid" onChange={handleChange} value={data.hkid} required />
                </div>
                <div className="form-field">
                    <label htmlFor="medid">MEDID</label>
                    <input type="text" name="medid" id="medid" onChange={handleChange} value={data.medid} required />
                </div>
                <div className="form-field">
                    <label htmlFor="phone">Phone Number</label>
                    <input type="text" name="phone" id="phone" onChange={handleChange} value={data.phone} required />
                </div>
                <div className="form-field">
                    <label htmlFor="address">Address</label>
                    <input type="text" name="address" id="address" onChange={handleChange} value={data.address} required />
                </div>
                <div className="form-field" style={{ textAlign: 'center' }}>
                    <button type="submit" disabled={submiting}>
                        {submiting ? 'Submiting...' : 'Update Information'}
                    </button>
                </div>
            </form>
        </div>
    )

    const doctorForm = (
        <div className="form">
            <form onSubmit={handleDoctorFormSubmit}>
                <div className="form-field">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" name="email" id="email" onChange={handleChange} value={data.email} required/>
                </div>
                <div className="form-field">
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="name" onChange={handleChange} value={data.name} required/>
                </div>
                <div className="form-field">
                    <label htmlFor="registration_no">Registration Number</label>
                    <input type="text" name="registration_number" id="registration_no" onChange={handleChange} value={data.registration_number} required/>
                </div>
                <div className="form-field">
                    <label htmlFor="hospital">Hospital</label>
                    <input type="text" name="hospital" id="hospital" onChange={handleChange} value={data.hospital} required/>
                </div>
                <div className="form-field">
                    <label htmlFor="specialization">Specialization</label>
                    <input type="text" name="department" id="specialization" onChange={handleChange} value={data.department} required/>
                </div>
                <div className="form-field" style={{ textAlign: 'center' }}>
                    <button type="submit" disabled={submiting}>
                        {submiting ? 'Submiting...' : 'Update Information'}
                    </button>
                </div>
            </form>
        </div>
    )

    return (
        <div className="information">
            <ActionBar back='/app/dashboard' title={t('information')} />
            {error && <div className="alert alert-danger">{error}</div>}
            {loading && <div className="alert alert-info">Loading...</div>}
            <div className="container">
                {data.id !== '' && (user.is_doctor ? doctorForm : patientForm)}
            </div>
        </div>

    );
};

export default Information;
