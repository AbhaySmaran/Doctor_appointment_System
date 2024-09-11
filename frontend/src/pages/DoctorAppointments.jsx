import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'

const DoctorAppointments = () => {
  const url = localStorage.getItem('url');
  const [myAppointments, setMyAppointments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [day, setDay] = useState(new Date().getDate());
  const access = localStorage.getItem("access")
  const uuid = localStorage.getItem('doc_uid');

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${url}/services/appointments/history/${year}/${month}/${day}/`);
      setAppointments(res.data);
      console.log(res.data);
    } catch (error) {
      console.error(error)
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [year, month, day]);


  const filteredAppointments = appointments.filter(
    (appointment) => appointment.doctor.doc_uid === uuid
  );

  console.log(filteredAppointments);
  const generateYears = () => {
    const years = [];
    for (let i = new Date().getFullYear(); i >= 2000; i--) {
      years.push(i);
    }
    return years;
  };

  const generateMonths = () => {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  };

  const generateDays = () => {
    return Array.from({ length: 31 }, (_, i) => i + 1);
  };
  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-3'>
          <h4>Appointments</h4>
        </div>
        <div className='col-md-9'>
          <div className='d-flex mb-3'>
            <select
              className='form-select me-2'
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              {generateYears().map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              className='form-select me-2'
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              {generateMonths().map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select
              className='form-select'
              value={day}
              onChange={(e) => setDay(e.target.value)}
            >
              {generateDays().map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className='table-responsive'>
        <table className='table table-striped table-light'>
          <thead className='thead'>
            <tr>
              <th>Patient Name</th>
              <th>Appointment Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
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