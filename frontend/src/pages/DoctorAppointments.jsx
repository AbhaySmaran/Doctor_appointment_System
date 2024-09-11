import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DoctorAppointments = () => {
  const url = localStorage.getItem('url');
  const [myAppointments, setMyAppointments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [day, setDay] = useState(new Date().getDate());
  const [selectedPatient, setSelectedPatient] = useState(null);
  const access = localStorage.getItem("access")
  const uuid = localStorage.getItem('doc_uid');
  const [formData, setFormData] = useState({
    patient_uuid: "",
    patient_address: "",
    patient_name: ''
  })

  const navigate = useNavigate();

  const handlePatientSelect = (appointment) => {
    setSelectedPatient(appointment);
    setFormData({
      patient_uuid: appointment.patient.uuid,
      patient_address: appointment.patient.address,
      patient_name: appointment.patient.full_name
    })
  }

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${url}/services/appointments/history/${year}/${month}/${day}/`);
      setAppointments(res.data);
      console.log(res.data);
    } catch (error) {
      console.error(error)
    }
  };

  const handleStatus = (patient) => {
    handlePatientSelect(patient);
    setShowStatusModal(true);
  }

  const handleStatusChange = async () => {
    try {
      if (window.confirm("Are you sure you want to change status?")) {
        await axios.put(`${url}/api/patients/${formData.id}/`, formData);
        await fetchPatients();
        setShowStatusModal(false);
      }
    } catch (error) {
      console.error('Error updating patient Status:', error);
      setUploadError(error.response.data)
    }
  };

  const handleViewHistory = (patient) => {
    navigate(`/dashboard/patient/history/${formData.patient_uuid}`)
  }

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
        <div className='col-md-9'>
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
                  <th>Select</th>
                  <th>Patient Name</th>
                  <th>Appointment Date</th>
                </tr>
              </thead>
              <tbody>
                {
                  filteredAppointments.length > 0 ?
                    (
                      filteredAppointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td>
                            <input
                              type="radio"
                              name="patient-select"
                              value={appointment.patient.id}
                              onChange={() => { handlePatientSelect(appointment) }}
                            />
                          </td>
                          <td>{appointment.patient.full_name}</td>
                          <td>{appointment.date}</td>
                        </tr>
                      ))
                    )
                    :
                    (
                      <tr>
                        <td colSpan="3" className='text-center'><p>No appointments found</p></td>
                      </tr>
                    )
                }
              </tbody>
            </table>
          </div>
        </div>
        <div className='col-md-3'>
          <div className='side-panel'>
            <h5>Patient Detail</h5>
            {
              selectedPatient
                ?
                <div>
                  <p><strong>Patient Name: </strong>{formData.patient_name}</p>
                  <p><strong>Patient Address: </strong>{formData.patient_address}</p>

                  <div className='btn-grp'>
                    <button className='btn btn-primary' onClick={() => handleViewHistory(selectedPatient)}>
                      Patient Histoy
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleStatus(selectedPatient)}
                    >
                      Status
                    </button>
                  </div>
                </div>
                :
                <p>Select Apointment to see Patient Details</p>

            }
          </div>
        </div>
      </div>
      {showStatusModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Status</h5>
                <button type="button" className="close" onClick={() => setShowStatusModal(false)}>
                  &times;
                </button>
              </div>
              <div className='modal-body'>
                <p><strong>UHID:</strong> {formData.uuid}</p>
                <p><strong>Name:</strong> {formData.full_name}</p>
                <p><strong>Age:</strong> {formData.age}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Status:</strong>{formData.status}</p>
                {/* <p><strong>Change Status:-</strong></p> */}
                <div>
                  <div>
                    <input
                      type="radio"
                      id="statusActive"
                      name="status"
                      value="Active"
                      checked={formData.status === 'Active'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    />
                    <label htmlFor="statusActive">Active</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="statusInactive"
                      name="status"
                      value="Inactive"
                      checked={formData.status === 'Inactive'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    />
                    <label htmlFor="statusInactive">Inactive</label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={() => handleStatusChange()}>
                  Chnage Staus
                </button>
                <button type="button" className="btn btn-primary" onClick={() => setShowStatusModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorAppointments