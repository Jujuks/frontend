import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Modal, Form } from 'react-bootstrap';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

const DashboardPatient = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  });
  const [editingAppointment, setEditingAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments/patient');
      setAppointments(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      setDoctors(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAvailabilities = async () => {
    try {
      const response = await api.get('/availabilities/doctor');
      setAvailabilities(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAppointment = async () => {
    try {
      await api.post('/appointments', { doctorId: selectedDoctor, date: selectedDate });
      fetchAppointments();
      setShowModal(false);
      setSelectedDoctor('');
      setSelectedDate('');
      setEditingAppointment(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelAppointment = async (id) => {
    try {
      await api.put(`/appointments/${id}/cancel`);
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await api.put(`/users/${user.id}`, profileForm);
      setShowProfileModal(false);
      // Opcional: actualizar el contexto si es necesario
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setSelectedDoctor(appointment.doctorId);
    setSelectedDate(appointment.date);
    setShowModal(true);
  };

  const handleUpdateAppointment = async () => {
    try {
      await api.put(`/appointments/${editingAppointment.id}`, { doctorId: selectedDoctor, date: selectedDate });
      fetchAppointments();
      setShowModal(false);
      setEditingAppointment(null);
      setSelectedDoctor('');
      setSelectedDate('');
    } catch (err) {
      console.error(err);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const upcomingAppointments = appointments.filter(app => app.date >= today);
  const pastAppointments = appointments.filter(app => app.date < today);

  return (
    <Container className="mt-5">
      <h2>Dashboard Paciente</h2>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Header>Citas Próximas</Card.Header>
            <ListGroup variant="flush">
              {upcomingAppointments.map(app => (
                <ListGroup.Item key={app.id}>
                  {app.date} - {app.doctorName}
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditAppointment(app)}>Editar</Button>
                  <Button variant="danger" size="sm" onClick={() => handleCancelAppointment(app.id)}>Cancelar</Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
          <Card>
            <Card.Header>Historial de Citas</Card.Header>
            <ListGroup variant="flush">
              {pastAppointments.map(app => (
                <ListGroup.Item key={app.id}>
                  {app.date} - {app.doctorName} (Completada)
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
          <Button className="mt-3 me-2" onClick={() => setShowModal(true)}>Nueva Cita</Button>
          <Button className="mt-3 me-2" variant="info" onClick={() => { fetchAvailabilities(); setShowAvailabilityModal(true); }}>Ver Disponibilidad</Button>
          <Button className="mt-3" variant="secondary" onClick={() => setShowProfileModal(true)}>Editar Perfil</Button>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nueva Cita</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Médico</Form.Label>
              <Form.Select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
                <option value="">Seleccionar</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </Form.Group>
            <Button onClick={editingAppointment ? handleUpdateAppointment : handleCreateAppointment} disabled={!selectedDoctor || !selectedDate}>
              {editingAppointment ? 'Actualizar' : 'Crear'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={profileForm.firstName}
                onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                value={profileForm.lastName}
                onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                value={profileForm.address}
                onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
              />
            </Form.Group>
            <Button onClick={handleSaveProfile}>Guardar</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showAvailabilityModal} onHide={() => setShowAvailabilityModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Disponibilidad de Médicos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {availabilities.map(av => (
            <Card key={av.id} className="mb-3">
              <Card.Body>
                <Card.Title>Médico ID: {av.doctorId}</Card.Title>
                <Card.Text>
                  Fecha: {av.date}<br />
                  Horarios disponibles: {av.timeSlots.join(', ')}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default DashboardPatient;