import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

import React from 'react'

const Layouts = () => {
  return (
    <div>
        <Navbar />
        <Outlet />
    </div>
  )
}

export default Layouts