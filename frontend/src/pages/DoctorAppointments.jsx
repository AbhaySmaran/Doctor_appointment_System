import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'

const DoctorAppointments = () => {
  const url = localStorage.getItem('url');
  const [myAppointments, setMyAppointments] = useState([]);
  const [appointments,setAppointments] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [day, setDay] = useState(new Date().getDate());
  const access = localStorage.getItem("access")
  const uuid = localStorage.getItem('uuid');

  const fetchAppointments = async () => {
    const res = await axios.get(`${url}/services/appointments/history/${year}/${month}/${day}/`);
    setAppointments(res.data);
  };

  useEffect(() => {
    fetchAppointments();
  }, [year, month, day]);

  const filteredAppointments = appointments.filter(
    (appointment) => String(appointment.doctor.doc_uid) === String(uuid)
  );
  
  console.log(filteredAppointments);
  // useEffect(() => {
  //   const fetchAppointments = async () => {
  //     const res = await axios.get(`${url}/services/doctor/appointments/`, {
  //       headers: {
  //         'Authorization': `Bearer ${access}`
  //       }
  //     })
  //     setMyAppointments(res.data)
  //   };
  //   fetchAppointments();
  // }, [])
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
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.patient.full_name}</td>
                <td>{appointment.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DoctorAppointments