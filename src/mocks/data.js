export const mockUsers = [
  {
    id: 1,
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan@example.com',
    password: '123456',
    role: 'PATIENT',
    phone: '123-456-7890',
    address: 'Calle 123, Ciudad'
  },
  {
    id: 2,
    firstName: 'María',
    lastName: 'García',
    email: 'maria@example.com',
    password: '123456',
    role: 'DOCTOR',
    specialtyId: 1,
    phone: '098-765-4321',
    address: 'Avenida 456, Ciudad'
  },
  {
    id: 3,
    firstName: 'Admin',
    lastName: 'Sistema',
    email: 'admin@example.com',
    password: '123456',
    role: 'ADMIN',
    phone: '555-123-4567',
    address: 'Centro, Ciudad'
  }
];

export const mockSpecialties = [
  { id: 1, name: 'Cardiología' },
  { id: 2, name: 'Dermatología' },
  { id: 3, name: 'Pediatría' }
];

export const mockDoctors = [
  {
    id: 2,
    firstName: 'María',
    lastName: 'García',
    email: 'maria@example.com',
    specialtyId: 1
  }
];

export const mockAppointments = [
  {
    id: 1,
    patientId: 1,
    doctorId: 2,
    date: '2025-11-25',
    time: '10:00',
    doctorName: 'María García',
    patientName: 'Juan Pérez'
  }
];

export const mockAvailabilities = [
  {
    id: 1,
    doctorId: 2,
    date: '2025-11-25',
    timeSlots: ['09:00', '10:00', '11:00']
  }
];