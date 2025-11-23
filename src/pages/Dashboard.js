import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import DashboardPatient from './DashboardPatient';
import DashboardDoctor from './DashboardDoctor';
import DashboardAdmin from './DashboardAdmin';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <div>No autorizado</div>;

  switch (user.role) {
    case 'PATIENT':
      return <DashboardPatient />;
    case 'DOCTOR':
      return <DashboardDoctor />;
    case 'ADMIN':
      return <DashboardAdmin />;
    default:
      return <div>Rol no reconocido</div>;
  }
};

export default Dashboard;