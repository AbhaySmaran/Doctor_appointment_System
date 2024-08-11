import React from 'react';
import { Link,NavLink } from 'react-router-dom';
import { Button } from '@mui/material';

const Login = () => {

  return (
    <div>
        <Button component={NavLink} to='/doctor/login'>Login as Doctor</Button>
        <br />
        <Button component={NavLink} to='/receptionist/login'>Login as Receptioist</Button>
    </div>
  )
}

export default Login