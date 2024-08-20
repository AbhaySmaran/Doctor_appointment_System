import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Layouts from './pages/Layouts';
import Home from './pages/Home';
import Login from './pages/Login';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientReg from './pages/PatientReg';
import DoctorReg from './pages/DoctorReg';
import ReceptionistReg from './pages/ReceptionistReg';
import PatientList from './pages/PatientList';
import DoctorList from './pages/DoctorList';
import ReceptionistList from './pages/ReceptionistList';
import BookAppointment from './pages/BookAppointment';
import ReportUpload from './pages/ReportUpload';
import AppointmentHistory from './pages/AppointmentHistory';
import ReportList from './pages/ReportList';

function App() {
  const [count, setCount] = useState(0)
  const access_token = localStorage.getItem('access');
  const role = localStorage.getItem('role')

  const getRedirectPath = () => {
    if (access_token) {
      if (role === 'doc') {
        return '/dashboard/doctor';
      } else if (role === 'receptionist') {
        return '/dashboard/receptionist';
      }
    }
    return '/';
  };
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={!access_token ? <Login /> : <Navigate to={getRedirectPath()} /> } />
          <Route exact path ='dashboard/' element={<Layouts />}>
            <Route path='receptionist' element={<ReceptionistDashboard />} />
            <Route path='doctor' element={<DoctorDashboard />} />
            <Route path='patient/registration' element={<PatientReg />} />
            <Route path='patient/list' element={<PatientList />} />
            <Route path='doctor/register' element={<DoctorReg />} />
            <Route path='receptionist/register' element={<ReceptionistReg />} />
            <Route path='doctor/list' element={<DoctorList />} />
            <Route path='receptionist/list' element={<ReceptionistList />} />
            <Route path='appointment/book' element={<BookAppointment />} />
            <Route path='reports/upload' element={<ReportUpload />} />
            <Route path='appointment/history' element={<AppointmentHistory />} />
            <Route path='report/list' element={<ReportList />} />
          </Route>
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
