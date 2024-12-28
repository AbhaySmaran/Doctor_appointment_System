import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { GiClick } from "react-icons/gi";
import { GrTooltip } from "react-icons/gr";
import { IoReturnUpBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'bootstrap';
import { FaCloudDownloadAlt } from "react-icons/fa";

const DoctorVisitHistory = () => {
    const doc_uid = localStorage.getItem('doc_uid');
    const base_url = localStorage.getItem('url');
    const { uuid } = useParams();
    const [patient, setPatient] = useState({});
    const [appointments, setAppointments] = useState([]);
    const [reports, setReports] = useState([]);
    const [prescriptions,setPrescriptions] = useState([]); 
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
    const [appointmentAdvice,setAppointmentAdvice] = useState("");
    const access = localStorage.getItem('access');
    const navigate = useNavigate();
    // Fetch patient details
    const fetchPatientDetails = async () => {
        const res = await axios.get(`${base_url}/api/patients/${uuid}/`);
        setPatient(res.data);
    };


    // Fetch appointments
    const fetchAppointments = async () => {
        const res = await axios.get(`${base_url}/services/patient/appointment/${uuid}/`);
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

    const handleDownload = async (fileUrl) => {
        try {
            // Make a request to get the file blob
            const response = await axios.get(`${base_url}${fileUrl}`, {
                headers: {
                    'Authorization': `Bearer ${access}`
                },
                responseType: 'blob' // Important: This tells axios to expect a binary file
            });

            // Create a temporary URL to download the file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileUrl.split('/').pop()); // Set the file name
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link); // Clean up
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };
    const fetchReports = async () => {
        const res = await axios.get(`${base_url}/services/reports/${uuid}/`, {
            headers: {
                'Authorization': `Bearer ${access}`
            }
        });
        setReports(res.data);
    };

    const fetchPrescriptions = async()=>{
        try {
            const response = await axios.get(`${base_url}/services/prescriptions/${uuid}/`, {
                headers: {
                    'Authorization': `Bearer ${access}`
                }
            });
            setPrescriptions(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    }

    // const filteredPrescriptions  = prescriptions.filter((prescription)=>{
    //     return prescription.appointment === selectedAppointmentId;
    // })

    // const filteredReports = reports.filter((report) => {
    //     return report.appointment.id === selectedAppointmentId;
    // });

    const filteredReports = reports.filter((report) => {
        if(report.appointment){
            return report.appointment.id=== selectedAppointmentId;
        }
    });

    const filteredPrescriptions = prescriptions.filter((prescription) => {
        if(prescription.appointment){
            return prescription.appointment === selectedAppointmentId;
        }
    });

    useEffect(() => {
        fetchPatientDetails();
        fetchAppointments();
        fetchReports();
        fetchPrescriptions();

        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new Tooltip(tooltipTriggerEl);
        });
    }, [uuid]);

    const onReportClick = (appointmentId,advice) => {
        setSelectedAppointmentId(appointmentId);
        setAppointmentAdvice(advice)
    };

    const filteredAppointments = appointments.filter(
        (appointment) => appointment.doctor.doc_uid === doc_uid
      );

    return (
        <div>
            <div className='container-fluid position-relative'>
                <div className='position-absolute top-0 end-0'>
                    <button className='btn btn-primary' id='btn-back' type='button'
                        onClick={() => navigate('/dashboard/doctor/appointment')}
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
                                        filteredAppointments.length > 0
                                            ? filteredAppointments.map((appointment) => (
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
                                    <p><strong>Prescriptions:-</strong></p>
                                    <table className='table table-striped'>
                                            <thead className='thead' id='thead'>
                                                <tr>
                                                    <th>Prescription</th>
                                                    <th>Download</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {prescriptions.length > 0 ?
                                                    (filteredPrescriptions.map((prescription) => (
                                                        <tr key={prescription.id}>
                                                            <td>{"Dr."+prescription.name.slice(0,6)+"..."}</td>
                                                            <td>
                                                                <FaCloudDownloadAlt
                                                                    style={{ cursor: 'pointer', marginRight: '10px' }}
                                                                    onClick={() => handleDownload(prescription.prescription_file)}
                                                                />
                                                                <a href={`${base_url}${prescription.prescription_file}`} target="_blank" rel="noopener noreferrer">
                                                                    View prescription
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    )))
                                                    :
                                                    (
                                                        <tr>
                                                            <td colSpan="2" className='text-center'>No Prescriptions Found</td>
                                                        </tr>
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                        <br/>
                                        <p><strong>Reports:-</strong></p>
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
                                                                <a href={`${base_url}${report.report_file}`} target="_blank" rel="noopener noreferrer">
                                                                    View Report
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    )))
                                                    :
                                                    (
                                                        <tr>
                                                            <td colSpan="2" className='text-center'>No Reports Found</td>
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

export default DoctorVisitHistory;
