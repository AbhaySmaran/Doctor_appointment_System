// DoctorRegistrationForm.js
import React, { useState } from 'react';

const DoctorReg = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        department: '',
        specialization: '',
        degree: '',
        contactNo: '',
        fee: '',
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
        console.log('Doctor form data submitted:', formData);
    };

    return (
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
                                    <label htmlFor="department">Department</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="department"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        placeholder="Enter department"
                                    />
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
    );
};

export default DoctorReg;
