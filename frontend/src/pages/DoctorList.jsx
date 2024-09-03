import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import { MdAirplanemodeInactive } from 'react-icons/md';
import { IoReturnUpBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        full_name: '',
        specialization: '',
        email: '',
        fee: '',
        contact: '',
    });
    const recordsPerPage = 2;
    const navigate = useNavigate();
    const fetchDoctors = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/doctors/');
            setDoctors(res.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleDoctorSelect = (doctor) => {
        setSelectedDoctor(doctor);
        setFormData({
            id: doctor.id,
            full_name: doctor.full_name,
            specialization: doctor.specialization,
            email: doctor.user.email,
            fee: doctor.fee,
            contact: doctor.contact,
        });
    };

    const handleUpdate = (doctor) => {
        handleDoctorSelect(doctor);
        setShowUpdateModal(true);
    };

    const handleDelete = async (doctorId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/doctors/${doctorId}/`);
            setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
            setSelectedDoctor(null); // Clear selection after deletion
        } catch (error) {
            console.error('Error deleting doctor:', error);
        }
    };

    const handleSubmitUpdate = async () => {
        try {
            const res = await axios.put(`http://127.0.0.1:8000/api/doctors/${selectedDoctor.id}/`, formData);
            if(window.confirm("Are you sure you want to save changes")){
                fetchDoctors();
                setShowUpdateModal(false);
            }
            
        } catch (error) {
            console.error('Error updating doctor:', error);
        }
    };

    const filteredDoctors = doctors.filter((doctor) =>{
        const doctorName = doctor.full_name ?.toLowerCase() || "";
        const doctorEmail = doctor.user?.email?.toLowerCase() || "";
        const doctosSpecialiation = doctor.specialization?.toLowerCase() || "";
        
        return(
            doctorName.includes(searchTerm) ||
            doctorEmail.includes(searchTerm) ||
            doctosSpecialiation.includes(searchTerm)
        );
    });

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredDoctors.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredDoctors.length / recordsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
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
            <div className="container-fluid">
                <div className="row mt-4">
                    <div className="col-md-8">
                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Search by name, email, or specialization"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset to the first page when a new search is performed
                            }}
                        />
                        <div className="table-responsive">
                            <table className='table table-striped table-light'>
                                <thead className="thead" id='thead'>
                                    <tr>
                                        <th>Select</th>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Specialization</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentRecords.map((doctor) => (
                                        <tr key={doctor.id}>
                                            <td>
                                                <input
                                                    type='radio'
                                                    name='doctor-select'
                                                    value={doctor.id}
                                                    onChange={() => handleDoctorSelect(doctor)}
                                                />
                                            </td>
                                            <td>{doctor.doc_uid}</td>
                                            <td>{doctor.full_name}</td>
                                            <td>{doctor.user.email}</td>
                                            <td>{doctor.specialization}</td>
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
                            <h4>Doctor Details</h4>
                            {selectedDoctor ? (
                                <div>
                                    <p><strong>ID:</strong> {selectedDoctor.doc_uid}</p>
                                    <p><strong>Name:</strong> {selectedDoctor.full_name}</p>
                                    <p><strong>Email:</strong> {selectedDoctor.user.email}</p>
                                    <p><strong>Specialization:</strong> {selectedDoctor.specialization}</p>
                                    <p><strong>Consultation Fee:</strong> {selectedDoctor.fee}</p>
                                    <p><strong>Contact:</strong> {selectedDoctor.contact}</p>
                                    <div className='btn-grp'>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleUpdate(selectedDoctor)}
                                        >
                                            <FaEdit /> Update
                                        </button>
                                        <button
                                            className="btn btn-primary btn-sm"
                                        >
                                            <MdAirplanemodeInactive /> Inactive
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p>Select a doctor to view details here.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Update Doctor Modal */}
                <div className={`modal ${showUpdateModal ? 'show' : ''}`} style={{ display: showUpdateModal ? 'block' : 'none' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Update Doctor</h5>
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
                                        <label>Specialization</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.specialization}
                                            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Fee</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.fee}
                                            onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Contact</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.contact}
                                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={() => setShowUpdateModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleSubmitUpdate}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorList;
