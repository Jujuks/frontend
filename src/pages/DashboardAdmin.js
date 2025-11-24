import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Button, Modal, Form } from 'react-bootstrap';
import api from '../services/api';

const DashboardAdmin = () => {
  const [users, setUsers] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [stats, setStats] = useState({});
  const [showUserModal, setShowUserModal] = useState(false);
  const [showSpecialtyModal, setShowSpecialtyModal] = useState(false);
  const [userForm, setUserForm] = useState({ firstName: '', lastName: '', email: '', role: 'PATIENT' });
  const [specialtyForm, setSpecialtyForm] = useState({ name: '' });

  useEffect(() => {
    fetchUsers();
    fetchSpecialties();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const response = await api.get('/specialties');
      setSpecialties(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveUser = async () => {
    try {
      await api.post('/admin/users', userForm);
      fetchUsers();
      setShowUserModal(false);
      setUserForm({ firstName: '', lastName: '', email: '', role: 'PATIENT' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSpecialty = async () => {
    try {
      await api.post('/specialties', specialtyForm);
      fetchSpecialties();
      setShowSpecialtyModal(false);
      setSpecialtyForm({ name: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="mt-5">
      <h2>Dashboard Administrador</h2>
      <Row>
        <Col md={4}>
          <Card>
            <Card.Header>Estadísticas</Card.Header>
            <Card.Body>
              <p>Total Usuarios: {stats.totalUsers}</p>
              <p>Total Citas: {stats.totalAppointments}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Header>Usuarios <Button onClick={() => setShowUserModal(true)}>Agregar</Button></Card.Header>
            <ListGroup variant="flush">
              {users.map(user => (
                <ListGroup.Item key={user.id}>
                  {user.firstName} {user.lastName} - {user.email} ({user.role})
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>Especialidades <Button onClick={() => setShowSpecialtyModal(true)}>Agregar</Button></Card.Header>
            <ListGroup variant="flush">
              {specialties.map(s => (
                <ListGroup.Item key={s.id}>
                  {s.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>

      <Modal show={showUserModal} onHide={() => setShowUserModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control value={userForm.firstName} onChange={(e) => setUserForm({...userForm, firstName: e.target.value})} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Apellido</Form.Label>
              <Form.Control value={userForm.lastName} onChange={(e) => setUserForm({...userForm, lastName: e.target.value})} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control value={userForm.email} onChange={(e) => setUserForm({...userForm, email: e.target.value})} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Rol</Form.Label>
              <Form.Select value={userForm.role} onChange={(e) => setUserForm({...userForm, role: e.target.value})}>
                <option value="PATIENT">Paciente</option>
                <option value="DOCTOR">Médico</option>
                <option value="ADMIN">Admin</option>
              </Form.Select>
            </Form.Group>
            <Button onClick={handleSaveUser}>Crear</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showSpecialtyModal} onHide={() => setShowSpecialtyModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Especialidad</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control value={specialtyForm.name} onChange={(e) => setSpecialtyForm({...specialtyForm, name: e.target.value})} />
            </Form.Group>
            <Button onClick={handleSaveSpecialty}>Crear</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default DashboardAdmin;