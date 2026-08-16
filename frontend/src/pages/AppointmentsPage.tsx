import { useEffect, useState } from 'react';
import { AppointmentList } from '../components/AppointmentList';
import { AppointmentForm } from '../components/AppointmentForm';
import { getUsers } from '../services/userService';
import type { User } from '../types/User';

export function AppointmentsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

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

  function handleAppointmentCreated() {
    setRefreshKey((current) => current + 1);
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
        users={users}
        onCreated={handleAppointmentCreated}
      />

      <AppointmentList key={refreshKey} />
    </>
  );
}