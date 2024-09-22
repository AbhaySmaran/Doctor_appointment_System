import React, { useState, useEffect } from 'react';
import axios, { toFormData } from 'axios';
import { FaEdit } from 'react-icons/fa';
import { MdAirplanemodeInactive } from 'react-icons/md';
import { IoReturnUpBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const DoctorList = () => {
    const url = localStorage.getItem('url');
    const [dept,setDept] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [error, setError] = useState("");
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        full_name: '',
        department: '',
        dept_id: '',
        dept_name: '',
        specialization: '',
        email: '',
        fee: "",
        contact: "",
        status: "",
        degree: ""
    });
    const recordsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await axios.get(`${url}/api/departments/`);
                setDepartments(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchDepartments();
    }, [url]);

    const fetchDoctors = async () => {
        try {
            const res = await axios.get(`${url}/api/doctors/`);
            setDoctors(res.data);
            
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };
    // console.log(doctors);
    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleDoctorSelect = (doctor) => {
        setSelectedDoctor(doctor);
        setFormData({
            id: doctor.user.id,
            full_name: doctor.full_name,
            specialization: doctor.specialization,
            email: doctor.user.email,
            fee: doctor.fee,
            dept_name: doctor.department.dept_name,
            dept_id: doctor.department.id,
            contact: doctor.contact,
            status: doctor.status,
            degree: doctor.degree
        });
        // console.log("selected", formData);
    };

    const handleUpdate = (doctor) => {
        handleDoctorSelect(doctor);
        setError('');
        setShowUpdateModal(true);
    };


    const handleSubmitUpdate = async () => {
        try {
            const res = await axios.put(`${url}/api/update/user/${formData.id}/`, {
                "username": formData.username,
                "email": formData.email,
                "role": "doctor",
                "doctor": {
                    "full_name": formData.full_name,
                    "contact": formData.contact,
                    "department": formData.dept_id,
                    "specialization": formData.specialization,
                    "fee": formData.fee !== '' ? formData.fee : null,
                    "degree": formData.degree
                }
            });
            // console.log(res.data);
            if (window.confirm("Are you sure you want to save changes")) {
                setShowUpdateModal(false);
                
                // console.log(formData);
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    ...formData,
                    dept_name: formData.dept_name,  // Ensure dept_name is set
                    dept_id: formData.dept_id       // Ensure dept_id is set
                }));
                setSelectedDoctor((prevDoctor) => ({
                    ...prevDoctor,
                    ...formData
                }));
                fetchDoctors();
                // console.log(formData);
            }

        } catch (error) {
            setError(error.response.data);
            console.error('Error updating doctor:', error);
        }
    };

    const handleStatus = (doctor) => {
        handleDoctorSelect(doctor)
        setShowStatusModal(true);
    }

    const handleStatusSubmit = async () => {
        try {
            const res = await axios.put(`${url}/api/update/user/${formData.id}/`, {
                "username": formData.username,
                "email": formData.email,
                "role": "doctor",
                "doctor": {
                    "full_name": formData.full_name,
                    "contact": formData.contact,
                    "specialization": formData.specialization,
                    "fee": formData.fee,
                    "degree": formData.degree,
                    "status": formData.status
                }
            })
            if (window.confirm("Change Status")) {
                fetchDoctors();
                setShowStatusModal(false);
            }
        } catch (error) {
            setError(error.response.data);
        }
    }

    const filteredDoctors = doctors.filter((doctor) => {
        const doctorName = doctor.full_name?.toLowerCase() || "";
        const doctorEmail = doctor.user?.email?.toLowerCase() || "";
        const doctorDept = doctor.department?.dept_name?.toLowerCase() || "";

        return (
            doctorName.includes(searchTerm) ||
            doctorEmail.includes(searchTerm) ||
            doctorDept.includes(searchTerm)
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
                    <div className="col-md-9">
                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Search by name or department"
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
                                        <th>Email</th>
                                        <th>Department</th>
                                        <th>Status</th>
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
                                            <td>{doctor.full_name}</td>
                                            <td>{doctor.user.email}</td>
                                            <td>{doctor.department.dept_name}</td>
                                            <td>{doctor.status}</td>
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
                            <h4>Doctor Details</h4>
                            {selectedDoctor ? (
                                <div>
                                    <p><strong>Name:</strong> {selectedDoctor.full_name}</p>
                                    <p><strong>ID:</strong> {selectedDoctor.doc_uid}</p>
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
                                            onClick={() => handleStatus(selectedDoctor)}
                                            className="btn btn-primary btn-sm"
                                        >
                                            <MdAirplanemodeInactive /> Status
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
                                <form className='needs-validation'>
                                    <div className='row aligns-item-center'>
                                        <div className='form-group col-md-3'>
                                            <label>Name</label>
                                        </div>
                                        <div className='form-group col-md-9'>
                                            <input
                                                type="text"
                                                className={`form-control ${error.doctor?.full_name ? "is-invalid" : ""}`}
                                                value={formData.full_name}
                                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            />
                                            <div className='invalid-feedback'>
                                                {error.doctor ?.full_name == "This field may not be blank." ? <p>This field is required</p> : error.doctor ?.full_name}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row aligns-item-center'>
                                        <div className='form-group col-md-3'><label>Email</label></div>
                                        <div className='form-group col-md-9'>
                                            <input
                                                type="email"
                                                className={`form-control ${error.email ? "is-invalid" : ""}`}
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                            <div className='invalid-feedback'>
                                                {error.email == "This field may not be blank." ? <p>This field is required </p> : error.email }
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row aligns-item-center'>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="department" className="form-label">Department</label>
                                        </div>
                                        <div className="form-group  col-md-9">
                                            <select
                                                className={`form-control ${error.doctor?.department ? 'is-invalid' : ''}`}
                                                id="department"
                                                name="department"
                                                value={formData.dept_id}
                                                onChange={(e) => {
                                                    const selectedDepartment = departments.find(department => department.id === parseInt(e.target.value));
                                                    setFormData({
                                                        ...formData,
                                                        dept_id: selectedDepartment.id,   // Set dept_id
                                                        dept_name: selectedDepartment.dept_name // Set dept_name to match the selected department
                                                    });
                                                }}
                                            >
                                                <option value="">{formData.dept_name}</option>
                                                {departments.map(department => (
                                                    <option key={department.id} value={department.id}>
                                                        {department.dept_name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className='invalid-feedback'>
                                                {error.doctor?.department == "This field may not be null." ? <p>This field is required</p> : error.doctor?.department}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row aligns-item-center'>
                                        <div className='form-group col-md-3'><label>Specialization</label></div>
                                        <div className='form-group col-md-9'>
                                            <input
                                                type="text"
                                                className={`form-control ${error.doctor?.specialization ? 'is-invalid' : ''}`}
                                                value={formData.specialization}
                                                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                            />
                                            <div className='invalid-feedback'>{error.doctor?.specialization == "This field may not be blank." ? <p>This field is required</p> : error.doctor?.specialization}</div>
                                        </div>
                                    </div>
                                    <div className='row aligns-item-center'>
                                        <div className='form-group col-md-3'><label>Fee</label></div>
                                        <div className='form-group col-md-9'>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={formData.fee !== null ? formData.fee : ''}
                                                onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className='row aligns-item-center'>
                                        <div className='form-group col-md-3'><label>Degree</label></div>
                                        <div className='form-group col-md-9'>
                                            <input
                                                type="text"
                                                className={`form-control ${error.degree ? 'is-invalid' : ''}`}
                                                value={formData.degree}
                                                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className='row aligns-item-center'>
                                        <div className='form-group col-md-3'><label>Contact</label></div>
                                        <div className='form-group col-md-9'>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={formData.contact}
                                                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={handleSubmitUpdate}>Save changes</button>
                                <button type="button" className="btn btn-primary" onClick={() => setShowUpdateModal(false)}>Close</button>
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
                                    <p><strong>Specialization: </strong>{formData.specialization}</p>
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

export default DoctorList;
