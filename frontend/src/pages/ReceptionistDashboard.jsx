import React from 'react'
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { useState,useEffect } from 'react';

const ReceptionistDashboard = () => {
  const [receptionist,setReceptionist] = useState([]);
  const access= localStorage.getItem('access')
  useEffect(()=>{
    const fetchUser=async()=>{
      const res = await axios.get('http://127.0.0.1:8000/api/receptionist/profile/',{
        headers: {
          "Authorization": `Bearer ${access}`
        }
      })
      setReceptionist(res.data)
      if(res.data){
        localStorage.setItem('uuid',res.data.uuid)
        localStorage.setItem('name',res.data.full_name)
      }
    };
    fetchUser();
  },[])  
  const name = localStorage.getItem('name')
  return (
    <div>
      <h3>Welcome {name}</h3>
    </div>
  )
}

export default ReceptionistDashboard