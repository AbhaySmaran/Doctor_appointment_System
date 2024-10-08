import React from 'react'
import { useParams, useNavigate,NavLink } from 'react-router-dom'
import { useState,useEffect } from 'react';
import axios from 'axios';

const PatientDetails = () => {
    const [patient,setPatient] = useState(null);
    const [reports,setReports] = useState([]);
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(()=>{
        const url = localStorage.getItem('url');
        const fetchPatient = async()=>{
            const res =await axios.get(`${url}/api/patients/${id}/`)
            setPatient(res.data)
        };
        fetchPatient();
    },[id])
    // console.log(patient) 

    const uuid = patient.uuid
    useEffect(()=>{
        const fetchReports = async()=>{
            const res = await axios.get(`${url}/services/reports/${uuid}/`)
            setReports(res.data)
        };
        fetchReports();
    },[uuid])
    console.log(reports)
    return (
        <div>
            <p>{patient.full_name}</p>
        </div>
    )
}

export default PatientDetails;