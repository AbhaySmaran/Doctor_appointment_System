import React from 'react'
import axios from 'axios'
import { useEffect,useState } from 'react'

const Appointments = () => {
  const [myAppointments,setMyAppointments] = useState([])
  const access = localStorage.getItem("access")
  useEffect(()=>{
    const fetchAppointments=async()=>{
      const res =await axios.get("http://127.0.0.1:8000/services/doctor/appointments/",{
        headers: {
          'Authorization' : `Bearer ${access}`
        }
      })
      setMyAppointments(res.data)
    };
    fetchAppointments();
  },[])
  return (
    <div className='container-fluid'>
        <div className='table-responsive'>
          <table className='table'>
            <thead className='thead-dark'>
              <tr>
                <th>Patient Name</th>
                <th>Appointment Date</th>
              </tr>
            </thead>
            <tbody>
              {myAppointments.map((appointments)=>(
                <tr key={appointments.id}>
                  <td>{appointments.patient.full_name}</td>
                  <td>{appointments.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  )
}

export default Appointments