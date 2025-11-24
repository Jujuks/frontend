import { mockUsers, mockSpecialties, mockDoctors, mockAppointments, mockAvailabilities } from './data';

let users = [...mockUsers];
let appointments = [...mockAppointments];
let availabilities = [...mockAvailabilities];

export const mockApi = {
  post: async (url, data) => {
    if (url === '/auth/register') {
      const newUser = { ...data, id: users.length + 1 };
      users.push(newUser);
      return { data: { message: 'Registro exitoso' } };
    }
    if (url === '/auth/login') {
      const user = users.find(u => u.email === data.email && u.password === data.password);
      if (user) {
        return { data: { user, token: 'mock-token' } };
      } else {
        throw new Error('Credenciales inválidas');
      }
    }
    if (url === '/appointments') {
      const newAppointment = { ...data, id: appointments.length + 1 };
      appointments.push(newAppointment);
      return { data: newAppointment };
    }
    if (url === '/availabilities') {
      const newAvailability = { ...data, id: availabilities.length + 1 };
      availabilities.push(newAvailability);
      return { data: newAvailability };
    }
    if (url === '/specialties') {
      const newSpecialty = { ...data, id: mockSpecialties.length + 1 };
      mockSpecialties.push(newSpecialty);
      return { data: newSpecialty };
    }
    if (url === '/admin/users') {
      const newUser = { ...data, id: users.length + 1 };
      users.push(newUser);
      return { data: newUser };
    }
  },

  get: async (url) => {
    if (url === '/appointments/patient') {
      return { data: appointments };
    }
    if (url.startsWith('/appointments/doctor')) {
      const today = new Date().toISOString().split('T')[0];
      return { data: appointments.filter(a => a.date === today) };
    }
    if (url === '/doctors') {
      return { data: mockDoctors };
    }
    if (url === '/specialties') {
      return { data: mockSpecialties };
    }
    if (url === '/availabilities/doctor') {
      return { data: availabilities };
    }
    if (url.startsWith('/availabilities?')) {
      return { data: availabilities };
    }
    if (url === '/admin/users') {
      return { data: users };
    }
    if (url === '/admin/stats') {
      return { data: { totalUsers: users.length, totalAppointments: appointments.length } };
    }
    if (url.startsWith('/users/')) {
      const id = parseInt(url.split('/')[2]);
      const user = users.find(u => u.id === id);
      return { data: user };
    }
  },

  put: async (url, data) => {
    if (url.startsWith('/appointments/') && url.endsWith('/cancel')) {
      const id = parseInt(url.split('/')[2]);
      const index = appointments.findIndex(a => a.id === id);
      if (index !== -1) {
        appointments.splice(index, 1);
      }
      return { data: {} };
    }
    if (url.startsWith('/availabilities/') && url.endsWith('/block')) {
      const id = parseInt(url.split('/')[2]);
      const index = availabilities.findIndex(a => a.id === id);
      if (index !== -1) {
        availabilities.splice(index, 1);
      }
      return { data: {} };
    }
    if (url.startsWith('/admin/users/')) {
      const id = parseInt(url.split('/')[3]);
      const index = users.findIndex(u => u.id === id);
      if (index !== -1) {
        users[index] = { ...users[index], ...data };
      }
      return { data: users[index] };
    }
    if (url.startsWith('/specialties/')) {
      const id = parseInt(url.split('/')[2]);
      const index = mockSpecialties.findIndex(s => s.id === id);
      if (index !== -1) {
        mockSpecialties[index] = { ...mockSpecialties[index], ...data };
      }
      return { data: mockSpecialties[index] };
    }
    if (url.startsWith('/users/')) {
      const id = parseInt(url.split('/')[2]);
      const index = users.findIndex(u => u.id === id);
      if (index !== -1) {
        users[index] = { ...users[index], ...data };
      }
      return { data: users[index] };
    }
    if (url.startsWith('/appointments/') && !url.includes('/cancel')) {
      const id = parseInt(url.split('/')[2]);
      const index = appointments.findIndex(a => a.id === id);
      if (index !== -1) {
        appointments[index] = { ...appointments[index], ...data };
      }
      return { data: appointments[index] };
    }
  },

  delete: async (url) => {
    if (url.startsWith('/admin/users/')) {
      const id = parseInt(url.split('/')[3]);
      users = users.filter(u => u.id !== id);
      return { data: {} };
    }
    if (url.startsWith('/specialties/')) {
      const id = parseInt(url.split('/')[2]);
      const index = mockSpecialties.findIndex(s => s.id === id);
      if (index !== -1) {
        mockSpecialties.splice(index, 1);
      }
      return { data: {} };
    }
  }
};