import { createBrowserRouter } from 'react-router';
import App from './App';
import { AppointmentsPage } from './pages/AppointmentsPage';
import LoginPage from './pages/LoginPage';
import { UsersPage } from './pages/UsersPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        index: true,
        Component: AppointmentsPage,
      },
      {
        path: 'appointments',
        Component: AppointmentsPage,
      },
      {
        path: 'users',
        Component: UsersPage,
      },
      {
        path: 'login',
        Component: LoginPage,
      },
    ],
  },
]);