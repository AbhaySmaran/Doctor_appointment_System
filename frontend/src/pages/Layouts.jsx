import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import React from 'react';
import '../Layout.css'; 

const Layouts = () => {
  return (
    <div className="wrapper">
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div id="content" className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layouts;
