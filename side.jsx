import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaStethoscope, FaUserMd, FaUserNurse, FaUserInjured, FaCalendarAlt, FaFileAlt, FaHospital,FaProcedures,FaConciergeBell } from 'react-icons/fa';
import { MdDashboard } from "react-icons/md";

const Sidebar = () => {
    return (
        <nav id="sidebar" className="col-md-2 d-md-block bg-light sidebar">
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
                        <NavLink className="nav-link" to="/dashboard/patients">
                            <FaProcedures className="sidebar-icon" /> 
                            <span className="sidebar-text">Patient List</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/dashboard/doctors">
                            <FaStethoscope className="sidebar-icon" /> 
                            <span className="sidebar-text">Doctor List</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/dashboard/receptionists">
                            <FaConciergeBell className="sidebar-icon" /> 
                            <span className="sidebar-text">Receptionist List</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/dashboard/appointment">
                            <FaCalendarAlt className="sidebar-icon" />
                            <span className="sidebar-text">Book Appointment</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/dashboard/reports">
                            <FaFileAlt className="sidebar-icon" />
                            <span className="sidebar-text">Reports</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/dashboard/opd">
                            <FaHospital className="sidebar-icon" />
                            <span className="sidebar-text">OPD</span>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Sidebar;
