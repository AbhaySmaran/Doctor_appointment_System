import React from 'react'
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaProcedures, FaCalendarAlt, FaUserMd, FaUserInjured,
    FaUserNurse, FaConciergeBell, FaFileAlt, FaClipboard, FaPills
} from 'react-icons/fa';
import { MdListAlt, MdMedicalServices, MdUploadFile, MdHistory } from "react-icons/md";
import { Pie } from 'react-chartjs-2';
// import {
//     Chart,
//     Title,
//     Tooltip,
//     Legend,
//     ArcElement // Make sure to import ArcElement
// } from 'chart.js';
import Chart from "chart.js/auto"

const ReceptionistDashboard = () => {
    const [receptionist, setReceptionist] = useState([]);
    const [patientData, setPatientData] = useState({});
    const [totalPatients, setTotalPatients] = useState(0);
    const [genderCounts, setGenderCounts] = useState({ male: 0, female: 0 });
    const access = localStorage.getItem('access')
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get('http://127.0.0.1:8000/api/receptionist/profile/', {
                headers: {
                    "Authorization": `Bearer ${access}`,
                },
            });
            setReceptionist(res.data);
            if (res.data) {
                localStorage.setItem('uuid', res.data.uuid);
                localStorage.setItem('name', res.data.full_name);
            }
        };

        const fetchPatientData = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/patients/', {
                    headers: {
                        "Authorization": `Bearer ${access}`,
                    },
                });

                // Count total patients and male/female patients
                const maleCount = res.data.filter(patient => patient.gender.toLowerCase() === 'male').length;
                const femaleCount = res.data.filter(patient => patient.gender.toLowerCase() === 'female').length;

                setTotalPatients(res.data.length);
                setGenderCounts({ male: maleCount, female: femaleCount });

                setPatientData({
                    labels: ['Male', 'Female'],
                    datasets: [
                        {
                            label: 'Gender Ratio',
                            data: [maleCount, femaleCount],
                            backgroundColor: ['#36A2EB', '#FF6384'],
                            hoverBackgroundColor: ['#36A2EB', '#FF6384'],
                        },
                    ],
                });
            } catch (error) {
                console.error("Error fetching patient data:", error);
            }
        };

        fetchUser();
        fetchPatientData();
    }, [access]);
    const name = localStorage.getItem('name')
    return (
        <div>
            {/* 1st box: Card total number of patients 
            2nd box: month wise patient follow up graph
            3rd box: repoty type and storage graph
        */}
            <div className="container mt-5">
                <div className="row" style={{ cursor: 'pointer' }}>
                    <div className="col-md-4 mb-4">
                        <div className="card text-center">
                            <div className="card-body">
                                <h5 className="card-title mt-3">Gender Ratio</h5>
                                <p>Total Patients: {totalPatients}</p>
                                <div>
                                    {patientData.datasets ? (
                                        <Pie data={patientData} />
                                    ) : (
                                        <p>Loading chart...</p>
                                    )}
                                </div>
                                {/* <p>Male Patients: {genderCounts.male}</p>
                                <p>Female Patients: {genderCounts.female}</p> */}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="card text-center">
                            <div className="card-body">

                                <h5 className="card-title mt-3">Line chart</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="card text-center">
                            <div className="card-body">

                                <h5 className="card-title mt-3">Bar chart</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4" onClick={() => handleNavigation('/dashboard/patient/list')}>
                        <div className="card text-center">
                            <div className="card-body">
                                <FaProcedures size={50} />
                                <h5 className="card-title mt-3">Patient List</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4" onClick={() => handleNavigation('/dashboard/patient/registration')}>
                        <div className="card text-center">
                            <div className="card-body">
                                <FaUserInjured size={50} />
                                <h5 className="card-title mt-3">Add Patients</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4" onClick={() => handleNavigation('/dashboard/doctor/list')}>
                        <div className="card text-center">
                            <div className="card-body">
                                <MdListAlt size={50} />
                                <h5 className="card-title mt-3">Doctor List</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4" onClick={() => handleNavigation('/dashboard/doctor/register')}>
                        <div className="card text-center">
                            <div className="card-body">
                                <FaUserMd size={50} />
                                <h5 className="card-title mt-3">Add Doctor</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4" onClick={() => handleNavigation('/dashboard/appointment/book')}>
                        <div className="card text-center">
                            <div className="card-body">
                                <FaCalendarAlt size={50} />
                                <h5 className="card-title mt-3">Book Appointment</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4" onClick={() => handleNavigation('/dashboard/receptionist/register')}>
                        <div className="card text-center">
                            <div className="card-body">
                                <FaUserNurse size={50} />
                                <h5 className="card-title mt-3">Add Receptionists</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4" onClick={() => handleNavigation('/dashboard/receptionist/list')}>
                        <div className="card text-center">
                            <div className="card-body">
                                <FaConciergeBell size={50} />
                                <h5 className="card-title mt-3">Receptionist List</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4" onClick={() => handleNavigation('/dashboard/reports/upload')}>
                        <div className="card text-center">
                            <div className="card-body">
                                <MdUploadFile size={50} />
                                <h5 className="card-title mt-3">Upload Reports</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4" onClick={() => handleNavigation('/dashboard/appointment/history')}>
                        <div className="card text-center">
                            <div className="card-body">
                                <MdHistory size={50} />
                                <h5 className="card-title mt-3">Appointments</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4" onClick={() => handleNavigation('/dashboard/doctor/prescription')}>
                        <div className="card text-center">
                            <div className="card-body">
                                <FaPills size={50} />
                                <h5 className="card-title mt-3">Upload Prescription</h5>
                            </div>
                        </div>
                    </div>
                    {/* Add more cards if needed */}
                </div>
            </div>
        </div>
    )
}

export default ReceptionistDashboard