import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PatientList = () => {
    const user = localStorage.getItem('uuid');
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        uuid: '',
        full_name: '',
        age: '',
        email: '',
        gender: '',
        address: '',
        contact_no: '',
    });
    const [reportFile, setReportFile] = useState(null);
    const [test,setTest] = useState('');
    const [allTests,setAllTests] = useState([]);
    const recordsPerPage = 4;

    const fetchTests = async()=>{
        const res = await axios.get('http://127.0.0.1:8000/services/test/')
        setAllTests(res.data);
    }

    useEffect(()=>{
        fetchTests();
    },[])

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
        });
    };

    const handleUpdate = (patient) => {
        handlePatientSelect(patient);
        setShowUpdateModal(true);
    };

    const handleDelete = async (patientId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/patients/${patientId}/`);
            // Remove the deleted patient from the state
            setPatients(patients.filter(patient => patient.id !== patientId));
            setSelectedPatient(null);
        } catch (error) {
            console.error('Error deleting patient:', error);
        }
    };

    const navigate= useNavigate();

    const handleViewReport = (patient) => {
        const reportUrl = `http://127.0.0.1:8000/services/reports/${formData.uuid}/`;
        navigate(`/dashboard/patient/reports/${formData.uuid}`)
        // window.open(reportUrl, '_blank');
    };

    const handleUploadReport = (patient) => {
        handlePatientSelect(patient);
        setShowUploadModal(true);
    };

    const handleSubmitUpdate = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/patients/${formData.id}/`, formData);
            // Refetch the updated list of patients
            await fetchPatients();
            setShowUpdateModal(false);
        } catch (error) {
            console.error('Error updating patient:', error);
        }
    };

    const handleReportUpload = async () => {
        const reportData = new FormData();
        reportData.append('patient', formData.uuid);
        reportData.append('test', test);
        reportData.append('report_file', reportFile);
        reportData.append('uploaded_by',user)

        try {
            await axios.post(`http://127.0.0.1:8000/services/upload/report/`, reportData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setShowUploadModal(false);
            setTest('');
        } catch (error) {
            console.error('Error uploading report:', error);
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
                            setCurrentPage(1);  // Reset to the first page when search term changes
                        }}
                    />
                    <div className="table-responsive">
                        <table className='table table-striped table-light'>
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
                                <div className='btn-grp'>
                                    <button 
                                        className="btn btn-primary btn-sm" 
                                        onClick={() => handleUpdate(selectedPatient)}
                                    >
                                        Update
                                    </button>
                                    <button 
                                        className="btn btn-primary btn-sm" 
                                        onClick={() => handleDelete(selectedPatient.id)}
                                    >
                                        Delete
                                    </button>
                                    <button 
                                        className="btn btn-primary btn-sm" 
                                        onClick={() => handleViewReport(selectedPatient)}
                                    >
                                        View Report
                                    </button>
                                    <button 
                                        className="btn btn-primary btn-sm" 
                                        onClick={() => handleUploadReport(selectedPatient)}
                                    >
                                        Upload Report
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
                                        <label>Contact No</label>
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
                                <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={handleSubmitUpdate}>Save changes</button>
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
                                        <laabel>Test</laabel>
                                        <select
                                            type='text'
                                            className='form-control'
                                            name='test'
                                            value={test}
                                            onChange={(e)=>setTest(e.target.value)}
                                        >
                                            <option value="">Select Test</option>
                                            {allTests.map((test)=>(
                                                <option key={test.id} value={test.id}>{test.test_name}</option>
                                            ))}
                                        </select>
                                        <label>Choose Report File</label>
                                        <input 
                                            type="file" 
                                            className="form-control" 
                                            onChange={(e) => setReportFile(e.target.files[0])}
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={handleReportUpload}>Upload</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientList;
