import axios from 'axios';
import React, { useState } from 'react';
import { IoReturnUpBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const ReceptionistReg = () => {
    const url = localStorage.getItem('url');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        username: '',
        password: '',
        contactNo: '',
    });

    const [error, setError] = useState({}); // State to hold validation errors

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${url}/api/register/user/`, {
                email: formData.email,
                username: formData.username,
                password: formData.password,
                role: "receptionist",
                receptionist: {
                    full_name: formData.fullName,
                    contact_no: formData.contactNo
                }
            });
            if (res.status === 201) {
                alert('Receptionist registered successfully');
                setFormData({
                    fullName: '',
                    email: '',
                    username: '',
                    password: '',
                    contactNo: '',
                });
                setError({});
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data);
            } else {
                console.error("An unexpected error occurred", error);
            }
        }
    };

    return (
        <div>
            <div className='container-fluid position-relative'>
                <div className='position-absolute top-0 end-0'>
                    <button className='btn btn-primary' id='btn-back' type='button'
                        onClick={() => navigate('/dashboard/receptionist')}
                    >
                        <IoReturnUpBackSharp /> Back
                    </button>
                </div>
            </div>
            <div className="container">
                <h5 className="mb-4">Receptionist Registration</h5>
                <form onSubmit={handleSubmit} className='needs-validation'>
                    <div className="row mb-3">
                        <div className="col-md-2">
                            <label htmlFor="fullName" className="form-label">Full Name</label>
                        </div>
                        <div className="col-md-10">
                            <input
                                type="text"
                                className={`form-control ${error.full_name ? "is-invalid" : ""}`}
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter full name"
                            />
                            <div className='invalid-feedback'>{error.full_name && <p>{error.full_name}</p>}</div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-2">
                            <label htmlFor="email" className="form-label">Email</label>
                        </div>
                        <div className="col-md-10">
                            <input
                                type="email"
                                className={`form-control ${error.email ? "is-invalid" : ""}`}
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                            />
                            <div className='invalid-feedback'>{error.email && <p>{error.email}</p>}</div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-2">
                            <label htmlFor="username" className="form-label">Username</label>
                        </div>
                        <div className="col-md-10">
                            <input
                                type="text"
                                className={`form-control ${error.username ? "is-invalid" : ""}`}
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter username"
                            />
                            <div className='invalid-feedback'>{error.username && <p>{error.username}</p>}</div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-2">
                            <label htmlFor="password" className="form-label">Password</label>
                        </div>
                        <div className="col-md-10">
                            <input
                                type="password"
                                className={`form-control ${error.password ? 'is-invalid' : ""}`}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                            />
                            <div className='invalid-feedback'>
                                {error.password && <p>{error.password}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-2">
                            <label htmlFor="contactNo" className="form-label">Contact Number</label>
                        </div>
                        <div className="col-md-10">
                            <input
                                type="text"
                                className={`form-control ${error.contact_no ? 'is-invalid' : ''}`}
                                id="contactNo"
                                name="contactNo"
                                value={formData.contactNo}
                                onChange={handleChange}
                                placeholder="Enter contact number"
                            />
                            <div className='invalid-feedback'>
                                {error.contact_no && <p>{error.contact_no}</p>}
                            </div>
                        </div>
                    </div>
                    <div className='text-end'>
                        <button type="submit" className="btn btn-primary">Register</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReceptionistReg;
