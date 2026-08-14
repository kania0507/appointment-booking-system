import { useState } from 'react';
import {
  createAppointment, ApiError,
  type CreateAppointmentData,
} from '../services/appointmentService';
import styles from './CreateAppointmentForm.module.css';
import { Input } from './ui/Input';
import { Button } from './ui/Button';


interface CreateAppointmentFormProps {
  onCreated: () => void;
}

export function CreateAppointmentForm({
  onCreated,
}: CreateAppointmentFormProps) {
  const [userId, setUserId] = useState('1');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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

      await createAppointment(data);

      setStartAt('');
      setEndAt('');
      setNotes('');

      onCreated();
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
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Dodaj wizytę</h2>
      <div className={styles.field}>

        <Input
          label="ID klienta"
          type="number"
          min="1"
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          Od
        </label>

        <input
          className={styles.input}
          type="datetime-local"
          value={startAt}
          onChange={(event) => setStartAt(event.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          Do
        </label>

        <input
          className={styles.input}
          type="datetime-local"
          value={endAt}
          onChange={(event) => setEndAt(event.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          Notatka
        </label>

        <textarea
          className={styles.textarea}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
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
        Dodaj wizytę
      </Button>
    </form>
  </section>
);
}