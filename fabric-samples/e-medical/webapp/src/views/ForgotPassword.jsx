import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';

function ForgotPassword() {
    const navigate = useNavigate();
    const [data, setData] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('');

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data);
        setLoading(true);
        axios.post('/forgot', {
            ...data
        })
            .then(res => {
                if (res.data.error) {
                    setError(res.data.error);
                } else {
                    setToken(res.data.token);
                    setError('');
                    navigate(`/passwordreset/${res.data.token}`);
                }
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }

    return (
        <div className="forgot-password container">
            <div className="forgot-password-content">
                {/* show error */}
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" onChange={handleChange} value={data.email} required/>
                    </div>
                    <div className="form-field">
                        <label htmlFor="question1">Question 1</label>
                        <select name="question1" id="question1" onChange={handleChange} value={data.question1} required>
                            <option value="">Please select</option>
                            <option value="What is the name of your first pet?">What is the name of your first pet?</option>
                            <option value="What is your mother's name?">What is your mother's name?</option>
                            <option value="What was your first car?">What was your first car?</option>
                            <option value="What is your best friend name?">What is your best friend name?</option>
                        </select>
                        <input type="text" name="answer1" id="answer1" placeholder='Answer 1' onChange={handleChange} value={data.answer1} required />
                    </div>
                    <div className="form-field">
                        <label htmlFor="question2">Question 2</label>
                        <select name="question2" id="question2" onChange={handleChange} value={data.question2} required>
                            <option value="">Please select</option>
                            <option value="What is the name of your first pet?">What is the name of your first pet?</option>
                            <option value="What is your mother's name?">What is your mother's name?</option>
                            <option value="What was your first car?">What was your first car?</option>
                            <option value="What is your best friend name?">What is your best friend name?</option>
                        </select>
                        <input type="text" name="answer2" id="answer2" placeholder='Answer 2' onChange={handleChange} value={data.answer2} required />
                    </div>
                    <div className="form-field" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button type="button" onClick={()=>{navigate(-1)}}>Cancel</button>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Confirm...' : 'Confirm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
