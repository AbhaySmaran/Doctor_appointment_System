// PatientRegistrationForm.js
import axios from 'axios';
import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

const PatientReg = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        age: '',
        email: '',
        gender: '',  
        dob: '',
        address: '',
        nationality: '',
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
        const res = axios.post('http://127.0.0.1:8000/api/patients/',{
            "full_name": formData.fullName,
            "age": formData.age,
            "email": formData.email,
            "gender": formData.gender,
            "dob": formData.dob,
            "address": formData.address,
            "nationality": formData.nationality,
            "contact_no": formData.contactNo
        })

        alert(res.data.msg)
        setFormData({
            fullName: '',
            age: '',
            email: '',
            gender: '',  
            dob: '',
            address: '',
            nationality: '',
            contactNo: '',
        }); 
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Patient Registration</h4>
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
                                    <label htmlFor="age">Age</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="age"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        placeholder="Enter age"
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
                                    <label htmlFor="gender">Gender</label>
                                    <select
                                        className="form-control"
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="dob">Date of Birth</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="dob"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address">Address</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Enter address"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nationality">Nationality</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nationality"
                                        name="nationality"
                                        value={formData.nationality}
                                        onChange={handleChange}
                                        placeholder="Enter nationality"
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

export default PatientReg;
