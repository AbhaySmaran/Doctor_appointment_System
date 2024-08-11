import React from 'react'
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    // const navigate = 
    return (
        <div>
            <Box sx={{ flexGrow: 1 }} >
                <AppBar position='static'>
                    <Toolbar>
                        <Typography variant='h5' component='div' sx={{ flexGrow:1 }}>
                            Doctor Appointment Portal
                        </Typography>
                        <Button component={NavLink} to='/' sx={{ color: 'white' }}>
                            Home
                        </Button>
                        <Button component={NavLink} to='/login' sx={{ color: 'white' }}>
                            Login
                        </Button>
                    </Toolbar>
                </AppBar>
            </Box>

        </div>
    )
}

export default Navbar