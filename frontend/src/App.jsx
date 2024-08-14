import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Layouts from './pages/Layouts';
import Home from './pages/Home';
import Login from './pages/Login';
import DoctorLogin from './pages/DoctorLogin';
import ReceptionistLogin from './pages/ReceptionistLogin';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import DoctorDashboard from './pages/DoctorDashboard';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route exact path ='/' element={<Layouts />}>
            <Route index element= {<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='doctor/login' element= {<DoctorLogin />} />
            <Route path='receptionist/login' element= {<ReceptionistLogin />} />
            <Route path='receptionist/dashboard' element={<ReceptionistDashboard />} />
            <Route path='doctor/dashboard' element={<DoctorDashboard />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
