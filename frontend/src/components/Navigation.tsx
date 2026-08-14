import { NavLink } from 'react-router';
import styles from './Navigation.module.css';

export function Navigation() {
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

      <NavLink
        to="/users"
        className={({ isActive }) =>
          isActive ? styles.linkActive : styles.link
        }
      >
        Klienci
      </NavLink>
    </nav>
  );
}