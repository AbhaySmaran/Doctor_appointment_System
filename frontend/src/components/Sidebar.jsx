import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    FaStethoscope, FaUserMd, FaUserNurse, FaUserInjured, FaCalendarAlt,
    FaFileAlt, FaHospital, FaProcedures, FaConciergeBell, FaPills, FaClipboard
} from 'react-icons/fa';
import { MdDashboard, MdHistory, MdUploadFile, MdListAlt, MdMedicalServices } from "react-icons/md";
import { GiTestTubes } from "react-icons/gi";
import { BiSupport } from "react-icons/bi";
import { useState } from 'react';

const Sidebar = () => {
    const role = localStorage.getItem('role')
    const [showSupportModal, setShowSupportModal] = useState(false)
    return (
        <nav id="sidebar" className="col-md-2 d-md-block bg-light sidebar">
            {role === 'receptionist' || role === 'super_admin' ?
                <div className="sidebar-sticky">
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/dashboard/receptionist">
                                <MdDashboard className='sidebar-icon' />
                                <span className="sidebar-text">Dashboard</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/dashboard/patient/registration">
                                <FaUserInjured className="sidebar-icon" />
                                <span className="sidebar-text">Add Patients</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/dashboard/doctor/register">
                                <FaUserMd className="sidebar-icon" />
                                <span className="sidebar-text">Add Doctors</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/dashboard/receptionist/register">
                                <FaUserNurse className="sidebar-icon" />
                                <span className="sidebar-text">Add Receptionists</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/dashboard/patient/list">
                                <FaProcedures className="sidebar-icon" />
                                <span className="sidebar-text">Patient List</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/dashboard/doctor/list">
                                <MdListAlt className="sidebar-icon" />
                                <span className="sidebar-text">Doctor List</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/dashboard/receptionist/list">
                                <FaConciergeBell className="sidebar-icon" />
                                <span className="sidebar-text">Receptionist List</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/dashboard/appointment/book">
                                <FaCalendarAlt className="sidebar-icon" />
                                <span className="sidebar-text">Book Appointment</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/dashboard/appointment/history">
                                <MdHistory className="sidebar-icon" />
                                <span className="sidebar-text">Appointments</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/dashboard/configuration">
                                <GiTestTubes className="sidebar-icon" />
                                <span className="sidebar-text">Configurations</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link support-button" onClick={() => setShowSupportModal(true)}>
                                <BiSupport className="sidebar-icon" />
                                <span className="sidebar-text">Support</span>
                            </button>
                        </li>
                        {/* <li className="nav-item">
                            <NavLink className="nav-link" to="/dashboard/report/list">
                                <FaFileAlt className="sidebar-icon" />
                                <span className="sidebar-text">Reports List</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/dashboard/opd">
                                <MdMedicalServices className="sidebar-icon" />
                                <span className="sidebar-text">OPD</span>
                            </NavLink>
                        </li> */}
                    </ul>
                </div>
                :
                <div className="sidebar-sticky">
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/dashboard/doctor/appointment">
                                <FaCalendarAlt className="sidebar-icon" />
                                <span className="sidebar-text">Appointments</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/dashboard/doctor/reports">
                                <FaClipboard className="sidebar-icon" />
                                <span className="sidebar-text">Reports</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/dashboard/doctor/prescription">
                                <FaPills className="sidebar-icon" />
                                <span className="sidebar-text">Prescriptions</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            }

            {showSupportModal && (
                <div className='modal show' style={{ display: 'block' }}>
                    <div className='modal-dialog'>
                        <div className='modal-content'>
                            <div className="modal-header">
                                <h5 className="modal-title">Support</h5>
                                <button type="button" className="close" onClick={() => setShowSupportModal(false)}>
                                    &times;
                                </button>
                            </div>
                            <div className='modal-body'>
                                <form className='form-group'>
                                    <div className="row aligns-item-center">
                                        <div className='col-md-2'><label>Customer Name</label></div>
                                        <div className='col-md-10'>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={customerName}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="row aligns-item-center">
                                        <div className='col-md-2'><label>Customer Id</label></div>
                                        <div className='col-md-10'>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={customerId}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className='form-group'>
                                            <label>Issue Caption</label>
                                            <select
                                                className='form-control'
                                                value={issueCaption}
                                                onChange={(e) => setDoctor(e.target.value)}
                                            >
                                                <option value=''>Select Issue Caption</option>
                                                <option value='Screen Issue'>Screen Issue</option>
                                                <option value='Technical Issue'>Technical Issue</option>
                                                <option value='Any Other'>Any Other</option>
                                            </select>
                                        </div>
                                    <div className="row aligns-item-center">
                                        <div className='col-md-2'><label>Issue Description</label></div>
                                        <div className='col-md-10'>
                                            <textarea
                                                type="text"
                                                className="form-control"
                                                value={issueDescription}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="row aligns-item-center">
                                        <div className='col-md-2'><label>Email</label></div>
                                        <div className='col-md-10'>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="row aligns-item-center">
                                        <div className='col-md-2'><label>Email</label></div>
                                        <div className='col-md-10'>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="row aligns-item-center">
                                        <div className='col-md-2'><label>Email</label></div>
                                        <div className='col-md-10'>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="row aligns-item-center">
                                        <div className='col-md-2'><label>Email</label></div>
                                        <div className='col-md-10'>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="row aligns-item-center">
                                        <div className='col-md-2'><label>Email</label></div>
                                        <div className='col-md-10'>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="row aligns-item-center">
                                        <div className='col-md-2'><label>Email</label></div>
                                        <div className='col-md-10'>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Sidebar;
