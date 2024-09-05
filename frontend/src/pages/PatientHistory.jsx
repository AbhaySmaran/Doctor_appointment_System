import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { GiClick } from "react-icons/gi";
import { GrTooltip } from "react-icons/gr";
import { IoReturnUpBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'bootstrap';
import { FaCloudDownloadAlt } from "react-icons/fa";

const PatientHistory = () => {
    const url = localStorage.getItem('url');
    const { uuid } = useParams();
    const [patient, setPatient] = useState({});
    const [appointments, setAppointments] = useState([]);
    const [reports, setReports] = useState([]);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
    const [appointmentAdvice,setAppointmentAdvice] = useState("");
    const access = localStorage.getItem('access');
    const navigate = useNavigate();
    // Fetch patient details
    const fetchPatientDetails = async () => {
        const res = await axios.get(`${url}/api/patients/${uuid}/`);
        setPatient(res.data);
    };

    // Fetch appointments
    const fetchAppointments = async () => {
        const res = await axios.get(`${url}/services/patient/appointment/${uuid}/`);
        setAppointments(res.data);
    };

    // useEffect(() => {
    //     // Initialize all tooltips on the page
    //     const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    //     tooltipTriggerList.forEach((tooltipTriggerEl) => {
    //         new bootstrap.Tooltip(tooltipTriggerEl);
    //     });
    // }, []);

    // Fetch reports for a specific appointment
    const fetchReports = async () => {
        const res = await axios.get(`${url}/services/reports/${uuid}/`, {
            headers: {
                'Authorization': `Bearer ${access}`
            }
        });
        setReports(res.data);
    };

    const filteredReports = reports.filter((report) => {
        return report.appointment.id === selectedAppointmentId;
    });

    useEffect(() => {
        fetchPatientDetails();
        fetchAppointments();
        fetchReports();

        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new Tooltip(tooltipTriggerEl);
        });
    }, [uuid]);

    const onReportClick = (appointmentId,advice) => {
        setSelectedAppointmentId(appointmentId);
        setAppointmentAdvice(advice)
    };

    return (
        <div>
            <div className='container-fluid position-relative'>
                <div className='position-absolute top-0 end-0'>
                    <button className='btn btn-primary' id='btn-back' type='button'
                        onClick={() => navigate('/dashboard/patient/list')}
                    >
                        <IoReturnUpBackSharp /> Back
                    </button>
                </div>
            </div>
            <br />
            <div className='container fluid'>
                <div className='row mt-4'>
                    <div className='col-md-9'>
                        <h5>Patient's Appointment History</h5>
                        <div className='row mb-3'>
                            <div className='col-md-4'>
                                <p><strong>Patient UHID: </strong>{patient.uuid}</p>
                            </div>
                            <div className='col-md-5'>
                                <p><strong>Patient's Name: </strong>{patient.full_name}</p>
                            </div>
                            <div className='col-md-3'>
                                <p><strong>Patient's Age: </strong>{patient.age}</p>
                            </div>
                        </div>
                        <div className='table p-2'>
                            <table className='table table-striped table-light'>
                                <thead className='thead'>
                                    <tr>
                                        <th className='text-center'>Appointment Date</th>
                                        <th>Doctor</th>
                                        <th className='text-center'>Advice</th>
                                        <th className='text-center'>Reports</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        appointments.length > 0
                                            ? appointments.map((appointment) => (
                                                <tr key={appointment.id}>
                                                    <td className='text-center'>{appointment.date}</td>
                                                    <td>{appointment.doctor.full_name}</td>
                                                    <td className='text-center'>
                                                        <a href="#"
                                                            data-bs-toggle="tooltip"
                                                            data-bs-placement="top"
                                                            title={appointment.advice}
                                                            style={{ textDecoration: 'none', color: 'inherit' }}>
                                                            <GrTooltip size={24} />
                                                        </a>
                                                    </td>
                                                    <td className='text-center'>
                                                        <a href="#" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => onReportClick(appointment.id,appointment.advice)}><GiClick /></a>
                                                    </td>
                                                </tr>
                                            ))
                                            : (
                                                <tr>
                                                    <td colSpan="4" className="text-center">No Appointments Found</td>
                                                </tr>
                                            )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='col-md-3'>
                        <div className='side-panel'>
                            {selectedAppointmentId ? (
                                <div>
                                    <h5>Reports {/* for Appointment ID: {selectedAppointmentId}*/}</h5>
                                    {/* <ul>
                                        {filteredReports.length > 0 ? filteredReports.map(report => (
                                            <li key={report.id}>{report.name}</li>
                                        )) : <p>No Reports Found</p>}
                                    </ul> */}
                                    <div>
                                        <table className='table table-striped'>
                                            <thead className='thead' id='thead'>
                                                <tr>
                                                    <th>Report Name</th>
                                                    <th>Download</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredReports.length > 0 ?
                                                    (filteredReports.map((report) => (
                                                        <tr key={report.id}>
                                                            <td>{report.name}</td>
                                                            <td>
                                                                <FaCloudDownloadAlt
                                                                    style={{ cursor: 'pointer', marginRight: '10px' }}
                                                                    onClick={() => handleDownload(report.report_file)}
                                                                />
                                                                <a href={`${url}${report.report_file}`} target="_blank" rel="noopener noreferrer">
                                                                    View Report
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    )))
                                                    :
                                                    (
                                                        <tr>
                                                            <p>No Reports Found</p>
                                                        </tr>
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <div>
                                        <h6>Advice</h6>
                                        <textarea 
                                            className='form-control'
                                            value={
                                                appointmentAdvice === "undefined"
                                                ?
                                                "No Advice Given"
                                                :
                                                appointmentAdvice

                                            }
                                            readOnly
                                            style={{ height: '100px' }}
                                        />
                                    </div>
                                </div>
                            ) : <p>Select an appointment to view reports</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientHistory;
