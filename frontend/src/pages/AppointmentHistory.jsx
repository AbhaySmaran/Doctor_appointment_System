import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react';

const AppointmentHistory = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(()=>{
        const fetchAppointments =async()=>{
            const res = await axios.get("http://127.0.0.1:8000/services/appointment/history/")
            setAppointments(res.data)
        };
        fetchAppointments();
    },[])
    return (
        <div className='container-fluid'>
            <div>
                <div className='table-responsive'>
                    <table className='table'>
                        <thead className='thead-dark'>
                            <tr>
                                <th>Patient Name</th>
                                <th>Doctor's Name</th>
                                <th>Appointment Date</th>

                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment)=>(
                                <tr key={appointment.id}>
                                    <td>{appointment.patient.full_name}</td>
                                    <td>{appointment.doctor.full_name}</td>
                                    <td>{appointment.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AppointmentHistory