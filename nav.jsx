import React from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const access_token = localStorage.getItem("access");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('role');
    navigate('/');
  };

  const handleToggleSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className='container-fluid'>
        <button className="navbar-toggler" type="button" onClick={handleToggleSidebar}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <span className="navbar-brand">Clinic Management Portal</span>
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
          <li className="nav-item text-nowrap">
            {access_token ? 
              <NavLink to='/' className='nav-link' onClick={handleLogout}>Logout</NavLink>
              :
              <NavLink to='/login' className='nav-link'>Login</NavLink>
            }
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
