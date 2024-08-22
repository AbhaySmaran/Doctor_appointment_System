import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PatientList = () => {
    const [patients, setPatients] = useState([]);

    useEffect(()=>{
        const fetchPatients = async() =>{
            const res = await axios.get('http://127.0.0.1:8000/api/patients/')
            // console.log(res.data)
            setPatients(res.data)
        }
        fetchPatients();
    },[])

    const onEditClick= ()=>{

    }

    const onDeleteClick = ()=>{
        
    }
    return (
        <div>
            <div className="table-responsive">
                <table className='table'>
                    <thead className="thead-dark">
                        <tr>
                            <th>UHID</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Email</th>
                            <th>Gender</th>
                            <th>Address</th>
                            <th>Contact</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((patient) => (
                            <tr key={patient.id}>
                                <td>{patient.uuid}</td>
                                <Link to={`${patient.id}/`}><td>{patient.full_name}</td></Link>
                                <td>{patient.age}</td>
                                <td>{patient.email}</td>
                                <td>{patient.gender}</td>
                                <td>{patient.address}</td>
                                <td>{patient.contact_no}</td>
                                <td>
                                    <button className='btn btn-success'>
                                        Edit
                                    </button>
                                    <button className='btn btn-danger'>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PatientList