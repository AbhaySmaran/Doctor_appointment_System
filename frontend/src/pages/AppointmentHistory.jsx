import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoReturnUpBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const AppointmentHistory = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [day, setDay] = useState(new Date().getDate());
    const navigate = useNavigate();
    const [showPrescriptionUploadModal, setShowPrescriptionUploadModal] = useState(false);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [reportFile, setReportFile] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        patient_uuid: '',
        doctor_id: '',
        doctor_name: '',
        patient_name: '',
        patient_address: '',
        patient_age: '',
        appointment_status: '',
    })

    const user = localStorage.getItem("name");

    const handleSelectAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setFormData({
            id: appointment.id,
            patient_uuid: appointment.patient.uuid,
            doctor_id: appointment.doctor.id,
            doctor_name: appointment.doctor.full_name,
            patient_name: appointment.patient.full_name,
            patient_address: appointment.patient.address,
            patient_age: appointment.patient.age,
            appointment_status: appointment.date
        })
    };

    useEffect(() => {
        const fetchAppointments = async () => {
            const res = await axios.get(`http://127.0.0.1:8000/services/appointments/history/${year}/${month}/${day}/`);
            setAppointments(res.data);
        };
        fetchAppointments();
    }, [year, month, day]);

    const handleStatusClick = (appointment) => {
        handleSelectAppointment(appointment);
        setShowStatusModal(true)
    }

    const handleStatusSubmit = async () => {
        try{
            const res = await axios.put(`http://127.0.0.1:8000/services/appointment/history/${formData.id}/`)
        }catch(error){
            
        }
    }

    const handleUploadPrescription = (appointment) => {
        handleSelectAppointment(appointment);
        setShowPrescriptionUploadModal(true);
    }

    const handleUploadPrescriptionSubmit = async () => {
        const reportData = new FormData();
        reportData.append('patient', formData.patient_uuid);
        reportData.append('doctor', formData.doctor_id);
        reportData.append('prescription_file', reportFile);
        reportData.append('uploaded_by', user);

        try {
            const response = await axios.post('http://127.0.0.1:8000/services/upload/prescription/', reportData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                alert('Prescription uploaded')
                setShowPrescriptionUploadModal(false);
                setUploadError(null)
                setDoctor('');
            }
        } catch (error) {
            if (error.response) {
                console.log(error.response.data)
                setUploadError(error.response.data || 'Failed to upload report');
            } else {
                setUploadError('An error occurred while uploading the report');
            }
        }
    }

    const handleRescheduleClick = (appointment) => {
        handleSelectAppointment(appointment);
        setShowRescheduleModal(true);
    }


    const handleSearch = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const filteredAppointments = appointments.filter((appointment) => {
        const patientName = appointment.patient?.full_name?.toLowerCase() || '';
        const doctorName = appointment.doctor?.full_name?.toLowerCase() || '';
        const appointmentDate = appointment.date || '';

        return (
            patientName.includes(searchQuery) ||
            doctorName.includes(searchQuery) ||
            appointmentDate.includes(searchQuery)
        );
    });

    const generateYears = () => {
        const years = [];
        for (let i = new Date().getFullYear(); i >= 2000; i--) {
            years.push(i);
        }
        return years;
    };

    const generateMonths = () => {
        return Array.from({ length: 12 }, (_, i) => i + 1);
    };

    const generateDays = () => {
        return Array.from({ length: 31 }, (_, i) => i + 1);
    };

    return (
        <div>
            <div className='container-fluid position-relative'>
                <div className='position-absolute top-0 end-0'>
                    <button className='btn btn-primary' id='btn-back' type='button'
                        onClick={() => navigate('/dashboard/receptionist')}
                    >
                        <IoReturnUpBackSharp /> Back
                    </button>
                </div>
            </div>
            <br />
            <br />
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-md-9'>
                        <div className='row'>
                            <div className='col-md-3'>
                                <h4>Appointments</h4>
                            </div>
                            <div className='col-md-9'>
                                <div className='d-flex mb-3'>
                                    <select
                                        className='form-select me-2'
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                    >
                                        {generateYears().map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        className='form-select me-2'
                                        value={month}
                                        onChange={(e) => setMonth(e.target.value)}
                                    >
                                        {generateMonths().map((month) => (
                                            <option key={month} value={month}>
                                                {month}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        className='form-select'
                                        value={day}
                                        onChange={(e) => setDay(e.target.value)}
                                    >
                                        {generateDays().map((day) => (
                                            <option key={day} value={day}>
                                                {day}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <input
                            type='text'
                            className='form-control mb-3'
                            placeholder='Search by Patient Name, Doctor Name, or Date'
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        <div className='table-responsive'>
                            <table className='table table-striped table-light'>
                                <thead className='thead-dark'>
                                    <tr>
                                        <th>Select</th>
                                        <th>Patient Name</th>
                                        <th>Doctor's Name</th>
                                        <th>Appointment Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAppointments.length > 0 ? (filteredAppointments.map((appointment) => (
                                        <tr key={appointment.id}>
                                            <td>
                                                <input
                                                    type="radio"
                                                    name="selectedAppointment"
                                                    onChange={() => handleSelectAppointment(appointment)}
                                                    checked={selectedAppointment?.id === appointment.id}
                                                />
                                            </td>
                                            <td>{appointment.patient.full_name}</td>
                                            <td>{appointment.doctor.full_name}</td>
                                            <td>{appointment.date}</td>
                                            <td>{appointment.status}</td>
                                        </tr>
                                    ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center">No Appointments Found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='col-md-3'>
                        <div className='side-panel'>
                            {selectedAppointment ? (
                                <div>
                                    <h4>Appointment Details</h4>
                                    <p><strong>Patient UHID:</strong> {selectedAppointment.patient.uuid}</p>
                                    <p><strong>Patient's Age:</strong> {selectedAppointment.patient.age}</p>
                                    <p><strong>Patient's Address:</strong> {selectedAppointment.patient.address}</p>
                                    <div className='btn-grp'>
                                        <button className='btn btn-primary btn-sm' onClick={() => handleUploadPrescription(selectedAppointment)}>
                                            Upload Prescription
                                        </button>
                                        <button className='btn btn-primary' onClick={() => handleStatusClick(selectedAppointment)}>
                                            Status
                                        </button>
                                        <button className='btn btn-primary'>
                                            Reschedule
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p>Select an appointment to view details.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showPrescriptionUploadModal && (
                <div className='modal show' style={{ display: 'block' }}>
                    <div className='modal-dialog'>
                        <div className='modal-content'>
                            <div className="modal-header">
                                <h5 className="modal-title">Upload Prescription</h5>
                                <button type="button" className="close" onClick={() => setShowPrescriptionUploadModal(false)}>
                                    &times;
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label>Prescription File</label>
                                        <input
                                            type="file"
                                            className="form-control-file"
                                            onChange={(e) => setReportFile(e.target.files[0])}
                                        />
                                    </div>
                                </form>
                                {uploadError ? <div className="alert alert-danger mt-3">{uploadError.report_file}</div> : " "}
                            </div>
                            <div className='modal-footer'>
                                <button className='btn btn-primary' onClick={handleUploadPrescriptionSubmit}>Upload</button>
                                <button className='btn btn-primary' onClick={(e) => setShowPrescriptionUploadModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showStatusModal && (
                <div className='modal show'>
                    <div className='modal-dialog'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className="modal-title">Change Appointment Status</h5>
                                <button type="button" className="close" onClick={() => setShowPrescriptionUploadModal(false)}>
                                    &times;
                                </button>
                            </div>
                        </div>
                        <div className='modal-body'>
                            <p><strong>Patient UHID:</strong> {formData.patient_uuid}</p>
                            <p><strong>Patient Name:</strong> {formData.patient_name}</p>
                            <p><strong>Doctor's Name</strong> {formData.doctor_name}</p>
                            <p><strong>Patient Address</strong> {formData.patient_address}</p>
                            <p><strong>Status:</strong>{formData.appointment_status}</p>
                            <div>
                                <select 
                                    className='form-control'
                                    value={formData.appointment_status}
                                    onChange={(e) => setFormData({ ...formData, appointment_status: e.target.value })}
                                >
                                    <option value='Active'>Active</option>
                                    <option value='Cheaked'>Cheaked</option>
                                    <option value='Cancelled'>Cancelled</option>
                                    <option value='Not Available'>Not Available</option>
                                </select>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button className='btn btn-primary' onClick={handleStatusSubmit}>Change Status</button>
                            <button className='btn btn-primary' onClick={()=>setShowStatusModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentHistory;
