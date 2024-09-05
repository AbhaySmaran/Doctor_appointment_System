import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ReceptionistLogin() {
    const url = localStorage.getItem('url');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [serverError,setServerError] = useState({});
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${url}/api/receptionist/login/`, { 
                "email":email, 
                "password":password 
            });
            if (response.data) {
                localStorage.setItem("access",response.data.tokens.access)
                localStorage.setItem("refresh",response.data.tokens.refresh)
                localStorage.setItem("role",response.data.role)
                navigate('/receptionist/dashboard');
            }
        } catch (error) {
            setServerError(error.response.data.errors)
            console.log(error.response.data.errors)
        }
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={12}>
                    <h2 className="text-center">Receptionist Login</h2>
                    <Form onSubmit={handleLogin}>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 mt-3">
                            Login
                        </Button>
                        <div>{serverError.error && <p>{serverError.error[0]}</p>}</div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default ReceptionistLogin;
