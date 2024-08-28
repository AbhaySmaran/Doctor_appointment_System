import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaEdit, FaFileUpload } from "react-icons/fa";
import { MdEmail, MdAirplanemodeInactive } from "react-icons/md";
import { CiFileOn } from "react-icons/ci";
import { IoReturnUpBackSharp } from "react-icons/io5";
// import { set } from 'react-datepicker/dist/date_utils';
import { SlCalender } from "react-icons/sl"

const PatientList = () => {
    const user = localStorage.getItem('uuid');
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
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
    const [uploadError, setUploadError] = useState(null);
    const recordsPerPage = 4;
    const [doctor, setDoctor] = useState('');
    const [doctors, setDoctors] = useState([])
    useEffect(() => {
        const fetchDoctors = async () => {
            const res = await axios.get('http://127.0.0.1:8000/api/doctors/')
            setDoctors(res.data)
        };
        fetchDoctors();
    }, [])

    const fetchTests = async () => {
        const res = await axios.get('http://127.0.0.1:8000/services/test/');
        setAllTests(res.data);
    };

    useEffect(() => {
        fetchTests();
    }, []);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/patients/');
            setPatients(res.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

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
            status: patient.status,
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
            await axios.put(`http://127.0.0.1:8000/api/patients/${formData.id}/`, formData);
            if (window.confirm("Are you sure you want to change status?")) {
                await fetchPatients();
                setShowStatusModal(false);
            }
        } catch (error) {
            console.error('Error updating patient Status:', error);
        }
    };

    const navigate = useNavigate();

    const handleViewReport = (patient) => {
        navigate(`/dashboard/patient/reports/${formData.uuid}`);
    };

    const handleUploadReport = (patient) => {
        handlePatientSelect(patient);
        setShowUploadModal(true);
    };

    const handleSubmitUpdate = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/patients/${formData.id}/`, formData);
            await fetchPatients();
            setShowUpdateModal(false);
        } catch (error) {
            console.error('Error updating patient:', error);
        }
    };

    const handleAppointmentSubmit = async () => {
        const reportData = new FormData();
        reportData.append('patient', formData.uuid);
        reportData.append('doctor', doctor);
        reportData.append('date', appointmentDate);
        reportData.append('uploaded_by', user)

        const res = await axios.post('http://127.0.0.1:8000/services/appointment/book/', reportData)
        alert('Appointment Booked')
        setShowAppointmentModal(false);
    }

    const handleReportUpload = async () => {
        const reportData = new FormData();
        reportData.append('patient', formData.uuid);
        reportData.append('test', test);
        reportData.append('report_file', reportFile);
        reportData.append('uploaded_by', user);

        try {
            const response = await axios.post('http://127.0.0.1:8000/services/upload/report/', reportData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                alert('Report uploaded')
                setShowUploadModal(false);
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
            const response = await axios.post('http://127.0.0.1:8000/services/follow-up/', {
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
            <div className="container-fluid">
                <div className="row mt-4">
                    <div className="col-md-8">
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
                                        <th>Status</th>
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
                                                    onChange={() => handlePatientSelect(patient)}
                                                />
                                            </td>
                                            <td>{patient.uuid}</td>
                                            <td>{patient.full_name}</td>
                                            <td>{patient.gender}</td>
                                            <td>{patient.status}</td>
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

                    <div className="col-md-4">
                        <div className="side-panel">
                            <h4>Patient Details</h4>
                            {selectedPatient ? (
                                <div>
                                    <p><strong>UHID:</strong> {selectedPatient.uuid}</p>
                                    <p><strong>Name:</strong> {selectedPatient.full_name}</p>
                                    <p><strong>Age:</strong> {selectedPatient.age}</p>
                                    <p><strong>Email:</strong> {selectedPatient.email}</p>
                                    <p><strong>Gender:</strong> {selectedPatient.gender}</p>
                                    <p><strong>Address:</strong> {selectedPatient.address}</p>
                                    <p><strong>Contact:</strong> {selectedPatient.contact_no}</p>
                                    <div className="btn-grp">
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleUpdate(selectedPatient)}
                                        >
                                            <FaEdit /> Update
                                        </button>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleAppointment(selectedPatient)}
                                        >
                                            <SlCalender /> Appointment
                                        </button>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleViewReport(selectedPatient)}
                                        >
                                            <CiFileOn /> View Reports
                                        </button>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleUploadReport(selectedPatient)}
                                        >
                                            <FaFileUpload /> Upload Report
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
                                            <MdAirplanemodeInactive /> Status
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
                                    <button type="button" className="close" onClick={() => setShowUpdateModal(false)}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="form-group">
                                            <label>Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.full_name}
                                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Age</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.age}
                                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
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
                                        <div className="form-group">
                                            <label>Address</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Contact No.</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.contact_no}
                                                onChange={(e) => setFormData({ ...formData, contact_no: e.target.value })}
                                            />
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={handleSubmitUpdate}>
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Upload Report Modal */}
                {showUploadModal && (
                    <div className="modal show" style={{ display: 'block' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Upload Report</h5>
                                    <button type="button" className="close" onClick={() => setShowUploadModal(false)}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="form-group">
                                            <label>Test</label>
                                            <select
                                                className="form-control"
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
                                        </div>
                                        <div className="form-group">
                                            <label>Report File</label>
                                            <input
                                                type="file"
                                                className="form-control-file"
                                                onChange={(e) => setReportFile(e.target.files[0])}
                                            />
                                        </div>
                                    </form>
                                    {uploadError ? <div className="alert alert-danger mt-3">{uploadError.report_file}</div> : " "}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={handleReportUpload}>
                                        Upload Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
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
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowFollowUpModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={handleFollowUpSubmit}>
                                        Send Follow Up
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
                                    <form>
                                        <div className='form-group'>
                                            <label>Doctor Name</label>
                                            <select
                                                className='form-control'
                                                name='doctor'
                                                id='doctor'
                                                value={doctor}
                                                onChange={(e) => setDoctor(e.target.value)}
                                            >
                                                <option value=''>Select Doctors Name</option>
                                                {doctors.map((doctor => (
                                                    <option key={doctor.id} value={doctor.id}>{doctor.full_name}</option>
                                                )))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor='date'>Appointment Date</label>
                                            <input
                                                type='date'
                                                name='date'
                                                id='date'
                                                value={appointmentDate}
                                                onChange={(e) => setAppointmentDate(e.target.value)}
                                            />
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowAppointmentModal(false)}>Cancel</button>
                                    <button type="button" className="btn btn-primary" onClick={handleAppointmentSubmit}>Schedule</button>
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
                                    <div>
                                        <p><strong>Change Status:-</strong></p>
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
                                        Chnage Staus
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowStatusModal(false)}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div >
    );
};

export default PatientList;
