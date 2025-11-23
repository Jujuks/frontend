import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, ListGroup, Button, Modal, Form } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

const DashboardDoctor = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    fetchTodayAppointments();
    fetchAvailabilities();
  }, []);

  const fetchTodayAppointments = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await api.get(`/appointments/doctor?date=${today}`);
      setAppointments(response.data);
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

  const handleAddAvailability = async () => {
    try {
      await api.post('/availabilities', { date: selectedDate, timeSlots });
      fetchAvailabilities();
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlockSlot = async (id) => {
    try {
      await api.put(`/availabilities/${id}/block`);
      fetchAvailabilities();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="mt-5">
      <h2>Dashboard Médico</h2>
      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>Citas de Hoy</Card.Header>
            <ListGroup variant="flush">
              {appointments.map(app => (
                <ListGroup.Item key={app.id}>
                  {app.time} - {app.patientName}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>Disponibilidad</Card.Header>
            <ListGroup variant="flush">
              {availabilities.map(av => (
                <ListGroup.Item key={av.id}>
                  {av.date} {av.timeSlots.join(', ')}
                  <Button variant="warning" size="sm" onClick={() => handleBlockSlot(av.id)}>Bloquear</Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Button className="mt-3" onClick={() => setShowModal(true)}>Agregar Disponibilidad</Button>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Disponibilidad</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Calendar onChange={setSelectedDate} value={selectedDate} />
          <Form.Group>
            <Form.Label>Horarios (ej: 09:00,10:00)</Form.Label>
            <Form.Control
              type="text"
              value={timeSlots.join(',')}
              onChange={(e) => setTimeSlots(e.target.value.split(','))}
            />
          </Form.Group>
          <Button onClick={handleAddAvailability}>Agregar</Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default DashboardDoctor;