import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();
    const url = localStorage.getItem('url');

    const handleLogin = async (e) => {
        e.preventDefault();
        const data = new FormData();
        if(email){
            data.append("email",email)
        }
        if(password){
            data.append('password',password)
        }
        try {
            const response = await axios.post(`${url}/api/user/login/`, data);
            if (response.data) {
                localStorage.setItem("access", response.data.tokens.access)
                localStorage.setItem("refresh", response.data.tokens.refresh)
                localStorage.setItem("role", response.data.role)
                console.log(response.data)
                if (response.data.role == 'doctor') {
                    navigate('/dashboard/doctor')
                } else if (response.data.role == 'receptionist' || response.data.role == 'super_admin') {
                    navigate('/dashboard/receptionist')
                } else {
                    navigate('')
                }
            }
        } catch (error) {
            if (error.response) {
                setServerError(error.response.data);
                // console.error(error.response.data);
            }else{
                console.log("An unexpected error occurred:", error);
            };
            if(error.response.data.errors){
                setServerError(error.response.data.errors);
            };
        }

    };

    return (
        <div>
            <Navbar />
            <Container className="d-flex align-items-center justify-content-center">
                <Row className="justify-content-md-center w-100">
                    <Col xs={12} sm={10} md={8} lg={8}>
                        <h2 className="text-center">Login</h2>
                        <form className='needs-validation'>
                            <div className='form-group'>
                                <label>Email Address</label>
                                <input 
                                    type='email'
                                    className={`form-control ${serverError.email || serverError.error ? "is-invalid" : " "}`}
                                    value={email}
                                    placeholder='*Enter Email'
                                    required
                                    onChange={(e)=>setEmail(e.target.value)}
                                />
                                <div className="invalid-feedback">
                                    {serverError.email ? <p>{serverError.email}</p> : " "}
                                    {serverError.error ? <p>{serverError.error[0]}</p> : ''}
                                </div>
                            </div>
                            <div className='form-group'>
                                <label>Password</label>
                                <input 
                                    type='password'
                                    className={`form-control ${serverError.password ? "is-invalid" : " "}`}
                                    value={password}
                                    placeholder='*Enter Password'
                                    required
                                    onChange={(e)=>setPassword(e.target.value)}
                                />
                                <div className="invalid-feedback">
                                    {serverError.password ? <p>{serverError.password}</p> : " "}
                                </div>
                            </div>
                            <Button variant="primary" type="submit" className="w-100 mt-3" id='login-btn' onClick={handleLogin}>
                                Login
                            </Button>
                        </form>
                        {/* {serverError.error && <div className='alert alert-info' role='alert'> <p>{serverError.error[0]}</p></div>} */}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Login;
