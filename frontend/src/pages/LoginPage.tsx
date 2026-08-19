import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../auth/AuthProvider';
import { ApiError } from '../services/authService';
import styles from './LoginPage.module.css';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');
    setIsSubmitting(true);

    try {
      await login({
        email,
        password,
      });

      navigate('/appointments');
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          setError('Nieprawidłowy email lub hasło.');
        } else {
          setError(error.message);
        }
      } else {
        setError('Nie udało się zalogować.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <h2>Zaloguj się</h2>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />

          <label htmlFor="password">
            Hasło
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          {error && (
            <p className={styles.error}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Logowanie...'
              : 'Zaloguj się'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default LoginPage;