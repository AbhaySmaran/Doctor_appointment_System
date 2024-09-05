import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { IoReturnUpBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const BookAppointment = () => {
    const url = localStorage.getItem('url');
    const [error,setError] = useState('')
    const [formData, setFormData] = useState({
        patient_UHID: "",
        doctor: "",
        date: "",
    })
    const [doctors, setDoctors] = useState([])
    const navigate = useNavigate();
    const receptionistId = localStorage.getItem("uuid")
    useEffect(() => {
        const fetchDoctors = async () => {
            const res = await axios.get(`${url}/api/doctors/`)
            setDoctors(res.data)
        };
        fetchDoctors();
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        try{
            if(window.confirm("Book Appointment?")){
                const res = axios.post(`${url}/services/appointment/book/`, {
                    patient: formData.patient_UHID,
                    doctor: formData.doctor,
                    date: formData.date,
                    booked_by: receptionistId
                })
                setFormData({
                    patient_UHID: "",
                    doctor: "",
                    date: "",
                })
            }
        }catch(error){
            setError(error.response.data);
        }
    }

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
            <div className='container mt-5'>
                <div className='row justify-content-center'>
                    <div className='col-md-8'>
                        <div className='card'>
                            <div className='card-header'>
                                <h4 className='card-title'>Book Appointment</h4>
                            </div>
                            <div className='card-body'>
                                <form onSubmit={handleSubmit} className='needs-validation'>
                                    <div className='form-group'>
                                        <label>Patient UHID</label>
                                        <input
                                            type='text'
                                            className={`form-control ${error.patient ? "is-invalid" : ""}`}
                                            name='patient_UHID'
                                            value={formData.patient_UHID}
                                            placeholder='Enter Patient UHID'
                                            onChange={handleChange}
                                        />
                                        <div className='validation-feedback'>
                                            {error.patient}
                                        </div>
                                    </div>
                                    <div className='form-group'>
                                        <label>Doctor Name</label>
                                        <select
                                            className={`form-control ${error.doctor ? "is-invalid" : ""}`}
                                            name='doctor'
                                            id='doctor'
                                            value={formData.doctor}
                                            onChange={handleChange}
                                        >
                                            <option value=''>Select Doctors Name</option>
                                            {doctors.map((doctor => (
                                                <option key={doctor.id} value={doctor.id}>{doctor.full_name}</option>
                                            )))}
                                        </select>
                                        <div className="valid">
                                            {error.doctor && <p>{error.doctor}</p>}
                                        </div>
                                    </div>
                                    <div className='form-group'>
                                        <label htmlFor='date'>Appointment Date</label>
                                        <input
                                            type='date'
                                            name='date'
                                            id='date'
                                            value={formData.value}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Book</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookAppointment