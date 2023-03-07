import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register({ }) {
    const [isdoctor, setDoctor] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setDoctor(e.target.value === 'doctor');
    }

    const handleNext = (e) => {
        e.preventDefault();
        if (isdoctor) {
            navigate('/register/doctor');
        } else {
            navigate('/register/patient');
        }
    }


    return (
        <div className="register container" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '1.2rem' }}>What kind of user are you?</span>
                <br />
                <div style={{ margin: '20px 0' }}>
                    <input type="radio" name="user" id="patient" value="patient" onChange={handleChange} />
                    <label htmlFor="patient">Patient</label>
                    <input type="radio" name="user" id="doctor" value="doctor" onChange={handleChange} />
                    <label htmlFor="doctor">Doctor</label>
                </div>

                <div className="form-field">
                    <button onClick={handleNext}>Next</button>
                </div>
            </div>
        </div>
    );
}

export default Register;
