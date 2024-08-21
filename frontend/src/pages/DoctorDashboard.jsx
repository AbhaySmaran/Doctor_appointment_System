import React from 'react'
import Sidebar from '../components/Sidebar'
import { useState,useEffect } from 'react'
import axios from 'axios'

const DoctorDashboard = () => {
  const [doctor,setDoctor] = useState([]);
  useEffect(()=>{
    const fetchUser = async()=>{
      const res = await axios.get('http://127.0.0.1:8000/api/receptionist/profile/')
      setDoctor(res.data)
    }
    if(res.data){
      localStorage.setItem('doc_uid',res.data.doc_uid)
      localStorage.setItem('name',res.data.full_name)
    }
    fetchUser();
  },[])
  const doc_name = localStorage.getItem('name')
  return (
    <div>
      <h3>Wlcome back Dr. {doc_name}</h3>
    </div>
  )
}

export default DoctorDashboard