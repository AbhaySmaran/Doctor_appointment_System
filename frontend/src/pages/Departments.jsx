import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoReturnUpBackSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { TbTestPipe } from 'react-icons/tb';
import { FaEdit } from "react-icons/fa"

const Departments = () => {
    const url = localStorage.getItem('url');
    const [departments, setDepartments] = useState([]);
    const [showAddDeptModal, setShowAddDeptModal] = useState(false);
    const [selectedDept, setSelectedDept] = useState(null);
    const [error, setError] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [formData, setFormData] = useState({
        dept_name: '',
        dept_code: '',
        dept_location: '',
        dept_contact_no: ''
    });

    const fetchDepartments = async () => {
        try {
            const res = await axios.get(`${url}/api/departments/`);
            setDepartments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleAddDepartment = async (e) => {
        e.preventDefault();
        const deptData = new FormData();
        deptData.append("dept_name", formData.dept_name);
        deptData.append("dept_code", formData.dept_code);
        deptData.append('dept_location', formData.dept_location);
        deptData.append("dept_contact_no", formData.dept_contact_no);
        try {
            await axios.post(`${url}/api/departments/`, deptData);
            setShowAddDeptModal(false);
            fetchDepartments();
            setFormData({
                dept_name: '',
                dept_code: '',
                dept_location: '',
                dept_contact_no: ''
            });
        } catch (err) {
            setError(err.response.data);
        }
    };

    const handleEditDepartment = async (e) => {
        e.preventDefault();
        try {
            if(window.confirm("Save Changes?")){
                await axios.put(`${url}/api/departments/${formData.id}/`, formData);
                setShowEditModal(false);
                await fetchDepartments();
            }
        } catch (err) {
            setError(err.response.data);
        }
    };

    const handleDeptSelect = (dept) => {
        setSelectedDept(dept);
        setFormData({
            id: dept.id,
            dept_name: dept.dept_name,
            dept_code: dept.dept_code,
            dept_location: dept.dept_location,
            dept_contact_no: dept.dept_contact_no
        });
    };

    const handleEdit = (dept) => {
        handleDeptSelect(dept);
        setShowEditModal(true);
    };

    const navigate = useNavigate();

    return (
        <div>
            <div className='container-fluid position-relative'>
                <div className='position-absolute top-0 end-0'>
                    <button
                        className='btn btn-primary'
                        type='button'
                        onClick={() => navigate('/dashboard/receptionist')}
                    >
                        <IoReturnUpBackSharp /> Back
                    </button>
                </div>
            </div>
            <div className='container-fluid position-relative'>
                <div className='position-absolute top-0'>
                    <button
                        className='btn btn-primary'
                        type='button'
                        onClick={() => setShowAddDeptModal(true)}
                    >
                        <TbTestPipe /> Add Department
                    </button>
                </div>
            </div>
            <br />
            <br />
            <div className='container-fluid p-4'>
                <div className='table-responsive'>
                    <table className='table table-striped table-light'>
                        <thead className='thead'>
                            <tr>
                                <th>Department Name</th>
                                <th>Department Code</th>
                                <th>Department Location</th>
                                <th>Department ContactNo.</th>
                                <th className='text-center'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.length > 0 ? (
                                departments.map((department) => (
                                    <tr key={department.id}>
                                        <td>{department.dept_name}</td>
                                        <td>{department.dept_code}</td>
                                        <td>{department.dept_location}</td>
                                        <td>{department.dept_contact_no}</td>
                                        <td className='text-center'>
                                            <button
                                                className='btn btn-primary'
                                                onClick={() => handleEdit(department)}
                                            >
                                                <FaEdit />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan='5' className='text-center'>
                                        No Departments Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Department Modal */}
            {showAddDeptModal && (
                <div className='modal show' style={{ display: 'block' }}>
                    <div className='modal-dialog'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className='modal-title'>Add Department</h5>
                                <button
                                    type='button'
                                    className='close'
                                    onClick={() => setShowAddDeptModal(false)}
                                >
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className='modal-body'>
                                <form className='needs-validation'>
                                    <div className='form-group'>
                                        <label>Department Name</label>
                                        <input
                                            type='text'
                                            className={`form-control ${error.dept_name ? 'is-invalid' : ''}`}
                                            value={formData.dept_name}
                                            onChange={(e) => setFormData({...formData, dept_name: (e.target.value)})}
                                        />
                                        <div className='invalid-feedback'>
                                            {error.dept_name && <p>{error.dept_name}</p>}
                                        </div>
                                    </div>
                                    <div className='form-group'>
                                        <label>Department Code</label>
                                        <input
                                            type='text'
                                            className={`form-control ${error.dept_code ? 'is-invalid' : ''}`}
                                            value={formData.dept_code}
                                            onChange={(e) => setFormData({...formData, dept_code:(e.target.value)})}
                                        />
                                        <div className='invalid-feedback'>
                                            {error.dept_code && <p>{error.dept_code}</p>}
                                        </div>
                                    </div>
                                    <div className='form-group'>
                                        <label>Department Location</label>
                                        <input
                                            type='text'
                                            className={`form-control ${error.dept_location ? 'is-invalid' : ''}`}
                                            value={formData.dept_location}
                                            onChange={(e) => setFormData({...formData,dept_location:(e.target.value)})}
                                        />
                                        <div className='invalid-feedback'>
                                            {error.dept_location && <p>{error.dept_location}</p>}
                                        </div>
                                    </div>
                                    <div className='form-group'>
                                        <label>Department ContactNo.</label>
                                        <input
                                            type='text'
                                            className={`form-control ${error.dept_contact_no ? 'is-invalid' : ''}`}
                                            value={formData.dept_contact_no}
                                            onChange={(e) => setFormData({...formData,dept_contact_no:(e.target.value)})}
                                        />
                                        <div className='invalid-feedback'>
                                            {error.dept_contact_no && <p>{error.dept_contact_no}</p>}
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className='modal-footer'>
                                <button className='btn btn-primary' type='submit' onClick={handleAddDepartment}>
                                    Add
                                </button>
                                <button
                                    className='btn btn-primary'
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Department Modal */}
            {showEditModal && (
                <div className='modal show' style={{ display: 'block' }}>
                    <div className='modal-dialog'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className='modal-title'>Edit Department</h5>
                                <button
                                    type='button'
                                    className='close'
                                    onClick={() => setShowEditModal(false)}
                                >
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className='modal-body'>
                                <form onSubmit={handleEditDepartment} className='needs-validation'>
                                    <div className='form-group'>
                                        <label>Department Name</label>
                                        <input
                                            type='text'
                                            className={`form-control ${error.dept_name ? "is-invalid" : ""}`}
                                            value={formData.dept_name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, dept_name: e.target.value })
                                            }
                                        />
                                        <div className='invalid-feedback'>
                                            {error.dept_name && <p>{error.dept_name}</p>}
                                        </div>
                                    </div>
                                    <div className='form-group'>
                                        <label>Department Code</label>
                                        <input
                                            type='text'
                                            className={`form-control ${error.dept_code ? 'is-invalid' : ''}`}
                                            value={formData.dept_code}
                                            onChange={(e) =>
                                                setFormData({ ...formData, dept_code: e.target.value })
                                            }
                                        />
                                        <div className='invalid-feedback'>
                                            {error.dept_code && <p>{error.dept_code}</p>}
                                        </div>
                                    </div>
                                    <div className='form-group'>
                                        <label>Department Location</label>
                                        <input
                                            type='text'
                                            className='form-control'
                                            value={formData.dept_location}
                                            onChange={(e) =>
                                                setFormData({ ...formData, dept_location: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className='form-group'>
                                        <label>Department ContactNo.</label>
                                        <input
                                            type='text'
                                            className='form-control'
                                            value={formData.dept_contact_no}
                                            onChange={(e) =>
                                                setFormData({ ...formData, dept_contact_no: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className='modal-footer'>
                                        <button className='btn btn-primary' type='submit'>
                                            Save Changes
                                        </button>
                                        <button
                                            className='btn btn-primary'
                                            onClick={() => setShowEditModal(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Departments;
