import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IoReturnUpBackSharp } from "react-icons/io5";
import { Navigate, useNavigate } from 'react-router-dom';

function ChangePassword() {
    const url = localStorage.getItem('url');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const access = localStorage.getItem('access');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (oldPassword) {
            formData.append("old_password", oldPassword);
        }
        if (newPassword) {
            formData.append("new_password", newPassword);
        }
        if (confirmPassword) {
            formData.append("confirm_password", confirmPassword)
        }
        // Confirmation dialog before proceeding
        try {
            if (window.confirm('Are you sure you want to change your password?')) {
                const response = await axios.put(`${url}/api/password-change/`, {
                    "old_password": oldPassword,
                    "new_password": newPassword,
                    "confirm_password": confirmPassword,
                },
                    {
                        headers: {
                            "Authorization": `Bearer ${access}`
                        }
                    });
                if (response.status === 200) {
                    alert('Password updated successfully');
                    localStorage.clear();
                    navigate('/');
                }
            }

        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data);
            } else {
                setMessage('An unexpected error occurred.');
            }
        }
    };

    return (
        <div>
            <div className='container-fluid position-relative'>
                <div className='position-absolute top-0 end-0'>
                    <button className='btn btn-primary' id='btn-back' type='button'
                        onClick={() => navigate(-1)}
                    >
                        <IoReturnUpBackSharp /> Back
                    </button>
                </div>
            </div>
            <br />
            <br />
            <div>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <h4 className="text-center mb-4">Change Password</h4>
                            {/* {message && <div className="alert alert-info">{message}</div>} */}
                            <form className='needs-validation'>
                                <div className="row mb-3">
                                    <div className="col-md-3">
                                        <label htmlFor="oldPassword" className="form-label">Old Password</label>
                                    </div>
                                    <div className="col-md-9">
                                        <input
                                            type="password"
                                            id="oldPassword"
                                            className={`form-control ${errors.old_password ? 'is-invalid' : ''}`}
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            placeholder="Enter your old password"
                                            required
                                        />
                                        <div className="invalid-feedback">
                                            {errors.old_password && <p>{errors.old_password}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-3">
                                        <label htmlFor="newPassword" className="form-label">New Password</label>
                                    </div>
                                    <div className="col-md-9">
                                        <input
                                            type="password"
                                            id="newPassword"
                                            className={`form-control ${errors.new_password ? 'is-invalid' : ''}`}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter your new password"
                                            required
                                        />
                                        <div className="invalid-feedback">
                                            {errors.new_password && <p>{errors.new_password}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-3">
                                        <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                                    </div>
                                    <div className="col-md-9">
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            className={`form-control ${errors.confirm_password || errors.non_field_errors ? 'is-invalid' : ''}`}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm your new password"
                                            required
                                        />
                                        <div className="invalid-feedback">
                                            {errors.confirm_password && <p>{errors.confirm_password}</p>}
                                            {errors.non_field_errors && <p>{errors.non_field_errors}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-end">
                                    <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Update Password</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;
