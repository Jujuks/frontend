import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Modal, Form, Alert } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

const DashboardPatient = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [notifications, setNotifications] = useState(['Recordatorio: Cita mañana a las 10:00']);

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    fetchSpecialties();
  }, []);

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

  const fetchSpecialties = async () => {
    try {
      const response = await api.get('/specialties');
      setSpecialties(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAvailabilities = async (doctorId, date) => {
    try {
      const response = await api.get(`/availabilities?doctorId=${doctorId}&date=${date}`);
      setAvailabilities(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAppointment = async () => {
    // Lógica para crear cita
    try {
      await api.post('/appointments', { doctorId: selectedDoctor, date: selectedDate });
      fetchAppointments();
      setShowModal(false);
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

  return (
    <Container className="mt-5">
      <h2>Dashboard Paciente</h2>
      <Row>
        <Col md={8}>
          <Card>
            <Card.Header>Mis Citas</Card.Header>
            <ListGroup variant="flush">
              {appointments.map(app => (
                <ListGroup.Item key={app.id}>
                  {app.date} - {app.doctorName}
                  <Button variant="danger" size="sm" onClick={() => handleCancelAppointment(app.id)}>Cancelar</Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
          <Button className="mt-3" onClick={() => setShowModal(true)}>Nueva Cita</Button>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>Notificaciones</Card.Header>
            <ListGroup variant="flush">
              {notifications.map((note, idx) => <ListGroup.Item key={idx}>{note}</ListGroup.Item>)}
            </ListGroup>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nueva Cita</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Especialidad</Form.Label>
              <Form.Select onChange={(e) => fetchDoctors(e.target.value)}>
                <option>Seleccionar</option>
                {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Médico</Form.Label>
              <Form.Select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
                <option>Seleccionar</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>)}
              </Form.Select>
            </Form.Group>
            <Calendar onChange={setSelectedDate} value={selectedDate} />
            <Button onClick={handleCreateAppointment}>Crear</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default DashboardPatient;