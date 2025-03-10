import axios from 'axios';
import React, { useState } from 'react';
import { IoReturnUpBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
// import './PatientReg.css'; // Import custom CSS

const PatientReg = () => {
    const url = localStorage.getItem('url');
    const [error, setError] = useState({});
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
        refferedBy:'',
        diagnosis: '',
        diagnosis_details: ''
    });

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
        const data = new FormData();
        if(formData.uuid){
            data.append("uuid", formData.uuid)
        }
        if(formData.fullName){
            data.append("full_name", formData.fullName)
        }
        if(formData.email){
            data.append("email", formData.email)
        }
        if(formData.age){
            data.append("age", formData.age)
        }
        if(formData.gender){
            data.append("gender", formData.gender)
        }
        if(formData.dob){
            data.append("dob", formData.dob)
        }
        if(formData.address){
            data.append("address", formData.address)
        }
        if(formData.contactNo){
            data.append("contact_no", formData.contactNo)
        }
        if(formData.nationality){
            data.append("nationality", formData.nationality)
        }
        if(formData.refferedBy){
            data.append("reffered_by", formData.refferedBy)
        }
        try {
            const res = await axios.post(`${url}/api/patients/`, data
            // {
            //     uuid: formData.uuid,
            //     full_name: formData.fullName,
            //     age: formData.age,
            //     email: formData.email,
            //     gender: formData.gender,
            //     dob: formData.dob,
            //     address: formData.address,
            //     nationality: formData.nationality,
            //     contact_no: formData.contactNo
            // }
            );

            if (window.confirm("Add patient")) {
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
                    refferedBy:''
                });
                setError({});
            }
        } catch (error) {
            setError(error.response.data);
            if(error.msg){
                alert(error.msg)
            }
            console.error(error)
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
                <h5 className="mb-4">Patient Registration</h5>
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3" id='form-row'>
                        {/* <div className='invalid-feedback'>
                            {error.msg ? <p>{error.msg}</p> : ""}
                        </div> */}
                        <div className="col-md-2">
                            <label htmlFor="uuid" className="form-label">UHID</label>
                        </div>
                        <div className="col-md-10">
                            <input
                                type="text"
                                className={`form-control ${error.uuid ? 'is-invalid' : ''}`}
                                name="uuid"
                                value={formData.uuid}
                                onChange={handleChange}
                                placeholder="Enter UHID"
                            />
                            <div className="invalid-feedback">
                                {error.uuid && <p>{error.uuid}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3" id='form-row'>
                        <div className="col-md-2">
                            <label htmlFor="fullName" className="form-label">Full Name</label>
                        </div>
                        <div className="col-md-10">
                            <input
                                type="text"
                                className={`form-control ${error.full_name || error.msg ? 'is-invalid' : ''}`}
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter full name"
                            />
                            <div className="invalid-feedback">
                                {error.full_name && <p>{error.full_name}</p>}
                                {error.msg && <p>{error.msg}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3" id='form-row'>
                        <div className="col-md-2">
                            <label htmlFor="age" className="form-label">Age</label>
                        </div>
                        <div className="col-md-10">
                            <input
                                type="number"
                                className={`form-control ${error.age ? 'is-invalid' : ''}`}
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="Enter age"
                                min="0"
                            />
                            <div className="invalid-feedback">
                                {error.age && <p>{error.age}</p>}
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
                                className={`form-control ${error.email ? 'is-invalid' : ''}`}
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                            />
                            <div className="invalid-feedback">
                                {error.email && <p>{error.email}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3" id='form-row'>
                        <div className="col-md-2">
                            <label htmlFor="gender" className="form-label">Gender</label>
                        </div>
                        <div className="col-md-10">
                            <select
                                className={`form-control ${error.gender ? 'is-invalid' : ''}`}
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            <div className="invalid-feedback">
                                {error.gender && <p>{error.gender}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3" id='form-row'>
                        <div className="col-md-2">
                            <label htmlFor="dob" className="form-label">Date of Birth</label>
                        </div>
                        <div className="col-md-10">
                            <input
                                type="date"
                                className={`form-control ${error.dob ? 'is-invalid' : ''}`}
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                            />
                            <div className="invalid-feedback">
                                {error.dob && <p>Choose a Date</p>}
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3" id='form-row'>
                        <div className="col-md-2">
                            <label htmlFor="address" className="form-label">Address</label>
                        </div>
                        <div className="col-md-10">
                            <textarea
                                type="text"
                                className={`form-control ${error.address ? 'is-invalid' : ''}`}
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter address"
                            />
                            <div className="invalid-feedback">
                                {error.address && <p>{error.address}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3" id='form-row'>
                        <div className="col-md-2">
                            <label htmlFor="nationality" className="form-label">Nationality</label>
                        </div>
                        <div className="col-md-10">
                            <input
                                type="text"
                                className={`form-control ${error.nationality ? 'is-invalid' : ''}`}
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleChange}
                                placeholder="Enter nationality"
                            />
                            <div className="invalid-feedback">
                                {error.nationality && <p>{error.nationality}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3" id='form-row'>
                        <div className="col-md-2">
                            <label htmlFor="contactNo" className="form-label">Contact Number</label>
                        </div>
                        <div className="col-md-10">
                            <input
                                type="number"
                                className={`form-control ${error.contact_no ? 'is-invalid' : ''}`}
                                name="contactNo"
                                value={formData.contactNo}
                                onChange={handleChange}
                                placeholder="Enter contact number"
                                min="10"
                            />
                            <div className="invalid-feedback">
                                {error.contact_no && <p>{error.contact_no}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3" id='form-row'>
                        <div className="col-md-2">
                            <label className="form-label">Reffered By</label>
                        </div>
                        <div className="col-md-10">
                            <input
                                type="text"
                                className="form-control"
                                name="refferedBy"
                                value={formData.refferedBy}
                                onChange={handleChange}
                                placeholder="Reffred by Doctor"
                                
                            />
                        </div>
                    </div>

                    <div className="row mb-3" id='form-row'>
                        <div className="col-md-2">
                            <label className="form-label">Diagnosis</label>
                        </div>
                        <div className="col-md-10">
                            <input
                                type="text"
                                className="form-control"
                                name="diagnosis"
                                value={formData.diagnosis}
                                onChange={handleChange}
                                
                            />
                        </div>
                    </div>

                    <div className="row mb-3" id='form-row'>
                        <div className="col-md-2">
                            <label className="form-label">Diagnosis Details</label>
                        </div>
                        <div className="col-md-10">
                            <textarea
                                type="text"
                                className="form-control"
                                name="diagnosis_details"
                                value={formData.diagnosis_details}
                                onChange={handleChange}
                                
                            />
                        </div>
                    </div>

                    <div className="text-end">
                        <button type="submit" className="btn btn-primary">Register</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PatientReg;
