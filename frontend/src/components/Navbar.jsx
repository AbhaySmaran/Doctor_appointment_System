import React,{useEffect} from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate,useLocation } from 'react-router-dom';

const Navbar = () => {
  const access_token = localStorage.getItem("access");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    const url = localStorage.getItem('url');
    localStorage.clear();
    if (url) {
      localStorage.setItem('url', url); 
    }
    navigate('/', { replace: true });  
  };


  // const handleToggleSidebar = () => {
  //   const sidebar = document.getElementById('sidebar');
  //   sidebar.classList.toggle('collapsed');
  // };

  return (
    // <nav className="navbar navbar-expand-md navbar-dark bg-dark">
    <nav className="navbar navbar-expand-md" style={{ backgroundColor: '#00857c' }}>
      <div className='container-fluid'>
        
        <button className="navbar-toggler ms-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className='collapse navbar-collapse col-10' id='navbarTogglerDemo01'>
          <span className="navbar-brand">Patient Information System - 1.0</span> 
        </div>

        <div className='col-2 d-flex justify-content-end'>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item text-nowrap">
              {!access_token || location.pathname === '/' ? (
                <NavLink to="/" className="nav-link">
                  <b>Login</b>
                </NavLink>
              ) : (
                <NavLink to="/" className="nav-link" onClick={handleLogout}>
                  <b>Logout</b>
                </NavLink>
              )}
            </li>
          </ul>
        </div>
        
        
      </div>
    </nav>
  );
};

export default Navbar;


