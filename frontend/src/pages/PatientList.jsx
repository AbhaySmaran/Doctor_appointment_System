import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaEdit, FaFileUpload } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { GrStatusUnknown } from "react-icons/gr";
import { CiFileOn } from "react-icons/ci";
import { IoReturnUpBackSharp } from "react-icons/io5";
// import { set } from 'react-datepicker/dist/date_utils';
import { SlCalender } from "react-icons/sl"
import { FaFileExport } from "react-icons/fa";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { GrStatusCritical } from "react-icons/gr";
import { GrStatusGood } from "react-icons/gr";
import { MdOutlineManageHistory } from "react-icons/md";

const PatientList = () => {
    const url = localStorage.getItem('url');
    const user = localStorage.getItem('name');
    const [message,setMessage] = useState('');
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showReportUploadModal, setShowReportUploadModal] = useState(false);
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [showPrescriptionUploadModal, setShowPrescriptionUploadModal] = useState(false);
    const [appointmentDate, setAppointmentDate] = useState('')
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        uuid: '',
        full_name: '',
        age: '',
        email: '',
        gender: '',
        address: '',
        contact_no: '',
        status: ''
    });
    const [reportFile, setReportFile] = useState(null);
    const [test, setTest] = useState('');
    const [allTests, setAllTests] = useState([]);
    const [uploadError, setUploadError] = useState('');
    const recordsPerPage = 10;
    const [doctor, setDoctor] = useState('');
    const [doctors, setDoctors] = useState([])

    const fetchDoctors = async () => {
        const res = await axios.get(`${url}/api/doctors/`)
        setDoctors(res.data)
    };
    

    const fetchTests = async () => {
        const res = await axios.get(`${url}/services/test/`);
        setAllTests(res.data);
    };

    const fetchPatients = async () => {
        try {
            const res = await axios.get(`${url}/api/patients/`);
            setPatients(res.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    useEffect(() => {
        fetchDoctors();
        fetchPatients();
        fetchTests();
    }, []);

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        setFormData({
            id: patient.id,
            uuid: patient.uuid,
            full_name: patient.full_name,
            age: patient.age,
            email: patient.email,
            gender: patient.gender,
            address: patient.address,
            contact_no: patient.contact_no,
            status: patient.status
        });
    };

    const handleUpdate = (patient) => {
        handlePatientSelect(patient);
        setShowUpdateModal(true);
    };

    const handleAppointment = (patient) => {
        handlePatientSelect(patient);
        setShowAppointmentModal(true);
    }

    const handleStatus = (patient) => {
        handlePatientSelect(patient);
        setShowStatusModal(true);
    }

    const handleStatusChange = async () => {
        try {
            if (window.confirm("Are you sure you want to change status?")) {
                await axios.put(`${url}/api/patients/${formData.id}/`, formData);
                await fetchPatients();
                setShowStatusModal(false);
            }
        } catch (error) {
            console.error('Error updating patient Status:', error);
            setUploadError(error.response.data)
        }
    };

    const navigate = useNavigate();

    const handleViewReport = (patient) => {
        navigate(`/dashboard/patient/reports/${formData.uuid}`);
    };

    const handleViewPrescription = (patient)=>{
        navigate(`/dashboard/patient/prescriptions/${formData.uuid}`)
    }

    const handleViewHistory = (patient) =>{
        navigate(`/dashboard/patient/history/${formData.uuid}`)
    }

    const handleSubmitUpdate = async () => {
        const data = new FormData();
        if(formData.full_name){
            data.append("full_name",formData.full_name )
        }
        if(formData.age){
            data.append("age",formData.age )
        }
        if(formData.email){
            data.append("email",formData.email )
        }
        if(formData.contact_no){
            data.append("contact_no",formData.contact_no )
        }
        if(formData.address){
            data.append("address",formData.address )
        }
        if(formData.status){
            data.append("status",formData.status )
        }
        try {            
            if (window.confirm("Are you sure you want to save changes?")) {
                const res = await axios.put(`${url}/api/patients/${formData.id}/`, formData);
                await fetchPatients();
                setShowUpdateModal(false);
                setSelectedPatient((prevPatient) => ({
                    ...prevPatient,
                    ...formData
                }));
            }
        } catch (error) {
            setUploadError(error.response.data)
            console.error('Error updating patient:', error);
        }
    };

    const handleAppointmentSubmit = async () => {
        const reportData = new FormData();
        reportData.append('patient', formData.uuid);
        if(doctor){
            reportData.append('doctor', doctor);
        }
        reportData.append('date', appointmentDate);
        reportData.append('booked_by', user)

        try{       
            await axios.post(`${url}/services/appointment/book/`, reportData);
            alert("Appointment Booked!")
            setShowAppointmentModal(false);
            setDoctor('');
            setAppointmentDate('');
            setUploadError('');
            
        }catch(error){
            setUploadError(error.response.data);
            console.log(error.response.data);
        }
    }

    // comment later

    const handleUploadReport = (patient) => {
        handlePatientSelect(patient);
        setShowReportUploadModal(true);
    };

    const handleUploadPrescription = (patient) => {
        handlePatientSelect(patient);
        setShowPrescriptionUploadModal(true);
    }

    const handleReportUpload = async () => {
        const reportData = new FormData();
        reportData.append('patient', formData.uuid);
        if(test) reportData.append('test', test);
        if(reportFile) reportData.append('report_file', reportFile);
        reportData.append('uploaded_by', user);
        reportData.append('message', message);

        try {
            const response = await axios.post(`${url}/services/upload/report/`, reportData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                alert('Report uploaded')
                setShowReportUploadModal(false);
                setReportFile(null);
                setUploadError('');
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

    const handleUploadPrescriptionSubmit = async () => {
        const reportData = new FormData();
        reportData.append('patient', formData.uuid);
        if(doctor) reportData.append('doctor', doctor);
        if(reportFile) reportData.append('prescription_file', reportFile);
        reportData.append('uploaded_by', user);

        try {
            const response = await axios.post(`${url}/services/upload/prescription/`, reportData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                alert('Prescription uploaded')
                setShowPrescriptionUploadModal(false);
                setReportFile(null);
                setUploadError('');
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

    // comment later

    const filteredPatients = patients.filter((patient) => {
        if (patient && patient.full_name) {
            return patient.full_name.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
    });

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredPatients.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredPatients.length / recordsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [showFollowUpModal, setShowFollowUpModal] = useState(false);
    const [followUpDate, setFollowUpDate] = useState(null);

    const handleFollowUpSubmit = async () => {
        if (!followUpDate) {
            alert('Please select a follow-up date.');
            return;
        }

        try {
            const response = await axios.post(`${url}/services/follow-up/`, {
                patient_uuid: selectedPatient.uuid,
                follow_up_date: followUpDate.toISOString().split('T')[0]  // Convert date to YYYY-MM-DD format
            });

            alert(response.data.message);
            setShowFollowUpModal(false);
        } catch (error) {
            console.error('Error sending follow-up email:', error);
            alert('Failed to send follow-up email.');
        }
    };


    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const handleExport = () => {
        // Convert the table data to a worksheet
        const date = new Date();
        const worksheet = XLSX.utils.json_to_sheet(patients);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const fileName = `PatientData_${formattedDate}.xlsx`;
        // Create a new workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Write the workbook to a binary array
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        // Save the file
        const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(file, fileName);
        alert('Excel file saved');
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
                <div className='position-absolute top-0'>
                    <button className='btn btn-primary' id='btn-back' type='button'
                        onClick={handleExport}
                    >
                        <FaFileExport /> Export
                    </button>
                </div>
            </div>
            <br />
            <div className="container-fluid">
                <div className="row mt-4">
                    <div className="col-md-9">
                        <input
                            type="text"
                            id="search-input"
                            className="form-control mb-3"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset to the first page when search term changes
                            }}
                        />
                        <div className="table-responsive">
                            <table className="table table-striped table-light">
                                <thead className="thead" id='thead'>
                                    <tr>
                                        <th>Select</th>
                                        <th>UHID</th>
                                        <th>Name</th>
                                        <th>Gender</th>
                                        <th className='text-center'>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentRecords.map((patient) => (
                                        <tr key={patient.id}>
                                            <td>
                                                <input
                                                    type="radio"
                                                    name="patient-select"
                                                    value={patient.id}
                                                    onChange={() =>{ handlePatientSelect(patient)}}
                                                />
                                            </td>
                                            <td>{patient.uuid}</td>
                                            <td>{patient.full_name}</td>
                                            <td>{patient.gender}</td>
                                            <td className='text-center'>{
                                                patient.status.toLowerCase() === 'active' ? <GrStatusGood /> : <GrStatusCritical />
                                            }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <nav>
                            <ul className="pagination justify-content-center">
                                {[...Array(totalPages)].map((_, index) => (
                                    <li key={index} className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    <div className="col-md-3">
                        <div className="side-panel">
                            <h4>Patient Details</h4>
                            {selectedPatient ? (
                                <div>
                                    <p><strong>Age:</strong> {selectedPatient.age}</p>
                                    <p><strong>Email:</strong> {selectedPatient.email}</p>
                                    <p><strong>Address:</strong> {selectedPatient.address}</p>
                                    <p><strong>Contact:</strong> {selectedPatient.contact_no}</p>
                                    <div className="btn-grp">
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleUpdate(selectedPatient)}
                                        >
                                            <FaEdit /> Edit
                                        </button>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleAppointment(selectedPatient)}
                                        >
                                            <SlCalender /> Appointment
                                        </button>
                                        
                                        {/* remove later */}
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleUploadReport(selectedPatient)}
                                        >
                                            <FaFileUpload /> Upload Report
                                        </button> 
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleUploadPrescription(selectedPatient)}
                                        >
                                            <FaFileUpload /> Add Prescription
                                        </button>
                                        {/* remove later */}
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleViewReport(selectedPatient)}
                                        >
                                            <CiFileOn /> View Reports
                                        </button>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleViewPrescription(selectedPatient)}
                                        >
                                            <CiFileOn /> View Prescription
                                        </button>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => setShowFollowUpModal(true)}
                                        >
                                            <MdEmail /> Follow Up Email
                                        </button>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleStatus(selectedPatient)}
                                        >
                                            <GrStatusUnknown /> Status
                                        </button>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleViewHistory(selectedPatient)}
                                        >
                                            <MdOutlineManageHistory /> History
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p>Select a patient to view details here.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Update Patient Modal */}
                {showUpdateModal && (
                    <div className="modal show" style={{ display: 'block' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Update Patient</h5>
                                    <button type="button" className="close" onClick={() =>{ setShowUpdateModal(false); setUploadError('')}}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body" >
                                    <form className='needs-validation'>
                                        <div className='row'>
                                            <div className='col-md-4'>
                                                <div className="form-group">
                                                    <label>Name</label>
                                                    <input
                                                        type="text"
                                                        className={`form-control ${uploadError.full_name ? 'is-invalid' : ''}`}
                                                        value={formData.full_name}
                                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                                    />
                                                    <div className='invalid-feedback'>
                                                        {uploadError.full_name && <p>This field is required</p>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-4'>
                                                <div className="form-group">
                                                    <label>Age</label>
                                                    <input
                                                        type="number"
                                                        className={`form-control ${uploadError.age ? 'is-invalid' : ''}`}
                                                        value={formData.age}
                                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                                    />
                                                    <div className='invalid-feedback'>
                                                        {uploadError.age && <p>This field is required</p>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-4'>
                                                <div className="form-group">
                                                    <label>Gender</label>
                                                    <select
                                                        className="form-control"
                                                        value={formData.gender}
                                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                    >
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row aligns-item-center">
                                            <div className='col-md-2'><label>Email</label></div>
                                            <div className='col-md-10'>
                                                <input
                                                    type="email"
                                                    className={`form-control ${uploadError.email ? 'is-invalid': ''}`}
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                />
                                                <div className="invalid-feedback">
                                                    {uploadError.email && <p>This field is required</p>}
                                                </div>
                                            </div>
                                        </div>
                                        <br />
                                        <div className="row aligns-item-center">
                                            <div className='col-md-2'><label >Contact</label></div>
                                            <div className='col-md-10'>
                                                <input
                                                    type="number"
                                                    className={`form-control ${uploadError.contact_no ? 'is-invalid' : ""}`}
                                                    value={formData.contact_no}
                                                    onChange={(e) => setFormData({ ...formData, contact_no: e.target.value })}
                                                    min='10'
                                                    max="15"
                                                />
                                                <div className='invalid-feedback'>
                                                    {uploadError.contact_no && <p>This field is required</p>}
                                                </div>
                                            </div>
                                            
                                        </div>
                                        <br/>
                                        <div className="row aligns-item-center">
                                            <div className='col-md-2'><label>Address</label></div>
                                            <div className='col-md-10'>
                                                <textarea
                                                    type="text"
                                                    className="form-control"
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary" onClick={handleSubmitUpdate}>
                                        Save Changes
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={() =>{ setShowUpdateModal(false); setUploadError('')}}>
                                        Cancel
                                    </button>                                   
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Upload Report Modal */}
                {showReportUploadModal && (
                    <div className="modal show" style={{ display: 'block' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Upload Report</h5>
                                    <button type="button" className="close" onClick={() => setShowReportUploadModal(false)}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form>
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
                                            <label>Message</label>
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
                                    <button type="button" className="btn btn-primary" onClick={handleReportUpload}>
                                        Upload Report
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={() => setShowReportUploadModal(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* can be removed later */}
                {showFollowUpModal && (
                    <div className="modal show" style={{ display: 'block' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Follow Up Email</h5>
                                    <button type="button" className="close" onClick={() => setShowFollowUpModal(false)}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="form-group">
                                            <label>Select Follow-Up Date</label>
                                            <DatePicker
                                                selected={followUpDate}
                                                onChange={(date) => setFollowUpDate(date)}
                                                minDate={tomorrow} // Disable past dates and today
                                                dateFormat="yyyy-MM-dd"
                                                className="form-control"
                                            />
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary" onClick={handleFollowUpSubmit}>
                                        Send Follow Up
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={() => setShowFollowUpModal(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Appointment modal */}
                {showAppointmentModal && (
                    <div className="modal show" style={{ display: 'block' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Schedule Appointment</h5>
                                    <button type="button" className="close" onClick={() => setShowAppointmentModal(false)}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form className='needs-validation'>
                                        <div className='form-group'>
                                            <label>Doctor's Name</label>
                                            <select
                                                className={`form-control ${uploadError.doctor ? 'is-invalid' : ''}`}
                                                name='doctor'
                                                id='doctor'
                                                value={doctor}
                                                onChange={(e) => setDoctor(e.target.value)}
                                            >
                                                <option value=''>Select Doctor's Name</option>
                                                {doctors.map((doctor => (
                                                    <option key={doctor.id} value={doctor.id}>{doctor.full_name}</option>
                                                )))}
                                            </select>
                                            <div className='invalid-feedback'>
                                                {uploadError.doctor && <p>{uploadError.doctor}</p>}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor='date'>Appointment Date</label>
                                            <input
                                                type='date'
                                                className={`form-control ${uploadError.date ? 'is-invalid' : ''}` }
                                                name='date'
                                                id='date'
                                                value={appointmentDate}
                                                onChange={(e) => setAppointmentDate(e.target.value)}
                                            />
                                            <div className='invalid-feedback'>
                                                <p>Choose a Date</p>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary" onClick={handleAppointmentSubmit}>Schedule</button>
                                    <button type="button" className="btn btn-primary" onClick={() => setShowAppointmentModal(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showStatusModal && (
                    <div className="modal show" style={{ display: 'block' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Status</h5>
                                    <button type="button" className="close" onClick={() => setShowStatusModal(false)}>
                                        &times;
                                    </button>
                                </div>
                                <div className='modal-body'>
                                    <p><strong>UHID:</strong> {formData.uuid}</p>
                                    <p><strong>Name:</strong> {formData.full_name}</p>
                                    <p><strong>Age:</strong> {formData.age}</p>
                                    <p><strong>Email:</strong> {formData.email}</p>
                                    <p><strong>Status:</strong>{formData.status}</p>
                                    {/* <p><strong>Change Status:-</strong></p> */}
                                    <div>
                                        <div>
                                            <input
                                                type="radio"
                                                id="statusActive"
                                                name="status"
                                                value="Active"
                                                checked={formData.status === 'Active'}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            />
                                            <label htmlFor="statusActive">Active</label>
                                        </div>
                                        <div>
                                            <input
                                                type="radio"
                                                id="statusInactive"
                                                name="status"
                                                value="Inactive"
                                                checked={formData.status === 'Inactive'}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            />
                                            <label htmlFor="statusInactive">Inactive</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary" onClick={() => handleStatusChange()}>
                                        Change Status
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={() => setShowStatusModal(false)}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* can beremovd later */}
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
                                        <div className='form-group'>
                                            <label>Doctor's Name</label>
                                            <select
                                                className={`form-control ${uploadError.doctor ? 'is-invalid' : ""}`}
                                                name='doctor'
                                                id='doctor'
                                                value={doctor}
                                                onChange={(e) => setDoctor(e.target.value)}
                                            >
                                                <option value=''>Select Doctor's Name</option>
                                                {doctors.map((doctor => (
                                                    <option key={doctor.id} value={doctor.id}>{doctor.full_name}</option>
                                                )))}
                                            </select>
                                            <div className='invalid-feedback'>
                                                {uploadError.doctor ?  <p>{uploadError.doctor}</p>: ""}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Prescription File</label>
                                            <input
                                                type="file"
                                                className={`form-control ${uploadError.prescription_file ? 'is-invalid' : ""}`}
                                                onChange={(e) => setReportFile(e.target.files[0])}
                                            />
                                            <div className='invalid-feedback'>
                                                {uploadError.prescription_file ? <p>{uploadError.prescription_file}</p> : "" }
                                            </div>
                                        </div>
                                    </form>
                                    
                                </div>
                                <div className='modal-footer'>
                                    <button className='btn btn-primary' onClick={handleUploadPrescriptionSubmit}>Upload</button>
                                    <button className='btn btn-primary' onClick={(e) => setShowPrescriptionUploadModal(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* can be remove later */}

            </div>
        </div >
    );
};

export default PatientList;
