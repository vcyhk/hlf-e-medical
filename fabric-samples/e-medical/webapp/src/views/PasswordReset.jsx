import React, {useState} from 'react';
import axios from 'axios';
import {useParams, useNavigate} from 'react-router-dom'

const PasswordReset = () => {
    const navigate = useNavigate();
    const param = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        if (e.target.name === 'newPassword') {
            setNewPassword(e.target.value);
        } else if (e.target.name === 'confirmPassword') {
            setConfirmPassword(e.target.value);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword === '' || confirmPassword === '') {
            setError('All fields are required');
        } else if (newPassword !== confirmPassword) {
            setError('Password and confirm password must be the same');
        } else {
            setLoading(true);
            axios.post('/passwordreset', {
                new_password:newPassword,
                token: param.token
            })
            .then(res => {
                if (res.data.error) {
                    setError(res.data.error);
                    setLoading(false);
                } else {
                    alert('Password reset successfully');
                    navigate('/login');
                }
            })
            .catch(err => {
                console.log(err);
            })
        }
    }
  return (
    <div className="password-rest container">
        {/* show error */}
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="form">
            <form onSubmit={handleSubmit}>
                <div className="form-field">
                    <label htmlFor="new_password">New Password</label>
                    <input type="password" id="new_password" name='newPassword' onChange={handleChange} value={newPassword}  required/>
                </div>
                <div className="form-field">
                    <label htmlFor="confirm_password">Confirm Password</label>
                    <input type="password" id="confirm_password" name='confirmPassword' onChange={handleChange} value={confirmPassword} required/>
                </div>
                <div className="form-field" style={{display:'flex', justifyContent:'space-between'}}>
                    <button type='button' onClick={()=>{navigate(-1)}}>Cancel</button>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Confirm...' : 'Confirm'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default PasswordReset;
