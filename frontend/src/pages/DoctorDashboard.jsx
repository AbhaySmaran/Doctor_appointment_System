import React from 'react'
import Sidebar from '../components/Sidebar'
import { useState, useEffect } from 'react'
import axios from 'axios';
import { SlCalender } from "react-icons/sl"
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const url = localStorage.getItem('url');
  const access = localStorage.getItem('access')
  const [doctor, setDoctor] = useState([]);

  const navigate = useNavigate();
  const handleNavigation = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`${url}/api/doctor/profile/`, {
        headers: {
          "Authorization": `Bearer ${access}`
        }
      })
      setDoctor(res.data)
      if (res.data) {
        localStorage.setItem('doc_uid', res.data.doc_uid)
        localStorage.setItem('name', res.data.full_name)
      }
    };
    fetchUser();
  }, []);

  const doc_name = localStorage.getItem('name')
  return (
    <div className='container'>
      {/* <div className='container mt-5'>
        <div className='row' style ></div> 
      </div> */}
      <h5>Welcome back Doctor</h5>
      <div className='row mt-5' style={{ cursor: "pointer" }}>
        <div className="col-md-4 mb-4" onClick={() => navigate('/dashboard/doctor/appointment')}>
          <div className="card text-center">
            <div className="card-body">
              <SlCalender size={50} />
              <h5 className="card-title mt-3">My Appointments</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard