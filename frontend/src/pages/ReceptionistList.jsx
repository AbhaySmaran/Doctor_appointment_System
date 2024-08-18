import React from 'react'
import axios from 'axios';
import { useState,useEffect } from 'react';

const ReceptionistList = () => {
  const [receptionists, setReceptionists] = useState([]);

    useEffect(() => {
        const fetchReceptionists = async () => {
            const res = await axios.get('http://127.0.0.1:8000/api/receptionists/');
            setReceptionists(res.data)
        }
        fetchReceptionists();
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
                                <th>Contact</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receptionists.map((receptionist) => (
                                <tr key={receptionist.id}>
                                    <td>{receptionist.uuid}</td>
                                    <td>{receptionist.full_name}</td>
                                    <td>{receptionist.user.email}</td>
                                    <td>{receptionist.contact_no}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ReceptionistList