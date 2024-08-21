import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useState,useEffect } from 'react';
import axios from 'axios';

const PatientDetails = () => {
    const [patient,setPatient] = useState(null);
    // const [reports,setReports] = useState([]);
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(()=>{
        const fetchPatient = async()=>{
            const res = await axios.get(`http://127.0.0.1:8000/api/patients/${id}/`)
            setPatient(res.data)
        };
        fetchPatient();
    },[id])

    // useEffect(()=>{
    //     const fetchReports = async()=>{
    //         const res = await axios.get('')
    //     }
    // })

    return (
        <div>

        </div>
    )
}

export default PatientDetails;