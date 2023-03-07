import React, { useState, useEffect, useContext } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import axios from 'axios';
import AppContext from '../context';

function Login() {
    const {user, setUser} = useContext(AppContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.name === 'email') {
            setEmail(e.target.value);
        } else {
            setPassword(e.target.value);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        axios.post('/login', {
            email,
            password
        })
            .then(res => {
                console.log(res);
                if (res.data.error) {
                    setError(res.data.error);
                } else {
                    localStorage.setItem('user', JSON.stringify(res.data));
                    setUser(res.data);
                    navigate('/app/dashboard');
                }
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }

    return (
        <div className="login container">
            <div style={{ textAlign: "center" }}>
                <img src={logo} alt="logo" width="200" />
            </div>
            {/* display error */}
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="form">
                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="email">Email Address</label>
                        <input type="email" name="email" id="email" onChange={handleChange} required />
                    </div>
                    <div className="form-field">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" onChange={handleChange} required />
                    </div>
                    <div className="form-field">
                        <Link to="/forgot">Forgot Password?</Link>
                    </div>
                    <div className="form-field" style={{ textAlign: 'center' }}>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Login...' : 'Login'}
                        </button>
                    </div>
                </form>
            </div>
            <div style={{ textAlign: 'center' }} className="register">
                <p>
                    Don't have an account?
                    <br />
                    <Link to='/register'><b>Register</b></Link>
                </p>
            </div>
        </div>
    );

}

export default Login;
