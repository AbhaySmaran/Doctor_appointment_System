// ReceptionistRegistrationForm.js
import axios from 'axios';
import React, { useState } from 'react';

const ReceptionistReg = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        username: '',
        password: '',
        contactNo: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const res = axios.post('http://127.0.0.1:8000/api/register/user/',{
          "email": formData.email,
          "username": formData.username ,
          "password": formData.password,
          "role": "receptionist",
          "receptionist":{
            "full_name": formData.fullName,
            "contact_no": formData.contactNo
          }
        })
        alert('Receptionist registered')
        setFormData({
          fullName: '',
          email: '',
          username: '',
          password: '',
          contactNo: '',
        })
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Receptionist Registration</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="fullName">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter full name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter email"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="fullName">username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        name="fullName"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Enter username"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="fullName">Password</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter password"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contactNo">Contact Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="contactNo"
                                        name="contactNo"
                                        value={formData.contactNo}
                                        onChange={handleChange}
                                        placeholder="Enter contact number"
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">Register</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceptionistReg;
