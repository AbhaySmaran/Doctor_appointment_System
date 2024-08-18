import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'

const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            const res = await axios.get('http://127.0.0.1:8000/api/doctors/');
            setDoctors(res.data)
        }
        fetchDoctors();
    }, [])

    return (
        <div>
            <div className="container fluid">
                <div className="table-responsive">
                    <table className='table'>
                        <thead className="thead-dark">
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Specialization</th>
                                <th>Consultation fee</th>
                                <th>Contact</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map((doctor) => (
                                <tr key={doctor.id}>
                                    <td>{doctor.doc_uid}</td>
                                    <td>{doctor.full_name}</td>
                                    <td>{doctor.user.email}</td>
                                    <td>{doctor.specialization}</td>
                                    <td>{doctor.fee}</td>
                                    <td>{doctor.contact}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default DoctorList