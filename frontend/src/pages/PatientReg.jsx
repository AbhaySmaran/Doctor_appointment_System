// PatientRegistrationForm.js
import axios from 'axios';
import React, { useState } from 'react';
import { IoReturnUpBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';

const PatientReg = () => {
    const [error,setError] = useState('')
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

    const handleSubmit =async(e) => {
        e.preventDefault();
        try{
            const res =await axios.post('http://127.0.0.1:8000/api/patients/',{
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
            }
        }catch(error){
            setError(error.response.data)
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
                            <form onSubmit={handleSubmit} className='needs-validation'>
                                <div className="form-group">
                                    <label htmlFor="uuid">UHID</label>
                                    <input
                                        type="text"
                                        className={`form-control ${error.uuid ? 'is-invalid' : ''}`}
                                        id="uuid"
                                        name="uuid"
                                        value={formData.uuid}
                                        onChange={handleChange}
                                        placeholder="Enter UHID"
                                    />
                                    <div className='invalid-feedback'>
                                        {error.uuid && <p>{error.uuid[0]}</p>}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="fullName">Full Name</label>
                                    <input
                                        type="text"
                                        className={`form-control ${error.full_name ? 'is-invalid' : ''}`}
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter full name"
                                    />
                                    <div className='invalid-feedback'>
                                        {error.full_name && <p>{error.full_name[0]}</p>}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="age">Age</label>
                                    <input
                                        type="number"
                                        className={`form-control ${error.age ? 'is-invalid' : ''}`}
                                        id="age"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        placeholder="Enter age"
                                    />
                                    <div className='invalid-feedback'>
                                        {error.age && <p>{error.age}</p>}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        className={`form-control ${error.email ? 'is-invalid' : ''}`}
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter email"
                                    />
                                    <div className='invalid-feedback'>
                                        {error.email && <p>{error.email}</p>}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="gender">Gender</label>
                                    <select
                                        className={`form-control ${error.gender ? 'is-invalid' : ""}`}
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
                                    <div className='invalid-feedback'>
                                        {error.gender && <p>{error.gender}</p>}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="dob">Date of Birth</label>
                                    <input
                                        type="date"
                                        className={`form-control ${error.dob ? 'is-invalid' : ''}`}
                                        id="dob"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleChange}
                                    />
                                    <div className='invalid-feedback'>
                                        {error.dob && <p>{error.dob}</p>}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address">Address</label>
                                    <input
                                        type="text"
                                        className={`form-control ${error.address ? 'is-invalid' : ''}`}
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Enter address"
                                    />
                                    <div className='invalid-feedback'>
                                        {error.address && <p>{error.address}</p>}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nationality">Nationality</label>
                                    <input
                                        type="text"
                                        className={`form-control ${error.nationality ? 'is-invalid' : ''}`}
                                        id="nationality"
                                        name="nationality"
                                        value={formData.nationality}
                                        onChange={handleChange}
                                        placeholder="Enter nationality"
                                    />
                                    <div className='invalid-feedback'>
                                        {error.nationality && <p>{error.nationality}</p>}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contactNo">Contact Number</label>
                                    <input
                                        type="number"
                                        className={`form-control ${error.contact_no ? 'is-invalid' : ''}`}
                                        id="contactNo"
                                        name="contactNo"
                                        value={formData.contactNo}
                                        onChange={handleChange}
                                        placeholder="Enter contact number"
                                        min='10'
                                        max='15'
                                    />
                                    <div className='invalid-feedback'>
                                        {error.contact_no && <p>{error.contact_no}</p>}
                                    </div>
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
