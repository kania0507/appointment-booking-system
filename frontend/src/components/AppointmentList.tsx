import { useEffect, useState } from 'react';
import {
  getAppointments,
  type Appointment,
} from '../services/appointmentService';
import { formatDateTime } from '../utils/formatDate';
import { Button } from './ui/Button';

interface AppointmentListProps {
  onEdit: (appointment: Appointment) => void;
}

export function AppointmentList({
  onEdit,
}: AppointmentListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAppointments()
      .then(setAppointments)
      .catch(() => setError('Nie udało się pobrać wizyt.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Ładowanie wizyt...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h2>Wizyty</h2>

      {appointments.length === 0 ? (
        <p>Brak wizyt.</p>
      ) : (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment.id}>
              <strong>
                {formatDateTime(appointment.startAt)} –{' '}
                {formatDateTime(appointment.endAt)}
              </strong>

              <div>Status: {appointment.status}</div>

              {appointment.notes && (
                <div>Notatka: {appointment.notes}</div>
              )}

              <Button
                type="button"
                onClick={() => onEdit(appointment)}
              >
                Edytuj
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}