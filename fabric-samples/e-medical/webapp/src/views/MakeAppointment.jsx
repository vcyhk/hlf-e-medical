import React, { useState, useEffect, useContext } from 'react';
import ActionBar from '../components/ActionBar';
import axios from 'axios';
import AppContext from '../context';
import { useNavigate } from 'react-router-dom'
import {useTranslation} from 'react-i18next';

function MakeAppointment() {
    const { t } = useTranslation('common');
    const navigate = useNavigate();
    const { user } = useContext(AppContext);
    const [appointment, setAppointment] = useState({});

    const [hospitals, setHospitals] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    useEffect(() => {
        axios.get('/hospitals', {
            headers: {
                Authorization: `${user.token}`,
            }
        })
            .then(res => {
                if (res.data.error) {
                    // setError(res.data.error);
                } else {
                    setHospitals(res.data);
                }
                // setLoading(false);
            })
            .catch(err => {
                // setError(err.message);
                // setLoading(false);
            });
    }, []);

    const handleHopitalChange = (e) => {
        if (e.target.value === '') {
            setDepartments([]);
            setDoctors([]);
        } else {
            setAppointment({ ...appointment, hospital_id: e.target.value });
            axios.get(`/hospitals/${e.target.value}/departments`, {
                headers: {
                    Authorization: `${user.token}`,
                }
            })
                .then(res => {
                    if (res.data.error) {
                        // setError(res.data.error);
                    } else {
                        setDepartments(res.data);
                    }
                    
                })
                .catch(err => {
                    // setError(err.message);
                    
                });
        }
    }

    const handleDepartmentChange = (e) => {
        if (e.target.value === '') {
            setDoctors([]);
        } else {
            setAppointment({ ...appointment, department_id: e.target.value });
            axios.get(`/hospitals/${appointment.hospital_id}/departments/${e.target.value}/doctors`, {
                headers: {
                    Authorization: `${user.token}`,
                }
            })
                .then(res => {
                    if (res.data.error) {
                        // setError(res.data.error);
                    } else {
                        setDoctors(res.data);
                    }
                    // setLoading(false);
                })
                .catch(err => {
                    // setError(err.message);
                    // setLoading(false);
                });
        }
    }

    const handleDoctorChange = (e) => {
        setAppointment({ ...appointment, doctor_id: e.target.value });
    }

    const handleDateChange = (e) => {
        // change date to iso string
        setAppointment({ ...appointment, date: new Date(e.target.value).toISOString() });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // validate appointment hospital_id, department_id, doctor_id, date are required
        if (appointment.hospital_id === '' || appointment.department_id === '' || appointment.doctor_id === '' || appointment.date === '') {
            setError('All fields are required');
        } else {
            axios.post('/appointments', appointment, {
                headers: {
                    Authorization: `${user.token}`,
                }
            })
                .then(res => {
                    if (res.data.error) {
                        setError(res.data.error);
                    } else {
                        alert('Your appointment has been made');
                        navigate('/app/dashboard');
                    }
                    setLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(false);
                });
        }
    }

    return (
        <div className="makeappointment">
            <ActionBar back="/app/dashboard/booking" title={t("make_appointment")} />
            <div className='form container'>
                <h2>Please fill in the following information</h2>
                <p>
                    Please enter you HKID correctly. It will effect your appointment, <br />
                    if your HKID is incorrect.
                </p>
                {/* display error message */}
                {error && <div className='alert alert-danger'>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="hkid">HKID</label>
                        <input type="text" name="hkid" id="hkid" required />
                    </div>
                    <div className="form-field">
                        <label htmlFor="date">Date</label>
                        <input type="date" name="date" id="date" onChange={handleDateChange} required />
                    </div>
                    <div className='form-field'>
                        <label htmlFor="hospital">Hospital</label>
                        <select name="hospital_id" id="hospital" onChange={handleHopitalChange} required>
                            <option value="">Select Hospital</option>
                            {hospitals.map(hospital => (
                                <option key={hospital.id} value={hospital.id}>{hospital.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-field">
                        <label htmlFor="time">Department</label>
                        <select name="department_id" id="department" onChange={handleDepartmentChange} required>
                            <option value="">Select Department</option>
                            {departments.map(department => (
                                <option key={department.id} value={department.id}>{department.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-field">
                        <label htmlFor="doctor">Doctor</label>
                        <select name="doctor_id" id="doctor" onChange={handleDoctorChange} required>
                            <option value="">Select Doctor</option>
                            {doctors.map(doctor => (
                                <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-field" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button type='button' onClick={() => { navigate(-1) }}>Cancel</button>
                        <button type='submit' disabled={loading}>
                            {loading ? 'Confirm...' : 'Confirm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default MakeAppointment;
