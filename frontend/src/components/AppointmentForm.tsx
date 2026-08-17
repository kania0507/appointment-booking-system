import { useEffect, useState } from 'react';
import {
  createAppointment,
  updateAppointment,
  ApiError,
  type CreateAppointmentData,
  type Appointment,
} from '../services/appointmentService';
import type { User } from '../types/User';
import styles from './AppointmentForm.module.css';
import { Button } from './ui/Button';

interface AppointmentFormProps {
  users: User[];
  appointment?: Appointment;
  onSaved: (appointment: Appointment) => void;
  onCancel?: () => void;
}

function toLocalDateTime(value: string): string {
  const date = new Date(value);

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
}

export function AppointmentForm({
  users,
  appointment,
  onSaved,
  onCancel,
}: AppointmentFormProps) {
  const [userId, setUserId] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (appointment) {
      setUserId(String(appointment.userId));
      setStartAt(toLocalDateTime(appointment.startAt));
      setEndAt(toLocalDateTime(appointment.endAt));
      setNotes(appointment.notes ?? '');
    } else {
      setUserId('');
      setStartAt('');
      setEndAt('');
      setNotes('');
    }

    setError(null);
  }, [appointment]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);
    setSubmitting(true);

    try {
      const data: CreateAppointmentData = {
        userId: Number(userId),
        startAt: new Date(startAt).toISOString(),
        endAt: new Date(endAt).toISOString(),
        notes: notes || null,
      };

      const savedAppointment = appointment
        ? await updateAppointment(appointment.id, data)
        : await createAppointment(data);

      onSaved(savedAppointment);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Wystąpił nieoczekiwany błąd.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <h2 className={styles.title}>
          {appointment ? 'Edytuj wizytę' : 'Dodaj wizytę'}
        </h2>

        <div className={styles.field}>
          <label className={styles.label}>
            Klient

            <select
              className={styles.input}
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              required
            >
              <option value="">
                Wybierz klienta
              </option>

              {users.map((user) => (
                <option
                  key={user.id}
                  value={user.id}
                >
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Od

            <input
              className={styles.input}
              type="datetime-local"
              value={startAt}
              onChange={(event) => setStartAt(event.target.value)}
              required
            />
          </label>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Do

            <input
              className={styles.input}
              type="datetime-local"
              value={endAt}
              onChange={(event) => setEndAt(event.target.value)}
              required
            />
          </label>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Notatka

            <textarea
              className={styles.textarea}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </label>
        </div>

        {error && (
          <p className={styles.error}>
            {error}
          </p>
        )}

        <Button
          type="submit"
          loading={submitting}
        >
          {appointment ? 'Zapisz zmiany' : 'Dodaj wizytę'}
        </Button>

        {appointment && onCancel && (
          <Button
            type="button"
            onClick={onCancel}
          >
            Anuluj
          </Button>
        )}
      </form>
    </section>
  );
}