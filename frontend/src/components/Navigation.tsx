import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../auth/AuthProvider';
import styles from './Navigation.module.css';

export function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch {
      // Na razie ignorujemy błąd logoutu.
    }
  }

  return (
    <nav className={styles.navigation}>
      <NavLink
        to="/appointments"
        className={({ isActive }) =>
          isActive ? styles.linkActive : styles.link
        }
      >
        Wizyty
      </NavLink>

      {isAuthenticated && (
        <NavLink
          to="/users"
          className={({ isActive }) =>
            isActive ? styles.linkActive : styles.link
          }
        >
          Klienci
        </NavLink>
      )}

      {!isAuthenticated && (
        <NavLink
          to="/login"
          className={({ isActive }) =>
            isActive ? styles.linkActive : styles.link
          }
        >
          Zaloguj się
        </NavLink>
      )}

      {isAuthenticated && user && (
        <>
          <span>
            Zalogowany jako: {user.firstName} {user.lastName}
          </span>

          <button
            type="button"
            onClick={handleLogout}
          >
            Wyloguj
          </button>
        </>
      )}
    </nav>
  );
}