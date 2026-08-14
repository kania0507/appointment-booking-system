import { useState } from 'react';
import { UsersPage } from './pages/UsersPage';
import { AppointmentList } from './components/AppointmentList';
import { CreateAppointmentForm } from './components/CreateAppointmentForm';

function App() {
    const [refreshKey, setRefreshKey] = useState(0);

    function handleAppointmentCreated() {
      setRefreshKey((current) => current + 1);
    }
  return (
    <main>
      <h1>Appointment Booking System</h1>

      <CreateAppointmentForm onCreated={handleAppointmentCreated} />

      <AppointmentList key={refreshKey} />

      <UsersPage />
    </main>
  );
}

export default App;