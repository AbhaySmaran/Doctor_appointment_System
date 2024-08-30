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
import { Pie,Line,Bar } from 'react-chartjs-2';
import Chart from "chart.js/auto"
import { GiTestTubes } from "react-icons/gi";

const ReceptionistDashboard = () => {
    const [user,setUser] = useState([]);
    const [error,setError] = useState(null);
    const [patientData, setPatientData] = useState({});
    const [totalPatients, setTotalPatients] = useState(0);
    const [genderCounts, setGenderCounts] = useState({ male: 0, female: 0 });
    const access = localStorage.getItem('access')
    const navigate = useNavigate();
    const [lineChartData, setLineChartData] = useState([]);
    const [testCatagory,setTestCatagory] = useState('Test');
    const [reportData,setReportData] = useState({});
    const [selectedMonth,setSelectedMonth] = useState(new Date().getMonth()+1);
    const [selectedYear,setSelectedYear] = useState(new Date().getFullYear());
    // const year = new Date().getFullYear();
    // const month = new Date().getMonth() + 1;
    const handleNavigation = (path) => {
        navigate(path);
    };
    const role = localStorage.getItem('role');
    useEffect(() => {
        const fetchUser = async () => {
            // const res = await axios.get('http://127.0.0.1:8000/api/receptionist/profile/', {
            //     headers: {
            //         "Authorization": `Bearer ${access}`,
            //     },
            // });
            // setReceptionist(res.data);
            // if (res.data) {
            //     localStorage.setItem('uuid', res.data.uuid);
            //     localStorage.setItem('name', res.data.full_name);
            // }
            try {
                let response;
                if (role === 'super_admin') {
                    // Fetch data specific to super_admin
                    response = await axios.get('http://127.0.0.1:8000/api/user/profile/',{
                            headers: {
                                "Authorization": `Bearer ${access}`,
                            },
                        });
                        if (response.data) {
                            localStorage.setItem('name', response.data.username);
                        }
                } else if (role === 'receptionist') {
                    // Fetch data specific to receptionist
                    response = await axios.get(`http://127.0.0.1:8000/api/receptionist/profile/`,{
                            headers: {
                                "Authorization": `Bearer ${access}`,
                            },
                        });
                        if (response.data) {
                            localStorage.setItem('uuid', response.data.uuid);
                            localStorage.setItem('name', response.data.full_name);
                        }
                }
                setUser(response.data);
            } catch (error) {
                setError(error.message);
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

        const fetchLineChartData = async () => {
            try {
                const res = await axios.get(`http://127.0.0.1:8000/services/appointments/daily/${selectedYear}/${selectedMonth}/`, {
                    headers: {
                        "Authorization": `Bearer ${access}`,
                    },
                });
                console.log(res.data)
                const dates = res.data.map(item => item.appointment_date);
                const counts = res.data.map(item =>Math.floor(item.total_appointments));

                setLineChartData({
                    labels: dates,
                    datasets: [
                        {
                            label: 'Daily Appointments',
                            data: counts,
                            borderColor: 'rgba(75,192,192,1)',
                            fill: false,
                        },
                    ],
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true, // Ensure y-axis starts at 0
                            },
                            x: {
                                
                            }
                        },
                    },
                });
            } catch (error) {
                console.error("Error fetching line chart data:", error);
            }
        };
        const fetchReportData = async () => {
            try {
                const res = await axios.get(`http://127.0.0.1:8000/services/api/tests/${testCatagory}/`, {
                    headers: {
                        "Authorization": `Bearer ${access}`,
                    },
                });

                const labels = res.data.map(item => item.test_code);
                const data = res.data.map(item => item.report_count);

                setReportData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Total Reports',
                            data: data,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                            ],
                            borderWidth: 1,
                        },
                    ],
                });
            } catch (error) {
                console.error("Error fetching file type data:", error);
            }
        };

        fetchUser();
        fetchPatientData();
        fetchLineChartData();
        fetchReportData();
    }, [access,selectedMonth, selectedYear,testCatagory]);

    const handleTestCatagory = (e)=>{
        setTestCatagory(e.target.value);
    }

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };
    // const name = localStorage.getItem('name')
    return (
        <div>
            {/* 1st box: Card total number of patients 
            2nd box: month wise patient follow up graph
            3rd box: repoty type and storage graph
        */}
            <div className="container mt-5">
                <div className="row" style={{ cursor: 'pointer' }}>
                    <div className="col-md-4 mb-4">
                        <div className="card text-center" id='chart-card'>
                            <div className="card-body">
                                <h5 className="card-title mt-3">Gender Ratio</h5>
                                <p>Total Patients: {totalPatients}</p>
                                <div id='chart'>
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
                        <div className="card text-center" id='chart-card'>
                            <div className="card-body">
                                <h5 className="card-title mt-3">Appointments</h5>
                                
                                {/* Dropdowns for Year and Month */}
                                <div className="d-flex justify-content-center mb-3">
                                    <select value={selectedYear} onChange={handleYearChange} className="form-select mx-2" style={{ width: '120px' }}>
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <option key={i} value={new Date().getFullYear() - i}>
                                                {new Date().getFullYear() - i}
                                            </option>
                                        ))}
                                    </select>
                                    <select value={selectedMonth} onChange={handleMonthChange} className="form-select mx-2" style={{ width: '120px' }}>
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {new Date(0, i).toLocaleString('en-US', { month: 'long' })}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Line Chart */}
                                <div className='chart'>
                                    {lineChartData.datasets ? (
                                        <Line data={lineChartData} />
                                    ) : (
                                        <p>Loading chart...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="card text-center" id='chart-card'>
                            <div className="card-body">
                                <h5 className="card-title mt-3">Reports</h5>
                                <div className='d-flex justify-content-center mb-3'>
                                    <select value={testCatagory} onChange={handleTestCatagory} className="form-select mx-2" style={{ width: '130px' }}>
                                        <option value='Test'>Test</option>
                                        <option value='Diagnostic'>Diagnostic</option>
                                    </select>
                                </div>
                                <div className='chart'>
                                    {reportData.datasets ? (
                                        <Bar data={reportData} 
                                            options={{
                                                scales: {
                                                    y: {
                                                        beginAtZero: true,
                                                        ticks: {
                                                            callback: (value) => Math.floor(value), // Remove decimal values
                                                        },
                                                    },
                                                },
                                                layout: {
                                                    padding: {
                                                        top: 10, // Adjust the padding to move the chart slightly lower
                                                        bottom: 10,
                                                    },
                                                },
                                            }}
                                        />
                                    ) : (
                                        <p>Loading chart...</p>
                                    )}
                                </div>
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
                    <div className="col-md-4 mb-4" onClick={() => handleNavigation('/dashboard/appointment/history')}>
                        <div className="card text-center">
                            <div className="card-body">
                                <MdHistory size={50} />
                                <h5 className="card-title mt-3">Appointments</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4" onClick={() => handleNavigation('/dashboard/configuration')}>
                        <div className="card text-center">
                            <div className="card-body">
                                <GiTestTubes size={50} />
                                <h5 className="card-title mt-3">Configuration</h5>
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