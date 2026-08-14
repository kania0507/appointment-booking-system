import { useState } from 'react';
import { AppointmentList } from '../components/AppointmentList';
import { CreateAppointmentForm } from '../components/CreateAppointmentForm';

export function AppointmentsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  function handleAppointmentCreated() {
    setRefreshKey((current) => current + 1);
  }

  return (
    <>
      <CreateAppointmentForm
        onCreated={handleAppointmentCreated}
      />

      <AppointmentList key={refreshKey} />
    </>
  );
}