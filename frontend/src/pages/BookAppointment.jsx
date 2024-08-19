import React from 'react'
import { useState,useEffect } from 'react';
import axios from 'axios';

const BookAppointment = () => {
    const [formData, setFormData] = useState({
        patient_UHID: "",
        doctor: "",
        date: "",
    })
    const [doctors,setDoctors] = useState([])

    useEffect(()=>{
        const fetchDoctors = async()=>{
            const res=await axios.get('http://127.0.0.1:8000/api/doctors/')
            setDoctors(res.data)
        };
        fetchDoctors();
    },[])

    const handleChange = (e)=>{
        const {name,value} = e.target
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        const res = axios.post('http://127.0.0.1:8000/services/appointment/book/',{
            patient: formData.patient_UHID,
            doctor: formData.doctor,
            date: formData.date
        })
        alert("Appointmrnt Booked")
        setFormData({
            patient_UHID: "",
            doctor: "",
            date: "",
        })
    }

    return (
        <div className='container mt-5'>
            <div className='row justify-content-center'>
                <div className='col-md-8'>
                    <div className='card'>
                        <div className='card-header'>
                            <h4 className='card-title'>Book Appointment</h4>
                        </div>
                        <div className='card-body'>
                            <form onSubmit={handleSubmit}>
                                <div className='form-group'>
                                    <label>Patient UHID</label>
                                    <input 
                                        type='text'
                                        className='form-control'
                                        name='patient_UHID'
                                        value={formData.patient_UHID}
                                        placeholder='Enter Patient UHID'
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label>Doctor Name</label>
                                    <select
                                        className='form-control'
                                        name='doctor'
                                        id='doctor'
                                        value={formData.doctor}
                                        onChange={handleChange}
                                    >
                                        <option value=''>Select Doctors Name</option>
                                        {doctors.map((doctor=>(
                                            <option value={doctor.id}>{doctor.full_name}</option>
                                        )))}
                                    </select>
                                </div>
                                <div className='form-group'>
                                    <label>Appointment Date</label>
                                    <input 
                                        type='date'
                                        name='date'
                                        id='date'
                                        value={formData.value}
                                        placeholder='Enter Appointment Date'
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">Book</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookAppointment