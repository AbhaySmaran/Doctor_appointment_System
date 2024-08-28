// PatientRegistrationForm.js
import axios from 'axios';
import React, { useState } from 'react';
import { IoReturnUpBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';

const PatientReg = () => {
    const [error,setError] = useState(null)
    const [formData, setFormData] = useState({
        uuid: '',
        fullName: '',
        age: '',
        email: '',
        gender: '',  
        dob: '',
        address: '',
        nationality: '',
        contactNo: '',
    });
    
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try{
            const res = axios.post('http://127.0.0.1:8000/api/patients/',{
                "uuid": formData.uuid,
                "full_name": formData.fullName,
                "age": formData.age,
                "email": formData.email,
                "gender": formData.gender,
                "dob": formData.dob,
                "address": formData.address,
                "nationality": formData.nationality,
                "contact_no": formData.contactNo
            })

            if(res.status === 201) {
                alert('Patient Registered')
                setFormData({
                    uuid: '',
                    fullName: '',
                    age: '',
                    email: '',
                    gender: '',  
                    dob: '',
                    address: '',
                    nationality: '',
                    contactNo: '',
                });
            }else{
                alert('Patient with this UHID already exists')
                setFormData({
                    uuid: ''
                });
            }
        }catch(error){
            if (error.response) {
                console.log(error.response.data.uuid)
                setError(error.response.data || 'Failed to upload report');
                // console.log(error.uuid[0]);
                // alert("Patient with this UHID already exists.")
            } else {
                setError('An error occurred while uploading the report');
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
            <br />
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
                                    <label htmlFor="uuid">UHID</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="uuid"
                                        name="uuid"
                                        value={formData.uuid}
                                        onChange={handleChange}
                                        placeholder="Enter UHID"
                                    />
                                </div>
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
        </div>
    );
};

export default PatientReg;
