// DoctorRegistrationForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoReturnUpBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const DoctorReg = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        username: '',
        password: '',
        department: '',
        specialization: '',
        degree: '',
        contactNo: '',
        fee: '',
    });
    const [departments, setDepartments] = useState([]);
    useEffect(() => {
        const fetchDepartments = async () => {
            const res = await axios.get('http://127.0.0.1:8000/api/departments/')
            setDepartments(res.data)
        };
        fetchDepartments();
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const res = axios.post('http://127.0.0.1:8000/api/register/user/', {
            "email": formData.email,
            "username": formData.username,
            "password": formData.password,
            "role": "doctor",
            "doctor": {
                "full_name": formData.fullName,
                "department": formData.department,
                "contact": formData.contactNo,
                "specialization": formData.specialization,
                "fee": formData.fee,
                "degree": formData.degree
            }
        })
        alert("Doctor registered")
        setFormData({
            fullName: '',
            email: '',
            username: '',
            password: '',
            department: '',
            specialization: '',
            degree: '',
            contactNo: '',
            fee: '',
        })
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
            <br />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Doctor Registration</h4>
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
                                        <label htmlFor="email">Username</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            placeholder="Enter username"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Password</label>
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
                                        <label htmlFor="gender">Department Name</label>
                                        <select
                                            className="form-control"
                                            id="department"
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map((department) => (
                                                <option value={department.id}>{department.dept_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="specialization">Specialization</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="specialization"
                                            name="specialization"
                                            value={formData.specialization}
                                            onChange={handleChange}
                                            placeholder="Enter specialization"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="degree">Degree</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="degree"
                                            name="degree"
                                            value={formData.degree}
                                            onChange={handleChange}
                                            placeholder="Enter degree"
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
                                    <div className="form-group">
                                        <label htmlFor="fee">Consultation Fee</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="fee"
                                            name="fee"
                                            value={formData.fee}
                                            onChange={handleChange}
                                            placeholder="Enter consultation fee"
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Register</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorReg;
