import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoReturnUpBackSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { TbTestPipe } from 'react-icons/tb';

const Departments = () => {
    const url = localStorage.getItem('url');
    const [departments, setDepartments] = useState([]);
    const [deptName, setDeptName] = useState('');
    const [deptCode, setDeptCode] = useState('');
    const [deptLocation, setDeptLocation] = useState('');
    const [deptContact, setDeptContact] = useState('');
    const [showAddDeptModal, setShowAddDeptModal] = useState(false);
    const [error, setError] = useState('');

    const fetchDepartments = async () => {
        try {
            const res = await axios.get(`${url}/services/department/`);
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
        try {
            const res = await axios.post(`${url}/services/department/`, {
                dept_name: deptName,
                dept_code: deptCode,
                dept_location: deptLocation,
            });
            setShowAddDeptModal(false);
            fetchDepartments();
            setDeptName('');
            setDeptCode('');
            setDeptLocation('');
        } catch (err) {
            setError(err.response.data);
        }
    };

    const navigate = useNavigate();

    return (
        <div>
            <div>
                <div className='container-fluid position-relative'>
                    <div className='position-absolute top-0 end-0'>
                        <button
                            className='btn btn-primary'
                            id='btn-back'
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
                            id='btn-back'
                            type='button'
                            onClick={() => setShowAddDeptModal(true)}
                        >
                            <TbTestPipe /> Department Configuration
                        </button>
                    </div>
                </div>
            </div>
            <br />
            <br />
            <div className='container-fluid p-4'>
                <div className='table-responsive'>
                    <table className='table table-striped table-light'>
                        <thead className='thead' id='thead'>
                            <tr>
                                <th>Department Name</th>
                                <th>Department Code</th>
                                <th>Department Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.length > 0 ? (
                                departments.map((department) => (
                                    <tr key={department.id}>
                                        <td>{department.dept_name}</td>
                                        <td>{department.dept_code}</td>
                                        <td>{department.dept_location}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan='3' className='text-center'>
                                        No Departments Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
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
                                            value={deptName}
                                            onChange={(e) => setDeptName(e.target.value)}
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
                                            value={deptCode}
                                            onChange={(e) => setDeptCode(e.target.value)}
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
                                            value={deptLocation}
                                            onChange={(e) => setDeptLocation(e.target.value)}
                                        />
                                        <div className='invalid-feedback'>
                                            {error.dept_location && <p>{error.dept_location}</p>}
                                        </div>
                                    </div>
                                    <div className='modal-footer'>
                                        <button
                                            className='btn btn-primary'
                                            id='btn-back'
                                            onClick={handleAddDepartment}
                                        >
                                            Add Department
                                        </button>
                                        <button
                                            className='btn btn-secondary'
                                            id='btn-back'
                                            onClick={() => setShowAddDeptModal(false)}
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
