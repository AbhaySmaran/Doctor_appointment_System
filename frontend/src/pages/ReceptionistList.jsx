import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa'
import { MdAirplanemodeInactive } from 'react-icons/md'
import { IoReturnUpBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const ReceptionistList = () => {
    const url = localStorage.getItem('url');
    const [receptionists, setReceptionists] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedReceptionist, setSelectedReceptionist] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        full_name: '',
        email: '',
        contact_no: '',
    });
    const recordsPerPage = 2;
    const navigate = useNavigate();
    useEffect(() => {
        fetchReceptionists();
    }, []);

    const fetchReceptionists = async () => {
        try {
            const res = await axios.get(`${url}/api/receptionists/`);
            setReceptionists(res.data);
        } catch (error) {
            console.error('Error fetching receptionists:', error);
        }
    };

    const handleReceptionistSelect = (receptionist) => {
        setSelectedReceptionist(receptionist);
        setFormData({
            id: receptionist.id,
            full_name: receptionist.full_name,
            email: receptionist.user.email,
            contact_no: receptionist.contact_no,
        });
    };

    const handleUpdate = (receptionist) => {
        handleReceptionistSelect(receptionist);
        setShowUpdateModal(true);
    };

    const handleDelete = async (receptionistId) => {
        try {
            await axios.delete(`${url}/api/receptionists/${receptionistId}/`);
            setReceptionists(receptionists.filter(receptionist => receptionist.id !== receptionistId));
            setSelectedReceptionist(null); // Clear selection after deletion
        } catch (error) {
            console.error('Error deleting receptionist:', error);
        }
    };

    const handleSubmitUpdate = async () => {
        try {
            await axios.put(`${url}/api/receptionists/${formData.id}/`, formData);
            await fetchReceptionists(); // Fetch updated list after update
            setShowUpdateModal(false);
            fetchReceptionists();
        } catch (error) {
            console.error('Error updating receptionist:', error);
        }
    };

    const filteredReceptionists = receptionists.filter((receptionist) =>
        receptionist.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receptionist.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredReceptionists.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredReceptionists.length / recordsPerPage);

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
                            placeholder="Search by name or email"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset to the first page when a new search is performed
                            }}
                        />
                        <div className="table-responsive">
                            <table className='table'>
                                <thead className="thead" id='thead'>
                                    <tr>
                                        <th>Select</th>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Contact</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentRecords.map((receptionist) => (
                                        <tr key={receptionist.id}>
                                            <td>
                                                <input
                                                    type='radio'
                                                    name='receptionist-select'
                                                    value={receptionist.id}
                                                    onChange={() => handleReceptionistSelect(receptionist)}
                                                />
                                            </td>
                                            <td>{receptionist.uuid}</td>
                                            <td>{receptionist.full_name}</td>
                                            <td>{receptionist.user.email}</td>
                                            <td>{receptionist.contact_no}</td>
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
                            <h4>Receptionist Details</h4>
                            {selectedReceptionist ? (
                                <div>
                                    <p><strong>ID:</strong> {selectedReceptionist.uuid}</p>
                                    <p><strong>Name:</strong> {selectedReceptionist.full_name}</p>
                                    <p><strong>Email:</strong> {selectedReceptionist.user.email}</p>
                                    <p><strong>Contact:</strong> {selectedReceptionist.contact_no}</p>
                                    <div className='btn-grp'>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleUpdate(selectedReceptionist)}
                                        >
                                            <FaEdit /> Update
                                        </button>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleDelete(selectedReceptionist.id)}
                                        >
                                            <MdAirplanemodeInactive /> Inactive
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p>Select a receptionist to view details here.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Update Receptionist Modal */}
                <div className={`modal ${showUpdateModal ? 'show' : ''}`} style={{ display: showUpdateModal ? 'block' : 'none' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Update Receptionist</h5>
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
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Contact</label>
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

export default ReceptionistList;
