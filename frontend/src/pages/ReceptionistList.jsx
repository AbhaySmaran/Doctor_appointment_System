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
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [formData, setFormData] = useState({
        id: '',
        full_name: '',
        username: '',
        email: '',
        contact_no: '',
        status: ''
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
            id: receptionist.user.id,
            full_name: receptionist.full_name,
            username: receptionist.user.username,
            email: receptionist.user.email,
            contact_no: receptionist.contact_no,
        });
    };

    const handleUpdate = (receptionist) => {
        handleReceptionistSelect(receptionist);
        setShowUpdateModal(true);
    };

    const handleStatus = (receptionist) => {
        handleReceptionistSelect(receptionist)
        setShowStatusModal(true);
    }

    const handleStatusSubmit = async () => {
        try {
            if (window.confirm("Change Status")) {
                const res = await axios.put(`${url}/api/receptionist/${formData.id}/`, formData)
                fetchReceptionists();
                setShowStatusModal(false);
            
            }
        } catch (error) {
            setError(error.response.data);
        }
    }

    const handleSubmitUpdate = async () => {
        try {
            if(window.confirm("Sure want to save changes?")){
                await axios.put(`${url}/api/update/user/${formData.id}/`, {
                    "username": formData.username,
                    "email": formData.email,
                    "role": "receptionist",
                    "receptionist": {
                      "full_name": formData.full_name,
                      "contact_no": formData.contact_no
                    }
                  });
                await fetchReceptionists(); // Fetch updated list after update
                setShowUpdateModal(false);
                fetchReceptionists();
                setSelectedReceptionist((prevReceptionist) => ({
                    ...prevReceptionist,
                    ...formData
                }));
            }
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
                    <div className="col-md-9">
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
                            <table className='table table-striped table-light'>
                                <thead className="thead" id='thead'>
                                    <tr>
                                        <th>Select</th>
                                        <th>Name</th>
                                        <th>Contact</th>
                                        <th>Status</th>
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
                                            <td>{receptionist.full_name}</td>
                                            <td>{receptionist.contact_no}</td>
                                            <td>{receptionist.status}</td>
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
                            <h4>Receptionist Details</h4>
                            {selectedReceptionist ? (
                                <div>
                                    <p><strong>ID:</strong> {selectedReceptionist.uuid}</p>
                                    <p><strong>Email:</strong> {selectedReceptionist.user.email}</p>
                                    <p><strong>UserName:</strong> {selectedReceptionist.user.username}</p>
                                    <div className='btn-grp'>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleUpdate(selectedReceptionist)}
                                        >
                                            <FaEdit /> Update
                                        </button>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleStatus(selectedReceptionist)}
                                        >
                                            <MdAirplanemodeInactive /> Status
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
                                    <div className='row aligns-item-center'>
                                        <div className='form-group col-md-3'><label>Name</label></div>
                                        <div className='form-group col-md-9'>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.full_name}
                                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className='row aligns-item-center'>
                                        <div className='form-group col-md-3'><label>Email</label></div>
                                        <div className='form-group col-md-9'>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className='row aligns-item-center'>
                                        <div className='form-group col-md-3'><label>Contact</label></div>
                                        <div className='form-group col-md-9'>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.contact_no}
                                                onChange={(e) => setFormData({ ...formData, contact_no: e.target.value })}
                                            />
                                        </div>
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
                {showStatusModal && (
                    <div className='modal show' style={{ display: "block" }}>
                        <div className='modal-dialog'>
                            <div className='modal-content'>
                                <div className='modal-header'>
                                    <h5 className="modal-title">Change Status</h5>
                                    <button type="button" className="close" onClick={() => setShowStatusModal(false)}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className='modal-body'>
                                    <p><strong>Name: </strong>{formData.full_name}</p>
                                    <p><strong>Email: </strong>{formData.email}</p>
                                    <p><strong>Status: </strong>{formData.status}</p>
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
                                <div className='modal-footer'>
                                    <button className='btn btn-primary' onClick={handleStatusSubmit}>Change Status</button>
                                    <button className='btn btn-primary' onClick={() => setShowStatusModal(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReceptionistList;
