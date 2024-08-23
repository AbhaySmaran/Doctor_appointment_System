import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        age: '',
        email: '',
        gender: '',
        address: '',
        contact_no: '',
    });
    const [reportFile, setReportFile] = useState(null);
    const recordsPerPage = 2;

    useEffect(() => {
        const fetchPatients = async () => {
            const res = await axios.get('http://127.0.0.1:8000/api/patients/');
            setPatients(res.data);
        };
        fetchPatients();
    }, []);

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        setFormData({
            full_name: patient.full_name,
            age: patient.age,
            email: patient.email,
            gender: patient.gender,
            address: patient.address,
            contact_no: patient.contact_no,
            // Map other patient fields here
        });
    };

    const setToLocalStorage = (patient) => {
        localStorage.setItem('selectedPatient', JSON.stringify(patient));
    };

    // Action handlers
    const handleUpdate = (patient) => {
        handlePatientSelect(patient);
        setShowUpdateModal(true);
    };

    const handleDelete = async (patientId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/patients/${patientId}/`);
            setPatients(patients.filter(patient => patient.id !== patientId));
            setSelectedPatient(null); // Clear selection after deletion
        } catch (error) {
            console.error('Error deleting patient:', error);
        }
    };

    const handleViewReport = (patient) => {
        const reportUrl = `http://127.0.0.1:8000/reports/${patient.id}/view/`;
        window.open(reportUrl, '_blank');
    };

    const handleUploadReport = (patient) => {
        handlePatientSelect(patient);
        setShowUploadModal(true);
    };

    // Handle form submissions
    const handleSubmitUpdate = async () => {
        try {
            const res = await axios.put(`http://127.0.0.1:8000/api/patients/${selectedPatient.id}/`, formData);
            const updatedPatients = patients.map(patient => 
                patient.id === selectedPatient.id ? res.data : patient
            );
            setPatients(updatedPatients);
            setShowUpdateModal(false);
            setSelectedPatient(res.data);
        } catch (error) {
            console.error('Error updating patient:', error);
        }
    };

    const handleReportUpload = async () => {
        const reportData = new FormData();
        reportData.append('report', reportFile);

        try {
            await axios.post(`http://127.0.0.1:8000/api/patients/${selectedPatient.id}/upload-report/`, reportData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setShowUploadModal(false);
        } catch (error) {
            console.error('Error uploading report:', error);
        }
    };

    // Filter patients based on search term
    const filteredPatients = patients.filter((patient) =>
        patient.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination Logic after filtering
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredPatients.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredPatients.length / recordsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
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
                            setCurrentPage(1); // Reset to the first page when a new search is performed
                        }}
                    />
                    <div className="table-responsive">
                        <table className='table'>
                            <thead className="thead-dark">
                                <tr>
                                    <th>Select</th>
                                    <th>UHID</th>
                                    <th>Name</th>
                                    <th>Gender</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRecords.map((patient) => (
                                    <tr key={patient.id}>
                                        <td>
                                            <input 
                                                type='radio' 
                                                name='patient-select'
                                                value={patient.id} 
                                                onChange={() => handlePatientSelect(patient)}
                                            />
                                        </td>
                                        <td>{patient.uuid}</td>
                                        <td>{patient.full_name}</td>
                                        <td>{patient.gender}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Controls */}
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

                {/* Side Panel Section */}
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
                                <button 
                                    className="btn btn-primary mr-2" 
                                    onClick={() => handleUpdate(selectedPatient)}
                                >
                                    Update
                                </button>
                                <button 
                                    className="btn btn-danger mr-2" 
                                    onClick={() => handleDelete(selectedPatient.id)}
                                >
                                    Delete
                                </button>
                                <button 
                                    className="btn btn-info mr-2" 
                                    onClick={() => handleViewReport(selectedPatient)}
                                >
                                    View Report
                                </button>
                                <button 
                                    className="btn btn-secondary" 
                                    onClick={() => handleUploadReport(selectedPatient)}
                                >
                                    Upload Report
                                </button>
                            </div>
                        ) : (
                            <p>Select a patient to view details here.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Update Patient Modal */}
            <div className={`modal ${showUpdateModal ? 'show' : ''}`} style={{ display: showUpdateModal ? 'block' : 'none' }}>
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
                                        type="number" 
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
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={formData.gender} 
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    />
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
                                    <label>Contact No</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={formData.contact_no} 
                                        onChange={(e) => setFormData({ ...formData, contact_no: e.target.value })}
                                    />
                                </div>
                                {/* Add other fields here */}
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button 
                                type="button" 
                                className="btn btn-primary" 
                                onClick={handleSubmitUpdate}
                            >
                                Save changes
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upload Report Modal */}
            <div className={`modal ${showUploadModal ? 'show' : ''}`} style={{ display: showUploadModal ? 'block' : 'none' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Upload Report</h5>
                            <button type="button" className="close" onClick={() => setShowUploadModal(false)}>
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <input 
                                type="file" 
                                onChange={(e) => setReportFile(e.target.files[0])}
                            />
                        </div>
                        <div className="modal-footer">
                            <button 
                                type="button" 
                                className="btn btn-primary" 
                                onClick={handleReportUpload}
                                disabled={!reportFile}
                            >
                                Upload
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientList;
