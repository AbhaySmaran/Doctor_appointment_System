import React from 'react';
import { NavLink,useNavigate } from 'react-router-dom';
import {
    FaStethoscope, FaUserMd, FaUserNurse, FaUserInjured, FaCalendarAlt,
    FaFileAlt, FaHospital, FaProcedures, FaConciergeBell, FaPills, FaClipboard
} from 'react-icons/fa';
import { FcDepartment } from "react-icons/fc"
import { CgProfile } from "react-icons/cg";
import { MdDashboard, MdHistory, MdUploadFile, MdListAlt, MdMedicalServices } from "react-icons/md";
import { GiTestTubes } from "react-icons/gi";
import { BiSupport } from "react-icons/bi";
import { useState } from 'react';
import axios from 'axios';

const Sidebar = () => {
    const navigate=useNavigate();
    const role = localStorage.getItem('role')
    const username = localStorage.getItem('name')
    const [showProfileModal, setShowProfileModal] = useState(false);
    return (
        <div>
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
                                <NavLink className="nav-link" to="/dashboard/department">
                                    <FcDepartment className="sidebar-icon" />
                                    <span className="sidebar-text">Departments</span>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/dashboard/support">
                                    <BiSupport className="sidebar-icon" />
                                    <span className="sidebar-text">Support</span>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link" onClick={() => setShowProfileModal(true)}>
                                    <CgProfile className='sidebar-icon' />
                                    <span className="sidebar-text">Profile</span>
                                </button>
                            </li>
                            {/* <li className="nav-item">
                            <button className="nav-link support-button" onClick={() => setShowSupportModal(true)}>
                                <BiSupport className="sidebar-icon" />
                                <span className="sidebar-text">Support</span>
                            </button>
                        </li> */}
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
                                <NavLink className="nav-link" to="/dashboard/doctor">
                                    <MdDashboard className='sidebar-icon' />
                                    <span className="sidebar-text">Dashboard</span>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/dashboard/doctor/appointment">
                                    <FaCalendarAlt className="sidebar-icon" />
                                    <span className="sidebar-text">Appointments</span>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link" onClick={() => setShowProfileModal(true)}>
                                    <CgProfile className='sidebar-icon' />
                                    <span className="sidebar-text">Profile</span>
                                </button>
                            </li>
                            {/* <li className="nav-item">
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
                            </li> */}
                        </ul>
                    </div>
                }
            </nav>
            {showProfileModal && (
                <div className="modal show" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Profile</h5>
                                <button type="button" className="close" onClick={() => setShowProfileModal(false)}>
                                    &times;
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Hey! {username}</p>
                                
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-primary" onClick={() => {navigate('/dashboard/change-password'); setShowProfileModal(false);}}>
                                    Change Password
                                </button>
                                <button type="button" className="btn btn-primary" onClick={() => setShowProfileModal(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
