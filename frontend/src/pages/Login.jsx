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
        try {
            const response = await axios.post(`${url}/api/user/login/`, {
                "email": email,
                "password": password
            });
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
                // console.log(error.response.data.errors);
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
            {/* <Container>
                <Row className="justify-content-md-center">
                    <Col xs={8} md={8}>
                        <h2 className="text-center">Login</h2>
                        <Form onSubmit={handleLogin}>
                            <Form.Group controlId="formEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="*Enter email"
                                    value={email}
                                    required
                                    isInvalid={serverError.email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {serverError.email ? <p>{serverError.email}</p>: ''}
                                </Form.Control.Feedback>
                            </Form.Group>
                            {serverError.email && <p>{serverError.email}</p>}
                            <Form.Group controlId="formPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="*Password"
                                    value={password}
                                    required
                                    isInvalid = {serverError.password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {serverError.password ? <p>{serverError.password}</p>: ''}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100 mt-3" id='login-btn'>
                                Login
                            </Button>
                        </Form>
                        {serverError.error && <div className='alert alert-info' role='alert'> <p>{serverError.error[0]}</p></div>}
                    </Col>
                </Row>
            </Container> */}

            <Container>
                <Row className="justify-content-md-center">
                    <Col xs={8} md={8}>
                        <h2 className="text-center">Login</h2>
                        <form className='needs-validation'>
                            <div className='form-group'>
                                <label>Email Address</label>
                                <input 
                                    type='email'
                                    className={`form-control ${serverError.email ? "is-invalid" : " "}`}
                                    value={email}
                                    placeholder='*Enter Email'
                                    required
                                    onChange={(e)=>setEmail(e.target.value)}
                                />
                                <div className="invalid-feedback">
                                    {serverError.email ? <p>{serverError.email}</p> : " "}
                                </div>
                            </div>
                            <div className='form-group'>
                                <label>Password</label>
                                <input 
                                    type='password'
                                    className={`form-control ${serverError.password || serverError.error ? "is-invalid" : " "}`}
                                    value={password}
                                    placeholder='*Enter Password'
                                    required
                                    onChange={(e)=>setPassword(e.target.value)}
                                />
                                <div className="invalid-feedback">
                                    {serverError.password ? <p>{serverError.password}</p> : " "}
                                    {serverError.error ? <p>{serverError.error[0]}</p> : ''}
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
