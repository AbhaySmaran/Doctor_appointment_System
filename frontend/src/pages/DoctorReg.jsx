import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoReturnUpBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const DoctorReg = () => {
    const url = localStorage.getItem('url');
    const navigate = useNavigate();
    const [error, setError] = useState('');
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
            try {
                const res = await axios.get(`${url}/api/departments/`);
                setDepartments(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchDepartments();
    }, [url]);

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
            const feeValue = formData.fee === '' ? null : formData.fee;
            const res = await axios.post(`${url}/api/register/user/`, 
            {
                email: formData.email,
                username: formData.username,
                password: formData.password,
                role: "doctor",
                doctor: {
                    full_name: formData.fullName,
                    department: formData.department,
                    contact: formData.contactNo,
                    specialization: formData.specialization,
                    fee: feeValue,
                    degree: formData.degree
                }
            }
            );
            
                alert("Doctor registered successfully");
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
                });
                setError('');
            
        } catch (error) {
            // Error handling
            if (error.response.data || error.response.data.doctor) {
                setError(error.response.data);
                console.error(error)
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
                <h5 className="mb-4">Doctor Registration</h5>
                <form onSubmit={handleSubmit} className='needs-validation'>
                    <div className="row mb-3" id='form-row'>
                        <div className="col-md-2">
                            <label htmlFor="fullName" className="form-label">Full Name</label>
                        </div>
                        <div className="col-md-10">
                            <input
                                type="text"
                                className={`form-control ${error.doctor ?.full_name ? "is-invalid" : ""}`}
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter full name"
                            />
                            <div className='invalid-feedback'>
                                {error.doctor ?.full_name == "This field may not be blank." ? <p>This field is required</p> : error.doctor ?.full_name}
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3" id='form-row'>
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
                            <div className='invalid-feedback'>
                                {error.email == "This field may not be blank." ? <p>This field is required </p> : error.email }
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3" id='form-row'>
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
                            <div className='invalid-feedback'>
                                {error.username == "This field may not be blank." ? <p>This field is required</p> : error.username}
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3" id='form-row'>
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
                                {error.password == "This field may not be blank." ? <p>This field is required</p> : error.password}
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3" id='form-row'>
                        <div className="col-md-2">
                            <label htmlFor="department" className="form-label">Department</label>
                        </div>
                        <div className="col-md-10">
                            <select
                                className={`form-control ${error.doctor ?.department ? 'is-invalid' : ''}`}
                                id="department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                            >
                                <option value="">Select Department</option>
                                {departments.map(department => (
                                    <option key={department.id} value={department.id}>
                                        {department.dept_name}
                                    </option>
                                ))}
                            </select>
                            <div className='invalid-feedback'>
                                {error.doctor ?.department == "This field may not be null." ? <p>This field is required</p> : error.doctor ?.department}
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3" id='form-row'>
                        <div className="col-md-2">
                            <label htmlFor="specialization" className="form-label">Specialization</label>
                        </div>
                        <div className="col-md-10">
                            <input
                                type="text"
                                className={`form-control ${error.doctor ?.specialization ? 'is-invalid' : ''}`}
                                id="specialization"
                                name="specialization"
                                value={formData.specialization}
                                onChange={handleChange}
                                placeholder="Enter specialization"
                            />
                            <div className='invalid-feedback'>{error.doctor ?.specialization == "This field may not be blank." ? <p>This field is required</p> : error.doctor ?.specialization}</div>
                        </div>
                    </div>
                    <div className="row mb-3" id='form-row'>
                        <div className="col-md-2">
                            <label htmlFor="degree" className="form-label">Degree</label>
                        </div>
                        <div className="col-md-10">
                            <input
                                type="text"
                                className={`form-control ${error.degree ? 'is-invalid' : ''}`}
                                id="degree"
                                name="degree"
                                value={formData.degree}
                                onChange={handleChange}
                                placeholder="Enter degree"
                            />
                            <div className='invalid-feedback'>{error.degree}</div>
                        </div>
                    </div>
                    <div className="row mb-3" id='form-row'>
                        <div className="col-md-2">
                            <label htmlFor="contactNo" className="form-label">Contact Number</label>
                        </div>
                        <div className="col-md-10">
                            <input
                                type="text"
                                className={`form-control ${error.contactNo ? 'is-invalid' : ''}`}
                                id="contactNo"
                                name="contactNo"
                                value={formData.contactNo}
                                onChange={handleChange}
                                placeholder="Enter contact number"
                            />
                            <div className='invalid-feedback'>{error.contactNo}</div>
                        </div>
                    </div>
                    <div className="row mb-3" id='form-row'>
                        <div className="col-md-2">
                            <label htmlFor="fee" className="form-label">Consultation Fee</label>
                        </div>
                        <div className="col-md-10">
                            <input
                                type="number"
                                className={`form-control ${error.doctor ?.fee ? 'is-invalid' : ''}`}
                                id="fee"
                                name="fee"
                                value={formData.fee}
                                onChange={handleChange}
                                placeholder="Enter consultation fee"
                            />
                            <div className='invalid-feedback'>{error.doctor ?.fee == "A valid integer is required." ? <p>This field is required</p> : error.doctor ?.fee}</div>
                        </div>
                    </div>
                    <div className="text-end">
                        <div className="col-md-12">
                            <button type="submit" className="btn btn-primary">Register</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorReg;
