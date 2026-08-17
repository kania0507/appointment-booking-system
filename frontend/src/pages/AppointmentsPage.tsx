import { useEffect, useState } from 'react';
import { AppointmentList } from '../components/AppointmentList';
import { AppointmentForm } from '../components/AppointmentForm';
import { getUsers } from '../services/userService';
import type { User } from '../types/User';
import type { Appointment } from '../services/appointmentService';

export function AppointmentsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const users = await getUsers();
        setUsers(users);
      } catch {
        setUsersError('Nie udało się pobrać klientów.');
      } finally {
        setLoadingUsers(false);
      }
    }

    loadUsers();
  }, []);

  function handleSaved() {
    setEditingAppointment(null);
    setRefreshKey((current) => current + 1);
  }

  function handleCancel() {
    setEditingAppointment(null);
  }

  if (loadingUsers) {
    return <p>Ładowanie klientów...</p>;
  }

  if (usersError) {
    return <p>{usersError}</p>;
  }

  return (
    <>
      <AppointmentForm
        key={editingAppointment?.id ?? 'new'}
        appointment={editingAppointment ?? undefined}
        users={users}
        onSaved={handleSaved}
        onCancel={handleCancel}
      />

      <AppointmentList
        key={refreshKey}
        onEdit={setEditingAppointment}
      />
    </>
  );
}