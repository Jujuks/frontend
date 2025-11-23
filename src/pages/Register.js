import React, { useState } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'PATIENT', // Default
    specialtyId: '', // For doctors
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      setSuccess('Registro exitoso. Inicia sesión.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Error en el registro');
    }
  };

  return (
    <Container className="mt-5">
      <h2>Registro</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Apellido</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Rol</Form.Label>
          <Form.Select name="role" value={formData.role} onChange={handleChange}>
            <option value="PATIENT">Paciente</option>
            <option value="DOCTOR">Médico</option>
          </Form.Select>
        </Form.Group>
        {formData.role === 'DOCTOR' && (
          <Form.Group className="mb-3">
            <Form.Label>Especialidad ID</Form.Label>
            <Form.Control
              type="number"
              name="specialtyId"
              value={formData.specialtyId}
              onChange={handleChange}
              required
            />
          </Form.Group>
        )}
        <Button variant="primary" type="submit">Registrar</Button>
      </Form>
    </Container>
  );
};

export default Register;