import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoReturnUpBackSharp } from "react-icons/io5";
import DatePicker from 'react-datepicker';
import { GrUpdate } from "react-icons/gr";

import 'react-datepicker/dist/react-datepicker.css';

const AppointmentHistory = () => {
    const url = localStorage.getItem('url');
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [day, setDay] = useState(new Date().getDate());
    const [showPrescriptionUploadModal, setShowPrescriptionUploadModal] = useState(false);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    // const today = useState(new Date()); // Initialize with today's date
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showFollowUpDateModal,setFollowUpDateModal] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [reportFile, setReportFile] = useState(null);
    const [prescriptionFile, setPrescriptionFile] = useState(null);
    const [followUpDate,setFollowUpDate] = useState(new Date())
    const [showUploadReportModal,setShowUploadReportModal] = useState(false)
    const [showAdviceModal,setShaowAdviceModal] = useState(false)
    const [test, setTest] = useState('');
    const [allTests, setAllTests] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        patient_id: '',
        patient_uuid: '',
        doctor_id: '',
        doctor_name: '',
        patient_name: '',
        patient_address: '',
        patient_age: '',
        appointment_status: '',
        appointment_date: '',
        appointment_advice: '' ,
    });

    const user = localStorage.getItem("name");

    const handleSelectAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setFormData({
            id: appointment.id,
            patient_id: appointment.patient.id,
            patient_uuid: appointment.patient.uuid,
            doctor_id: appointment.doctor.id,
            doctor_name: appointment.doctor.full_name,
            patient_name: appointment.patient.full_name,
            patient_address: appointment.patient.address,
            patient_age: appointment.patient.age,
            appointment_status: appointment.status,
            appointment_date: appointment.date,
        });
    };

    const fetchTests = async () => {
        const res = await axios.get(`${url}/services/test/`);
        setAllTests(res.data);
    };

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchAppointments = async () => {
        const res = await axios.get(`${url}/services/appointments/history/${year}/${month}/${day}/`);
        setAppointments(res.data);
    };

    useEffect(() => {
        fetchAppointments();
    }, [year, month, day]);

    const handleStatusClick = (appointment) => {
        handleSelectAppointment(appointment);
        setShowStatusModal(true);
    };

    const handleStatusSubmit = async () => {
        const reportData = new FormData();
        reportData.append("status", formData.appointment_status);
        // reportData.append("advice", formData.appointment_advice);
        try {
            const res = await axios.put(`${url}/services/appointment/history/${formData.id}/`, reportData);
            if (window.confirm("Are you sure you want to change the status?")) {
                await fetchAppointments();
                setShowStatusModal(false); // Close the modal
                // setSelectedAppointment(null); // Clear selected appointment

            }
        } catch (error) {
            alert("Error updating status: " + error.message);
        }
    };

    const handleUpoadReport = (appointment) =>{
        handleSelectAppointment(appointment);
        setShowUploadReportModal(true);
    }

    const handleUploadReportSubmit = async () => {
        const reportData = new FormData();
        reportData.append('patient', formData.patient_uuid);
        if(test){
            reportData.append('test', test);
        }
        if(reportFile){
            reportData.append('report_file', reportFile);
        }
        reportData.append('uploaded_by', user);
        reportData.append('message', message);
        reportData.append('appointment', formData.id)

        try {
            const response = await axios.post(`${url}/services/upload/report/`, reportData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                alert('Report uploaded')
                setShowUploadReportModal(false);
            }
        } catch (error) {
            if (error.response) {
                console.log(error.response.data)
                setUploadError(error.response.data || 'Failed to upload report');
            } else {
                setUploadError('An error occurred while uploading the report');
            }
        }
    };


    const handleUploadPrescription = (appointment) => {
        handleSelectAppointment(appointment);
        setShowPrescriptionUploadModal(true);
    };

    const handleUploadPrescriptionSubmit = async () => {
        const reportData = new FormData();
        reportData.append('patient', formData.patient_uuid);
        reportData.append('doctor', formData.doctor_id);
        if (prescriptionFile){
            reportData.append('prescription_file', prescriptionFile);
        }
        reportData.append('uploaded_by', user);
        reportData.append('message', message);

        try {
            const response = await axios.post(`${url}/services/upload/prescription/`, reportData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                alert('Prescription uploaded');
                setShowPrescriptionUploadModal(false);
                setUploadError('');
                setMessage('');
            }
        } catch (error) {
            if(error.response){
                setUploadError(error.response.data);
                console.error(error.response.data);
            }
        }
    };

    const handleRescheduleClick = (appointment) => {
        handleSelectAppointment(appointment);
        setShowRescheduleModal(true);
    };

    const handleRescheduleSubmit = async () => {
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        const formattedDate = formatDate(followUpDate);
        const reportData = new FormData();
        if(formattedDate){
            reportData.append('date', formattedDate)
        }
        try {
            const res = await axios.put(`${url}/services/appointment/history/${formData.id}/`, reportData)

            if (res.status === 200) {
                setShowRescheduleModal(false); // Close the reschedule modal
                setSelectedAppointment(null); // Clear selected appointment
                alert('Appointment rescheduled')
                fetchAppointments();
                setFollowUpDate('')
            }
        } catch (error) {
            alert("Error updating appointment date: " + error.message);
        }
    };

    const handleAdviceClick = (appointment)=>{
        handleSelectAppointment(appointment);
        setShaowAdviceModal(true);
    }

    const handleAdviceSubmmit =  async()=>{
        const reportData = new FormData();
        reportData.append("status", formData.appointment_status);
        reportData.append("advice", formData.appointment_advice);

        try{
            const res = await axios.put(`${url}/services/appointment/history/${formData.id}/`, reportData);
            if(window.confirm("Upload Advice")){
                setShaowAdviceModal(false);
            }
        }catch(error){
            setUploadError(error.response.data)
        }
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
                            placeholder='Search by Patient Name or Doctor Name'
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
                                        <button className='btn btn-primary' onClick={() => handleRescheduleClick(selectedAppointment)}>
                                            {/*<GrUpdate />*/}Reschedule
                                        </button>
                                        <button className='btn btn-primary' onClick={()=> handleUpoadReport(selectedAppointment)}>
                                            Upload Report
                                        </button>
                                        <button className='btn  btn-primary' onClick={()=>handleAdviceClick(selectedAppointment)}>
                                            Advice 
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
                                <form className='needs-validation'>
                                    <div className='form-group'>
                                        <label>Advice / Impression</label>
                                        <textarea
                                            className='form-control'
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Upload Prescription</label>
                                        <input
                                            type="file"
                                            className={`form-control ${uploadError.prescription_file ? "is-invalid":" "}`}
                                            onChange={(e) => setPrescriptionFile(e.target.files[0])}
                                        />
                                        <div className="invalid-feedback">
                                            {uploadError.prescription_file ? <p>{uploadError.prescription_file}</p> : " " }
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={() => setShowPrescriptionUploadModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={handleUploadPrescriptionSubmit}>Upload</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showStatusModal && (
                <div className='modal show' style={{ display: 'block' }}>
                    <div className='modal-dialog'>
                        <div className='modal-content'>
                            <div className="modal-header">
                                <h5 className="modal-title">Change Status</h5>
                                <button type="button" className="close" onClick={() => setShowStatusModal(false)}>
                                    &times;
                                </button>
                            </div>
                            <div className="modal-body">
                                <div>
                                    <p><strong>Patient's UHID:</strong> {formData.patient_uuid}</p>
                                    <p><strong>Patient Name:</strong> {formData.patient_name}</p>
                                    <p><strong>Doctors's Name:</strong> {formData.doctor_name}</p>
                                    <p><strong>Appointment Date:</strong> {formData.appointment_date}</p>
                                    <p><strong>Status:</strong>{formData.appointment_status}</p>
                                </div>
                                <form>
                                    <div className="form-group">
                                        <label>Change Status</label>
                                        <select
                                            className="form-control"
                                            value={formData.appointment_status}
                                            onChange={(e) => setFormData({...formData, appointment_status: e.target.value })}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Checked">Checked</option>
                                            <option value="Cancelled">Cancelled</option>
                                            <option value='Not Available'>Not Available</option>
                                        </select>
                                    </div>
                                    {/* <div className='form-group'>
                                        <label>Advice</label>
                                        <textarea 
                                            className='form-control'
                                            value={formData.appointment_advice}
                                            onChange={(e)=>setFormData({...formData, appointment_advice: e.target.value})}
                                        />
                                    </div> */}
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={() => setShowStatusModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={handleStatusSubmit}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showRescheduleModal && (
                <div className="modal show" style={{ display: 'block' }}>
                    <div className='modal-dialog'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h4 className="modal-title">Reschedule Appointment</h4>
                                <button type="button" className="close" onClick={() => setShowRescheduleModal(false)}>
                                    &times;
                                </button>
                            </div>
                            <div className='modal-body'>
                                <h5>Reschedule Appointment On:-</h5>
                                <DatePicker
                                    selected={followUpDate}
                                    onChange={(date) => setFollowUpDate(date)}
                                    minDate={new Date()} // Disable past dates and today
                                    dateFormat="yyyy-MM-dd"
                                    className="form-control"
                                />
                            </div>
                            <div className='modal-footer'>
                                <button className='btn btn-primary' onClick={handleRescheduleSubmit}>Submit</button>
                                <button className='btn btn-primary' onClick={() => setShowRescheduleModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showFollowUpDateModal && (
                <div className="modal show" style={{ display: 'block' }}>
                    <div className='modal-dialog'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className="modal-title">Reschedule Appointment</h5>
                                <button type="button" className="close" onClick={() => setShowRescheduleModal(false)}>
                                    &times;
                                </button>
                            </div>
                            <div className='modal-body'>
                                <h3>Reschedule Appointment</h3>
                                <DatePicker
                                    selected={followUpDate}
                                    onChange={(date) => setFollowUpDate(date)}
                                    minDate={new Date()} // Disable past dates and today
                                    dateFormat="yyyy-MM-dd"
                                    className="form-control"
                                />
                            </div>
                            <div className='modal-footer'>
                                <button className='btn btn-primary' onClick={handleRescheduleSubmit}>Reschedule</button>
                                <button className='btn btn-primary' onClick={() => setShowRescheduleModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showUploadReportModal && (
                    <div className="modal show" style={{ display: 'block' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Upload Report</h5>
                                    <button type="button" className="close" onClick={() => setShowUploadReportModal(false)}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form className="needs-validation">
                                        <div className="form-group">
                                            <label>Test</label>
                                            <select
                                                className={`form-control ${uploadError.test ? 'is-invalid' : ""}`}
                                                value={test}
                                                onChange={(e) => setTest(e.target.value)}
                                            >
                                                <option value="">Select a test</option>
                                                {allTests.map((test) => (
                                                    <option key={test.id} value={test.id}>
                                                        {test.test_name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className='invalid-feedback'>
                                                {uploadError.test && <p>{uploadError.test}</p>}
                                            </div>
                                        </div>
                                        <div className='form-group'>
                                            <label>Advice / Impression</label>
                                            <textarea 
                                                className='form-control'
                                                type='text'
                                                value={message}
                                                onChange={(e)=>setMessage(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Report File</label>
                                            <input
                                                className= {`form-control ${uploadError.report_file  ? "is-invalid" : ""}`}
                                                type="file"
                                                onChange={(e) => setReportFile(e.target.files[0])}
                                            />
                                            <div className='invalid-feedback'>
                                                {uploadError.report_file ? <p>{uploadError.report_file}</p> : "" }
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary" onClick={() => setShowUploadReportModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={handleUploadReportSubmit}>
                                        Upload Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {showAdviceModal && (
                    <div className='modal show' style={{display: "block"}}>
                        <div className='modal-dialog'>
                            <div className='modal-content'>
                                <div className='modal-header'>
                                    <h5 className="modal-title">Add Advice</h5>
                                    <button type="button" className="close" onClick={() => setShaowAdviceModal(false)}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className='modal-body'>
                                    <form>
                                        <div className='form-group'>
                                            <label>Advice / Impression</label>
                                            <textarea 
                                                className='form-control'
                                                value={formData.appointment_advice}
                                                onChange={(e)=>setFormData({...formData, appointment_advice: e.target.value})}
                                            />
                                        </div>
                                    </form>
                                </div>
                                <div className='modal-footer'>
                                    <button className='btn btn-primary' onClick={handleAdviceSubmmit}>
                                        Add Advice
                                    </button>
                                    <button className='btn btn-primary' onClick={()=>setShaowAdviceModal(false)}>
                                        Cancel 
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

        </div>
    );
};

export default AppointmentHistory;
