import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [serverError, setServerError] = useState({});
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/user/login/', {
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
                } else if (response.data.role == 'receptionist') {
                    navigate('/dashboard/receptionist')
                } else {
                    navigate('')
                }
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setServerError(error.response.data.errors);
                console.log(error.response.data.errors);
            } else {
                console.log("An unexpected error occurred:", error);
            }
        }

    };

    return (
        <div>
            <Navbar />
            <Container>
                <Row className="justify-content-md-center">
                    <Col xs={12} md={12}>
                        <h2 className="text-center">Login</h2>
                        <Form onSubmit={handleLogin}>
                            <Form.Group controlId="formEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="*Enter email"
                                    value={email}
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>
                            {serverError.email && <p>{serverError.email[0]}</p>}
                            <Form.Group controlId="formPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="*Password"
                                    value={password}
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>
                            {serverError.password && <p>{serverError.password[0]}</p>}
                            <Button variant="primary" type="submit" className="w-100 mt-3">
                                Login
                            </Button>
                        </Form>
                        {serverError.error && <div className='alert alert-info' role='alert'> <p>{serverError.error[0]}</p></div>}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Login;
