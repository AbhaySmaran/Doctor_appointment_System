import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Practice = () => {
    const [patients, setPatients] = useState([]);
    const baseUrl = localStorage.getItem('url');
    
    const fetchPatients = async()=>{
        const res = await fetch(`${baseUrl}/api/patients/`);
        const data = res.json();
        setPatients(data);
    }
    console.log(patients);
    // fetchPatients();
    useEffect(()=>{
        fetchPatients();
    },[])

    return (
        <div>
            <div className='row'>
                <div className='col-md-9'>
                    {patients.map((patient)=>{
                        <table>
                            
                        </table>
                    })}
                </div>
            </div>
        </div>
    )
}

export default Practice