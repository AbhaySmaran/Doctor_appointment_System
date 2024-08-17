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
            <Route path='doctor/register' element={<DoctorReg />} />
            <Route path='receptionist/register' element={<ReceptionistReg />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
